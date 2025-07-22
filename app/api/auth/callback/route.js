import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { determineUserRole } from "@/libs/admin";
import config from "@/config";

export const dynamic = "force-dynamic";

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
export async function GET(req) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const role = requestUrl.searchParams.get("role");

  if (code) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

    // If we have a user, create or update their profile
    if (user) {
      // Determine the correct role based on email and selection
      const finalRole = determineUserRole(user.email, role);

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        // Update existing profile with the determined role
        await supabase
          .from("profiles")
          .update({ 
            role: finalRole,
            full_name: user.user_metadata?.full_name || existingProfile.full_name,
            avatar_url: user.user_metadata?.avatar_url || existingProfile.avatar_url
          })
          .eq("id", user.id);
      } else {
        // Create new profile with the determined role
        await supabase
          .from("profiles")
          .insert({
            id: user.id,
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
