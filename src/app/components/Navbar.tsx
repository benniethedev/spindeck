/**
 * Public Navbar - Navigation for the public-facing landing page
 * Includes links to pricing, about, and auth
 */
'use client';

import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Spin<span className="text-violet-600 dark:text-violet-400">Rec</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
              Pricing
            </a>
            <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
              How It Works
            </a>
            <a href="#faq" className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
              FAQ
            </a>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700" />
            <a
              href="/artist/login"
              className="text-sm font-medium text-zinc-700 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
            >
              Log in
            </a>
            <a
              href="/artist/signup"
              className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 transition-all hover:shadow-lg hover:shadow-violet-500/30"
            >
              Get Started
            </a>
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
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors py-2"
              >
                Pricing
              </a>
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors py-2"
              >
                How It Works
              </a>
              <a
                href="#faq"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors py-2"
              >
                FAQ
              </a>
              <div className="w-px h-px bg-zinc-200 dark:bg-zinc-700" />
              <a
                href="/artist/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-700 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors py-2"
              >
                Log in
              </a>
              <a
                href="/artist/signup"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 transition-all"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
