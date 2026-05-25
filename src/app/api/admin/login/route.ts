import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body as { password?: string };
    const adminPassword = process.env.ADMIN_PASSWORD || "spinrec-admin-2024";

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true, message: "Authenticated successfully" });
      response.cookies.set("admin-auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/admin",
      });
      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
