/**
 * HowItWorks - 3-step process for new artists
 * DESIGN.md: gradient icons, section padding, centered layout
 */

const steps = [
  {
    step: "01",
    title: "Sign Up",
    description:
      "Create your free artist account in under 2 minutes. Set up your profile, add your bio, and connect your social links.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Submit Your Tracks",
    description:
      "Upload your best work—MP3, WAV, or links to your SoundCloud, Spotify, or Apple Music. Add genre tags and mood descriptors.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Get Promoted",
    description:
      "Your tracks reach our curated pool of 5,000+ DJs worldwide. Get playlist adds, remix offers, and real feedback from industry pros.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 bg-white dark:bg-zinc-950"
      aria-label="How it works"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold uppercase tracking-widest gradient-text mb-3 block">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Three simple steps to get your music in front of the right ears.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, index) => (
            <div key={item.step} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-zinc-200 dark:border-zinc-800"
                  aria-hidden="true"
                />
              )}

              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg text-white mb-6 shadow-lg shadow-violet-500/20">
                {item.icon}
                <span
                  className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 text-amber-900 text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950"
                  aria-hidden="true"
                >
                  {item.step}
                </span>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
