import { createClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/feedback
 * Submit or update track feedback
 */
export async function POST(request) {
  try {
    const pb = createClient();

    // Check if user is authenticated
    const { data: { user } } = await pb.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to leave feedback" },
        { status: 401 }
      );
    }

    const { trackId, rating, comment } = await request.json();

    // Validate input
    if (!trackId) {
      return NextResponse.json(
        { error: "Track ID is required" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if track exists
    const { data: track, error: trackError } = await pb
      .from("tracks")
      .select("id, user_id")
      .eq("id", trackId)
      .single();

    if (trackError || !track) {
      return NextResponse.json(
        { error: "Track not found" },
        { status: 404 }
      );
    }

    // Prevent artists from rating their own tracks
    if (track.user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot rate your own tracks" },
        { status: 400 }
      );
    }

    // Check for existing feedback from this user
    const { data: existingFeedback } = await pb
      .from("track_feedback")
      .select("id")
      .eq("track_id", trackId)
      .eq("user_id", user.id)
      .single();

    let feedback;

    if (existingFeedback) {
      // Update existing feedback
      const { data: updatedFeedback, error: updateError } = await pb
        .from("track_feedback")
        .update({
          rating,
          comment: comment || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingFeedback.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      feedback = updatedFeedback;
    } else {
      // Create new feedback
      const { data: newFeedback, error: insertError } = await pb
        .from("track_feedback")
        .insert({
          track_id: trackId,
          user_id: user.id,
          rating,
          comment: comment || null,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      feedback = newFeedback;
    }

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback
 * Get feedback for a track
 */
export async function GET(request) {
  try {
    const pb = createClient();
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get("trackId");

    if (!trackId) {
      return NextResponse.json(
        { error: "Track ID is required" },
        { status: 400 }
      );
    }

    // Get all feedback for the track
    const { data: feedback, error } = await pb
      .from("track_feedback")
      .select(`
        id,
        rating,
        comment,
        created_at,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq("track_id", trackId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Calculate average rating
    const avgRating = feedback?.length
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
      : 0;

    return NextResponse.json({
      feedback: feedback || [],
      averageRating: avgRating,
      totalCount: feedback?.length || 0,
    });
  } catch (error) {
    console.error("Feedback fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
