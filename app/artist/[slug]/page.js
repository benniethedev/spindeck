import { createServiceClient } from "@/libs/pressbase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import ArtistTrackList from "@/components/ArtistTrackList";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pb = createServiceClient();

  const { data: artist } = await pb
    .from("profiles")
    .select("full_name, bio, avatar_url")
    .eq("profile_slug", slug)
    .eq("role", "artist")
    .single();

  if (!artist) {
    return getSEOTags({
      title: "Artist Not Found",
      description: "This artist profile could not be found.",
    });
  }

  return getSEOTags({
    title: `${artist.full_name} | ${config.appName}`,
    description: artist.bio || `Check out ${artist.full_name}'s music on ${config.appName}`,
    openGraph: {
      images: artist.avatar_url ? [{ url: artist.avatar_url }] : [],
    },
  });
}

export default async function ArtistProfilePage({ params }) {
  const { slug } = await params;
  const pb = createServiceClient();

  // Fetch artist profile
  const { data: artist, error } = await pb
    .from("profiles")
    .select("id, owner_user_id, full_name, bio, avatar_url, social_links, role, created_at")
    .eq("profile_slug", slug)
    .eq("role", "artist")
    .single();

  if (error || !artist) {
    notFound();
  }

  // Fetch artist's approved tracks
  const { data: tracks } = await pb
    .from("tracks")
    .select("id, title, artist_name, audio_url, artwork_url, genre, bpm, key, duration, play_count, download_count, created_at")
    .eq("user_id", artist.owner_user_id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Parse social links
  let socialLinks = {};
  try {
    socialLinks = artist.social_links ? JSON.parse(artist.social_links) : {};
  } catch {
    socialLinks = {};
  }

  // Calculate total stats
  const totalPlays = tracks?.reduce((sum, t) => sum + (t.play_count || 0), 0) || 0;
  const totalDownloads = tracks?.reduce((sum, t) => sum + (t.download_count || 0), 0) || 0;

  return (
    <>
      <PublicHeader />

      <main className="bg-black text-white min-h-screen pt-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-spindeck-red/20 to-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-spindeck-red shadow-2xl shadow-red-500/30 flex-shrink-0">
                {artist.avatar_url ? (
                  <img
                    src={artist.avatar_url}
                    alt={artist.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-spindeck-red to-red-800 flex items-center justify-center">
                    <span className="text-6xl">🎵</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-spindeck-red font-medium mb-2">Artist</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{artist.full_name}</h1>
                
                {artist.bio && (
                  <p className="text-gray-400 text-lg max-w-2xl mb-6">{artist.bio}</p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{tracks?.length || 0}</p>
                    <p className="text-sm text-gray-500">Tracks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{totalPlays.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Plays</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{totalDownloads.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Downloads</p>
                  </div>
                </div>

                {/* Social Links */}
                {Object.keys(socialLinks).length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {socialLinks.instagram && (
                      <a
                        href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        <span>📸</span> Instagram
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a
                        href={`https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        <span>🐦</span> Twitter
                      </a>
                    )}
                    {socialLinks.spotify && (
                      <a
                        href={socialLinks.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        <span>🎧</span> Spotify
                      </a>
                    )}
                    {socialLinks.soundcloud && (
                      <a
                        href={socialLinks.soundcloud}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        <span>☁️</span> SoundCloud
                      </a>
                    )}
                    {socialLinks.website && (
                      <a
                        href={socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        <span>🌐</span> Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tracks Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>🎵</span> Tracks
            {tracks && tracks.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({tracks.length} {tracks.length === 1 ? 'track' : 'tracks'})
              </span>
            )}
          </h2>

          {tracks && tracks.length > 0 ? (
            <ArtistTrackList tracks={tracks} artistId={artist.owner_user_id} />
          ) : (
            <div className="bg-spindeck-dark rounded-xl p-12 text-center border border-gray-800">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-2">No tracks yet</h3>
              <p className="text-gray-400">
                This artist hasn't uploaded any tracks to the pool yet.
              </p>
            </div>
          )}
        </div>

        {/* Share Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-gray-400 text-sm">Share this profile</p>
              <p className="text-white font-mono text-sm">
                {config.domainName}/artist/{slug}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://${config.domainName}/artist/${slug}`);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
