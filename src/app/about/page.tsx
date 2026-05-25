import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/app/components/Footer";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://spinrec.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: "About SpinRec — Our Mission to Empower Independent Artists",
  description:
    "Learn about SpinRec: the artist promotion platform connecting independent musicians with 5,000+ professional DJs worldwide. Our mission, team, and story.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SpinRec",
    title: "About SpinRec — Our Mission",
    description: "Connecting independent artists with professional DJs worldwide.",
    url: "/about",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Script
        id="json-ld-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About SpinRec",
            description: "Learn about SpinRec's mission to empower independent artists.",
          }),
        }}
        strategy="afterInteractive"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4 block">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            About <span className="gradient-text">SpinRec</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            We believe every independent artist deserves a chance to be heard by the right ears.
            SpinRec was built to level the playing field between indie and major-label promotion.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              SpinRec was founded with a simple idea: music discovery shouldn't depend on budget size.
              Independent producers, singers, and DJs create incredible work every day, but breaking
              into the professional DJ circuit has always been a gatekept process.
            </p>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              We built SpinRec to change that. Our platform connects independent artists directly
              with a curated pool of over 5,000 professional DJs across every genre and region.
              When an artist submits their music through SpinRec, it reaches DJs who are genuinely
              interested in discovering new talent — not just major-label rostered acts.
            </p>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Since our launch, we've helped over 200 independent artists gain real exposure through
              playlist placements, DJ bookings, and increased streaming numbers. Our average artist
              sees a 340% increase in streams within their first three months.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Artist-First",
                description:
                  "Every feature and decision starts with the question: does this help the artist? Our revenue model aligns with artist success.",
              },
              {
                title: "Quality Over Quantity",
                description:
                  "We vet every DJ in our pool. A curated community of 5,000 quality DJs is more valuable than an unvetted database of 100,000.",
              },
              {
                title: "Transparency",
                description:
                  "Real analytics, honest pricing, no hidden fees. Artists deserve to know exactly what they're getting and where their music goes.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
              >
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
