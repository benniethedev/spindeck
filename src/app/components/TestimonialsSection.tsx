/**
 * TestimonialsSection - Social proof from featured artists
 */
const testimonials = [
  {
    quote: 'SpinRec helped me reach DJs I never could have contacted on my own. Within two weeks of my first campaign, a major festival DJ started playing my track.',
    author: 'Marcus T.',
    role: 'Electronic Artist, NYC',
    avatar: (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
        M
      </div>
    ),
  },
  {
    quote: 'I was skeptical at first, but the analytics dashboard showed real engagement. My Spotify streams jumped 400% after my first Pro campaign.',
    author: 'Priya K.',
    role: 'R&B Singer, London',
    avatar: (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
        P
      </div>
    ),
  },
  {
    quote: 'The quality of DJs in the network is outstanding. These aren\'t random contacts — they\'re working professionals who actually spin music in clubs.',
    author: 'DJ Volt',
    role: 'House Music Producer, Berlin',
    avatar: (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
        V
      </div>
    ),
  },
  {
    quote: 'As an independent artist, SpinRec is the most cost-effective promo tool I\'ve used. The Pro+ plan alone pays for itself with just one feature play.',
    author: 'Sasha L.',
    role: 'Hip-Hop Artist, Toronto',
    avatar: (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
        S
      </div>
    ),
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Trusted by independent artists
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Hear from artists who've grown their audience with SpinRec.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-violet-800 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                {t.avatar}
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">{t.author}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
