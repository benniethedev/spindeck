/**
 * Pricing - Three main pricing tiers with Stripe integration
 */

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for artists just getting started with DJ promotion.",
    features: [
      "Submit up to 3 tracks per month",
      "Access to 1,000+ DJ contacts",
      "Basic analytics dashboard",
      "Email support",
      "Standard playlist placement",
    ],
    cta: "Start with Starter",
    href: "https://buy.stripe.com/test_starter",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For serious artists who want maximum visibility and impact.",
    features: [
      "Submit unlimited tracks",
      "Access to 5,000+ DJ contacts",
      "Advanced analytics & insights",
      "Priority playlist placement",
      "Featured artist spotlight",
      "Dedicated account manager",
      "Social media cross-promotion",
    ],
    cta: "Start with Professional",
    href: "https://buy.stripe.com/test_pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "Full-service promotion for labels and established artists.",
    features: [
      "Everything in Professional",
      "Access to 10,000+ DJ contacts",
      "Custom campaign strategy",
      "Radio & festival circuit outreach",
      "Press kit & bio optimization",
      "White-label DJ submissions",
      "API access",
      "24/7 priority support",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Choose the plan that fits your goals. Upgrade or downgrade anytime. No hidden fees.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col h-full transition-all duration-200 ${
                plan.highlighted
                  ? "gradient-bg text-white shadow-2xl shadow-violet-500/30 scale-[1.02] md:scale-105"
                  : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg"
              }`}
            >
              {plan.badge && (
                <span
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-semibold px-4 py-1.5 rounded-full ${
                    plan.highlighted
                      ? "bg-amber-400 text-amber-900"
                      : "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300"
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlighted ? "text-white" : "text-zinc-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    plan.highlighted ? "text-violet-100" : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.highlighted ? "text-white" : "text-zinc-900 dark:text-white"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-violet-200" : "text-zinc-500 dark:text-zinc-500"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-violet-200" : "text-violet-500"
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
                        plan.highlighted ? "text-violet-100" : "text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block w-full text-center font-semibold px-6 py-3.5 rounded-full transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-white text-violet-600 hover:bg-violet-50"
                    : "gradient-bg text-white hover:opacity-90"
                }`}
              >
                {plan.cta}
              </a>
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
