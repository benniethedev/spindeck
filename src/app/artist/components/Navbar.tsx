/**
 * Artist Navbar - Navigation for the artist portal
 * Includes links to dashboard, submit, and account menu
 */
'use client';

import { useArtistAuth } from '../context/ArtistAuthContext';

export default function ArtistNavbar() {
  const { user, loading, isAuthenticated, logout } = useArtistAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/artist" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Spin<span className="text-violet-600 dark:text-violet-400">Rec</span>
        </a>
        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated && !loading && user && (
            <>
              <a
                href="/artist/dashboard"
                className="text-sm text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 font-medium transition-colors hidden sm:block"
              >
                Dashboard
              </a>
              <a
                href="/artist/submit"
                className="text-sm text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 font-medium transition-colors hidden sm:block"
              >
                Submit
              </a>
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/artist/login';
                }}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
              </button>
            </>
          )}
          {!isAuthenticated && !loading && (
            <>
              <a
                href="/artist/login"
                className="text-sm font-medium text-zinc-700 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
              >
                Log in
              </a>
              <a
                href="/artist/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 transition-all"
              >
                Sign Up
              </a>
            </>
          )}
          {loading && (
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          )}
        </div>
      </div>
    </nav>
  );
}
