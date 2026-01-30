import { createClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/tracks
 * Fetch approved tracks for the DJ pool with optional filters
 */
export async function GET(request) {
  try {
    const pb = createClient();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const genre = searchParams.get("genre");
    const key = searchParams.get("key");
    const minBpm = searchParams.get("minBpm");
    const maxBpm = searchParams.get("maxBpm");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;

    // Build query
    let query = pb
      .from("tracks")
      .select(`
        id,
        title,
        artist_name,
        audio_url,
        artwork_url,
        genre,
        bpm,
        key,
        duration,
        download_count,
        play_count,
        created_at,
        profiles (
          full_name,
          username
        )
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (genre && genre !== "All Genres") {
      query = query.eq("genre", genre);
    }
    if (key && key !== "All Keys") {
      query = query.eq("key", key);
    }
    if (minBpm) {
      query = query.gte("bpm", parseInt(minBpm));
    }
    if (maxBpm) {
      query = query.lte("bpm", parseInt(maxBpm));
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,artist_name.ilike.%${search}%`);
    }

    const { data: tracks, error, count } = await query;

    if (error) {
      console.error("Error fetching tracks:", error);
      return NextResponse.json(
        { error: "Failed to fetch tracks" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      tracks: tracks || [],
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
