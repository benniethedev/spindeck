/**
 * PricingSection - Three-tier pricing cards linked to Stripe checkout
 * Tiers: Free Trial, Pro, Pro+
 * Maps to: Starter ($29), Professional ($79), Enterprise ($199) plans in Stripe
 */
'use client';

import { useState } from 'react';

interface Package {
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  stripePlan: string;
  features: string[];
  highlight: boolean;
}

const packages: Package[] = [
  {
    name: 'Free Trial',
    price: '$0',
    period: 'for 7 days',
    description: 'Try SpinRec risk-free. Submit one track and see the results.',
    cta: 'Start Free Trial',
    stripePlan: 'free-trial',
    highlight: false,
    features: [
      '1 track submission',
      'Delivery to 50+ DJs',
      'Basic analytics',
      'Email support',
      'Standard delivery time',
    ],
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    description: 'For serious artists ready to grow their audience.',
    cta: 'Get Started — Pro',
    stripePlan: 'professional',
    highlight: true,
    features: [
      '5 track submissions',
      'Delivery to 200+ DJs',
      'Advanced analytics & reports',
      'Priority delivery',
      'Custom release notes',
      'Social media promotion',
      'Priority support',
    ],
  },
  {
    name: 'Pro+',
    price: '$199',
    period: '/month',
    description: 'Maximum reach with premium DJ network and full campaign management.',
    cta: 'Get Started — Pro+',
    stripePlan: 'enterprise',
    highlight: false,
    features: [
      'Unlimited track submissions',
      'Delivery to 500+ DJs',
      'Full campaign management',
      'Featured placement in DJ pool',
      'Custom landing page',
      'Email blast inclusion',
      'Dedicated account manager',
      'White-label reports',
    ],
  },
];

async function createCheckoutSession(plan: string, mode: 'payment' | 'subscription' = 'subscription') {
  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: plan === 'free-trial' ? 'starter' : plan, mode }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Checkout failed:', err);
      return null;
    }

    const data = await res.json();
    return data.url as string;
  } catch (err) {
    console.error('Checkout error:', err);
    return null;
  }
}

export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (pkg: Package) => {
    setLoading(pkg.name);

    if (pkg.stripePlan === 'free-trial') {
      window.location.href = '/artist/signup?trial=true';
      return;
    }

    const url = await createCheckoutSession(pkg.stripePlan, 'subscription');
    if (url) {
      window.location.href = url;
    } else {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Choose the plan that fits your goals. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl border-2 p-8 transition-all hover:-translate-y-1 ${
                pkg.highlight
                  ? 'border-violet-500 shadow-xl shadow-violet-500/10 bg-gradient-to-b from-violet-50 to-white dark:from-violet-950/30 dark:to-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{pkg.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">{pkg.price}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{pkg.period}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{pkg.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <svg className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(pkg)}
                disabled={loading !== null}
                className={`w-full py-3 px-6 rounded-full font-semibold text-sm transition-all ${
                  pkg.highlight
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 hover:from-violet-700 hover:to-indigo-700'
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
                } ${loading !== null ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading === pkg.name ? 'Redirecting...' : pkg.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Secure payment via Stripe · 30-day money-back guarantee · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
