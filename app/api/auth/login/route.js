import { createClient, createServiceClient } from "@/libs/pressbase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const TOKEN_KEY = "pb_access_token";
const REFRESH_KEY = "pb_refresh_token";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const pb = createClient();

    // Sign in with PressBase
    const { data, error } = await pb.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check for unverified email
      if (error.message?.includes("not verified") || error.message?.includes("email_not_confirmed")) {
        return NextResponse.json(
          { error: "Please verify your email before signing in. Check your inbox for the verification link." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email is verified using service client
    const pbService = createServiceClient();
    const { data: profile } = await pbService
      .from("profiles")
      .select("email_verified")
      .eq("owner_user_id", data.user?.id)
      .single();

    // If profile exists and email is not verified, reject login
    if (profile && profile.email_verified === false) {
      return NextResponse.json(
        { error: "Please verify your email before signing in. Check your inbox for the verification link." },
        { status: 401 }
      );
    }

    // Set cookies for the session
    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    };

    cookieStore.set(TOKEN_KEY, data.access_token, cookieOptions);
    if (data.refresh_token) {
      cookieStore.set(REFRESH_KEY, data.refresh_token, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
