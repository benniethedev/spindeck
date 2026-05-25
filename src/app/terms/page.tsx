import type { Metadata } from "next";
import Footer from "@/app/components/Footer";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://spinrec.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: "Terms of Service - SpinRec",
  description: "SpinRec's terms of service. Understand your rights and responsibilities as a SpinRec user.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4 block">
            Legal
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">Last updated: May 2026</p>

          <div className="prose prose-base dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              By accessing or using SpinRec, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use our platform.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">2. Artist Submissions</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              You retain all rights to your submitted music. By submitting tracks, you grant
              SpinRec and our DJ partners a non-exclusive license to promote and share your
              music within our platform and DJ network. You represent that you have the right
              to submit all content.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">3. Payments and Subscriptions</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Subscription fees are charged monthly via Stripe. You may cancel at any time.
              Refunds are handled per our refund policy - contact us at hello@spinrec.com
              for any refund requests.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">4. Acceptable Use</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              You may not submit content that infringes third-party rights, contains malware,
              or violates applicable laws. Abuse of the DJ pool or platform will result in
              account termination.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">5. Disclaimer</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              SpinRec facilitates connections between artists and DJs but does not guarantee
              specific outcomes such as playlist placements or streaming numbers. Results vary
              by artist, genre, and plan tier.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">6. Contact</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              For questions about these terms: <a href="mailto:hello@spinrec.com" className="text-violet-600 dark:text-violet-400 hover:underline">hello@spinrec.com</a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
