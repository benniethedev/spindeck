import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-auth", "", { maxAge: 0, path: "/admin" });
  return response;
}
