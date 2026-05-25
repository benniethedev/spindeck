import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import ButtonCheckout from "@/components/ButtonCheckout";
import Link from "next/link";

export const metadata = getSEOTags({
  title: "Pricing | SpinRec - Music Promotion Plans",
  description: "Choose the perfect plan to promote your music to 10,000+ professional DJs. From single-track promotion to full artist campaigns.",
  canonicalUrlRelative: "/pricing",
});

export default function PricingPage() {
  // Main subscription plans (monthly)
  const monthlyPlans = config.stripe.plans.filter(
    (p) => !p.isAddon && !p.isOneTime
  );

  // One-time / lifetime plans
  const oneTimePlans = config.stripe.plans.filter(
    (p) => p.isOneTime && !p.isAddon
  );

  // Helper: calculate savings vs monthly
  const calcSavings = (plan) => {
    if (!plan.isOneTime || !plan.priceAnchor) return null;
    const basic = config.stripe.plans.find((p) => p.name === "Basic");
    if (!basic) return null;
    const months = Math.floor(plan.priceAnchor / basic.price);
    const savings = Math.round(plan.priceAnchor - plan.price);
    return { months, savings };
  };

  return (
    <>
      <PublicHeader />

      <main className="bg-void text-text-primary pt-24 pb-32">
        {/* ==================== HERO ==================== */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="label-md tracking-wider thermal-gradient-text mb-4">PRICING</div>
            <h1 className="headline-lg lg:text-5xl mb-6">
              Plans That{" "}
              <span className="thermal-gradient-text">Scale With You</span>
            </h1>
            <p className="body-lg text-text-secondary max-w-2xl mx-auto">
              From emerging artists to major labels, we have a plan that fits your career stage. Every plan includes DJ pool access and quality-checked submissions.
            </p>
          </div>
        </section>

        {/* ==================== MONTHLY PLANS ==================== */}
        {monthlyPlans.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 mb-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="headline-md text-on-surface mb-3">Monthly Subscription</h2>
                <p className="body-md text-text-secondary">
                  Flexible billing for artists who want to start now and scale later.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {monthlyPlans.map((plan) => (
                  <div key={plan.priceId} className="stage-card p-8 flex flex-col">
                    <div className="label-sm tracking-wider text-text-secondary mb-4">
                      {plan.name}
                    </div>
                    <div className="mb-6">
                      <span className="headline-lg">${plan.price}</span>
                      <span className="body-md text-text-secondary"> /month</span>
                    </div>
                    <p className="body-md text-text-secondary mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5 thermal-gradient-text shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="body-md text-on-surface">{f.name}</span>
                        </li>
                      ))}
                    </ul>
                    <ButtonCheckout
                      priceId={plan.priceId}
                      mode="subscription"
                      text="Start Monthly Plan"
                      className="w-full btn-secondary-cta text-center block"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==================== ONE-TIME / LIFETIME PLANS ==================== */}
        {oneTimePlans.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 mb-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="headline-md text-on-surface mb-3">
                  Lifetime Access
                </h2>
                <p className="body-md text-text-secondary">
                  One payment, forever access. Save big vs. monthly billing.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {oneTimePlans.map((plan) => {
                  const savings = calcSavings(plan);
                  return (
                    <div
                      key={plan.priceId}
                      className={`stage-card p-8 flex flex-col ${
                        plan.isFeatured
                          ? "border-thermal-start/40"
                          : ""
                      }`}
                      style={
                        plan.isFeatured
                          ? {
                              boxShadow:
                                "0 0 40px rgba(255, 80, 50, 0.1)",
                              borderColor: "rgba(255, 59, 48, 0.4)",
                            }
                          : {}
                      }
                    >
                      {plan.isFeatured && (
                        <div className="label-sm tracking-wider thermal-gradient-text bg-void px-3 py-1 rounded-full mb-4 text-center inline-block w-full">
                          MOST POPULAR
                        </div>
                      )}
                      <div className="label-sm tracking-wider text-text-secondary mb-4">
                        {plan.name}
                      </div>
                      <div className="mb-2">
                        <span className="headline-lg">${plan.price}</span>
                        <span className="body-md text-text-secondary"> one-time</span>
                      </div>
                      {plan.priceAnchor && savings && (
                        <div className="label-sm text-thermal-end mb-4">
                          Save ${savings.savings} vs. monthly
                        </div>
                      )}
                      <p className="body-md text-text-secondary mb-6">{plan.description}</p>
                      <ul className="space-y-3 mb-8 flex-grow">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <svg
                              className="w-5 h-5 thermal-gradient-text shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span
                              className={`body-md ${
                                f.name === "LIFETIME ACCESS"
                                  ? "thermal-gradient-text font-semibold"
                                  : "text-on-surface"
                              }`}
                            >
                              {f.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <ButtonCheckout
                        priceId={plan.priceId}
                        mode="payment"
                        text={`Choose ${plan.name}`}
                        className="w-full btn-primary-cta text-center block"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ==================== ADD-ONS ==================== */}
        {(() => {
          const addOns = config.stripe.plans.filter(
            (p) => p.isAddon
          );
          if (addOns.length === 0) return null;
          return (
            <section className="px-4 sm:px-6 lg:px-8 mb-20">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="headline-md text-on-surface mb-3">
                    Add-Ons
                  </h2>
                  <p className="body-md text-text-secondary">
                    Boost your reach with targeted promotions.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {addOns.map((plan) => (
                    <div key={plan.priceId} className="stage-card p-6 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="label-sm tracking-wider text-text-secondary mb-1">{plan.name}</div>
                          <div className="headline-md">${plan.price}</div>
                        </div>
                      </div>
                      <p className="body-md text-text-secondary mb-4">{plan.description}</p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <svg
                              className="w-4 h-4 thermal-gradient-text shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="body-md text-on-surface">{f.name}</span>
                          </li>
                        ))}
                      </ul>
                      <ButtonCheckout
                        priceId={plan.priceId}
                        mode="payment"
                        text="Add to Cart"
                        className="w-full btn-secondary-cta text-center block"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* ==================== FAQ ==================== */}
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="label-md tracking-wider thermal-gradient-text mb-4">FAQ</div>
              <h2 className="headline-lg mb-6">
                Frequently Asked{" "}
                <span className="thermal-gradient-text">Questions</span>
              </h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  q: "How long does approval take?",
                  a: "Submissions are typically reviewed within 24-48 hours. We check for quality standards, audio format, and metadata completeness.",
                },
                {
                  q: "Can I upgrade or downgrade my plan anytime?",
                  a: "Yes! Monthly plans can be changed at any time. For lifetime plans, we offer prorated upgrades from your current plan.",
                },
                {
                  q: "What genres do you accept?",
                  a: "We accept all genres — hip-hop, R&B, pop, electronic, house, techno, latin trap, and more. Our DJ pool spans 50+ genres.",
                },
                {
                  q: "How does the DJ pool work?",
                  a: "Once your track is approved, it appears in the DJ pool where verified DJs can browse, preview, and download. DJs can also receive your track via targeted email campaigns.",
                },
                {
                  q: "Do I get analytics on my promotion?",
                  a: "Monthly and Silver+ plans include analytics. You'll see download counts, email campaign performance, and DJ engagement metrics.",
                },
              ].map((faq, i) => (
                <div key={i} className="stage-card p-6">
                  <h3 className="headline-md mb-3">{faq.q}</h3>
                  <p className="body-md text-text-secondary">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div
              className="deck-card text-center py-16 px-8"
              style={{
                background:
                  "linear-gradient(135deg, #141414 0%, #1c1b1b 100%)",
                boxShadow: "0 0 60px rgba(255, 80, 50, 0.08)",
              }}
            >
              <h2 className="headline-lg lg:text-4xl mb-4">
                Ready to{" "}
                <span className="thermal-gradient-text">Promote</span>?
              </h2>
              <p className="body-md text-text-secondary mb-8 max-w-lg mx-auto">
                Join hundreds of artists already using SpinRec to break into the industry.
              </p>
              <Link href="/signup">
                <button className="btn-primary-cta text-lg">
                  Create Your Account
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
