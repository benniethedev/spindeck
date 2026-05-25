"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/libs/pressbase/client";
import toast from "react-hot-toast";

function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Star rating component
function StarRating({ rating, onRate, interactive = false, size = "md" }) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onRate?.(star)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <svg
            className={`${sizeClass} ${
              star <= (hoverRating || rating)
                ? "text-yellow-400"
                : "text-gray-600"
            } transition-colors`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// Single track card
function TrackCard({ track, onPlay, isPlaying, onFeedback }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [feedbackCount, setFeedbackCount] = useState(0);

  const pb = createClient();

  // Load existing feedback and stats
  useEffect(() => {
    const loadFeedbackStats = async () => {
      try {
        // Get average rating
        const { data: allFeedback } = await pb
          .from("track_feedback")
          .select("rating")
          .eq("track_id", track.id);

        if (allFeedback && allFeedback.length > 0) {
          const avg = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
          setAverageRating(avg);
          setFeedbackCount(allFeedback.length);
        }

        // Check for user's existing feedback
        const { data: { user } } = await pb.auth.getUser();
        if (user) {
          const { data: userFeedback } = await pb
            .from("track_feedback")
            .select("*")
            .eq("track_id", track.id)
            .eq("user_id", user.id)
            .single();

          if (userFeedback) {
            setExistingFeedback(userFeedback);
            setRating(userFeedback.rating);
            setComment(userFeedback.comment || "");
          }
        }
      } catch (error) {
        // Ignore errors for stats loading
      }
    };

    loadFeedbackStats();
  }, [track.id]);

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await pb.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to leave feedback");
        return;
      }

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: track.id,
          rating,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      toast.success(existingFeedback ? "Feedback updated!" : "Feedback submitted!");
      setExistingFeedback(data.feedback);
      setShowFeedback(false);
      onFeedback?.();
    } catch (error) {
      toast.error(error.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-spindeck-dark rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
      <div className="flex items-center p-4 gap-4">
        {/* Artwork */}
        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
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

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{track.title}</h3>
          <p className="text-sm text-gray-400 truncate">{track.artist_name}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            {track.genre && <span>{track.genre}</span>}
            {track.bpm && <span>{track.bpm} BPM</span>}
            {track.key && <span>Key: {track.key}</span>}
            <span>{formatDuration(track.duration)}</span>
          </div>
        </div>

        {/* Stats & Rating */}
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
          <div className="text-center">
            <p className="font-medium text-white">{(track.play_count || 0).toLocaleString()}</p>
            <p className="text-xs">Plays</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-white">{(track.download_count || 0).toLocaleString()}</p>
            <p className="text-xs">Downloads</p>
          </div>
          {averageRating !== null && (
            <div className="text-center">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-medium text-white">{averageRating.toFixed(1)}</span>
              </div>
              <p className="text-xs">{feedbackCount} reviews</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPlay(track)}
            className={`p-3 rounded-full transition-colors ${
              isPlaying
                ? "bg-spindeck-red text-white"
                : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className={`p-3 rounded-full transition-colors ${
              showFeedback || existingFeedback
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}
            title="Leave feedback"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Feedback Form */}
      {showFeedback && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-400">Your rating:</span>
                <StarRating rating={rating} onRate={setRating} interactive />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment (optional)..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-spindeck-red resize-none"
                rows={2}
              />
            </div>
            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting || rating === 0}
              className="px-4 py-2 bg-spindeck-red hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg font-medium text-sm transition-colors"
            >
              {isSubmitting ? "..." : existingFeedback ? "Update" : "Submit"}
            </button>
          </div>
          {existingFeedback && (
            <p className="text-xs text-gray-500 mt-2">
              You previously rated this track {existingFeedback.rating}/5
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ArtistTrackList({ tracks, artistId }) {
  const [playingTrack, setPlayingTrack] = useState(null);
  const audioRef = useRef(null);

  const handlePlay = (track) => {
    if (playingTrack?.id === track.id) {
      // Toggle pause/play
      if (audioRef.current?.paused) {
        audioRef.current.play();
      } else {
        audioRef.current?.pause();
      }
      setPlayingTrack(playingTrack?.id === track.id && !audioRef.current?.paused ? null : track);
    } else {
      // Play new track
      setPlayingTrack(track);
      if (audioRef.current) {
        audioRef.current.src = track.audio_url;
        audioRef.current.play().catch(console.error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingTrack(null)}
        onPause={() => {}}
        onPlay={() => {}}
      />

      {/* Track list */}
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          onPlay={handlePlay}
          isPlaying={playingTrack?.id === track.id}
        />
      ))}

      {/* Now Playing Bar */}
      {playingTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-spindeck-dark border-t border-gray-800 p-4 z-50">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
              {playingTrack.artwork_url ? (
                <img
                  src={playingTrack.artwork_url}
                  alt={playingTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xl">
                  🎵
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{playingTrack.title}</p>
              <p className="text-sm text-gray-400 truncate">{playingTrack.artist_name}</p>
            </div>
            <button
              onClick={() => handlePlay(playingTrack)}
              className="p-3 bg-spindeck-red rounded-full text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
