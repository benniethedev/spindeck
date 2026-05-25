"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

const genres = [
  "All Genres", "Hip-Hop", "R&B", "Pop", "Electronic", "House", "Techno", 
  "Trap", "Drill", "Afrobeat", "Reggae", "Dancehall", "Latin", "Other"
];

const keys = [
  "All Keys", "C", "C#/Db", "D", "D#/Eb", "E", "F", 
  "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"
];

export default function DJPoolBrowse({ initialTracks, genreCounts, isAuthenticated }) {
  const [tracks] = useState(initialTracks);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All Genres");
  const [keyFilter, setKeyFilter] = useState("All Keys");
  const [bpmRange, setBpmRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  const filteredTracks = useMemo(() => {
    return tracks
      .filter(track => {
        const matchesSearch = !searchTerm || 
          track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.artist_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesGenre = genreFilter === "All Genres" || track.genre === genreFilter;
        const matchesKey = keyFilter === "All Keys" || track.key === keyFilter || keyFilter.includes(track.key);
        
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
          default:
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });
  }, [tracks, searchTerm, genreFilter, keyFilter, bpmRange, sortBy]);

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const hasActiveFilters = searchTerm || genreFilter !== "All Genres" || 
    keyFilter !== "All Keys" || bpmRange.min || bpmRange.max;

  const clearFilters = () => {
    setSearchTerm("");
    setGenreFilter("All Genres");
    setKeyFilter("All Keys");
    setBpmRange({ min: "", max: "" });
    setSortBy("newest");
  };

  // Calculate stats
  const totalTracks = tracks.length;
  const totalDownloads = tracks.reduce((sum, t) => sum + (t.download_count || 0), 0);
  const avgBpm = tracks.length > 0 
    ? Math.round(tracks.filter(t => t.bpm).reduce((sum, t) => sum + t.bpm, 0) / tracks.filter(t => t.bpm).length)
    : 0;

  return (
    <>
      <PublicHeader />
      
      <main className="bg-black text-white min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-spindeck-red/10 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Browse the <span className="text-spindeck-red">DJ Pool</span>
              </h1>
              <p className="text-xl text-spindeck-gray max-w-2xl mx-auto">
                Preview tracks and find the perfect music for your sets. 
                {!isAuthenticated && " Sign up as a DJ to download!"}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-spindeck-dark/50 rounded-lg p-4 text-center border border-gray-800">
                <p className="text-3xl font-bold text-spindeck-red">{totalTracks}</p>
                <p className="text-sm text-spindeck-gray">Available Tracks</p>
              </div>
              <div className="bg-spindeck-dark/50 rounded-lg p-4 text-center border border-gray-800">
                <p className="text-3xl font-bold text-green-400">{Object.keys(genreCounts).length}</p>
                <p className="text-sm text-spindeck-gray">Genres</p>
              </div>
              <div className="bg-spindeck-dark/50 rounded-lg p-4 text-center border border-gray-800">
                <p className="text-3xl font-bold text-blue-400">{avgBpm || "—"}</p>
                <p className="text-sm text-spindeck-gray">Avg BPM</p>
              </div>
              <div className="bg-spindeck-dark/50 rounded-lg p-4 text-center border border-gray-800">
                <p className="text-3xl font-bold text-purple-400">{totalDownloads.toLocaleString()}</p>
                <p className="text-sm text-spindeck-gray">Downloads</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner (for non-authenticated users) */}
        {!isAuthenticated && (
          <section className="py-6 bg-gradient-to-r from-spindeck-red to-red-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Ready to download?</h3>
                  <p className="text-white/80">Join as a DJ to access high-quality downloads.</p>
                </div>
                <Link 
                  href="/signin?role=dj" 
                  className="px-6 py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors"
                >
                  Join as DJ →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Filters & Browse Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="bg-spindeck-dark rounded-xl p-6 border border-gray-800 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter Tracks</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-spindeck-red hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tracks or artists..."
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-spindeck-red"
                  />
                </div>

                {/* Genre */}
                <select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre} {genreCounts[genre] ? `(${genreCounts[genre]})` : ""}
                    </option>
                  ))}
                </select>

                {/* Key */}
                <select
                  value={keyFilter}
                  onChange={(e) => setKeyFilter(e.target.value)}
                  className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
                >
                  {keys.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>

                {/* BPM */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bpmRange.min}
                    onChange={(e) => setBpmRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="Min BPM"
                    className="w-full px-3 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-spindeck-red"
                  />
                  <input
                    type="number"
                    value={bpmRange.max}
                    onChange={(e) => setBpmRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="Max BPM"
                    className="w-full px-3 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-spindeck-red"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-spindeck-gray">
                Showing <span className="text-white font-medium">{filteredTracks.length}</span> tracks
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-spindeck-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-spindeck-red text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Downloaded</option>
                <option value="bpm-asc">BPM (Low → High)</option>
                <option value="bpm-desc">BPM (High → Low)</option>
              </select>
            </div>

            {/* Tracks Grid */}
            {filteredTracks.length === 0 ? (
              <div className="bg-spindeck-dark rounded-xl p-12 text-center border border-gray-800">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
                <p className="text-spindeck-gray mb-4">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-spindeck-red hover:bg-red-600 text-white rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTracks.map((track) => (
                  <div 
                    key={track.id}
                    className="bg-spindeck-dark rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all group"
                  >
                    {/* Artwork */}
                    <div className="aspect-square bg-gray-800 relative overflow-hidden">
                      {track.artwork_url ? (
                        <img
                          src={track.artwork_url}
                          alt={track.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                          <span className="text-6xl">🎵</span>
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          href={isAuthenticated ? "/dashboard" : "/signin?role=dj"}
                          className="px-6 py-3 bg-spindeck-red hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                        >
                          {isAuthenticated ? "Go to Dashboard" : "Sign Up to Download"}
                        </Link>
                      </div>

                      {/* Genre badge */}
                      {track.genre && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                          {track.genre}
                        </span>
                      )}

                      {/* Download count */}
                      <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center gap-1">
                        ⬇️ {track.download_count || 0}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold truncate group-hover:text-spindeck-red transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-sm text-spindeck-gray truncate mb-3">
                        {track.artist_name}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-spindeck-gray">
                        <div className="flex items-center gap-3">
                          {track.bpm && <span>{track.bpm} BPM</span>}
                          {track.key && <span>Key: {track.key}</span>}
                        </div>
                        <span>{formatDuration(track.duration)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA at bottom */}
            {!isAuthenticated && filteredTracks.length > 0 && (
              <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-spindeck-red/20 to-red-700/20 rounded-xl p-8 border border-spindeck-red/30">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Download These Tracks?
                  </h3>
                  <p className="text-spindeck-gray mb-6 max-w-xl mx-auto">
                    Join SpinRec as a DJ to access high-quality downloads, 
                    exclusive tracks, and build your ultimate music library.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/signin?role=dj" 
                      className="px-8 py-4 bg-spindeck-red hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Join as DJ - Free
                    </Link>
                    <Link 
                      href="/pricing" 
                      className="px-8 py-4 bg-transparent border border-spindeck-gray hover:border-white text-white font-semibold rounded-lg transition-colors"
                    >
                      View Pricing
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
