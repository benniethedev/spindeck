import { createClient, createServiceClient } from "@/libs/pressbase/server";
import { isAdminEmail } from "@/libs/admin";
import { sendBlastEmail } from "@/libs/resend";
import { NextResponse } from "next/server";
import config from "@/config";

// POST - Send email blast to all subscribers (admin only)
export async function POST(request) {
  try {
    const pb = createClient();
    const servicePb = createServiceClient();
    
    const { data: { user } } = await pb.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { subject, html_content, post_id, type } = body;
    
    // Get all active subscribers
    const { data: subscribers, error: subError } = await servicePb
      .from("email_subscribers")
      .select("email, name")
      .eq("status", "active");
    
    if (subError) throw subError;
    
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers" }, { status: 400 });
    }
    
    let emailHtml = html_content;
    let emailSubject = subject;
    
    // If this is for a blog post, fetch and generate content
    if (type === "blog_post" && post_id) {
      const { data: post } = await servicePb
        .from("blog_posts")
        .select("*")
        .eq("id", post_id)
        .single();
      
      if (post) {
        emailSubject = subject || `New from ${config.appName}: ${post.title}`;
        emailHtml = generateBlogEmailHtml(post);
      }
    }
    
    if (!emailSubject || !emailHtml) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      );
    }
    
    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    const results = { sent: 0, failed: 0, errors: [] };
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const promises = batch.map(async (subscriber) => {
        try {
          // Personalize email with unsubscribe link
          const personalizedHtml = emailHtml
            .replace(/{{name}}/g, subscriber.name || "there")
            .replace(
              /{{unsubscribe_link}}/g,
              `${process.env.NEXT_PUBLIC_URL || ""}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
            );
          
          await sendBlastEmail({
            to: subscriber.email,
            subject: emailSubject,
            html: personalizedHtml,
            tags: [
              { name: "type", value: type || "newsletter" },
              ...(post_id ? [{ name: "post_id", value: post_id }] : []),
            ],
          });
          
          results.sent++;
        } catch (err) {
          results.failed++;
          results.errors.push({ email: subscriber.email, error: err.message });
        }
      });
      
      await Promise.all(promises);
      
      // Small delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    
    return NextResponse.json({
      success: true,
      total: subscribers.length,
      sent: results.sent,
      failed: results.failed,
      ...(results.errors.length > 0 && { errors: results.errors.slice(0, 10) }),
    });
  } catch (error) {
    console.error("Error sending email blast:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email blast" },
      { status: 500 }
    );
  }
}

function generateBlogEmailHtml(post) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://spinrec.com";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF3C3C; margin: 0; font-size: 28px;">${config.appName}</h1>
    </div>
    
    <!-- Featured Image -->
    ${post.featured_image ? `
    <div style="margin-bottom: 24px;">
      <img src="${post.featured_image}" alt="${post.title}" style="width: 100%; border-radius: 8px; display: block;">
    </div>
    ` : ""}
    
    <!-- Content -->
    <div style="background-color: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid #333;">
      <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 16px 0; line-height: 1.3;">
        ${post.title}
      </h2>
      
      <p style="color: #9ca3af; font-size: 14px; margin: 0 0 20px 0;">
        ${new Date(post.published_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      
      <p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
        ${post.excerpt || post.content.substring(0, 200).replace(/<[^>]*>/g, "") + "..."}
      </p>
      
      <a href="${baseUrl}/blog/${post.slug}" style="display: inline-block; background-color: #FF3C3C; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Read Full Article →
      </a>
    </div>
    
    <!-- Footer -->
    <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">
        You're receiving this because you subscribed to ${config.appName} updates.
      </p>
      <p style="margin: 0;">
        <a href="{{unsubscribe_link}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// GET - List email subscribers (admin only)
export async function GET(request) {
  try {
    const pb = createClient();
    const servicePb = createServiceClient();
    
    const { data: { user } } = await pb.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const limit = parseInt(searchParams.get("limit") || "100");
    
    const { data: subscribers, error } = await servicePb
      .from("email_subscribers")
      .select("*")
      .eq("status", status)
      .order("subscribed_at", { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Also get total counts
    const { data: activeCount } = await servicePb
      .from("email_subscribers")
      .select("id")
      .eq("status", "active");
    
    const { data: unsubCount } = await servicePb
      .from("email_subscribers")
      .select("id")
      .eq("status", "unsubscribed");
    
    return NextResponse.json({
      subscribers: subscribers || [],
      counts: {
        active: activeCount?.length || 0,
        unsubscribed: unsubCount?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
