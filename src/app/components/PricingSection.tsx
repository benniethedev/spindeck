/**
 * PricingSection - Three-tier pricing cards linked to Stripe checkout
 * Tiers: Starter ($29), Professional ($79), Enterprise ($199)
 * Maps to Stripe plans: starter, professional, enterprise
 * 
 * DESIGN.md alignment: premium music-tech aesthetic, violet-to-indigo gradients,
 * rounded cards, hover states, dark mode support
 * WCAG AA: focus states, proper contrast, ARIA labels
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
  badge?: string;
}

const packages: Package[] = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for artists just getting started with DJ promotion.',
    cta: 'Start with Starter',
    stripePlan: 'starter',
    highlight: false,
    features: [
      'Submit up to 3 tracks per month',
      'Access to 1,000+ DJ contacts',
      'Basic analytics dashboard',
      'Email support',
      'Standard playlist placement',
    ],
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'For serious artists who want maximum visibility and impact.',
    cta: 'Start with Professional',
    stripePlan: 'professional',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Submit unlimited tracks',
      'Access to 5,000+ DJ contacts',
      'Advanced analytics & insights',
      'Priority playlist placement',
      'Featured artist spotlight',
      'Dedicated account manager',
      'Social media cross-promotion',
    ],
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'Full-service promotion for labels and established artists.',
    cta: 'Start with Enterprise',
    stripePlan: 'enterprise',
    highlight: false,
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
  },
];

/**
 * Create Stripe Checkout session via API and redirect.
 * Collects email and artist name for customer creation.
 */
async function createCheckoutSession(
  plan: string,
  email: string,
  name: string,
) {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, mode: 'subscription', email, name }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create checkout session');
  }

  const data = await res.json();
  return data.url as string;
}

/**
 * Email capture form shown as a modal overlay when a plan is selected.
 * Collects email and artist name required for Stripe customer creation.
 */
function PlanModal({
  plan,
  onClose,
  onCheckout,
}: {
  plan: Package;
  onClose: () => void;
  onCheckout: (pkg: Package, email: string, name: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [artistName, setArtistName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!artistName.trim()) {
      setError('Please enter your artist or stage name.');
      return;
    }

    setSubmitting(true);
    onCheckout(plan, email.trim(), artistName.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Checkout ${plan.name} plan`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Plan summary */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            {plan.name} Plan
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {plan.price}{plan.period} — Secure checkout via Stripe
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Loading state */}
        {submitting ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Setting up your checkout...
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="checkout-artist-name"
                className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5"
              >
                Artist / Stage Name
              </label>
              <input
                id="checkout-artist-name"
                type="text"
                required
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                placeholder="Your artist name"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-email"
                className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-full font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200"
            >
              Proceed to Secure Checkout →
            </button>
          </form>
        )}

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure
          </span>
          <span>•</span>
          <span>Powered by Stripe</span>
        </div>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Package | null>(null);

  const handleCheckout = async (pkg: Package, email: string, name: string) => {
    setSelectedPlan(null);
    setLoading(pkg.name);

    try {
      const url = await createCheckoutSession(pkg.stripePlan, email, name);
      // Store email for session verification redirect
      sessionStorage.setItem('pending_checkout_email', email);
      sessionStorage.setItem('pending_checkout_name', name);
      sessionStorage.setItem('pending_checkout_plan', pkg.stripePlan);
      window.location.href = url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      alert(message);
      setLoading(null);
      setSelectedPlan(pkg); // Re-open modal on error
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
              className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:-translate-y-1 ${
                pkg.highlight
                  ? 'border-violet-500/60 shadow-xl shadow-violet-500/10 bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-950/20 dark:to-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md">
                    {pkg.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{pkg.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                    {pkg.price}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{pkg.period}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{pkg.description}</p>
              </div>

              <ul className="space-y-3 mb-8" role="list">
                {pkg.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <svg
                      className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan(pkg)}
                disabled={loading !== null}
                className={`w-full py-3 px-6 rounded-full font-semibold text-sm transition-all duration-200 ${
                  pkg.highlight
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 hover:from-violet-700 hover:to-indigo-700'
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
                } ${loading !== null ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
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

      {/* Email capture modal */}
      {selectedPlan && (
        <PlanModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onCheckout={handleCheckout}
        />
      )}
    </section>
  );
}
