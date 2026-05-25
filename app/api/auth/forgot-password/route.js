import { createServiceClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/libs/resend";
import { randomBytes } from "crypto";
import config from "@/config";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const pb = createServiceClient();

    // Find profile by looking up user first, then profile
    // We need to search profiles that match this email through the user
    const { data: profiles } = await pb
      .from("profiles")
      .select("id, owner_user_id, full_name");

    if (!profiles || profiles.length === 0) {
      // Return success even if not found (security best practice)
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Try to find the user by email using admin API
    const { data: users } = await pb.auth.admin.listUsers({ perPage: 1000 });
    const user = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Return success even if not found (security best practice)
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Find the profile for this user
    const { data: profile } = await pb
      .from("profiles")
      .select("id, full_name")
      .eq("owner_user_id", user.id)
      .single();

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in profile
    await pb
      .from("profiles")
      .update({
        reset_token: resetToken,
        reset_token_expires: tokenExpiry.toISOString(),
      })
      .eq("owner_user_id", user.id);

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || `https://${config.domainName}`}/reset-password/${resetToken}`;
    const displayName = profile?.full_name || "there";

    await sendEmail({
      to: email,
      subject: `Reset your ${config.appName} password`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000; color: #fff; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #111; border-radius: 12px; padding: 40px; border: 1px solid #333;">
            <h1 style="color: #FF3C3C; margin-top: 0; font-size: 24px;">Password Reset Request</h1>
            
            <p style="color: #ccc; line-height: 1.6;">Hey ${displayName},</p>
            
            <p style="color: #ccc; line-height: 1.6;">We received a request to reset your ${config.appName} password. Click the button below to create a new password:</p>
            
            <a href="${resetUrl}" style="display: inline-block; background-color: #FF3C3C; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 20px 0;">
              Reset Password
            </a>
            
            <p style="color: #888; font-size: 14px; margin-top: 30px;">
              This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
            
            <p style="color: #666; font-size: 12px; margin-bottom: 0;">
              © ${new Date().getFullYear()} ${config.appName}. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Password Reset Request\n\nHey ${displayName}, we received a request to reset your ${config.appName} password. Click this link to create a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, you can safely ignore this email.`,
    });

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
