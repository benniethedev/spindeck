"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import config from "@/config";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown to redirect to dashboard
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = config.auth.callbackUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-xl mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-500"
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
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl text-spindeck-gray mb-8">
          Thank you for subscribing to {config.appName}. Your account has been upgraded.
        </p>

        {/* What's Next */}
        <div className="bg-spindeck-dark rounded-lg p-8 mb-8 text-left">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-spindeck-red rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                1
              </span>
              <div>
                <p className="font-semibold">Check your email</p>
                <p className="text-spindeck-gray text-sm">
                  We've sent a confirmation email with your receipt and subscription details.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-spindeck-red rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                2
              </span>
              <div>
                <p className="font-semibold">Access your dashboard</p>
                <p className="text-spindeck-gray text-sm">
                  Your dashboard is now unlocked with all the features from your plan.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-spindeck-red rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                3
              </span>
              <div>
                <p className="font-semibold">Start promoting your music</p>
                <p className="text-spindeck-gray text-sm">
                  Upload your first track and reach DJs worldwide!
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href={config.auth.callbackUrl}
            className="block w-full py-4 bg-spindeck-red hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-center"
          >
            Go to Dashboard
          </Link>
          <p className="text-spindeck-gray text-sm">
            Redirecting automatically in {countdown} seconds...
          </p>
        </div>

        {/* Support Note */}
        <div className="mt-12 text-sm text-spindeck-gray">
          <p>
            Need help?{" "}
            <Link href="/contact" className="text-spindeck-red hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <PublicHeader />
      <Suspense fallback={
        <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <PublicFooter />
    </>
  );
}
