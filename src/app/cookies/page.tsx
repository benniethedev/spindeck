import type { Metadata } from "next";
import Footer from "@/app/components/Footer";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://spinrec.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: "Cookie Policy — SpinRec",
  description: "SpinRec's cookie policy. Learn how we use cookies and similar technologies.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4 block">
            Legal
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8">
            Cookie <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">Last updated: May 2026</p>

          <div className="prose prose-base dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">What Are Cookies</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Cookies are small text files stored on your device when you visit our website.
              They help us provide a better experience by remembering your preferences and
              understanding how you use our platform.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">Cookies We Use</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>Essential cookies:</strong> Required for basic functionality (authentication, security).
              <br />
              <strong>Analytics cookies:</strong> Help us understand how visitors interact with our site.
              <br />
              <strong>Preference cookies:</strong> Remember your settings and preferences.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">Managing Cookies</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              You can control cookies through your browser settings. Disabling cookies may
              affect the functionality of our platform.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8">Contact</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              For cookie-related questions: <a href="mailto:hello@spinrec.com" className="text-violet-600 dark:text-violet-400 hover:underline">hello@spinrec.com</a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
