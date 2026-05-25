import Link from "next/link";
import config from "@/config";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `Payment Cancelled | ${config.appName}`,
  robots: "noindex",
});

export default function CheckoutCancelPage() {
  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-xl text-spindeck-gray mb-8">
            No worries! Your payment was not processed. You can try again whenever you're ready.
          </p>

          {/* Reasons Box */}
          <div className="bg-spindeck-dark rounded-lg p-8 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">Changed your mind?</h2>
            <p className="text-spindeck-gray mb-4">
              Here's why artists and labels choose {config.appName}:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
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
                <span>Reach thousands of DJs in our global network</span>
              </li>
              <li className="flex items-start gap-3">
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
                <span>Track downloads and engagement in real-time</span>
              </li>
              <li className="flex items-start gap-3">
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
                <span>Email blasts to targeted audiences</span>
              </li>
              <li className="flex items-start gap-3">
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
                <span>7-day money-back guarantee</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Link
              href="/pricing"
              className="block w-full py-4 bg-spindeck-red hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-center"
            >
              View Plans Again
            </Link>
            <Link
              href="/"
              className="block w-full py-4 bg-transparent border border-spindeck-gray hover:border-white text-white font-semibold rounded-lg transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>

          {/* Support Note */}
          <div className="mt-12 text-sm text-spindeck-gray">
            <p>
              Have questions?{" "}
              <Link href="/contact" className="text-spindeck-red hover:underline">
                Contact our team
              </Link>
              {" "}and we'll help you find the right plan.
            </p>
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
