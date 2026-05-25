import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/app/components/Footer";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://spinrec.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: "Contact SpinRec — Get in Touch",
  description:
    "Have questions about SpinRec? Reach out to our team. We're here to help independent artists succeed with DJ promotion.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SpinRec",
    title: "Contact SpinRec",
    description: "Get in touch with the SpinRec team.",
    url: "/contact",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Script
        id="json-ld-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact SpinRec",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: "hello@spinrec.com",
            },
          }),
        }}
        strategy="afterInteractive"
      />

      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4 block">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            Contact <span className="gradient-text">SpinRec</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Whether you're an artist with questions or a label interested in a partnership,
            we'd love to hear from you.
          </p>

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <a
              href="mailto:hello@spinrec.com"
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg transition-all text-center group"
            >
              <svg className="w-8 h-8 mx-auto mb-3 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Email</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">hello@spinrec.com</p>
            </a>
            <a
              href="https://twitter.com/spinrec"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg transition-all text-center group"
            >
              <svg className="w-8 h-8 mx-auto mb-3 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Twitter</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">@spinrec</p>
            </a>
          </div>

          {/* Contact form */}
          <div className="max-w-xl mx-auto bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
            <form action="mailto:hello@spinrec.com" method="POST" encType="text/plain" className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full gradient-bg text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25 focus-visible-ring"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
