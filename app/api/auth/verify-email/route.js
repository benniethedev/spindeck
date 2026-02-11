import { createServiceClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const pb = createServiceClient();

    // Find profile with this verification token
    const { data: profile, error: findError } = await pb
      .from("profiles")
      .select("id, owner_user_id, verification_token_expires, email_verified")
      .eq("verification_token", token)
      .single();

    if (findError || !profile) {
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
    if (new Date(profile.verification_token_expires) < new Date()) {
      return NextResponse.json(
        { error: "Verification link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update profile to mark email as verified
    const { error: updateError } = await pb
      .from("profiles")
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expires: null,
      })
      .eq("id", profile.id);

    if (updateError) {
      throw updateError;
    }

    // Also update the user's email_confirmed status in PressBase auth
    if (profile.owner_user_id) {
      await pb.auth.admin.updateUserById(profile.owner_user_id, {
        email_confirm: true,
      });
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
