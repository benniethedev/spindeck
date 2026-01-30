import { createClient } from "@/libs/pressbase/server";
import { redirect } from "next/navigation";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import DJPoolBrowse from "@/components/DJPoolBrowse";

export const metadata = getSEOTags({
  title: `Browse DJ Pool | ${config.appName}`,
  description: "Browse and preview thousands of exclusive tracks. Filter by genre, BPM, and key to find the perfect tracks for your DJ sets.",
  canonicalUrlRelative: "/dj-pool/browse",
});

export const dynamic = "force-dynamic";

export default async function DJPoolBrowsePage() {
  const pb = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await pb.auth.getUser();

  // If logged in as DJ, redirect to dashboard
  if (user) {
    const { data: profile } = await pb
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "dj" || profile?.role === "admin") {
      redirect("/dashboard");
    }
  }

  // Fetch approved tracks for public preview
  const { data: tracks } = await pb
    .from("tracks")
    .select(`
      id,
      title,
      artist_name,
      artwork_url,
      genre,
      bpm,
      key,
      duration,
      download_count,
      play_count,
      created_at
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(100);

  // Get genre counts
  const genreCounts = {};
  (tracks || []).forEach(track => {
    if (track.genre) {
      genreCounts[track.genre] = (genreCounts[track.genre] || 0) + 1;
    }
  });

  return (
    <DJPoolBrowse 
      initialTracks={tracks || []} 
      genreCounts={genreCounts}
      isAuthenticated={!!user}
    />
  );
}
