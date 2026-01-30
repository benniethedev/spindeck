import { createClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/tracks/download
 * Download a track with subscription validation
 * Body: { trackId: string }
 */
export async function POST(request) {
  try {
    const pb = createClient();

    // Check authentication
    const {
      data: { user },
    } = await pb.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const { trackId } = await request.json();

    if (!trackId) {
      return NextResponse.json(
        { error: "Track ID is required" },
        { status: 400 }
      );
    }

    // Get user profile to check subscription
    const { data: profile, error: profileError } = await pb
      .from("profiles")
      .select("*, plans(*)")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    // Check if user has DJ role
    if (profile.role !== "dj" && profile.role !== "admin") {
      return NextResponse.json(
        { error: "DJ access required", code: "ROLE_REQUIRED" },
        { status: 403 }
      );
    }

    // Check subscription status
    const hasActiveSubscription = profile.stripe_subscription_id || 
                                   profile.plan_id || 
                                   profile.role === "admin";

    if (!hasActiveSubscription) {
      return NextResponse.json(
        { 
          error: "Active subscription required to download tracks", 
          code: "SUBSCRIPTION_REQUIRED",
          upgradeUrl: "/pricing"
        },
        { status: 403 }
      );
    }

    // Get the track
    const { data: track, error: trackError } = await pb
      .from("tracks")
      .select("*")
      .eq("id", trackId)
      .eq("status", "approved")
      .single();

    if (trackError || !track) {
      return NextResponse.json(
        { error: "Track not found or not available" },
        { status: 404 }
      );
    }

    // Check if already downloaded (for deduplication)
    const { data: existingDownload } = await pb
      .from("downloads")
      .select("id")
      .eq("track_id", trackId)
      .eq("user_id", user.id)
      .single();

    // Record the download (if not a re-download)
    if (!existingDownload) {
      const { error: downloadError } = await pb
        .from("downloads")
        .insert({
          track_id: trackId,
          user_id: user.id,
          ip_address: request.headers.get("x-forwarded-for") || 
                      request.headers.get("x-real-ip") || 
                      null,
          user_agent: request.headers.get("user-agent"),
        });

      if (downloadError) {
        console.error("Download record error:", downloadError);
        // Continue anyway - don't block download for analytics failure
      }

      // Increment download count
      await pb
        .from("tracks")
        .update({ download_count: (track.download_count || 0) + 1 })
        .eq("id", trackId);

      // Record analytics event
      await pb.from("analytics").insert({
        track_id: trackId,
        user_id: user.id,
        event: "download",
        metadata: {
          timestamp: new Date().toISOString(),
          user_agent: request.headers.get("user-agent"),
          is_first_download: true,
        },
      });
    }

    // Return download URL
    return NextResponse.json({
      success: true,
      downloadUrl: track.audio_url,
      track: {
        id: track.id,
        title: track.title,
        artist_name: track.artist_name,
      },
      isRedownload: !!existingDownload,
    });
  } catch (error) {
    console.error("Download API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tracks/download
 * Get download history for the current user
 */
export async function GET(request) {
  try {
    const pb = createClient();

    const {
      data: { user },
    } = await pb.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;

    const { data: downloads, error } = await pb
      .from("downloads")
      .select(`
        *,
        tracks (
          id,
          title,
          artist_name,
          artwork_url,
          genre,
          bpm,
          key,
          audio_url
        )
      `)
      .eq("user_id", user.id)
      .order("downloaded_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching downloads:", error);
      return NextResponse.json(
        { error: "Failed to fetch download history" },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count } = await pb
      .from("downloads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      downloads: downloads || [],
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
