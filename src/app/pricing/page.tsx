'use client';

import StripeCheckoutButton from '@/components/StripeCheckoutButton';

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for artists just getting started with DJ promotion.',
    features: [
      'Up to 3 track submissions/month',
      'Basic artist profile',
      'Email support',
      'Download analytics',
      'Social media sharing',
    ],
    planId: 'starter' as const,
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'For serious artists who want maximum exposure to DJs.',
    features: [
      'Unlimited track submissions',
      'Featured artist profile',
      'Priority support',
      'Advanced analytics dashboard',
      'Social media promotion',
      'Custom cover art',
      'Priority DJ matching',
    ],
    planId: 'professional' as const,
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'Full-scale promotion for labels and established artists.',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom campaign strategy',
      'Cross-platform promotion',
      'Exclusive DJ matching',
      'Playlist pitching',
      'White-label options',
      'API access',
    ],
    planId: 'enterprise' as const,
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-violet-950/30 dark:via-black dark:to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.15),rgba(255,255,255,0))] dark:hidden" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            Simple, Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            Choose Your <span className="gradient-text">Artist Package</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Get your music in front of thousands of curated DJs. Pick a plan that fits your career stage.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                  plan.highlighted
                    ? 'border-violet-500 bg-white dark:bg-zinc-900 shadow-xl shadow-violet-500/10 scale-[1.02] md:scale-105 z-10'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-zinc-900 dark:text-white">{plan.price}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <svg
                        className="w-5 h-5 shrink-0 text-violet-500 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3">
                  <StripeCheckoutButton
                    plan={plan.planId}
                    planName={plan.name}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
                  />
                  <a
                    href={`/api/stripe/checkout?plan=${plan.planId}`}
                    className="block w-full text-center py-2.5 rounded-full text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Use Stripe Link
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Secure payments powered by Stripe
            </p>
            <div className="flex items-center justify-center gap-8 opacity-40">
              {/* Stripe logo placeholder */}
              <svg className="h-8 w-auto" viewBox="0 0 60 25" fill="currentColor">
                <path d="M5.3 11.4c0-.7.3-1.3.8-1.6.5-.3 1.3-.5 2.3-.5h.8v-.3c0-.6-.2-1-.6-1.3-.4-.3-1-.4-1.8-.4-.8 0-1.5.2-2 .5-.5.3-.7.8-.7 1.4h2.2c0-.2.1-.3.2-.4.1-.1.3-.1.5-.1.5 0 .7.2.7.5 0 .3-.2.4-.6.5-.4.1-.7.3-.9.5-.2.3-.3.6-.3 1.1v5.5c0 .5.2.9.5 1.2.3.3.7.4 1.2.4.6 0 1.1-.2 1.4-.5.3-.3.5-.8.5-1.3v-.4H7.5v-.3c0-.5-.2-.9-.5-1.1-.3-.3-.8-.4-1.4-.4s-1.2.2-1.6.5c-.4.4-.6.8-.6 1.4 0 .6.2 1.1.6 1.4.4.4.9.5 1.6.5.5 0 1-.1 1.4-.3.4-.2.7-.5.9-.8.2-.3.3-.7.3-1.1v-.4h-2.2v.3c0 .7.2 1.2.7 1.6.5.4 1.2.6 2.2.6 1 0 1.7-.3 2.2-.7.5-.5.8-1.1.8-1.9V11.4z" />
              </svg>
              <span className="text-lg font-semibold text-zinc-400">VISA</span>
              <span className="text-lg font-semibold text-zinc-400">MC</span>
              <span className="text-lg font-semibold text-zinc-400">AMEX</span>
              <span className="text-lg font-semibold text-zinc-400">PayPal</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-28 bg-white dark:bg-black">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'How does the subscription work?',
                a: 'Your subscription renews monthly. You can upgrade, downgrade, or cancel at any time from your artist dashboard.',
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Yes, you can cancel anytime. You will continue to have access to your plan benefits until the end of your billing period.',
              },
              {
                q: 'Is there a free trial?',
                a: 'The Professional plan includes a trial period. Contact us for enterprise trial options.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit and debit cards through Stripe. All payments are processed securely.',
              },
              {
                q: 'Is there a refund policy?',
                a: 'We offer a 30-day money-back guarantee on all plans. No questions asked.',
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            Ready to Grow Your Music Career?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
            Join thousands of independent artists getting real DJ rotation with SpinRec.
          </p>
          <a
            href="/artist"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-500/25"
          >
            Back to Artist Portal
          </a>
        </div>
      </section>
    </div>
  );
}
