/**
 * DJ Pool Navbar - Navigation for the DJ pool section
 */
'use client';

import { useDJ } from '@/app/dj/context/DJContext';
import Link from 'next/link';
import { useState } from 'react';

export default function DJNavbar() {
  const { user, isDJApproved, isAuthenticated, logout, isLoading } = useDJ();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Spin<span className="text-violet-600 dark:text-violet-400">Rec</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/dj" className="text-sm font-medium text-violet-600 dark:text-violet-400 transition-colors">
              DJ Pool
            </Link>
            <a
              href="https://www.buymeacoffee.com/spindeck"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
            >
              Support
            </a>
            <Link href="/about" className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
              About
            </Link>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700" />
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user?.name || 'DJ'}
                  {isDJApproved && <span className="ml-1.5 text-emerald-500 text-xs">✓</span>}
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/dj/login"
                  className="text-sm font-medium text-zinc-700 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
                >
                  DJ Login
                </Link>
                <Link
                  href="/dj/register"
                  className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 transition-all hover:shadow-lg hover:shadow-violet-500/30"
                >
                  DJ Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col gap-3">
              <Link
                href="/dj"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-violet-600 dark:text-violet-400 py-2"
              >
                DJ Pool
              </Link>
              <a
                href="https://www.buymeacoffee.com/spindeck"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors py-2"
              >
                Support
              </a>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors py-2"
              >
                About
              </Link>
              <div className="w-px h-px bg-zinc-200 dark:bg-zinc-700" />
              {isAuthenticated ? (
                <div className="flex items-center gap-3 py-2">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {user?.name || 'DJ'}
                    {isDJApproved && <span className="ml-1.5 text-emerald-500 text-xs">✓</span>}
                  </span>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/dj/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-zinc-700 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors py-2"
                  >
                    DJ Login
                  </Link>
                  <Link
                    href="/dj/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 transition-all"
                  >
                    DJ Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
