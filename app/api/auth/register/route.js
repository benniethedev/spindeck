import { createServiceClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/libs/resend";
import { randomBytes } from "crypto";
import config from "@/config";

export async function POST(request) {
  try {
    const { email, password, displayName, role } = await request.json();

    // Validate input
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: "Email, password, and display name are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Validate role
    const validRole = ["artist", "dj"].includes(role) ? role : "artist";

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Generate unique profile slug from display name
    const baseSlug = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSlug = `${baseSlug}-${randomBytes(4).toString("hex")}`;

    const pb = createServiceClient();

    // Create user with PressBase admin API
    const { data: user, error: userError } = await pb.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Require email verification
      user_metadata: {
        display_name: displayName,
        role: validRole,
        verification_token: verificationToken,
        verification_token_expires: tokenExpiry.toISOString(),
      },
    });

    if (userError) {
      // Check for duplicate email
      if (userError.message?.includes("already exists") || userError.message?.includes("duplicate")) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        );
      }
      throw userError;
    }

    // Create profile for the user
    const { error: profileError } = await pb.from("profiles").insert({
      owner_user_id: user.id,
      role: validRole,
      full_name: displayName,
      profile_slug: uniqueSlug,
      email_verified: false,
      verification_token: verificationToken,
      verification_token_expires: tokenExpiry.toISOString(),
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Cleanup: delete the user if profile creation fails
      await pb.auth.admin.deleteUser(user.id);
      throw profileError;
    }

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || `https://${config.domainName}`}/verify-email/${verificationToken}`;

    await sendEmail({
      to: email,
      subject: `Verify your ${config.appName} account`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000; color: #fff; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #111; border-radius: 12px; padding: 40px; border: 1px solid #333;">
            <h1 style="color: #FF3C3C; margin-top: 0; font-size: 24px;">Welcome to ${config.appName}! 🎵</h1>
            
            <p style="color: #ccc; line-height: 1.6;">Hey ${displayName},</p>
            
            <p style="color: #ccc; line-height: 1.6;">Thanks for signing up as ${validRole === "artist" ? "an Artist" : "a DJ"}! Please verify your email address to get started.</p>
            
            <a href="${verificationUrl}" style="display: inline-block; background-color: #FF3C3C; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 20px 0;">
              Verify Email Address
            </a>
            
            <p style="color: #888; font-size: 14px; margin-top: 30px;">
              This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
            
            <p style="color: #666; font-size: 12px; margin-bottom: 0;">
              © ${new Date().getFullYear()} ${config.appName}. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to ${config.appName}!\n\nHey ${displayName}, thanks for signing up! Please verify your email by clicking this link:\n\n${verificationUrl}\n\nThis link expires in 24 hours.`,
    });

    return NextResponse.json({
      success: true,
      message: "Account created. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
