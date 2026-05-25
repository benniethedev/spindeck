/**
 * Features - Key benefits of SpinRec for artists
 * DESIGN.md: gradient icons, rounded cards, hover states
 */

const features = [
  {
    title: "Curated DJ Pool",
    description:
      "Reach 5,000+ vetted professional DJs across all genres and regions worldwide. Every DJ is hand-picked for quality.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Real Analytics",
    description:
      "Track your submissions, plays, and audience growth with our built-in analytics dashboard. Know what works.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Genre Matching",
    description:
      "Our smart algorithm matches your tracks with DJs who play your exact style and vibe. No more spamming random contacts.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    title: "Instant Submissions",
    description:
      "Submit your music in seconds with drag-and-drop uploads and deep link integration. MP3, WAV, or streaming links.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Playlist Placement",
    description:
      "Get your tracks considered for exclusive DJ playlists and festival circuit placements. Real reach, real impact.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    title: "Community Access",
    description:
      "Join a vibrant network of independent artists, producers, and music industry professionals. Grow together.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-950/50" aria-label="Features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold uppercase tracking-widest gradient-text mb-3 block">
            Why Artists Choose SpinRec
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Everything you need to get your music heard
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            From submission to promotion — we&apos;ve built the platform that connects artists with the DJs who matter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-800 hover:shadow-lg transition-all duration-300 bg-white dark:bg-zinc-950"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white mb-5 shadow-md shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
