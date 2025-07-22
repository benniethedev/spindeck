import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import ArtistDashboard from "@/components/dashboard/ArtistDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DJDashboard from "@/components/dashboard/DJDashboard";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Create profile if it doesn't exist
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        role: "artist", // Default role
      })
      .select()
      .single();

    if (newProfile) {
      profile = newProfile;
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