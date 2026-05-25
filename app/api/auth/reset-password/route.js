import { createServiceClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const pb = createServiceClient();

    // Find profile with this reset token
    const { data: profile, error: findError } = await pb
      .from("profiles")
      .select("id, owner_user_id, reset_token_expires")
      .eq("reset_token", token)
      .single();

    if (findError || !profile) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date(profile.reset_token_expires) < new Date()) {
      return NextResponse.json(
        { error: "Reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update user password using admin API
    const { error: updateError } = await pb.auth.admin.updateUserById(
      profile.owner_user_id,
      { password }
    );

    if (updateError) {
      throw updateError;
    }

    // Clear the reset token
    await pb
      .from("profiles")
      .update({
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", profile.id);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now sign in.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Password reset failed. Please try again." },
      { status: 500 }
    );
  }
}
