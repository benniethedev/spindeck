"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import AudioPlayer from "../AudioPlayer";
import toast from "react-hot-toast";

export default function TrackApproval({ onStatsUpdate }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchTracks();
  }, []);

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

  const updateTrackStatus = async (trackId, status, reason = null) => {
    try {
      const { error } = await supabase
        .from("tracks")
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          ...(reason && { 
            metadata: { 
              ...tracks.find(t => t.id === trackId)?.metadata,
              rejection_reason: reason,
              reviewed_at: new Date().toISOString()
            }
          })
        })
        .eq("id", trackId);

      if (error) throw error;

      setTracks(tracks.map(track => 
        track.id === trackId 
          ? { ...track, status, updated_at: new Date().toISOString() } 
          : track
      ));

      toast.success(`Track ${status}`);
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error("Error updating track status:", error);
      toast.error(`Failed to ${status} track`);
    }
  };

  const handleReject = (trackId) => {
    const reason = prompt("Please provide a reason for rejection (optional):");
    updateTrackStatus(trackId, "rejected", reason);
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
      if (onStatsUpdate) onStatsUpdate();
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
    const matchesStatus = filter === "all" || track.status === filter;
    const matchesSearch = track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.genre?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
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
        <h2 className="text-2xl font-semibold mb-6">Track Approval</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Track Approval</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-spindeck-dark border border-gray-600 rounded-lg text-white placeholder-spindeck-gray focus:outline-none focus:border-spindeck-red"
          />
          
          {/* Filter */}
          <div className="flex space-x-1 bg-spindeck-dark rounded-lg p-1">
            {[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "all", label: "All" },
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Total Tracks</p>
          <p className="text-2xl font-bold">{tracks.length}</p>
        </div>
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">
            {tracks.filter(t => t.status === "pending").length}
          </p>
        </div>
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Approved</p>
          <p className="text-2xl font-bold text-green-500">
            {tracks.filter(t => t.status === "approved").length}
          </p>
        </div>
        <div className="bg-spindeck-dark rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-spindeck-gray">Rejected</p>
          <p className="text-2xl font-bold text-red-500">
            {tracks.filter(t => t.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Tracks List */}
      {filteredTracks.length === 0 ? (
        <div className="bg-spindeck-dark rounded-lg p-12 text-center border border-gray-800">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
          <p className="text-spindeck-gray">
            {filter === "all" 
              ? "No tracks have been uploaded yet" 
              : `No ${filter} tracks found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTracks.map((track) => (
            <div key={track.id} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
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
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold truncate">{track.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(track.status)}`}>
                        {getStatusIcon(track.status)} {track.status}
                      </span>
                    </div>
                    <p className="text-spindeck-gray text-sm mb-1">by {track.artist_name}</p>
                    <p className="text-spindeck-gray text-sm mb-1">
                      Uploaded by {track.profiles?.full_name || track.profiles?.username || "Unknown Artist"}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-spindeck-gray">
                      <span>{track.genre}</span>
                      {track.bpm && <span>{track.bpm} BPM</span>}
                      {track.key && <span>Key: {track.key}</span>}
                      <span>{formatDuration(track.duration)}</span>
                      <span>{formatFileSize(track.file_size)}</span>
                      <span>Uploaded {new Date(track.created_at).toLocaleDateString()}</span>
                    </div>
                    {track.metadata?.rejection_reason && (
                      <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400">
                        <strong>Rejection reason:</strong> {track.metadata.rejection_reason}
                      </div>
                    )}
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

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2">
                  {track.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateTrackStatus(track.id, "approved")}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(track.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  
                  {track.status === "approved" && (
                    <button
                      onClick={() => updateTrackStatus(track.id, "pending")}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                    >
                      ⏳ Revert
                    </button>
                  )}
                  
                  {track.status === "rejected" && (
                    <button
                      onClick={() => updateTrackStatus(track.id, "pending")}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                    >
                      🔄 Review
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteTrack(track.id)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}