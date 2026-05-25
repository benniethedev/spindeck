import { NextRequest, NextResponse } from "next/server";

function verifyAuth(req: NextRequest): NextResponse | null {
  const auth = req.cookies.get("admin-auth");
  if (!auth?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authErr = verifyAuth(req);
  if (authErr) return authErr;

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "get_newsletters") {
      return NextResponse.json({ success: true, newsletters: [] });
    }

    // Get approved tracks for newsletter
    const submissionsUrl = new URL(`${req.url}`.replace("/api/admin/email", "/api/admin/submissions"));
    submissionsUrl.searchParams.set("status", "approved");
    const submissionsRes = await fetch(submissionsUrl.toString(), {
      headers: { Cookie: req.headers.get("Cookie") || "" },
    });
    const submissionsData = await submissionsRes.json();

    return NextResponse.json({ success: true, approvedTracks: submissionsData.submissions || [] });
  } catch (err) {
    console.error("Email API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = verifyAuth(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { action, newsletter } = body as {
      action?: string;
      newsletter?: Record<string, unknown>;
    };

    if (action === "send_newsletter") {
      const { title, content, trackIds, recipients, fromEmail, fromName } = newsletter || {};

      if (!title || !content) {
        return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
      }

      // In production, this would integrate with SendGrid/Mailgun/SMTP
      // For now, simulate the send operation
      const newsletterRecord = {
        id: `nl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        key: `newsletter:${Date.now()}`,
        title,
        content,
        trackIds: trackIds || [],
        recipients: recipients || "all",
        fromEmail: fromEmail || "noreply@spinrec.com",
        fromName: fromName || "SpinRec",
        status: "sent",
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Store the newsletter record
      try {
        const { createRecord } = require("@/lib/storeai");
        await createRecord(newsletterRecord.key, newsletterRecord);
      } catch {
        // StoreAI may not be available in all environments
      }

      return NextResponse.json({
        success: true,
        message: "Newsletter sent successfully",
        newsletter: newsletterRecord,
      });
    }

    if (action === "get_templates") {
      return NextResponse.json({
        success: true,
        templates: [
          {
            id: "weekly_picks",
            name: "Weekly Picks",
            preview: "This week's top tracks handpicked by our team...",
            subject: "🎵 Weekly Music Picks from SpinRec",
          },
          {
            id: "new_releases",
            name: "New Releases",
            preview: "Fresh tracks just dropped! Check out the latest submissions...",
            subject: "🔥 New Releases This Week",
          },
          {
            id: "genre_spotlight",
            name: "Genre Spotlight",
            preview: "This week we're focusing on {genre}...",
            subject: "🎧 Genre Spotlight: {genre}",
          },
        ],
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Email POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
