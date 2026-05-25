"use client";

import { useState, useMemo } from "react";
import { useDJFilters } from "../context/DJFilterContext";

const GENRES = [
  "All", "House", "Tech House", "Techno", "Drum & Bass",
  "Ambient", "Lo-Fi", "Hip-Hop", "R&B", "Afrobeats",
  "Afro House", "Progressive House", "Trance", "Dubstep",
];

const MOODS = [
  "All", "Energetic", "Chill", "Dark", "Uplifting",
  "Melodic", "Heavy", "Smooth", "Raw",
];

const BPM_RANGES = [
  { label: "All", min: 0, max: 999 },
  { label: "Slow (60-90)", min: 60, max: 90 },
  { label: "Medium (90-120)", min: 90, max: 120 },
  { label: "Fast (120-140)", min: 120, max: 140 },
  { label: "Rapid (140+)", min: 140, max: 999 },
];

export default function DJFilters() {
  const { filters, setFilters } = useDJFilters();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeFilters = useMemo(() => ({
    genre: filters.genre !== "All" ? filters.genre : null,
    mood: filters.mood !== "All" ? filters.mood : null,
    bpmRange: BPM_RANGES.findIndex(r => r.min === filters.bpmMin && r.max === filters.bpmMax),
  }), [filters]);

  const applyFilters = () => {
    setFilters(prev => ({ ...prev }));
  };

  const resetAll = () => {
    setFilters({
      genre: "All",
      mood: "All",
      bpmMin: 0,
      bpmMax: 999,
      search: "",
    });
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors w-full"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {(activeFilters.genre || activeFilters.mood || activeFilters.bpmRange > 0) && (
          <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">
            {(activeFilters.genre ? 1 : 0) + (activeFilters.mood ? 1 : 0) + (activeFilters.bpmRange > 0 ? 1 : 0)}
          </span>
        )}
      </button>
      <div className={mobileOpen ? "block" : "hidden"}>
        <div className="mb-4">
          <div className="relative max-w-2xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tracks, artists, or producers..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              onBlur={applyFilters}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 min-w-0">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block sm:hidden">Genre</label>
            <select value={filters.genre} onChange={(e) => { setFilters(prev => ({ ...prev, genre: e.target.value })); applyFilters(); }} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer">
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block sm:hidden">Mood</label>
            <select value={filters.mood} onChange={(e) => { setFilters(prev => ({ ...prev, mood: e.target.value })); applyFilters(); }} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer">
              {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block sm:hidden">BPM Range</label>
            <select value={BPM_RANGES.findIndex(r => r.min === filters.bpmMin && r.max === filters.bpmMax)} onChange={(e) => { const idx = parseInt(e.target.value); const range = BPM_RANGES[idx]; setFilters(prev => ({ ...prev, bpmMin: range.min, bpmMax: range.max })); applyFilters(); }} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer">
              {BPM_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
            </select>
          </div>
          <button onClick={resetAll} className="text-sm text-violet-600 dark:text-violet-400 hover:underline whitespace-nowrap pb-2">Reset filters</button>
        </div>
      </div>
    </div>
  );
}
