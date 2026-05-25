/**
 * Pricing - Three main pricing tiers with Stripe integration
 * DESIGN.md: violet-to-indigo gradients, rounded cards, hover states
 * WCAG AA: visible focus states, proper contrast, ARIA labels
 */
'use client';

import { useState } from 'react';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  planKey: string;
  highlighted: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for artists just getting started with DJ promotion.',
    features: [
      'Submit up to 3 tracks per month',
      'Access to 1,000+ DJ contacts',
      'Basic analytics dashboard',
      'Email support',
      'Standard playlist placement',
    ],
    cta: 'Start with Starter',
    planKey: 'starter',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'For serious artists who want maximum visibility and impact.',
    features: [
      'Submit unlimited tracks',
      'Access to 5,000+ DJ contacts',
      'Advanced analytics & insights',
      'Priority playlist placement',
      'Featured artist spotlight',
      'Dedicated account manager',
      'Social media cross-promotion',
    ],
    cta: 'Start with Professional',
    planKey: 'professional',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'Full-service promotion for labels and established artists.',
    features: [
      'Everything in Professional',
      'Access to 10,000+ DJ contacts',
      'Custom campaign strategy',
      'Radio & festival circuit outreach',
      'Press kit & bio optimization',
      'White-label DJ submissions',
      'API access',
      '24/7 priority support',
    ],
    cta: 'Contact Sales',
    planKey: 'enterprise',
    highlighted: false,
  },
];

/**
 * Create Stripe Checkout session via API and redirect.
 */
async function initiateCheckout(
  planKey: string,
  email: string,
  name: string,
  onLoading: (loading: boolean) => void,
  onPlan: (plan: string) => void,
  onError: (msg: string) => void
) {
  onLoading(true);
  onPlan(planKey);

  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan: planKey,
        mode: 'subscription',
        email,
        name,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    if (data.url) {
      sessionStorage.setItem('pending_stripe_session', data.sessionId);
      window.location.href = data.url;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    onError(message);
    onLoading(false);
  }
}

function CheckoutForm({
  plan,
  onClose,
}: {
  plan: (typeof plans)[0];
  onClose: () => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !name.trim()) {
      setError('Email and artist name are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    initiateCheckout(plan.planKey, email, name.trim(), setLoading, () => {}, setError);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Setting up your checkout...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          Choose your <span className="gradient-text">{plan.name}</span> plan
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {plan.price}{plan.period} — Enter your details to get started
        </p>
      </div>

      {error && (
        <div
          className="mb-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="checkout-name" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
            Artist / Stage Name
          </label>
          <input
            id="checkout-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
            placeholder="Your artist name"
          />
        </div>

        <div>
          <label htmlFor="checkout-email" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
            Email Address
          </label>
          <input
            id="checkout-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full font-semibold text-sm gradient-bg text-white hover:opacity-90 disabled:opacity-50 shadow-lg shadow-violet-500/25 transition-all duration-200 focus-visible-ring"
        >
          Continue to Payment →
        </button>

        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          Secure payment powered by Stripe
        </p>
      </form>

      <button
        onClick={onClose}
        className="mt-3 w-full text-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors focus-visible-ring px-2 py-1 rounded"
      >
        ← Back to pricing
      </button>
    </div>
  );
}

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(null);

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-white dark:bg-zinc-950" aria-label="Pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold uppercase tracking-widest gradient-text mb-3 block">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Choose the plan that fits your goals. Upgrade or downgrade anytime. No hidden fees.
          </p>
        </div>

        {/* Overlay for checkout form */}
        {selectedPlan && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
          >
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 relative">
              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1 focus-visible-ring rounded"
                aria-label="Close checkout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <CheckoutForm plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
            </div>
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col h-full transition-all duration-300 ${
                plan.highlighted
                  ? 'gradient-bg text-white shadow-2xl shadow-violet-500/30 ring-1 ring-white/20'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg'
              }`}
              role="article"
              aria-label={`${plan.name} plan - ${plan.price}${plan.period}`}
            >
              {plan.badge && (
                <span
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm ${
                    plan.highlighted
                      ? 'bg-amber-400 text-amber-900'
                      : 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300'
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-zinc-900 dark:text-white'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    plan.highlighted ? 'text-violet-100' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.highlighted ? 'text-white' : 'text-zinc-900 dark:text-white'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlighted ? 'text-violet-200' : 'text-zinc-500 dark:text-zinc-500'
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1" aria-label={`${plan.name} features`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-violet-200' : 'text-violet-500'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-violet-100' : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.name === 'Enterprise' ? (
                <a
                  href="/contact"
                  className={`block w-full text-center font-semibold px-6 py-3.5 rounded-full transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-white text-violet-600 hover:bg-violet-50'
                      : 'gradient-bg text-white hover:opacity-90'
                  } focus-visible-ring`}
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  onClick={() => setSelectedPlan(plan)}
                  disabled={loading}
                  className={`block w-full text-center font-semibold px-6 py-3.5 rounded-full transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-white text-violet-600 hover:bg-violet-50 disabled:opacity-60'
                      : 'gradient-bg text-white hover:opacity-90 disabled:opacity-60'
                  } focus-visible-ring`}
                >
                  {loading && loadingPlan === plan.planKey
                    ? 'Processing...'
                    : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-500 flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure payment via Stripe
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              30-day money-back guarantee
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
