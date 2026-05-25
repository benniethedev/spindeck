/**
 * Testimonials - Social proof from featured artists
 */

const testimonials = [
  {
    quote: "SpinRec changed my career. Within two weeks, three major DJs added my track to their sets. The exposure I got was incredible.",
    author: "Marcus Rivera",
    role: "Electronic Producer",
    avatar: "MR",
    color: "from-violet-500 to-purple-600",
  },
  {
    quote: "As an independent artist, getting DJ play used to be impossible. SpinRec made it feel effortless. My streams went up 340% after three months.",
    author: "Aisha Johnson",
    role: "R&B Singer-Songwriter",
    avatar: "AJ",
    color: "from-indigo-500 to-blue-600",
  },
  {
    quote: "The DJ pool is incredibly well-curated. Every submission feels like it reaches the right people. Best investment I've made for my music.",
    author: "DJ Nova",
    role: "House Music Producer",
    avatar: "DN",
    color: "from-fuchsia-500 to-pink-600",
  },
];

const stats = [
  { value: "5,000+", label: "DJs in pool" },
  { value: "200+", label: "Artists promoted" },
  { value: "12K+", label: "Tracks submitted" },
  { value: "340%", label: "Avg. stream increase" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Featured Artists
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Real artists, real results. See what the community is saying.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                "{t.quote}"
              </blockquote>

              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-zinc-900 dark:text-white">{t.author}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
