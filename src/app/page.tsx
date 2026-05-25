import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import HowItWorks from "@/app/components/HowItWorks";
import Pricing from "@/app/components/Pricing";
import Testimonials from "@/app/components/Testimonials";
import Footer from "@/app/components/Footer";
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
  generateSoftwareApplicationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/app/lib/structured-data";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://spinrec.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "SpinRec — Promote Your Music to Top DJs Worldwide",
    template: "%s | SpinRec",
  },
  description:
    "Submit your tracks to thousands of curated DJs worldwide. Get approved, get promoted, and grow your audience with SpinRec's independent artist promotion platform.",
  keywords: [
    "artist promotion",
    "DJ pool",
    "music submission",
    "independent artist",
    "music marketing",
    "DJ directory",
    "DJ playlist placement",
    "music promotion platform",
    "electronic music promotion",
    "Spotify promotion",
    "DJ submissions",
    "music distribution",
    "artist platform",
    "DJ contacts",
    "music discovery",
  ],
  authors: [{ name: "SpinRec" }],
  creator: "SpinRec",
  publisher: "SpinRec",
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SpinRec",
    title: "SpinRec — Promote Your Music to Top DJs Worldwide",
    description:
      "Submit your music to thousands of curated DJs worldwide. Get approved, get promoted, and grow your audience with SpinRec's artist promotion platform.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpinRec — Promote Your Music to Top DJs Worldwide",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@spinrec",
    creator: "@spinrec",
    title: "SpinRec — Promote Your Music to Top DJs Worldwide",
    description:
      "Submit your music to thousands of curated DJs worldwide.",
    images: ["/og-image.png"],
  },
  category: "music",
  manifest: "/manifest.json",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* JSON-LD Structured Data */}
      <Script
        id="json-ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateOrganizationJsonLd() }}
        strategy="afterInteractive"
      />
      <Script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebSiteJsonLd() }}
        strategy="afterInteractive"
      />
      <Script
        id="json-ld-software-app"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateSoftwareApplicationJsonLd() }}
        strategy="afterInteractive"
      />
      <Script
        id="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateBreadcrumbJsonLd() }}
        strategy="afterInteractive"
      />

      {/* Skip Navigation Link (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="skip-link"
        tabIndex={0}
      >
        Skip to main content
      </a>

      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        {/* CTA Banner */}
        <section
          className="py-24 sm:py-32 bg-white dark:bg-zinc-950"
          aria-label="Call to action"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.3),transparent_50%)]" />
              {/* Content */}
              <div className="relative px-6 py-16 sm:px-16 sm:py-20 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                  Ready to Get Your Music Heard?
                </h2>
                <p className="text-lg text-violet-100 max-w-xl mx-auto mb-8">
                  Join thousands of independent artists growing their audience with SpinRec&apos;s DJ platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-violet-700 font-semibold text-base hover:bg-zinc-100 transition-all duration-200 shadow-lg"
                  >
                    Get Started Free
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all duration-200"
                  >
                    Talk to Sales
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
