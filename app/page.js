import Link from "next/link";
import Image from "next/image";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import config from "@/config";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import ButtonCheckout from "@/components/ButtonCheckout";

export const metadata = getSEOTags({
  title: "SpinRec - Premier DJ Pool & Music Promotion Platform",
  description: "Promote your music to 10,000+ professional DJs worldwide. Upload tracks, get approved, and reach verified industry tastemakers across all genres.",
  keywords: [
    "DJ pool",
    "music promotion",
    "record pool",
    "DJ promo service",
    "music distribution",
    "DJ music downloads",
    "exclusive tracks",
    "artist promotion platform",
    "music marketing",
    "DJ remix pool",
  ],
  canonicalUrlRelative: "/",
  ogType: "website",
});

export default function HomePage() {
  return (
    <>
      <PublicHeader />

      <main className="bg-void text-text-primary">
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,80,50,0.12)_0%,transparent_70%)]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,180,160,0.06)_0%,transparent_60%)]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
            {/* Eyebrow */}
            <div className="label-md tracking-wider thermal-gradient-text mb-6 animate-fade-in-up">
              THE INDUSTRY STANDARD FOR MUSIC PROMOTION
            </div>

            {/* Headline */}
            <h1 className="headline-xl lg:headline-xl-mobile mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Get Your Music in Front of{" "}
              <span className="thermal-gradient-text">
                10,000+ Professional DJs
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="body-lg text-text-secondary max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              SpinRec is the premier platform connecting artists with verified DJs and industry tastemakers. Upload your tracks, get approved, and reach the audiences that matter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link href="/pricing">
                <button className="btn-primary-cta text-lg">
                  View Pricing
                </button>
              </Link>
              <Link href="/dj-pool">
                <button className="btn-secondary-cta text-lg">
                  Browse DJ Pool
                </button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-center">
                <div className="headline-lg thermal-gradient-text">10K+</div>
                <div className="label-sm text-text-secondary">Verified DJs</div>
              </div>
              <div className="w-px h-12 bg-border-subtle" />
              <div className="text-center">
                <div className="headline-lg thermal-gradient-text">500+</div>
                <div className="label-sm text-text-secondary">Artists Promoted</div>
              </div>
              <div className="w-px h-12 bg-border-subtle" />
              <div className="text-center">
                <div className="headline-lg thermal-gradient-text">50+</div>
                <div className="label-sm text-text-secondary">Genres</div>
              </div>
              <div className="w-px h-12 bg-border-subtle" />
              <div className="text-center">
                <div className="headline-lg thermal-gradient-text">All</div>
                <div className="label-sm text-text-secondary">Genres Supported</div>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent pointer-events-none" />
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section className="cinematic-gap px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="label-md tracking-wider thermal-gradient-text mb-4">HOW IT WORKS</div>
              <h2 className="headline-lg lg:text-5xl mb-6">
                Three Steps to{" "}
                <span className="thermal-gradient-text">Industry Recognition</span>
              </h2>
              <p className="body-lg text-text-secondary max-w-2xl mx-auto">
                From upload to industry exposure — the process is simple, fast, and designed for artists who mean business.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="deck-card">
                <div className="w-12 h-12 rounded-full thermal-gradient flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 10.9M9 9l3 3m0 0l-3 3m3-3H9" />
                  </svg>
                </div>
                <div className="label-md tracking-wider thermal-gradient-text mb-3">STEP 01</div>
                <h3 className="headline-md mb-4">Choose Your Plan</h3>
                <p className="body-md text-text-secondary">
                  Select the promotion package that fits your goals — from a single mixtape blast to full monthly campaigns.
                </p>
              </div>

              {/* Step 2 */}
              <div className="deck-card">
                <div className="w-12 h-12 rounded-full thermal-gradient flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="label-md tracking-wider thermal-gradient-text mb-3">STEP 02</div>
                <h3 className="headline-md mb-4">Submit Your Music</h3>
                <p className="body-md text-text-secondary">
                  Upload your track, artwork, and metadata. Our team reviews every submission to maintain pool quality.
                </p>
              </div>

              {/* Step 3 */}
              <div className="deck-card">
                <div className="w-12 h-12 rounded-full thermal-gradient flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="label-md tracking-wider thermal-gradient-text mb-3">STEP 03</div>
                <h3 className="headline-md mb-4">Get Promoted</h3>
                <p className="body-md text-text-secondary">
                  Once approved, your track appears in the DJ pool and can be featured in targeted email campaigns to 10,000+ verified DJs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== PRICING PREVIEW ==================== */}
        <section className="cinematic-gap px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="label-md tracking-wider thermal-gradient-text mb-4">PRICING</div>
              <h2 className="headline-lg lg:text-5xl mb-6">
                Plans That{" "}
                <span className="thermal-gradient-text">Scale With You</span>
              </h2>
              <p className="body-lg text-text-secondary max-w-2xl mx-auto">
                From single-track promotion to full artist campaigns. Choose what works for your career stage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic */}
              <div className="deck-card flex flex-col">
                <div className="label-sm tracking-wider text-text-secondary mb-4">STARTER</div>
                <div className="mb-6">
                  <span className="headline-lg">$29</span>
                  <span className="body-md text-text-secondary">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "2 tracks per month",
                    "1 email blast per month",
                    "Basic analytics",
                    "DJ pool access",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-5 h-5 thermal-gradient-text shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="body-md text-on-surface">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <button className="btn-secondary-cta w-full">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Silver (Featured) */}
              <div className="deck-card relative flex flex-col" style={{
                borderColor: 'rgba(255, 80, 50, 0.4)',
                boxShadow: '0 0 40px rgba(255, 80, 50, 0.1)',
              }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 label-sm tracking-wider thermal-gradient-text bg-void px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <div className="label-sm tracking-wider thermal-gradient-text mb-4">PROFESSIONAL</div>
                <div className="mb-6">
                  <span className="headline-lg">$200</span>
                  <span className="body-md text-text-secondary"> one-time</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "LIFETIME ACCESS",
                    "10 tracks per month",
                    "5 email blasts per month",
                    "Advanced analytics",
                    "Priority DJ placement",
                    "Download tracking",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-5 h-5 thermal-gradient-text shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`body-md ${feat === "LIFETIME ACCESS" ? "thermal-gradient-text font-semibold" : "text-on-surface"}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <button className="btn-primary-cta w-full">
                    Choose Silver
                  </button>
                </Link>
              </div>

              {/* Gold */}
              <div className="deck-card flex flex-col">
                <div className="label-sm tracking-wider text-text-secondary mb-4">PREMIUM</div>
                <div className="mb-6">
                  <span className="headline-lg">$800</span>
                  <span className="body-md text-text-secondary"> one-time</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    "LIFETIME ACCESS",
                    "50 tracks per month",
                    "20 email blasts per month",
                    "Premium analytics",
                    "Featured placement",
                    "Priority support",
                    "Custom branding",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-5 h-5 thermal-gradient-text shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`body-md ${feat === "LIFETIME ACCESS" ? "thermal-gradient-text font-semibold" : "text-on-surface"}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <button className="btn-secondary-cta w-full">
                    Choose Gold
                  </button>
                </Link>
              </div>
            </div>

            <p className="text-center body-md text-text-secondary mt-12">
              All plans include DJ pool access and industry-standard quality checks.
              <Link href="/pricing" className="thermal-gradient-text ml-1 hover:underline">View all plans →</Link>
            </p>
          </div>
        </section>

        {/* ==================== TESTIMONIALS / FEATURED ARTISTS ==================== */}
        <section className="cinematic-gap px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="label-md tracking-wider thermal-gradient-text mb-4">FEATURED ARTISTS</div>
              <h2 className="headline-lg lg:text-5xl mb-6">
                Trusted by{" "}
                <span className="thermal-gradient-text">Artists Worldwide</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "SpinRec changed my career. Within 2 weeks of submitting, I had 3 DJs using my track in their sets and one reached out for a collab.",
                  name: "Marcus 'DJ Pulse' Williams",
                  role: "Electronic Music Producer",
                  image: "/icon.png",
                },
                {
                  quote: "The quality of DJs in the pool is unmatched. My hip-hop EP got placed in 12 DJ sets within the first month. Worth every penny.",
                  name: "Aaliyah Monroe",
                  role: "R&B Artist",
                  image: "/icon.png",
                },
                {
                  quote: "As an indie artist, getting noticed is the hardest part. SpinRec gave me direct access to decision-makers in the industry.",
                  name: "Carlos Rivera",
                  role: "Latin Trap Artist",
                  image: "/icon.png",
                },
              ].map((artist, i) => (
                <div key={i} className="stage-card p-8">
                  {/* Quote mark */}
                  <svg className="w-10 h-10 thermal-gradient-text opacity-30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="body-md text-on-surface mb-8 leading-relaxed">
                    {artist.quote}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-high flex items-center justify-center overflow-hidden">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="label-md tracking-wider text-text-primary">
                        {artist.name}
                      </div>
                      <div className="label-sm text-text-secondary">
                        {artist.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="cinematic-gap px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="deck-card text-center py-20 px-8" style={{
              background: 'linear-gradient(135deg, #141414 0%, #1c1b1b 100%)',
              boxShadow: '0 0 60px rgba(255, 80, 50, 0.08)',
            }}>
              <div className="label-md tracking-wider thermal-gradient-text mb-6">READY TO GET STARTED?</div>
              <h2 className="headline-lg lg:text-5xl mb-6">
                Your Music Deserves to{" "}
                <span className="thermal-gradient-text">Be Heard</span>
              </h2>
              <p className="body-lg text-text-secondary max-w-xl mx-auto mb-10">
                Join hundreds of artists who are already using SpinRec to break into the industry. Start promoting today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/pricing">
                  <button className="btn-primary-cta text-lg">
                    View Pricing & Plans
                  </button>
                </Link>
                <Link href="/dj-pool">
                  <button className="btn-secondary-cta text-lg">
                    Browse the DJ Pool
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      {/* JSON-LD Schema */}
      {renderSchemaTags({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "SpinRec",
        url: "https://spinrec.com",
        description: "Premier DJ Pool & Music Promotion Platform",
        publisher: {
          "@type": "Organization",
          name: "NetSwagger LLC",
        },
      })}
    </>
  );
}
