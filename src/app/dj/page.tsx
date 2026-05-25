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
              </a>
            </div>
          </div>
        </section>
      )}

      <DJFooter />
    </div>
  );
}
