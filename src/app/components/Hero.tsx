/**
 * Hero - Main landing page hero section
 * DESIGN.md: violet-to-indigo gradients, dark zinc backgrounds, Geist Sans
 * WCAG AA: visible focus states, semantic HTML, ARIA labels
 */

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 pt-16"
      aria-label="Hero"
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Background gradient orbs — DESIGN.md glow-accent style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-violet-300 dark:bg-violet-900/40 rounded-full blur-3xl opacity-25" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-300 dark:bg-indigo-900/40 rounded-full blur-3xl opacity-25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-200 dark:bg-fuchsia-900/20 rounded-full blur-3xl opacity-15" />
        {/* Accent glow at top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-400/10 via-violet-300/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-28">
        {/* Badge */}
        <div className="animate-fade-in-up">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-full px-4 py-1.5 hover:bg-violet-100 dark:hover:bg-violet-950/60 transition-colors"
            aria-label="See pricing plans"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            Now accepting new artists
          </a>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-zinc-900 dark:text-white mb-6"
          style={{ animationDelay: "0.1s" }}
        >
          Promote Your Music to{" "}
          <span className="gradient-text">Top DJs</span>
          <br className="hidden sm:block" />
          Worldwide
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-in-up max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed"
          style={{ animationDelay: "0.2s" }}
        >
          SpinRec connects independent artists with a curated pool of{" "}
          <strong className="text-zinc-900 dark:text-white">5,000+ professional DJs</strong>.
          Submit your tracks, get featured, and reach audiences you never thought possible.
        </p>

        {/* CTA buttons */}
        <div
          className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#pricing"
            className="w-full sm:w-auto gradient-bg text-white font-semibold px-8 py-4 rounded-full text-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-violet-500/25 focus-visible-ring"
          >
            View Pricing Plans
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 px-8 py-4 rounded-full text-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible-ring"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            See How It Works
          </a>
        </div>

        {/* Social proof */}
        <div
          className="animate-fade-in-up mt-16 text-sm text-zinc-500 dark:text-zinc-500"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="mb-4">Trusted by 200+ independent artists</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="ml-1.5 font-medium text-zinc-700 dark:text-zinc-300">4.9/5</span>
            </div>
          </div>
        </div>

        {/* Trusted by logos row */}
        <div
          className="animate-fade-in-up mt-12"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-medium mb-4">
            Trusted by artists at
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-40 dark:opacity-30">
            {["Spotify", "SoundCloud", "Bandcamp", "Beatport"].map((brand) => (
              <span
                key={brand}
                className="text-sm font-bold text-zinc-400 dark:text-zinc-500 tracking-wider"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
