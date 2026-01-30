"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/libs/pressbase/client";
import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";
import ButtonPortal from "@/components/ButtonPortal";
import BrandLogo from "@/components/BrandLogo";
import AudioPlayer from "../AudioPlayer";
import toast from "react-hot-toast";

const genres = [
  "All Genres", "Hip-Hop", "R&B", "Pop", "Electronic", "House", "Techno", 
  "Trap", "Drill", "Afrobeat", "Reggae", "Dancehall", "Latin", "Other"
];

const keys = [
  "All Keys", "C", "C#/Db", "D", "D#/Eb", "E", "F", 
  "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Downloaded" },
  { value: "bpm-asc", label: "BPM (Low to High)" },
  { value: "bpm-desc", label: "BPM (High to Low)" },
];

// Stat card component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-gradient-to-br from-spindeck-dark to-black rounded-xl p-5 border border-gray-800/50">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-sm text-gray-400 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${
      color === 'green' ? 'text-green-400' : 
      color === 'blue' ? 'text-blue-400' : 
      color === 'red' ? 'text-spindeck-red' : 
      'text-white'
    }`}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </p>
  </div>
);

export default function DJDashboard({ user, profile }) {
  const [tracks, setTracks] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingTrackId, setDownloadingTrackId] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All Genres");
  const [keyFilter, setKeyFilter] = useState("All Keys");
  const [bpmRange, setBpmRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  
  // UI state
  const [activeTab, setActiveTab] = useState("browse");
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  const pb = createClient();

  useEffect(() => {
    fetchTracks();
    fetchDownloads();
    fetchSubscriptionInfo();
  }, [user.id]);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const { data, error } = await pb
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
      const { data, error } = await pb
        .from("downloads")
        .select(`
          *,
          tracks (
            id,
            title,
            artist_name,
            artwork_url,
            genre,
            bpm,
            key,
            audio_url
          )
        `)
        .eq("user_id", user.id)
        .order("downloaded_at", { ascending: false });

      if (error) throw error;
      setDownloads(data || []);
    } catch (error) {
      console.error("Error fetching downloads:", error);
    }
  };

  const fetchSubscriptionInfo = async () => {
    try {
      const { data: userProfile, error } = await pb
        .from("profiles")
        .select("*, plans(*)")
        .eq("owner_user_id", user.id)
        .single();

      if (error) throw error;

      if (userProfile?.customer_id) {
        setCustomerId(userProfile.customer_id);
      }

      const hasSubscription = userProfile?.stripe_subscription_id || 
                              userProfile?.plan_id || 
                              userProfile?.role === "admin";

      setSubscriptionInfo({
        isActive: hasSubscription,
        plan: userProfile?.plans || null,
        role: userProfile?.role,
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscriptionInfo({ isActive: false, plan: null });
    }
  };

  const downloadTrack = async (track) => {
    // Check subscription first
    if (!subscriptionInfo?.isActive) {
      toast.error(
        <div>
          <p className="font-semibold">Subscription Required</p>
          <p className="text-sm">Upgrade to download tracks</p>
        </div>,
        { duration: 4000 }
      );
      return;
    }

    setDownloadingTrackId(track.id);

    try {
      const response = await fetch("/api/tracks/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId: track.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "SUBSCRIPTION_REQUIRED") {
          toast.error(
            <div>
              <p className="font-semibold">Subscription Required</p>
              <p className="text-sm">Upgrade your plan to download tracks</p>
            </div>,
            { duration: 4000 }
          );
          return;
        }
        throw new Error(data.error || "Download failed");
      }

      // Update local state
      if (!data.isRedownload) {
        setDownloads(prev => [{
          id: Date.now(),
          track_id: track.id,
          downloaded_at: new Date().toISOString(),
          tracks: {
            id: track.id,
            title: track.title,
            artist_name: track.artist_name,
            artwork_url: track.artwork_url,
            genre: track.genre,
            audio_url: track.audio_url,
          }
        }, ...prev]);

        setTracks(prev => prev.map(t => 
          t.id === track.id 
            ? { ...t, download_count: (t.download_count || 0) + 1 }
            : t
        ));
      }

      // Trigger download
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = `${track.artist_name} - ${track.title}.mp3`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(data.isRedownload ? "Re-downloading track!" : "Download started!");

    } catch (error) {
      console.error("Error downloading track:", error);
      toast.error(error.message || "Failed to download track");
    } finally {
      setDownloadingTrackId(null);
    }
  };

  // Filter and sort tracks
  const filteredTracks = tracks
    .filter(track => {
      const matchesSearch = !searchTerm || 
        track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = genreFilter === "All Genres" || track.genre === genreFilter;
      
      const matchesKey = keyFilter === "All Keys" || 
        track.key === keyFilter || 
        keyFilter.includes(track.key);
      
      const matchesBPM = 
        (!bpmRange.min || !track.bpm || track.bpm >= parseInt(bpmRange.min)) &&
        (!bpmRange.max || !track.bpm || track.bpm <= parseInt(bpmRange.max));
      
      return matchesSearch && matchesGenre && matchesKey && matchesBPM;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.download_count || 0) - (a.download_count || 0);
        case "bpm-asc":
          return (a.bpm || 0) - (b.bpm || 0);
        case "bpm-desc":
          return (b.bpm || 0) - (a.bpm || 0);
        case "newest":
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
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

  const clearFilters = () => {
    setSearchTerm("");
    setGenreFilter("All Genres");
    setKeyFilter("All Keys");
    setBpmRange({ min: "", max: "" });
    setSortBy("newest");
  };

  const hasActiveFilters = searchTerm || genreFilter !== "All Genres" || 
    keyFilter !== "All Keys" || bpmRange.min || bpmRange.max;

  const tabs = [
    { id: "browse", label: "Browse Tracks", icon: "🎵", count: filteredTracks.length },
    { id: "downloads", label: "My Downloads", icon: "⬇️", count: downloads.length },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <BrandLogo />
              <div className="hidden md:flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-spindeck-red text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-white/20" : "bg-gray-700"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {subscriptionInfo?.isActive ? (
                <span className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-600/20 text-green-400 text-xs font-medium rounded-full border border-green-600/30">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Active Subscription
                </span>
              ) : (
                <Link 
                  href="/pricing"
                  className="hidden sm:flex items-center gap-2 px-3 py-1 bg-spindeck-red/20 text-spindeck-red text-xs font-medium rounded-full border border-spindeck-red/30 hover:bg-spindeck-red/30 transition-colors"
                >
                  Upgrade for Downloads
                </Link>
              )}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{profile?.full_name || 'DJ'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <ButtonAccount />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-800/50">
          <div className="flex px-4 py-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-spindeck-red text-white"
                    : "text-gray-400 bg-gray-800/30"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-spindeck-red rounded-full" />
            <h1 className="text-3xl font-bold tracking-tight">DJ Pool</h1>
          </div>
          <p className="text-gray-500 ml-5">
            Discover and download the latest approved tracks for your sets
          </p>
        </div>

        {/* Subscription Banner (if no active subscription) */}
        {!subscriptionInfo?.isActive && (
          <div className="mb-8 bg-gradient-to-r from-spindeck-red/20 via-red-900/10 to-transparent rounded-xl p-6 border border-spindeck-red/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  🔒 Unlock Unlimited Downloads
                </h3>
                <p className="text-gray-400">
                  Subscribe to download high-quality tracks for your DJ sets. Preview all tracks for free!
                </p>
              </div>
              <Link 
                href="/pricing"
                className="flex-shrink-0 px-6 py-3 bg-spindeck-red hover:bg-red-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-red-500/20"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon="🎵" label="Available Tracks" value={tracks.length} />
          <StatCard icon="⬇️" label="Your Downloads" value={downloads.length} color="green" />
          <StatCard icon="🎧" label="Genres" value={new Set(tracks.map(t => t.genre).filter(Boolean)).size} color="blue" />
          <StatCard 
            icon="💎" 
            label="Subscription" 
            value={subscriptionInfo?.isActive ? "Active" : "Free"} 
            color={subscriptionInfo?.isActive ? "green" : "red"} 
          />
        </div>

        {activeTab === "browse" && (
          <>
            {/* Filters */}
            <div className="bg-spindeck-dark rounded-xl p-6 border border-gray-800/50 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-spindeck-red hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Track or artist name..."
                      className="w-full pl-10 pr-4 py-2.5 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-spindeck-red transition-colors"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-spindeck-red transition-colors appearance-none cursor-pointer"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Key</label>
                  <select
                    value={keyFilter}
                    onChange={(e) => setKeyFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-spindeck-red transition-colors appearance-none cursor-pointer"
                  >
                    {keys.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>

                {/* BPM Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">BPM Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bpmRange.min}
                      onChange={(e) => setBpmRange(prev => ({ ...prev, min: e.target.value }))}
                      placeholder="Min"
                      min="60"
                      max="200"
                      className="w-full px-3 py-2.5 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-spindeck-red transition-colors"
                    />
                    <input
                      type="number"
                      value={bpmRange.max}
                      onChange={(e) => setBpmRange(prev => ({ ...prev, max: e.target.value }))}
                      placeholder="Max"
                      min="60"
                      max="200"
                      className="w-full px-3 py-2.5 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-spindeck-red transition-colors"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-spindeck-red transition-colors appearance-none cursor-pointer"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400">
                Showing <span className="text-white font-medium">{filteredTracks.length}</span> tracks
                {hasActiveFilters && ` (filtered from ${tracks.length})`}
              </p>
            </div>

            {/* Tracks List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-spindeck-dark rounded-xl p-6 border border-gray-800/50 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTracks.length === 0 ? (
              <div className="bg-spindeck-dark rounded-xl p-12 text-center border border-gray-800/50">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-spindeck-red hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTracks.map((track) => (
                  <div 
                    key={track.id} 
                    className="group bg-spindeck-dark rounded-xl p-5 border border-gray-800/50 hover:border-gray-700 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Track Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Artwork */}
                        <div className="relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-shadow">
                          {track.artwork_url ? (
                            <img
                              src={track.artwork_url}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-gray-700 to-gray-800">
                              🎵
                            </div>
                          )}
                          {isDownloaded(track.id) && (
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                              <span className="text-green-400 text-xl">✓</span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate group-hover:text-spindeck-red transition-colors">
                            {track.title}
                          </h3>
                          <p className="text-gray-400 text-sm truncate">
                            {track.artist_name}
                            {track.profiles?.full_name && track.profiles.full_name !== track.artist_name && (
                              <span className="text-gray-600"> • {track.profiles.full_name}</span>
                            )}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                            {track.genre && (
                              <span className="px-2 py-1 bg-gray-800 rounded text-gray-300">
                                {track.genre}
                              </span>
                            )}
                            {track.bpm && (
                              <span className="text-gray-500">
                                {track.bpm} BPM
                              </span>
                            )}
                            {track.key && (
                              <span className="text-gray-500">
                                Key: {track.key}
                              </span>
                            )}
                            <span className="text-gray-500">
                              {formatDuration(track.duration)}
                            </span>
                            <span className="text-gray-500">
                              {track.download_count || 0} downloads
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Audio Player */}
                      {track.audio_url && (
                        <div className="w-full lg:w-72">
                          <AudioPlayer
                            src={track.audio_url}
                            trackId={track.id}
                            className="bg-black/50"
                          />
                        </div>
                      )}

                      {/* Download Button */}
                      <div className="lg:ml-2">
                        <button
                          onClick={() => downloadTrack(track)}
                          disabled={downloadingTrackId === track.id}
                          className={`w-full lg:w-auto px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                            !subscriptionInfo?.isActive
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : isDownloaded(track.id)
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-spindeck-red hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                          }`}
                        >
                          {downloadingTrackId === track.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Downloading...</span>
                            </>
                          ) : !subscriptionInfo?.isActive ? (
                            <>
                              <span>🔒</span>
                              <span>Subscribe to Download</span>
                            </>
                          ) : isDownloaded(track.id) ? (
                            <>
                              <span>✅</span>
                              <span>Re-download</span>
                            </>
                          ) : (
                            <>
                              <span>⬇️</span>
                              <span>Download</span>
                            </>
                          )}
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
            {/* Subscription Status Card */}
            <div className="bg-gradient-to-br from-spindeck-dark to-black rounded-xl p-6 border border-gray-800/50 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {subscriptionInfo?.isActive ? "✅ Active Subscription" : "🔒 No Active Subscription"}
                  </h3>
                  <p className="text-gray-400">
                    {subscriptionInfo?.isActive 
                      ? `You have unlimited access to download tracks.`
                      : "Subscribe to download high-quality tracks for your DJ sets."}
                  </p>
                </div>
                <div className="flex gap-3">
                  {subscriptionInfo?.isActive && customerId ? (
                    <ButtonPortal 
                      customerId={customerId}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all"
                    >
                      Manage Subscription
                    </ButtonPortal>
                  ) : (
                    <Link 
                      href="/pricing"
                      className="px-6 py-3 bg-spindeck-red hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                    >
                      View Plans
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Download History</h2>
            
            {downloads.length === 0 ? (
              <div className="bg-spindeck-dark rounded-xl p-12 text-center border border-gray-800/50">
                <div className="text-6xl mb-4">⬇️</div>
                <h3 className="text-xl font-semibold mb-2">No downloads yet</h3>
                <p className="text-gray-400 mb-4">Start downloading tracks to build your collection</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="px-6 py-3 bg-spindeck-red hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Browse Tracks
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {downloads.map((download) => (
                  <div 
                    key={download.id} 
                    className="bg-spindeck-dark rounded-xl p-5 border border-gray-800/50 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Artwork */}
                      <div className="w-14 h-14 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {download.tracks?.artwork_url ? (
                          <img
                            src={download.tracks.artwork_url}
                            alt={download.tracks.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl bg-gradient-to-br from-gray-700 to-gray-800">
                            🎵
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{download.tracks?.title}</h3>
                        <p className="text-sm text-gray-400 truncate">{download.tracks?.artist_name}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          {download.tracks?.genre && <span>{download.tracks.genre}</span>}
                          {download.tracks?.bpm && <span>{download.tracks.bpm} BPM</span>}
                          <span>Downloaded {new Date(download.downloaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Re-download Button */}
                      <button
                        onClick={() => {
                          if (download.tracks?.audio_url) {
                            const link = document.createElement("a");
                            link.href = download.tracks.audio_url;
                            link.download = `${download.tracks.artist_name} - ${download.tracks.title}.mp3`;
                            link.target = "_blank";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast.success("Re-downloading track!");
                          }
                        }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <span>⬇️</span>
                        <span className="hidden sm:inline">Re-download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
