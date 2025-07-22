"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import AudioPlayer from "../AudioPlayer";
import toast from "react-hot-toast";

export default function TracksList({ userId }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const supabase = createClient();

  useEffect(() => {
    fetchTracks();
  }, [userId]);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
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
      const { error } = await supabase
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

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "rejected":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "pending":
      default:
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "pending":
      default:
        return "⏳";
    }
  };

  const filteredTracks = tracks.filter(track => {
    if (filter === "all") return true;
    return track.status === filter;
  });

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">My Tracks</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/6"></div>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Tracks</h2>
        
        {/* Filter */}
        <div className="flex space-x-1 bg-spindeck-dark rounded-lg p-1">
          {[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filter === option.value
                  ? "bg-spindeck-red text-white"
                  : "text-spindeck-gray hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTracks.length === 0 ? (
        <div className="bg-spindeck-dark rounded-lg p-12 text-center border border-gray-800">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
          <p className="text-spindeck-gray">
            {filter === "all" 
              ? "Upload your first track to get started" 
              : `No ${filter} tracks found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTracks.map((track) => (
            <div key={track.id} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-center space-x-4">
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

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold truncate">{track.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(track.status)}`}>
                      {getStatusIcon(track.status)} {track.status}
                    </span>
                  </div>
                  <p className="text-spindeck-gray text-sm mb-1">by {track.artist_name}</p>
                  <div className="flex items-center space-x-4 text-xs text-spindeck-gray">
                    <span>{track.genre}</span>
                    {track.bpm && <span>{track.bpm} BPM</span>}
                    {track.key && <span>Key: {track.key}</span>}
                    <span>{formatDuration(track.duration)}</span>
                    <span>{formatFileSize(track.file_size)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center space-x-6 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-500">{track.play_count || 0}</div>
                    <div className="text-xs text-spindeck-gray">Plays</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-spindeck-red">{track.download_count || 0}</div>
                    <div className="text-xs text-spindeck-gray">Downloads</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {track.audio_url && (
                    <AudioPlayer
                      src={track.audio_url}
                      title={track.title}
                      artist={track.artist_name}
                      trackId={track.id}
                    />
                  )}
                  <button
                    onClick={() => deleteTrack(track.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete track"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="md:hidden flex justify-center space-x-8 mt-4 pt-4 border-t border-gray-800">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-500">{track.play_count || 0}</div>
                  <div className="text-xs text-spindeck-gray">Plays</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-spindeck-red">{track.download_count || 0}</div>
                  <div className="text-xs text-spindeck-gray">Downloads</div>
                </div>
              </div>

              {/* Upload Date */}
              <div className="mt-3 text-xs text-spindeck-gray">
                Uploaded {new Date(track.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}