import { createClient, createServiceClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/email-blast/recipients
 * Get recipient counts by audience type
 */
export async function GET(request) {
  try {
    const pb = createClient();
    
    // Verify admin authentication
    const { data: { user } } = await pb.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await pb
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const adminPb = createServiceClient();

    // Get counts for each audience type
    const { data: allProfiles } = await adminPb
      .from("profiles")
      .select("id, role");

    const profiles = allProfiles || [];
    
    const counts = {
      all: profiles.length,
      djs: profiles.filter(p => p.role === "dj").length,
      artists: profiles.filter(p => p.role === "artist").length,
      labels: profiles.filter(p => p.role === "label").length
    };

    return NextResponse.json({ counts });

  } catch (error) {
    console.error("Recipients API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipient counts" },
      { status: 500 }
    );
  }
}
