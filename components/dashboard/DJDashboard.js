"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import ButtonAccount from "@/components/ButtonAccount";
import BrandLogo from "@/components/BrandLogo";
import AudioPlayer from "../AudioPlayer";
import toast from "react-hot-toast";

const genres = [
  "All Genres", "Hip-Hop", "R&B", "Pop", "Electronic", "House", "Techno", 
  "Trap", "Drill", "Afrobeat", "Reggae", "Dancehall", "Latin", "Other"
];

const keys = [
  "All Keys", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", 
  "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"
];

export default function DJDashboard({ user, profile }) {
  const [tracks, setTracks] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All Genres");
  const [keyFilter, setKeyFilter] = useState("All Keys");
  const [bpmRange, setBpmRange] = useState({ min: "", max: "" });
  const [activeTab, setActiveTab] = useState("browse");

  const supabase = createClient();

  useEffect(() => {
    fetchTracks();
    fetchDownloads();
  }, [user.id]);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from("tracks")
        .select(`
          *,
          profiles (
            full_name,
            username
          )
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      toast.error("Failed to load tracks");
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from("downloads")
        .select(`
          *,
          tracks (
            title,
            artist_name,
            artwork_url,
            genre
          )
        `)
        .eq("user_id", user.id)
        .order("downloaded_at", { ascending: false });

      if (error) throw error;
      setDownloads(data || []);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      toast.error("Failed to load download history");
    }
  };

  const downloadTrack = async (track) => {
    try {
      // Check if already downloaded
      const alreadyDownloaded = downloads.some(d => d.track_id === track.id);
      
      if (alreadyDownloaded) {
        // Just open the download link again
        window.open(track.audio_url, "_blank");
        return;
      }

      // Record the download
      const { error } = await supabase
        .from("downloads")
        .insert({
          track_id: track.id,
          user_id: user.id,
          ip_address: null, // Would be filled by server in production
          user_agent: navigator.userAgent,
        });

      if (error) throw error;

      // Update track download count
      await supabase
        .from("tracks")
        .update({ 
          download_count: (track.download_count || 0) + 1 
        })
        .eq("id", track.id);

      // Record analytics
      await supabase
        .from("analytics")
        .insert({
          track_id: track.id,
          user_id: user.id,
          event: "download",
          metadata: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
          }
        });

      // Update local state
      setDownloads([{
        id: Date.now(), // Temporary ID
        track_id: track.id,
        downloaded_at: new Date().toISOString(),
        tracks: {
          title: track.title,
          artist_name: track.artist_name,
          artwork_url: track.artwork_url,
          genre: track.genre,
        }
      }, ...downloads]);

      setTracks(tracks.map(t => 
        t.id === track.id 
          ? { ...t, download_count: (t.download_count || 0) + 1 }
          : t
      ));

      // Start download
      window.open(track.audio_url, "_blank");
      toast.success("Download started!");

    } catch (error) {
      console.error("Error downloading track:", error);
      toast.error("Failed to download track");
    }
  };

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = genreFilter === "All Genres" || track.genre === genreFilter;
    const matchesKey = keyFilter === "All Keys" || track.key === keyFilter;
    
    const matchesBPM = (!bpmRange.min || !track.bpm || track.bpm >= parseInt(bpmRange.min)) &&
                      (!bpmRange.max || !track.bpm || track.bpm <= parseInt(bpmRange.max));
    
    return matchesSearch && matchesGenre && matchesKey && matchesBPM;
  });

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isDownloaded = (trackId) => {
    return downloads.some(d => d.track_id === trackId);
  };

  const tabs = [
    { id: "browse", label: "Browse Tracks", icon: "🎵" },
    { id: "downloads", label: "My Downloads", icon: "⬇️" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-spindeck-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BrandLogo />
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-2 py-1 bg-green-600 text-xs font-medium rounded-full">
                DJ
              </span>
              <span className="text-sm text-spindeck-gray">
                Welcome, {profile?.full_name || user.email}
              </span>
              <ButtonAccount />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">DJ Pool</h1>
          <p className="text-spindeck-gray">Discover and download the latest approved tracks</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-spindeck-dark rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-spindeck-red text-white"
                  : "text-spindeck-gray hover:text-white hover:bg-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "browse" && (
          <>
            {/* Filters */}
            <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 mb-8">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Track or artist..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Key */}
                <div>
                  <label className="block text-sm font-medium mb-2">Key</label>
                  <select
                    value={keyFilter}
                    onChange={(e) => setKeyFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                  >
                    {keys.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>

                {/* BPM Min */}
                <div>
                  <label className="block text-sm font-medium mb-2">Min BPM</label>
                  <input
                    type="number"
                    value={bpmRange.min}
                    onChange={(e) => setBpmRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="60"
                    min="60"
                    max="200"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                  />
                </div>

                {/* BPM Max */}
                <div>
                  <label className="block text-sm font-medium mb-2">Max BPM</label>
                  <input
                    type="number"
                    value={bpmRange.max}
                    onChange={(e) => setBpmRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="200"
                    min="60"
                    max="200"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                  />
                </div>
              </div>
            </div>

            {/* Tracks List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTracks.length === 0 ? (
              <div className="bg-spindeck-dark rounded-lg p-12 text-center border border-gray-800">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
                <p className="text-spindeck-gray">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTracks.map((track) => (
                  <div key={track.id} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Track Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Artwork */}
                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          {track.artwork_url ? (
                            <img
                              src={track.artwork_url}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🎵
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate">{track.title}</h3>
                          <p className="text-spindeck-gray text-sm mb-1">by {track.artist_name}</p>
                          <div className="flex items-center space-x-4 text-xs text-spindeck-gray">
                            <span>{track.genre}</span>
                            {track.bpm && <span>{track.bpm} BPM</span>}
                            {track.key && <span>Key: {track.key}</span>}
                            <span>{formatDuration(track.duration)}</span>
                            <span>{track.download_count || 0} downloads</span>
                          </div>
                        </div>
                      </div>

                      {/* Audio Player */}
                      {track.audio_url && (
                        <div className="w-full lg:w-80">
                          <AudioPlayer
                            src={track.audio_url}
                            title={track.title}
                            artist={track.artist_name}
                            trackId={track.id}
                            className="bg-gray-800"
                          />
                        </div>
                      )}

                      {/* Download Button */}
                      <div className="lg:ml-4">
                        <button
                          onClick={() => downloadTrack(track)}
                          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            isDownloaded(track.id)
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-spindeck-red hover:bg-red-600 text-white"
                          }`}
                        >
                          {isDownloaded(track.id) ? "✅ Downloaded" : "⬇️ Download"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "downloads" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Download History</h2>
            
            {downloads.length === 0 ? (
              <div className="bg-spindeck-dark rounded-lg p-12 text-center border border-gray-800">
                <div className="text-6xl mb-4">⬇️</div>
                <h3 className="text-xl font-semibold mb-2">No downloads yet</h3>
                <p className="text-spindeck-gray">Start downloading tracks to build your collection</p>
              </div>
            ) : (
              <div className="space-y-4">
                {downloads.map((download) => (
                  <div key={download.id} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                    <div className="flex items-center space-x-4">
                      {/* Artwork */}
                      <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {download.tracks?.artwork_url ? (
                          <img
                            src={download.tracks.artwork_url}
                            alt={download.tracks.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">
                            🎵
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold">{download.tracks?.title}</h3>
                        <p className="text-sm text-spindeck-gray">by {download.tracks?.artist_name}</p>
                        <div className="flex items-center space-x-4 text-xs text-spindeck-gray mt-1">
                          <span>{download.tracks?.genre}</span>
                          <span>Downloaded {new Date(download.downloaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Re-download Button */}
                      <button
                        onClick={() => {
                          const track = tracks.find(t => t.id === download.track_id);
                          if (track?.audio_url) {
                            window.open(track.audio_url, "_blank");
                          }
                        }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Re-download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}