import { createClient } from "@/libs/pressbase/server";
import { redirect } from "next/navigation";
import { determineUserRole, validateAdminAccess } from "@/libs/admin";
import ArtistDashboard from "@/components/dashboard/ArtistDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DJDashboard from "@/components/dashboard/DJDashboard";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const pb = createClient();

  const {
    data: { user },
  } = await pb.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // Get user profile to determine role
  let { data: profile } = await pb
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Create profile if it doesn't exist with proper role determination
    const correctRole = determineUserRole(user.email, 'artist');
    
    const { data: newProfile } = await pb
      .from("profiles")
      .insert({
        id: user.id,
        role: correctRole,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null
      })
      .select()
      .single();

    if (newProfile) {
      profile = newProfile;
    }
  } else {
    // For existing profiles, validate admin access
    const shouldBeAdmin = validateAdminAccess(user, profile);
    const currentRole = profile.role;

    // Update role if needed (email-based admin check)
    if (shouldBeAdmin && currentRole !== 'admin') {
      await pb
        .from("profiles")
        .update({ role: 'admin' })
        .eq("id", user.id);
      profile.role = 'admin';
    } else if (!shouldBeAdmin && currentRole === 'admin') {
      // Remove admin access if email no longer in list
      await pb
        .from("profiles")
        .update({ role: 'artist' })
        .eq("id", user.id);
      profile.role = 'artist';
    }
  }

  const userRole = profile?.role || "artist";

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case "admin":
      return <AdminDashboard user={user} profile={profile} />;
    case "dj":
      return <DJDashboard user={user} profile={profile} />;
    case "artist":
    default:
      return <ArtistDashboard user={user} profile={profile} />;
  }
}