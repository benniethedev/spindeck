'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Track {
  id: string;
  data: {
    trackName: string;
    artistName: string;
    genre: string;
    bpm: number;
    rating: string;
    isClean: boolean;
    key: string;
    status: string;
    artworkUrl: string;
    audioUrl: string;
    notes?: string;
    createdAt: string;
    mood?: string;
    [key: string]: unknown;
  };
}

interface TrackCardProps {
  track: Track;
  onDemoRequest: (trackId: string) => void;
}

const MOODS = ['Energetic', 'Chill', 'Dark', 'Uplifting', 'Melodic', 'Raw', 'Sensual', 'Hype'];

function formatBpm(bpm: number): string {
  if (bpm >= 120) return 'Fast';
  if (bpm >= 100) return 'Mid';
  return 'Slow';
}

function getMoodColor(mood: string): string {
  const colors: Record<string, string> = {
    Energetic: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Chill: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Dark: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    Uplifting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    Melodic: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    Raw: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Sensual: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    Hype: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  };
  return colors[mood] || 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300';
}

function getGenreColor(genre: string): string {
  const g = genre.toLowerCase();
  if (g.includes('house')) return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300';
  if (g.includes('techno')) return 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
  if (g.includes('hip') || g.includes('rap')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  if (g.includes('r&b') || g.includes('soul')) return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
  if (g.includes('drum') || g.includes('bass')) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  if (g.includes('afro')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  if (g.includes('lo-fi') || g.includes('chill')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
}

export function TrackCard({ track, onDemoRequest }: TrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasInteraction, setHasInteraction] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const { data } = track;
  const isClean = data.isClean ?? data.rating === 'clean';
  const artworkSrc = (data.artworkUrl as string) || '';
  const audioUrl = (data.audioUrl as string) || '';
  const mood = (data.mood as string) || MOODS[Math.floor(Math.random() * MOODS.length)];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
        setHasInteraction(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 2;
        });
      }, 600);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setHasInteraction(true);
    setIsPlaying(!isPlaying);
    if (!isPlaying) setProgress(0);
  };

  const artistInitials = (data.artistName || '??')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const daysAgo = () => {
    if (!data.createdAt) return '';
    const diff = Date.now() - new Date(data.createdAt).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days}d ago`;
  };

  return (
    <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-violet-300 dark:hover:border-violet-800 transition-all duration-300 overflow-hidden">
      {/* Artwork */}
      <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        {artworkSrc ? (
          <img
            src={artworkSrc}
            alt={data.trackName || 'Track artwork'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-400/20 to-indigo-600/20 dark:from-violet-600/10 dark:to-indigo-600/10">
            <span className="text-4xl font-bold text-violet-400 dark:text-violet-500">{artistInitials}</span>
          </div>
        )}

        {/* Play button overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePlay();
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300"
          aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
        >
          <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-white/95 text-zinc-900 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </button>

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300">
            {formatBpm(data.bpm)}
          </span>
          {isClean ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">CLEAN</span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">EXP</span>
          )}
        </div>

        {/* Progress bar when playing */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 dark:text-white text-sm truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {data.trackName}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{data.artistName}</p>
          </div>
          <img
            src="https://www.google.com/s2/favicons?sz=32"
            alt=""
            className="w-5 h-5 shrink-0 opacity-0 group-hover:opacity-40 transition-opacity"
          />
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getGenreColor(data.genre)}`}>
            {data.genre}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMoodColor(mood)}`}>
            {mood}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-auto">
            {data.bpm} BPM
          </span>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 mb-4">
          <span>Key: {data.key || 'N/A'}</span>
          <span>·</span>
          <span>{daysAgo()}</span>
        </div>

        {/* Audio preview player */}
        {isPlaying && (
          <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <svg className="w-3.5 h-3.5 animate-pulse text-violet-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8v8a4.47 4.47 0 002.5-3.5z" />
            </svg>
            <span>Playing preview...</span>
          </div>
        )}

        {/* Demo request button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDemoRequest(track.id);
          }}
          className="w-full py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
        >
          Request Full Download
        </button>
      </div>
    </div>
  );
}

// Fallback SVG icon components
function PlayIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}
