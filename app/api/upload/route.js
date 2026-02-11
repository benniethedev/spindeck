import { createClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";
import config from "@/config";

/**
 * Get user's upload limit based on their plan
 */
async function getUserUploadLimit(pb, userId) {
  // Get user's profile and plan
  const { data: profile } = await pb
    .from("profiles")
    .select("plan_id")
    .eq("owner_user_id", userId)
    .single();

  if (!profile?.plan_id) {
    return config.uploadLimits.free || 0;
  }

  // Get plan details
  const { data: plan } = await pb
    .from("plans")
    .select("name")
    .eq("id", profile.plan_id)
    .single();

  if (!plan) {
    return config.uploadLimits.free || 0;
  }

  const planName = plan.name.toLowerCase();
  return config.uploadLimits[planName] ?? config.uploadLimits.free ?? 0;
}

/**
 * Get user's current month upload count
 */
async function getCurrentMonthUploads(pb, userId) {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const { data: tracks } = await pb
    .from("tracks")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", firstOfMonth.toISOString());

  return tracks?.length || 0;
}

export async function POST(request) {
  try {
    const pb = createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await pb.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check upload limits
    const uploadLimit = await getUserUploadLimit(pb, user.id);
    const currentUploads = await getCurrentMonthUploads(pb, user.id);

    // -1 means unlimited
    if (uploadLimit !== -1 && currentUploads >= uploadLimit) {
      const limitMessage = uploadLimit === 0 
        ? "You need a subscription to upload tracks. Please upgrade your plan."
        : `You've reached your monthly upload limit of ${uploadLimit} tracks. Please upgrade your plan for more uploads.`;
      
      return NextResponse.json(
        { 
          error: limitMessage,
          limit: uploadLimit,
          current: currentUploads,
          needsUpgrade: true
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "uploads";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to PressBase Storage
    const { data, error } = await pb.storage
      .from("tracks")
      .upload(filePath, buffer, {
        contentType: file.type,
        duplex: "half",
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "Upload failed: " + error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = pb.storage
      .from("tracks")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      remainingUploads: uploadLimit === -1 ? "unlimited" : uploadLimit - currentUploads - 1,
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload/limits
 * Get current user's upload limits and usage
 */
export async function GET(request) {
  try {
    const pb = createClient();

    const {
      data: { user },
    } = await pb.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const uploadLimit = await getUserUploadLimit(pb, user.id);
    const currentUploads = await getCurrentMonthUploads(pb, user.id);

    return NextResponse.json({
      limit: uploadLimit,
      current: currentUploads,
      remaining: uploadLimit === -1 ? "unlimited" : Math.max(0, uploadLimit - currentUploads),
      unlimited: uploadLimit === -1,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
