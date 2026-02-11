import { NextResponse } from "next/server";
import { sendEmail } from "@/libs/resend";
import { randomBytes } from "crypto";
import config from "@/config";

const API_BASE = process.env.NEXT_PUBLIC_PRESSBASE_URL || "https://backend.benbond.dev/wp-json/app/v1";
const SERVICE_KEY = process.env.PRESSBASE_SERVICE_KEY;

// Admin emails that get special privileges
const ADMIN_EMAILS = ["bencbond@gmail.com", "lmcmedia2@gmail.com"];

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

    // Check if user is admin
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Generate unique profile slug from display name
    const baseSlug = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSlug = `${baseSlug}-${randomBytes(4).toString("hex")}`;

    // 1. Register user with PressBase
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        display_name: displayName,
      }),
    });

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      // Check for duplicate email
      if (registerData.message?.includes("exists") || registerData.code === "email_exists") {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: registerData.message || "Registration failed" },
        { status: 400 }
      );
    }

    const userId = registerData.data?.user?.id;

    // 2. Create profile with role and verification token
    const profileResponse = await fetch(`${API_BASE}/db/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        user_id: String(userId),
        username: uniqueSlug,
        full_name: displayName,
        role: validRole,
        is_admin: isAdmin,
        slug: uniqueSlug,
        plan_id: "free",
        created_at: new Date().toISOString(),
      }),
    });

    if (!profileResponse.ok) {
      console.error("Failed to create profile:", await profileResponse.text());
    }

    // 3. Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://spinrec.com'}/verify-email/${verificationToken}`;
    
    try {
      await sendEmail({
        to: email,
        subject: `Verify your ${config.appName} account`,
        text: `Welcome to ${config.appName}!\n\nPlease verify your email by clicking this link:\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nIf you didn't create this account, you can ignore this email.`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { display: inline-block; padding: 12px 24px; background-color: #FF3C3C; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to ${config.appName}!</h1>
              <p>Hi ${displayName},</p>
              <p>Thanks for signing up as ${validRole === 'artist' ? 'an Artist' : 'a DJ'}! Please verify your email address to get started.</p>
              <p style="margin: 30px 0;">
                <a href="${verifyUrl}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy this link: <br><a href="${verifyUrl}">${verifyUrl}</a></p>
              <p>This link expires in 24 hours.</p>
              <div class="footer">
                <p>If you didn't create this account, you can safely ignore this email.</p>
                <p>© ${new Date().getFullYear()} ${config.appName}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email fails - they can request a new one
    }

    return NextResponse.json({
      success: true,
      message: "Account created! Please check your email to verify your account.",
      user: {
        id: userId,
        email,
        displayName,
        role: validRole,
        isAdmin,
        emailVerified: false,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
