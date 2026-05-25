"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import TrackCard from "./TrackCard";
import { useDJ } from "@/app/dj/context/DJContext";
import { useDJFilters } from "@/app/dj/context/DJFilterContext";

interface Track {
  id: string;
  trackName: string;
  artistName: string;
  genre: string;
  bpm: number;
  rating: "clean" | "explicit";
  artworkUrl?: string;
  mood?: string;
  key?: string;
  duration?: string;
}

const MOCK_TRACKS: Track[] = [
  {
    id: "1", trackName: "Midnight Protocol", artistName: "DJ Phoenix",
    genre: "Techno", bpm: 128, rating: "clean", mood: "Dark", key: "Am", duration: "6:42",
  },
  {
    id: "2", trackName: "Sunrise Groove", artistName: "Amara Sol",
    genre: "Afro House", bpm: 120, rating: "clean", mood: "Uplifting", key: "Dm", duration: "7:15",
  },
  {
    id: "3", trackName: "Neon Dreams", artistName: "Luna Wave",
    genre: "House", bpm: 124, rating: "explicit", mood: "Energetic", key: "Fm", duration: "5:58",
  },
  {
    id: "4", trackName: "Deep Space", artistName: "The Void",
    genre: "Tech House", bpm: 126, rating: "clean", mood: "Melodic", key: "Cm", duration: "8:03",
  },
  {
    id: "5", trackName: "Afterglow", artistName: "Echo Park",
    genre: "Lo-Fi", bpm: 85, rating: "clean", mood: "Chill", key: "Gm", duration: "4:30",
  },
  {
    id: "6", trackName: "Voltage", artistName: "Nyx Protocol",
    genre: "Progressive House", bpm: 130, rating: "clean", mood: "Energetic", key: "Em", duration: "6:20",
  },
  {
    id: "7", trackName: "Nightfall", artistName: "DJ Phoenix",
    genre: "Techno", bpm: 140, rating: "explicit", mood: "Heavy", key: "Bbm", duration: "7:45",
  },
  {
    id: "8", trackName: "Golden Hour", artistName: "Amara Sol",
    genre: "Afrobeats", bpm: 110, rating: "clean", mood: "Smooth", key: "Ab", duration: "5:12",
  },
  {
    id: "9", trackName: "Pulse", artistName: "Luna Wave",
    genre: "Drum & Bass", bpm: 174, rating: "clean", mood: "Energetic", key: "Dm", duration: "5:33",
  },
  {
    id: "10", trackName: "Whisper", artistName: "Echo Park",
    genre: "Ambient", bpm: 72, rating: "clean", mood: "Chill", key: "F", duration: "9:10",
  },
  {
    id: "11", trackName: "Bassline Theory", artistName: "The Void",
    genre: "Dubstep", bpm: 140, rating: "explicit", mood: "Heavy", key: "Gm", duration: "4:55",
  },
  {
    id: "12", trackName: "Starlight", artistName: "Nyx Protocol",
    genre: "Trance", bpm: 138, rating: "clean", mood: "Uplifting", key: "Am", duration: "8:20",
  },
  {
    id: "13", trackName: "Velvet Touch", artistName: "Maya K.",
    genre: "R&B", bpm: 95, rating: "clean", mood: "Smooth", key: "Eb", duration: "4:15",
  },
  {
    id: "14", trackName: "Street Anthem", artistName: "Kai N.",
    genre: "Hip-Hop", bpm: 92, rating: "explicit", mood: "Raw", key: "Bm", duration: "3:48",
  },
  {
    id: "15", trackName: "Ethereal", artistName: "Echo Park",
    genre: "Ambient", bpm: 68, rating: "clean", mood: "Melodic", key: "C", duration: "10:02",
  },
  {
    id: "16", trackName: "Circuit Breaker", artistName: "DJ Phoenix",
    genre: "Techno", bpm: 135, rating: "clean", mood: "Dark", key: "Am", duration: "6:50",
  },
];

function toDisplayGenre(genre: string): string {
  const map: Record<string, string> = {
    house: "House",
    tech_house: "Tech House",
    techno: "Techno",
    drum_and_bass: "Drum & Bass",
    ambient: "Ambient",
    lo_fi: "Lo-Fi",
    hip_hop: "Hip-Hop",
    rnb: "R&B",
    pop: "Pop",
    afrobeats: "Afrobeats",
    afro_house: "Afro House",
    progressive_house: "Progressive House",
    trance: "Trance",
    dubstep: "Dubstep",
    industrial: "Industrial",
    other: "Other",
  };
  return map[genre] || genre;
}

interface TrackGridProps {
  djApproved: boolean;
}

export default function TrackGrid({ djApproved }: TrackGridProps) {
  const { user } = useDJ();
  const { filters } = useDJFilters();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "bpm" | "artist">("name");
  const [loading, setLoading] = useState(true);
  const [demoTrack, setDemoTrack] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    async function loadTracks() {
      try {
        const { listRecords } = await import("@/lib/storeai");
        const { records } = await listRecords({ key_prefix: "submission:" });
        if (records && records.length > 0) {
          const mapped: Track[] = records.map((r: any) => ({
            id: (r.data.id as string) || r.key,
            trackName: (r.data.trackName as string) || "Untitled",
            artistName: (r.data.artistName as string) || "Unknown",
            genre: toDisplayGenre((r.data.genre as string) || "house"),
            bpm: Number((r.data.bpm as number) || 120),
            rating: (r.data.rating as "clean" | "explicit") || "clean",
            artworkUrl: (r.data.artworkUrl as string) || undefined,
            mood: (r.data.mood as string) || undefined,
            key: (r.data.key as string) || undefined,
            duration: (r.data.duration as string) || undefined,
          }));
          if (mapped.length > 0) {
            setTracks(mapped);
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore
      }
      setTracks(MOCK_TRACKS);
      setLoading(false);
    }
    loadTracks();
  }, []);

  const filteredTracks = useMemo(() => {
    let result = tracks.filter((t) => {
      if (filters.genre !== "All" && t.genre !== filters.genre) return false;
      if (filters.mood !== "All" && t.mood !== filters.mood) return false;
      if (t.bpm < filters.bpmMin || t.bpm > filters.bpmMax) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !t.trackName.toLowerCase().includes(q) &&
          !t.artistName.toLowerCase().includes(q) &&
          !t.genre.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
    result.sort((a, b) => {
      if (sortBy === "bpm") return a.bpm - b.bpm;
      if (sortBy === "artist") return a.artistName.localeCompare(b.artistName);
      return a.trackName.localeCompare(b.trackName);
    });
    return result;
  }, [tracks, filters, sortBy]);

  const handleDemoRequest = (trackId: string, trackName: string) => {
    setDemoTrack({ id: trackId, name: trackName });
  };

  const handleCloseModal = () => setDemoTrack(null);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing <span className="font-semibold text-zinc-900 dark:text-white">{filteredTracks.length}</span>{" "}
          of {tracks.length} tracks
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="name">Name</option>
            <option value="bpm">BPM</option>
            <option value="artist">Artist</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTracks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onDemoRequest={handleDemoRequest}
              isDJApproved={djApproved}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No tracks found</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {demoTrack && (
        <DemoRequestModal track={demoTrack} onClose={handleCloseModal} />
      )}
    </>
  );
}

function DemoRequestModal({
  track,
  onClose,
}: {
  track: { id: string; name: string };
  onClose: () => void;
}) {
  const { user, isAuthenticated, isDJApproved } = useDJ();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [djEmail, setDjEmail] = useState("");
  const [djName, setDjName] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    let name = djName || (user?.name || "");
    let email = djEmail || (user?.email || "");

    if (!name || !email) {
      if (user) {
        name = name || user.name;
        email = email || user.email;
      } else {
        setEmailError("Please enter your name and email to submit a request.");
        return;
      }
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/dj/request-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: track.id,
          trackName: track.name,
          name,
          email,
        }),
      });
      const data = await res.json();
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const handleLoginRedirect = () => {
    onClose();
    window.location.href = "/dj/login";
  };

  const handleRegisterRedirect = () => {
    onClose();
    window.location.href = "/dj/register";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Request Sent!</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              We will email you the download link shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-full text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
              Request Full Download
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Track: <span className="font-semibold text-zinc-900 dark:text-white">{track.name}</span>
            </p>

            {emailError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm text-center">
                {emailError}
              </div>
            )}

            {!isAuthenticated ? (
              <div className="text-center py-6 space-y-3">
                <svg className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You need to be logged in to request downloads.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleLoginRedirect}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition-opacity"
                  >
                    DJ Login
                  </button>
                  <button
                    onClick={handleRegisterRedirect}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                  >
                    Register
                  </button>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Registration is free and takes less than a minute.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                    DJ / Stage Name
                  </label>
                  <input
                    type="text"
                    required
                    value={djName}
                    onChange={(e) => setDjName(e.target.value)}
                    placeholder={user?.name || ""}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={djEmail}
                    onChange={(e) => setDjEmail(e.target.value)}
                    placeholder={user?.email || ""}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending..." : "Request Download"}
                </button>
              </form>
            )}
            <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 text-center">
              Full downloads are available to verified DJs only.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
