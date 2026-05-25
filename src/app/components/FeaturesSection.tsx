/**
 * FeaturesSection - Feature comparison table for Free/Pro/Pro+ tiers
 */
const featureRows = [
  {
    feature: 'Track Submissions',
    free: '1 / month',
    pro: '5 / month',
    proPlus: 'Unlimited',
  },
  {
    feature: 'DJ Network Size',
    free: '50+',
    pro: '200+',
    proPlus: '500+',
  },
  {
    feature: 'DJ Pool Placement',
    free: '—',
    pro: 'Standard',
    proPlus: 'Featured',
  },
  {
    feature: 'Analytics Dashboard',
    free: 'Basic',
    pro: 'Advanced',
    proPlus: 'Full',
  },
  {
    feature: 'Custom Release Notes',
    free: '—',
    pro: '✓',
    proPlus: '✓',
  },
  {
    feature: 'Social Media Promotion',
    free: '—',
    pro: '✓',
    proPlus: '✓',
  },
  {
    feature: 'Email Blast Inclusion',
    free: '—',
    pro: '—',
    proPlus: '✓',
  },
  {
    feature: 'Dedicated Account Manager',
    free: '—',
    pro: '—',
    proPlus: '✓',
  },
  {
    feature: 'White-Label Reports',
    free: '—',
    pro: '—',
    proPlus: '✓',
  },
  {
    feature: 'Priority Support',
    free: '—',
    pro: '✓',
    proPlus: '✓',
  },
  {
    feature: 'Custom Landing Page',
    free: '—',
    pro: '—',
    proPlus: '✓',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Compare plans
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            See what each tier offers so you can pick the right plan for your goals.
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Column headers */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">Feature</div>
              <div className="text-center text-sm font-semibold text-zinc-900 dark:text-white">Free</div>
              <div className="text-center text-sm font-semibold text-zinc-900 dark:text-white">Pro</div>
              <div className="text-center text-sm font-semibold text-zinc-900 dark:text-white">Pro+</div>
            </div>

            {/* Rows */}
            {featureRows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 gap-4 py-4 text-sm ${
                  i < featureRows.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''
                }`}
              >
                <div className="font-medium text-zinc-900 dark:text-white">{row.feature}</div>
                <div className="text-center text-zinc-500 dark:text-zinc-400">{row.free}</div>
                <div className="text-center text-zinc-500 dark:text-zinc-400">{row.pro}</div>
                <div className="text-center text-zinc-500 dark:text-zinc-400">{row.proPlus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#pricing"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
          >
            Choose Your Plan
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
