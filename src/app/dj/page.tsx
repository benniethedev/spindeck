/**
 * DJ Pool - Browse, preview, and request tracks
 * Public storefront for the DJ network
 */
import type { Metadata } from "next";
import DJFilters from "@/app/dj/components/DJFilters";
import TrackGrid from "@/app/dj/components/TrackGrid";
import Link from "next/link";

export const generateMetadata = (): Metadata => ({
  title: "DJ Pool — Browse & Preview Tracks | SpinRec",
  description:
    "Browse the SpinRec DJ pool. Filter by genre, BPM, and mood. Preview tracks with 30s audio snippets. Free DJ registration required for downloads.",
  keywords: ["DJ pool", "music downloads", "DJ tracks", "techno", "house", "DJ tool"],
  openGraph: {
    title: "DJ Pool — Browse & Preview Tracks",
    description: "Browse the SpinRec DJ pool. Filter by genre, BPM, mood, and preview tracks before requesting full downloads.",
    type: "website",
    url: "https://spinrec.com/dj",
    siteName: "SpinRec",
    images: [
      {
        url: "https://spinrec.com/og-dj-pool.png",
        width: 1200,
        height: 630,
        alt: "SpinRec DJ Pool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DJ Pool — Browse & Preview Tracks",
    description: "Browse the SpinRec DJ pool. Filter by genre, BPM, mood, and preview tracks.",
  },
});

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-300/20 dark:bg-violet-800/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-300/15 dark:bg-indigo-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Free DJ Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-5">
            The DJ Pool for
            <br />
            <span className="gradient-text">Independent Artists</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            Browse tracks from emerging artists. Preview with 30s audio clips,
            filter by genre, BPM, and mood, then request full downloads.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dj/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
            >
              Join Free — Browse Pool
            </Link>
            <a
              href="#pool"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
            >
              Preview Tracks
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">500+</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Tracks</div>
            </div>
            <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800" />
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">50+</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Artists</div>
            </div>
            <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800" />
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">14</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Genres</div>
            </div>
            <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800" />
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">Free</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Registration</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
            How the DJ Pool Works
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Three simple steps to discover and download tracks from emerging artists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              step: "1",
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ),
              title: "Browse & Filter",
              desc: "Search tracks by genre, BPM, or mood. Find exactly what fits your set.",
            },
            {
              step: "2",
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Preview Tracks",
              desc: "Listen to 30-second audio snippets directly in your browser. No downloads needed.",
            },
            {
              step: "3",
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              ),
              title: "Request Download",
              desc: "Click request and we will send you the full track file via email.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 text-violet-600 dark:text-violet-400 mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2">
                Step {item.step}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DJCTASection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/50 to-transparent dark:via-violet-950/10" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Ready to join the pool?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            Free DJ registration takes less than a minute. Get access to the full track
            library, download demos, and discover the next big release.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dj/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
            >
              Register as DJ
            </Link>
            <Link
              href="/dj/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
            >
              DJ Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DJPoolPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero */}
      <HeroSection />

      {/* Filters + Track Grid */}
      <section id="pool" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
            Browse the Pool
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Filter by genre, BPM, or mood. Click play to preview any track.
          </p>
        </div>

        {/* Filters */}
        <DJFilters />
        {/* TrackGrid handles its own filtering internally */}
        <TrackGrid djApproved={false} />
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* CTA */}
      <DJCTASection />
    </div>
  );
}

export default DJPoolPage;
