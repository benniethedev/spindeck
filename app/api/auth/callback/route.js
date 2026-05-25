import { NextResponse } from "next/server";
import config from "@/config";

export const dynamic = "force-dynamic";

// This route is no longer needed for OAuth since we removed magic link and OAuth login.
// Keeping it for any legacy redirects - just redirects to dashboard.
export async function GET(req) {
  const requestUrl = new URL(req.url);
  
  // Redirect to callback URL (dashboard)
  return NextResponse.redirect(requestUrl.origin + config.auth.callbackUrl);
}
