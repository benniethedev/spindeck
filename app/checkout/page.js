"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import config from "@/config";
import apiClient from "@/libs/api";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (planId) {
      const foundPlan = config.stripe.plans.find((p) => p.priceId === planId);
      setPlan(foundPlan || null);
    }
  }, [planId]);

  const handleCheckout = async () => {
    if (!plan) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.post("/stripe/create-checkout", {
        priceId: plan.priceId,
        mode: plan.isOneTime ? "payment" : "subscription",
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
      });

      window.location.href = res.url;
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to create checkout session. Please try again.");
      setIsLoading(false);
    }
  };

  // No plan selected - show plan selection
  if (!planId || !plan) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">Choose Your Plan</h1>
          <p className="text-spindeck-gray text-center mb-12">
            Select a plan to continue to checkout
          </p>

          {/* Recurring Plans */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Monthly Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.stripe.plans
                .filter((p) => !p.isOneTime)
                .map((p) => (
                  <Link
                    key={p.priceId}
                    href={`/checkout?plan=${p.priceId}`}
                    className={`
                      block p-6 rounded-lg border-2 transition-all duration-300
                      ${p.isFeatured 
                        ? 'border-spindeck-red bg-spindeck-dark hover:bg-spindeck-dark/80' 
                        : 'border-spindeck-dark bg-spindeck-dark/50 hover:border-spindeck-red/50'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{p.name}</h3>
                        <p className="text-spindeck-gray text-sm">{p.description}</p>
                      </div>
                      {p.isFeatured && (
                        <span className="bg-spindeck-red text-white text-xs px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">${p.price}</span>
                      <span className="text-spindeck-gray">/month</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* One-Time Plans */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">One-Time Promotions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.stripe.plans
                .filter((p) => p.isOneTime)
                .map((p) => (
                  <Link
                    key={p.priceId}
                    href={`/checkout?plan=${p.priceId}`}
                    className="block p-6 rounded-lg border-2 border-spindeck-dark bg-spindeck-dark/50 hover:border-spindeck-red/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{p.name}</h3>
                        <p className="text-spindeck-gray text-sm">{p.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">${p.price}</span>
                      <span className="text-spindeck-gray"> one-time</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Plan selected - show confirmation
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-spindeck-gray">Review your selection and proceed to payment</p>
        </div>

        {/* Plan Card */}
        <div className="bg-spindeck-dark rounded-lg p-8 mb-8 border-2 border-spindeck-red">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
              <p className="text-spindeck-gray">{plan.description}</p>
            </div>
            {plan.isFeatured && (
              <span className="bg-spindeck-red text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
          </div>

          <div className="border-t border-gray-700 pt-6 mb-6">
            <ul className="space-y-3">
              {plan.features?.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-spindeck-red shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg">Total</span>
              <div className="text-right">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-spindeck-gray ml-2">
                  {plan.isOneTime ? "one-time" : "/month"}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 bg-spindeck-red hover:bg-red-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </span>
              ) : (
                `Proceed to Payment`
              )}
            </button>
          </div>
        </div>

        {/* Change Plan Link */}
        <div className="text-center">
          <Link
            href="/checkout"
            className="text-spindeck-gray hover:text-white transition-colors"
          >
            ← Choose a different plan
          </Link>
        </div>

        {/* Security Note */}
        <div className="mt-8 text-center text-sm text-spindeck-gray">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure checkout powered by Stripe
          </div>
          <p>Your payment information is encrypted and secure.</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <PublicHeader />
      <Suspense fallback={
        <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <PublicFooter />
    </>
  );
}
