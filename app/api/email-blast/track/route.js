import { createServiceClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";

// 1x1 transparent GIF for tracking pixel
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

/**
 * GET /api/email-blast/track
 * Track email opens and clicks
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blastId = searchParams.get("blast");
    const event = searchParams.get("event"); // "open" or "click"
    const redirect = searchParams.get("redirect");

    if (!blastId || !event) {
      // Return transparent gif anyway to not break email clients
      return new NextResponse(TRANSPARENT_GIF, {
        status: 200,
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    }

    // Update the email blast tracking in background
    trackEvent(blastId, event).catch(console.error);

    // Handle click events - redirect to destination
    if (event === "click" && redirect) {
      const redirectUrl = decodeURIComponent(redirect);
      return NextResponse.redirect(redirectUrl, 302);
    }

    // For open events, return tracking pixel
    return new NextResponse(TRANSPARENT_GIF, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });

  } catch (error) {
    console.error("Tracking error:", error);
    // Return transparent gif anyway to not break email clients
    return new NextResponse(TRANSPARENT_GIF, {
      status: 200,
      headers: {
        "Content-Type": "image/gif"
      }
    });
  }
}

/**
 * Update tracking stats for an email blast
 */
async function trackEvent(blastId, event) {
  const pb = createServiceClient();

  // Fetch current blast stats
  const { data: blast, error } = await pb
    .from("email_blasts")
    .select("opened_count, clicked_count")
    .eq("id", blastId)
    .single();

  if (error || !blast) {
    console.error("Failed to fetch blast for tracking:", error);
    return;
  }

  // Update the appropriate counter
  const updates = {};
  if (event === "open") {
    updates.opened_count = (blast.opened_count || 0) + 1;
  } else if (event === "click") {
    updates.clicked_count = (blast.clicked_count || 0) + 1;
  }

  await pb
    .from("email_blasts")
    .update(updates)
    .eq("id", blastId);
}
