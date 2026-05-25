"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/pressbase/client";
import AudioPlayer from "../AudioPlayer";
import toast from "react-hot-toast";

export default function TracksList({ userId }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const pb = createClient();

  useEffect(() => {
    fetchTracks();
  }, [userId]);

  const fetchTracks = async () => {
    try {
      const { data, error } = await pb
        .from("tracks")
        .select("*")
        .eq("user_id", userId)
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

  const deleteTrack = async (trackId) => {
    if (!confirm("Are you sure you want to delete this track? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await pb
        .from("tracks")
        .delete()
        .eq("id", trackId);

      if (error) throw error;

      setTracks(tracks.filter(track => track.id !== trackId));
      toast.success("Track deleted successfully");
    } catch (error) {
      console.error("Error deleting track:", error);
      toast.error("Failed to delete track");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          label: "Approved"
        };
      case "rejected":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          label: "Rejected"
        };
      case "pending":
      default:
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: "Pending"
        };
    }
  };

  const filteredTracks = tracks.filter(track => {
    if (filter === "all") return true;
    return track.status === filter;
  });

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "plays":
        return (b.play_count || 0) - (a.play_count || 0);
      case "downloads":
        return (b.download_count || 0) - (a.download_count || 0);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filterOptions = [
    { value: "all", label: "All", count: tracks.length },
    { value: "pending", label: "Pending", count: tracks.filter(t => t.status === "pending").length },
    { value: "approved", label: "Approved", count: tracks.filter(t => t.status === "approved").length },
    { value: "rejected", label: "Rejected", count: tracks.filter(t => t.status === "rejected").length },
  ];

  if (loading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="h-8 w-40 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-full sm:w-80 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-spindeck-dark rounded-xl p-5 border border-gray-800/50 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === option.value
                  ? "bg-spindeck-red text-white shadow-lg shadow-red-500/20"
                  : "bg-spindeck-dark text-gray-400 hover:text-white border border-gray-800/50 hover:border-gray-700"
              }`}
            >
              {option.label}
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                filter === option.value ? 'bg-white/20' : 'bg-gray-700'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-spindeck-dark border border-gray-800/50 rounded-lg text-white text-sm focus:outline-none focus:border-spindeck-red transition-colors"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="plays">Most plays</option>
            <option value="downloads">Most downloads</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {sortedTracks.length === 0 ? (
        <div className="bg-spindeck-dark rounded-xl p-12 text-center border border-gray-800/50">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎵</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
          <p className="text-gray-500">
            {filter === "all" 
              ? "Upload your first track to get started" 
              : `No ${filter} tracks found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTracks.map((track) => {
            const statusConfig = getStatusConfig(track.status);
            
            return (
              <div 
                key={track.id} 
                className={`group bg-spindeck-dark rounded-xl border transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-black/20 ${
                  track.status === 'approved' ? 'border-green-500/20' :
                  track.status === 'rejected' ? 'border-red-500/20' :
                  'border-gray-800/50'
                } hover:border-gray-700`}
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Artwork & Basic Info */}
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
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-semibold truncate">{track.title}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">by {track.artist_name}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800/50 rounded">
                            {track.genre}
                          </span>
                          {track.bpm && (
                            <span>{track.bpm} BPM</span>
                          )}
                          {track.key && (
                            <span>Key: {track.key}</span>
                          )}
                          <span>{formatDuration(track.duration)}</span>
                          <span>{formatFileSize(track.file_size)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 px-4 py-2 bg-black/20 rounded-lg">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-400">{track.play_count || 0}</div>
                        <div className="text-xs text-gray-500">Plays</div>
                      </div>
                      <div className="w-px h-8 bg-gray-700"></div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-spindeck-red">{track.download_count || 0}</div>
                        <div className="text-xs text-gray-500">Downloads</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {track.audio_url && (
                        <div className="w-48">
                          <AudioPlayer
                            src={track.audio_url}
                            title={track.title}
                            artist={track.artist_name}
                            trackId={track.id}
                            className="bg-black/30"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => deleteTrack(track.id)}
                        className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title="Delete track"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload Date Footer */}
                <div className="px-5 py-3 bg-black/20 border-t border-gray-800/30 flex items-center justify-between text-xs text-gray-500">
                  <span>Uploaded {new Date(track.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                  {track.status === 'pending' && (
                    <span className="text-yellow-400">Review in progress...</span>
                  )}
                  {track.status === 'approved' && (
                    <span className="text-green-400">✓ Live in DJ Pool</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
