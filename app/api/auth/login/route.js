import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_PRESSBASE_URL || "https://backend.benbond.dev/wp-json/app/v1";
const SERVICE_KEY = process.env.PRESSBASE_SERVICE_KEY;
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

    // Sign in with PressBase
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      return NextResponse.json(
        { error: loginData.message || "Invalid email or password" },
        { status: 401 }
      );
    }

    const userData = loginData.data || loginData;
    const userId = userData.user?.id;
    const accessToken = userData.access_token;
    const refreshToken = userData.refresh_token;

    // Get profile to check verification status and role
    let profile = null;
    if (userId) {
      const profileResponse = await fetch(`${API_BASE}/db/profiles?where[user_id]=${userId}`, {
        headers: { "Authorization": `Bearer ${SERVICE_KEY}` },
      });
      const profileData = await profileResponse.json();
      profile = profileData.data?.[0] || profileData[0];
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

    if (accessToken) {
      cookieStore.set(TOKEN_KEY, accessToken, cookieOptions);
    }
    if (refreshToken) {
      cookieStore.set(REFRESH_KEY, refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: userData.user?.email || email,
        displayName: profile?.full_name || userData.user?.display_name,
        role: profile?.role || "artist",
        isAdmin: profile?.is_admin || false,
        slug: profile?.slug,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
