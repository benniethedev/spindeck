import type { Metadata } from "next";
import Footer from "@/app/components/Footer";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://spinrec.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: "Privacy Policy — SpinRec",
  description: "SpinRec's privacy policy. How we collect, use, and protect your data as an independent artist.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4 block">
            Legal
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">Last updated: May 2026</p>

          <div className="prose prose-base dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Information We Collect</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We collect information you provide directly, such as your name, email address,
              artist name, and payment information through Stripe. We also collect submission data
              (track metadata, genre tags, audio files) and usage analytics.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">How We Use Your Information</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your information is used to connect your music with DJs, process payments,
              provide analytics, improve our platform, and communicate with you about your account
              and our services.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">Data Sharing</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We share your submitted music metadata with DJs in our pool who have subscribed
              to your plan tier. We do not sell your personal data. Payment processing is handled
              securely by Stripe.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">Data Security</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We use industry-standard encryption, secure hosting, and regular security audits
              to protect your data.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">Your Rights</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              You can access, update, or delete your personal data at any time through your
              account settings. Contact us at hello@spinrec.com for any privacy-related requests.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">Contact</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              For privacy inquiries: <a href="mailto:hello@spinrec.com" className="text-violet-600 dark:text-violet-400 hover:underline">hello@spinrec.com</a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
