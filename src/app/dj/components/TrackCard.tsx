"use client";

import { useState, useRef, useEffect } from "react";

interface TrackCardProps {
  track: {
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
  };
  onDemoRequest: (trackId: string, trackName: string) => void;
  isDJApproved?: boolean;
}

const GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-purple-500 to-fuchsia-600",
  "from-red-500 to-pink-600",
  "from-teal-500 to-cyan-600",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getGradient(index: number): string {
  return GRADIENTS[index % GRADIENTS.length];
}

/**
 * Generate a 30-second audio blob as fallback preview
 * In production, use StoreAI downloadUrl for real previews
 */
function generateAudioBlob(trackId: string): Promise<Blob> {
  return new Promise((resolve) => {
    const sampleRate = 44100;
    const duration = 30;
    const numSamples = sampleRate * duration;
    const buffer = new Float32Array(numSamples);

    const seed = trackId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const baseFreq = 110 + (seed % 440);
    const bpm = 120 + (seed % 40);
    const beatInterval = sampleRate * 60 / bpm;

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const beatPhase = (i % Math.round(beatInterval)) / beatInterval;

      const kick = Math.exp(-beatPhase * 8) * 0.4;
      const hiHat = Math.exp(-((beatPhase - 0.5) ** 2) * 40) * 0.15;
      const tone = Math.sin(2 * Math.PI * baseFreq * t) *
        (0.15 + 0.1 * Math.sin(2 * Math.PI * t / 2));
      const sub = Math.sin(2 * Math.PI * baseFreq / 4 * t) * 0.2;

      buffer[i] = (kick + hiHat * (i % 2 === 0 ? 1 : 0.3) + tone + sub) *
        Math.min(1, t * 5) * Math.min(1, (duration - t) * 3);
    }

    const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(wavBuffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const val = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(44 + i * 2, val * 0x7FFF, true);
    }

    resolve(new Blob([wavBuffer], { type: "audio/wav" }));
  });
}

export default function TrackCard({ track, onDemoRequest, isDJApproved }: TrackCardProps) {
  const [playing, setPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Fetch preview URL from StoreAI when component mounts
  useEffect(() => {
    let cancelled = false;
    async function fetchPreview() {
      if (cancelled) return;
      setPreviewLoading(true);
      try {
        const res = await fetch(`/api/dj/get-preview?trackId=${encodeURIComponent(track.id)}`);
        if (res.ok) {
          // Check if response is an actual audio URL
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("json")) {
            const data = await res.json();
            if (data.url) {
              setPreviewUrl(data.url);
            }
          } else if (contentType.includes("audio")) {
            // Blob response — create object URL
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
          }
        }
      } catch {
        // Will fall back to generated audio
      }
      if (!cancelled) setPreviewLoading(false);
    }
    fetchPreview();
    return () => { cancelled = true; };
  }, [track.id]);

  const handlePreview = async () => {
    if (playing) {
      audioRef.current?.pause();
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setPreviewUrl(null);
      setPlaying(false);
    } else {
      // Try StoreAI preview URL first, fallback to generated audio
      if (!previewUrl && !previewLoading) {
        setPreviewLoading(true);
        try {
          const blob = await generateAudioBlob(track.id);
          if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = URL.createObjectURL(blob);
          setPreviewUrl(blobUrlRef.current);
        } finally {
          setPreviewLoading(false);
        }
      }
      const audio = audioRef.current;
      if (audio && previewUrl) {
        audio.src = previewUrl;
        try {
          await audio.play();
          setPlaying(true);
        } catch {
          // autoplay blocked — user interaction needed
        }
      }
    }
  };

  const stopAudio = () => {
    audioRef.current?.pause();
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setPreviewUrl(null);
    setPlaying(false);
  };

  return (
    <div className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden hover:border-violet-300 dark:hover:border-violet-800 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
      {/* Artwork */}
      <div className="relative aspect-square overflow-hidden">
        {track.artworkUrl ? (
          <img
            src={track.artworkUrl}
            alt={track.trackName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient(track.id.charCodeAt(3) % GRADIENTS.length)}`} />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Play button */}
        <button
          onClick={handlePreview}
          disabled={previewLoading}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg disabled:opacity-50"
          aria-label={playing ? "Stop preview" : "Play preview"}
        >
          {previewLoading ? (
            <svg className="w-5 h-5 text-zinc-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : playing ? (
            <svg className="w-4 h-4 text-zinc-900 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-zinc-900 dark:text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Rating badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
          track.rating === "clean"
            ? "bg-emerald-500/90 text-white"
            : "bg-zinc-900/80 text-white backdrop-blur-sm"
        }`}>
          {track.rating === "clean" ? (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Clean
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Exp
            </span>
          )}
        </div>

        {/* BPM badge */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
          {track.bpm} BPM
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(track.artistName)}
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {track.artistName}
          </span>
        </div>
        <h3 className="font-semibold text-zinc-900 dark:text-white text-sm truncate mb-1">
          {track.trackName}
        </h3>
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium">
            {track.genre}
          </span>
          {track.mood && (
            <span>{track.mood}</span>
          )}
          {track.key && (
            <span>Key: {track.key}</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => isDJApproved ? onDemoRequest(track.id, track.trackName) : window.location.href = "/dj/login"}
            className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all"
          >
            {isDJApproved ? "Download Full" : "Login to Download"}
          </button>
          <button
            onClick={handlePreview}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-violet-300 dark:hover:border-violet-800 transition-colors"
          >
            {playing ? "Stop" : "Preview"}
          </button>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={() => setPlaying(false)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} preload="none" />
    </div>
  );
}
