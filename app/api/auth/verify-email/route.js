import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_PRESSBASE_URL || "https://backend.benbond.dev/wp-json/app/v1";
const SERVICE_KEY = process.env.PRESSBASE_SERVICE_KEY;

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find profile with this verification token using direct API call
    const findResponse = await fetch(
      `${API_BASE}/db/profiles?where[verification_token]=${encodeURIComponent(token)}&limit=1`,
      {
        headers: { "Authorization": `Bearer ${SERVICE_KEY}` },
      }
    );
    const findData = await findResponse.json();
    const profiles = findData.data || findData;
    const profile = profiles?.[0];

    if (!profile) {
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (profile.email_verified) {
      return NextResponse.json({
        success: true,
        message: "Email already verified. You can sign in.",
        alreadyVerified: true,
      });
    }

    // Check if token has expired
    if (profile.verification_expires && new Date(profile.verification_expires) < new Date()) {
      return NextResponse.json(
        { error: "Verification link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update profile to mark email as verified
    const updateResponse = await fetch(`${API_BASE}/db/profiles/${profile.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        email_verified: true,
        verification_token: null,
        verification_expires: null,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error("Failed to update profile");
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now sign in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
