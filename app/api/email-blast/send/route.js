import { createClient, createServiceClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import config from "@/config";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/email-blast/send
 * Send an email blast to selected recipients
 */
export async function POST(request) {
  try {
    const pb = createClient();
    const adminPb = createServiceClient();
    
    // Verify admin authentication
    const { data: { user } } = await pb.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (use owner_user_id - PressBase built-in)
    const { data: profile } = await pb
      .from("profiles")
      .select("role")
      .eq("owner_user_id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { blastId, testEmail } = body;

    if (!blastId) {
      return NextResponse.json({ error: "Blast ID required" }, { status: 400 });
    }

    // Fetch the email blast with track info
    const { data: blast, error: blastError } = await pb
      .from("email_blasts")
      .select(`
        *,
        tracks (
          id,
          title,
          artist_name,
          artwork_url,
          audio_url,
          genre
        )
      `)
      .eq("id", blastId)
      .single();

    if (blastError || !blast) {
      return NextResponse.json({ error: "Email blast not found" }, { status: 404 });
    }

    if (blast.status === "sent" && !testEmail) {
      return NextResponse.json({ error: "Blast already sent" }, { status: 400 });
    }

    // If test email, only send to that address
    let recipients = [];
    if (testEmail) {
      recipients = [{ email: testEmail, name: "Test Recipient" }];
    } else {
      // Fetch recipients based on recipient_type
      const recipientType = blast.recipient_type || "all";
      let recipientQuery = adminPb.from("profiles").select("id, full_name");

      if (recipientType === "djs") {
        recipientQuery = recipientQuery.eq("role", "dj");
      } else if (recipientType === "labels") {
        recipientQuery = recipientQuery.eq("role", "label");
      } else if (recipientType === "artists") {
        recipientQuery = recipientQuery.eq("role", "artist");
      }
      // "all" fetches everyone

      const { data: profiles, error: profilesError } = await recipientQuery;
      
      if (profilesError) {
        console.error("Error fetching recipients:", profilesError);
        return NextResponse.json({ error: "Failed to fetch recipients" }, { status: 500 });
      }

      // Get emails from users - in PressBase, we need to fetch from auth users
      // For now, we'll use a mock approach since we can't directly query auth.users
      // In production, you'd need an API endpoint to get user emails by profile IDs
      recipients = (profiles || []).map(p => ({
        email: `user-${p.id}@placeholder.com`, // Placeholder - needs proper email lookup
        name: p.full_name || "SpinRec User"
      }));

      // If no recipients found, return error
      if (recipients.length === 0) {
        return NextResponse.json({ error: "No recipients found for this audience" }, { status: 400 });
      }
    }

    // Build the email HTML with tracking pixel
    const trackingBaseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${config.domainName}`;
    const trackingPixel = `<img src="${trackingBaseUrl}/api/email-blast/track?blast=${blastId}&event=open" width="1" height="1" style="display:none" alt="" />`;
    
    // Build email content
    const track = blast.tracks;
    const emailHtml = buildEmailHtml({
      subject: blast.subject,
      body: blast.body,
      track,
      blastId,
      trackingBaseUrl,
      trackingPixel
    });

    // Send emails via Resend
    const sendResults = {
      success: 0,
      failed: 0,
      errors: []
    };

    // Send in batches to respect rate limits
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipient) => {
        try {
          await resend.emails.send({
            from: config.resend.fromAdmin,
            to: recipient.email,
            subject: blast.subject,
            html: emailHtml,
            tags: [
              { name: "blast_id", value: blastId },
              { name: "category", value: "promotional" }
            ]
          });
          sendResults.success++;
        } catch (error) {
          sendResults.failed++;
          sendResults.errors.push({
            email: recipient.email,
            error: error.message
          });
        }
      });

      await Promise.all(batchPromises);
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Update blast status (only if not a test)
    if (!testEmail) {
      await pb
        .from("email_blasts")
        .update({
          status: "sent",
          date_sent: new Date().toISOString(),
          recipient_count: recipients.length,
          sent_to: sendResults.success
        })
        .eq("id", blastId);
    }

    return NextResponse.json({
      success: true,
      message: testEmail ? "Test email sent" : "Email blast sent successfully",
      stats: sendResults
    });

  } catch (error) {
    console.error("Email blast error:", error);
    return NextResponse.json(
      { error: "Failed to send email blast" },
      { status: 500 }
    );
  }
}

/**
 * Build HTML email template
 */
function buildEmailHtml({ subject, body, track, blastId, trackingBaseUrl, trackingPixel }) {
  const artworkUrl = track?.artwork_url || `${trackingBaseUrl}/default-artwork.png`;
  const trackTitle = track?.title || "New Track";
  const artistName = track?.artist_name || "Artist";
  const genre = track?.genre || "";
  
  // Create tracking link for the download/listen CTA
  const ctaUrl = `${trackingBaseUrl}/api/email-blast/track?blast=${blastId}&event=click&redirect=${encodeURIComponent(`${trackingBaseUrl}/dj-pool`)}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #333; }
    .logo { font-size: 28px; font-weight: bold; color: #FF3C3C; text-decoration: none; }
    .content { padding: 30px 0; }
    .track-card { background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; padding: 24px; margin: 20px 0; border: 1px solid #333; }
    .track-artwork { width: 200px; height: 200px; border-radius: 8px; margin: 0 auto 20px; display: block; object-fit: cover; }
    .track-title { font-size: 24px; font-weight: bold; margin: 0 0 8px; text-align: center; }
    .track-artist { font-size: 18px; color: #888; margin: 0 0 16px; text-align: center; }
    .track-genre { display: inline-block; background: #FF3C3C20; color: #FF3C3C; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; }
    .message { font-size: 16px; line-height: 1.6; color: #cccccc; white-space: pre-wrap; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #FF3C3C 0%, #cc3030 100%); color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 20px 0; text-align: center; }
    .cta-container { text-align: center; padding: 20px 0; }
    .footer { text-align: center; padding: 30px 0; border-top: 1px solid #333; font-size: 12px; color: #666; }
    .footer a { color: #888; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .container { padding: 10px; }
      .track-artwork { width: 150px; height: 150px; }
      .track-title { font-size: 20px; }
      .cta-button { padding: 14px 24px; font-size: 14px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="${trackingBaseUrl}" class="logo">SpinRec</a>
    </div>
    
    <div class="content">
      <div class="track-card">
        <img src="${artworkUrl}" alt="${trackTitle}" class="track-artwork" />
        <h1 class="track-title">${trackTitle}</h1>
        <p class="track-artist">by ${artistName}</p>
        ${genre ? `<div style="text-align: center;"><span class="track-genre">${genre}</span></div>` : ''}
      </div>
      
      <div class="message">${body}</div>
      
      <div class="cta-container">
        <a href="${ctaUrl}" class="cta-button">🎧 Listen & Download Now</a>
      </div>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} SpinRec. All rights reserved.</p>
      <p>You're receiving this because you're a member of SpinRec.</p>
      <p><a href="${trackingBaseUrl}/unsubscribe">Unsubscribe</a> | <a href="${trackingBaseUrl}/privacy-policy">Privacy Policy</a></p>
    </div>
  </div>
  ${trackingPixel}
</body>
</html>
  `;
}
