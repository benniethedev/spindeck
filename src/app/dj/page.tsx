<<<<<<< Updated upstream
/**
 * DJ Pool — Browse, Search & Preview Tracks
 *
 * Public storefront of SpinRec. DJs can:
 * 1. Browse/Filter tracks by genre, BPM, mood
 * 2. Preview 30s audio snippets via StoreAI
 * 3. Request full downloads (requires DJ login)
 * 4. Register as a DJ (free)
 */
"use client";

import { useState, useEffect } from "react";
import DJFilters from "./components/DJFilters";
import TrackGrid from "./components/TrackGrid";
import { useDJ } from "./context/DJContext";
import Navbar from "@/app/components/Navbar";
import DJFooter from "./components/Footer";

export default function DJPoolPage() {
  const { user, isAuthenticated, isDJApproved } = useDJ();
  const [showRegisterCTA, setShowRegisterCTA] = useState(true);

  useEffect(() => {
    setShowRegisterCTA(!isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            SpinRec{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              DJ Pool
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
            Browse tracks from independent artists. Preview, download, and
            discover your next set essential track.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
            <div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">500+</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">Tracks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">15+</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">Genres</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">100+</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">Artists</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">Free</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">For DJs</div>
            </div>
          </div>

          {/* DJ status badge */}
          {showRegisterCTA && (
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800 rounded-2xl px-6 py-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Login to download full tracks</span>
              </div>
              <a href="/dj/login" className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline">DJ Login</a>
              <span className="text-zinc-300 dark:text-zinc-700">or</span>
              <a href="/dj/register" className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline">Register Free</a>
            </div>
          )}

          {!showRegisterCTA && !isDJApproved && (
            <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-full px-4 py-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
              <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">Pending approval — browse and preview available now</span>
            </div>
          )}

          {!showRegisterCTA && isDJApproved && (
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Verified DJ — full access enabled</span>
            </div>
          )}
        </div>
      </section>

      {/* Browse / Search Section */}
      <section className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <DJFilters />
        <TrackGrid djApproved={isDJApproved} />
      </section>

      {/* CTA Section — For non-registered visitors */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-b from-violet-600/5 via-indigo-600/5 to-transparent dark:from-violet-600/10 dark:via-indigo-600/10 dark:to-transparent py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              Ready to access the full pool?
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
              Join hundreds of DJs who use SpinRec to discover fresh tracks.
              Registration is free and approval is typically within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/dj/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 transition-all hover:shadow-xl hover:shadow-violet-500/30">
                Register as DJ
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="/dj/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                DJ Login
=======
'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrackCard } from '@/components/ui/TrackCard';
import { useAuth } from '@/lib/auth-context';

interface TrackData {
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
}

interface Track {
  id: string;
  key: string;
  data: TrackData;
}

const GENRES = [
  'All', 'House', 'Tech House', 'Techno', 'Hip-Hop', 'R&B', 'Drum & Bass',
  'Afro House', 'Lo-Fi', 'Progressive House', 'Trance', 'Ambient', 'Pop',
  'EDM', 'Deep House', 'Minimal', 'Trap', 'Reggaeton', 'Afrobeats', 'Jazz'
];

const MOODS = [
  'All', 'Energetic', 'Chill', 'Dark', 'Uplifting', 'Melodic', 'Raw',
  'Sensual', 'Hype', 'Relaxed', 'Intense', 'Emotional', 'Groovy'
];

const BPM_RANGES = [
  { label: 'All', min: 0, max: 999 },
  { label: 'Slow (80-100)', min: 80, max: 100 },
  { label: 'Mid (100-120)', min: 100, max: 120 },
  { label: 'Fast (120+)', min: 120, max: 999 },
];

const RATINGS = ['All', 'Clean', 'Explicit'];

export default function DJPoolPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMood, setSelectedMood] = useState('All');
  const [selectedBpm, setSelectedBpm] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'bpm-asc' | 'bpm-desc' | 'name'>('newest');
  const [demoRequested, setDemoRequested] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  // Fetch tracks from server-side filtered API
  const fetchTracks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (selectedGenre !== 'All') params.set('genre', selectedGenre);
      if (selectedMood !== 'All') params.set('mood', selectedMood);
      if (selectedRating !== 'All') params.set('rating', selectedRating);
      if (selectedBpm !== 'All') params.set('bpm', selectedBpm);
      if (searchQuery) params.set('search', searchQuery);
      params.set('sort', sortBy);

      const res = await fetch('/api/dj/tracks?' + params);
      if (!res.ok) throw new Error('Failed to fetch tracks');
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (err) {
      // Fallback: generate sample data for display
      console.warn('Using sample data (API unavailable):', err);
      setTracks(generateSampleData());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks, selectedGenre, selectedMood, selectedBpm, selectedRating, searchQuery, sortBy]);

  // Server-side filtering applied
  const sortedTracks = tracks;

  // Demo request handler
  const handleDemoRequest = async (trackId: string) => {
    if (!user) {
      // Redirect to DJ register
      window.location.href = '/dj/register';
      return;
    }
    setDemoRequested(trackId);
    try {
      const res = await fetch('/dj/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId,
          djEmail: user.email,
          djName: user.name,
        }),
      });
      if (res.ok) {
        setDemoRequested(null);
        // Show success feedback
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send request');
        setDemoRequested(null);
      }
    } catch {
      alert('Network error. Please try again.');
      setDemoRequested(null);
    }
  };

  const activeFilters = [
    selectedGenre !== 'All',
    selectedMood !== 'All',
    selectedBpm !== 'All',
    selectedRating !== 'All',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedGenre('All');
    setSelectedMood('All');
    setSelectedBpm('All');
    setSelectedRating('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-violet-950/20 dark:via-black dark:to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.06),transparent)]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-violet-300/15 dark:bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-5 right-5 w-96 h-96 bg-indigo-300/10 dark:bg-indigo-600/8 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10 sm:pt-24 sm:pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              DJ Pool — {tracks.length} tracks available
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight mb-4">
              The DJ
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"> Pool</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Browse curated tracks from independent artists. Preview, request downloads, and discover your next set staple.
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tracks, artists, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-base shadow-sm"
                aria-label="Search tracks"
              />
            </div>

            {/* Filter toggle (mobile) */}
            <div className="mt-4 flex justify-center sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeFilters > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-xs">{activeFilters}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Sort + Results */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        {/* Active filters bar */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            {selectedGenre !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                Genre: {selectedGenre}
                <button onClick={() => setSelectedGenre('All')} className="ml-1 hover:text-violet-900 dark:hover:text-violet-100">×</button>
              </span>
            )}
            {selectedMood !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">
                Mood: {selectedMood}
                <button onClick={() => setSelectedMood('All')} className="ml-1 hover:text-pink-900 dark:hover:text-pink-100">×</button>
              </span>
            )}
            {selectedBpm !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                BPM: {selectedBpm}
                <button onClick={() => setSelectedBpm('All')} className="ml-1 hover:text-amber-900 dark:hover:text-amber-100">×</button>
              </span>
            )}
            {selectedRating !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                Rating: {selectedRating}
                <button onClick={() => setSelectedRating('All')} className="ml-1 hover:text-green-900 dark:hover:text-green-100">×</button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar filters */}
          <aside className={`lg:w-64 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              {/* Genre */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                  Genre
                </h3>
                <div className="space-y-1">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedGenre === genre
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                  Mood
                </h3>
                <div className="space-y-1">
                  {MOODS.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedMood === mood
                          ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-medium'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* BPM Range */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                  BPM Range
                </h3>
                <div className="space-y-1">
                  {BPM_RANGES.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedBpm(range.label)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedBpm === range.label
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                  Rating
                </h3>
                <div className="space-y-1">
                  {RATINGS.map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedRating === rating
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Showing <span className="font-semibold text-zinc-900 dark:text-white">{sortedTracks.length}</span> tracks
              </p>
              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm text-zinc-500 dark:text-zinc-400">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="newest">Newest</option>
                  <option value="bpm-asc">BPM: Low → High</option>
                  <option value="bpm-desc">BPM: High → Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-900" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                      <div className="h-3 bg-zinc-100 dark:bg-zinc-800/50 rounded w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-5 bg-zinc-100 dark:bg-zinc-800/50 rounded-full w-16" />
                        <div className="h-5 bg-zinc-100 dark:bg-zinc-800/50 rounded-full w-12" />
                      </div>
                      <div className="h-10 bg-zinc-100 dark:bg-zinc-800/50 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedTracks.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6">
                  <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">No tracks found</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
                  Try adjusting your filters or search query to discover more tracks.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTracks.map((track) => (
                  <TrackCard key={track.id} track={track} onDemoRequest={handleDemoRequest} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* CTA for non-logged-in DJs */}
      {!user && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
            <div className="relative px-8 py-12 sm:px-16 sm:py-16 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                DJ? Get Full Access
              </h2>
              <p className="text-lg text-violet-100 max-w-xl mx-auto mb-6">
                Sign up for free to request full track downloads, access exclusive DJ content, and stay ahead of the curve.
              </p>
              <a
                href="/dj/register"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-violet-700 font-semibold text-base hover:bg-zinc-100 transition-all duration-200 shadow-lg"
              >
                Register as DJ
>>>>>>> Stashed changes
              </a>
            </div>
          </div>
        </section>
      )}

<<<<<<< Updated upstream
      <DJFooter />
=======
      {/* Footer */}
      <Footer />
>>>>>>> Stashed changes
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <a href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Spin<span className="text-violet-600">Rec</span>
          </a>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {"\u00A9"} {new Date().getFullYear()} SpinRec. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Sample data generator for development/display when API is unavailable
function generateSampleData(): Track[] {
  const samples = [
    { trackName: 'Midnight Groove', artistName: 'Luna Wave', genre: 'House', bpm: 124, key: 'Am', mood: 'Groovy' },
    { trackName: 'Neon Dreams', artistName: 'DJ Phoenix', genre: 'Techno', bpm: 130, key: 'Em', mood: 'Dark' },
    { trackName: 'Golden Hour', artistName: 'Amara Sol', genre: 'Afro House', bpm: 118, key: 'Dm', mood: 'Uplifting' },
    { trackName: 'Void Walker', artistName: 'The Void', genre: 'Techno', bpm: 135, key: 'Bm', mood: 'Raw' },
    { trackName: 'Chillwave Sunset', artistName: 'Echo Park', genre: 'Lo-Fi', bpm: 85, key: 'C', mood: 'Chill' },
    { trackName: 'Electric Pulse', artistName: 'Nyx Protocol', genre: 'Progressive House', bpm: 128, key: 'Fm', mood: 'Energetic' },
    { trackName: 'Soul Fire', artistName: 'Jade Rivers', genre: 'R&B', bpm: 95, key: 'Gm', mood: 'Sensual' },
    { trackName: 'Bassline Theory', artistName: 'Kai Nakamura', genre: 'Hip-Hop', bpm: 92, key: 'D', mood: 'Hype' },
    { trackName: 'Starlight', artistName: 'Maya Chen', genre: 'House', bpm: 122, key: 'Am', mood: 'Melodic' },
    { trackName: 'Deep End', artistName: 'DJ Phoenix', genre: 'Deep House', bpm: 120, key: 'Cm', mood: 'Chill' },
    { trackName: 'Rave Reunion', artistName: 'Luna Wave', genre: 'Trance', bpm: 138, key: 'Em', mood: 'Energetic' },
    { trackName: 'Urban Jungle', artistName: 'The Void', genre: 'Techno', bpm: 140, key: 'Gm', mood: 'Raw' },
  ];

  return samples.map((s, i) => ({
    id: `sample-${i}`,
    key: `submission:${Date.now().toString(36)}-${i}`,
    data: {
      ...s,
      rating: i % 3 === 0 ? 'explicit' : 'clean',
      isClean: i % 3 !== 0,
      status: 'approved',
      artworkUrl: '',
      audioUrl: '',
      createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
      notes: '',
    },
  }));
}
