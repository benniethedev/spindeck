/**
 * HowItWorksSection - 3-step process: Sign Up, Submit, Get Promoted
 */
const steps = [
  {
    step: '01',
    title: 'Sign Up & Choose a Plan',
    description: 'Create your artist account in seconds. Pick a promotion package that matches your goals — from our free trial to Pro+.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Submit Your Track',
    description: 'Upload your music, add artwork, set genre and BPM, and provide any links. Our submission form makes it dead simple.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0c0 1.105 1.343 2 3 2s3-.895 3-2-1.343-2-3-2-3 .895-3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Get Promoted & Track Results',
    description: 'Your track goes live to our network of DJs, bloggers, and influencers. Monitor your campaign in real-time from your dashboard.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            How it works
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Three simple steps to get your music into the hands of influential DJs.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-violet-300 dark:from-violet-700 to-transparent -translate-y-1/2" />
              )}

              <div className="relative">
                {/* Step number badge */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40 text-violet-600 dark:text-violet-400 mb-6">
                  {s.icon}
                </div>

                {/* Step label */}
                <span className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                  Step {s.step}
                </span>

                {/* Title */}
                <h3 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
