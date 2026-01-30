import { NextResponse } from "next/server";
import { createClient } from "@/libs/pressbase/server";
import { determineUserRole } from "@/libs/admin";
import config from "@/config";

export const dynamic = "force-dynamic";

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
export async function GET(req) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const role = requestUrl.searchParams.get("role");

  if (code) {
    const pb = createClient();
    const { data: { user } } = await pb.auth.exchangeCodeForSession(code);

    // If we have a user, create or update their profile
    if (user) {
      // Determine the correct role based on email and selection
      const finalRole = determineUserRole(user.email, role);

      // Check if profile exists (use owner_user_id - PressBase built-in field)
      const { data: existingProfile } = await pb
        .from("profiles")
        .select("*")
        .eq("owner_user_id", user.id)
        .single();

      if (existingProfile) {
        // Update existing profile with the determined role
        await pb
          .from("profiles")
          .update({ 
            role: finalRole,
            full_name: user.user_metadata?.full_name || existingProfile.full_name,
            avatar_url: user.user_metadata?.avatar_url || existingProfile.avatar_url
          })
          .eq("owner_user_id", user.id);
      } else {
        // Create new profile with the determined role
        // PressBase automatically sets owner_user_id when authenticated
        await pb
          .from("profiles")
          .insert({
            role: finalRole,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null
          });
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + config.auth.callbackUrl);
}
