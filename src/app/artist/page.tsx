import type { Metadata } from "next";

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for artists just getting started with DJ promotion.",
    features: [
      "Up to 3 track submissions/month",
      "Basic artist profile",
      "Email support",
      "Download analytics",
      "Social media sharing",
    ],
    cta: "Get Started",
    highlighted: false,
    stripePath: "/api/stripe/checkout?plan=starter",
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For serious artists who want maximum exposure to DJs.",
    features: [
      "Unlimited track submissions",
      "Featured artist profile",
      "Priority support",
      "Advanced analytics dashboard",
      "Social media promotion",
      "Custom cover art",
      "Priority DJ matching",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    stripePath: "/api/stripe/checkout?plan=professional",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "Full-scale promotion for labels and established artists.",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom campaign strategy",
      "Cross-platform promotion",
      "Exclusive DJ matching",
      "Playlist pitching",
      "White-label options",
      "API access",
    ],
    cta: "Contact Sales",
    highlighted: false,
    stripePath: "/api/stripe/checkout?plan=enterprise",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Sign Up",
    description:
      "Create your free artist account in under 60 seconds. No credit card required to get started.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    step: "2",
    title: "Submit Your Music",
    description:
      "Upload your tracks with metadata, artwork, and genre tags. Our team reviews each submission for quality.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8" />
      </svg>
    ),
  },
  {
    step: "3",
    title: "Get Promoted",
    description:
      "Your music gets featured to curated DJs worldwide. Track plays, downloads, and campaign performance in real-time.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    quote:
      "SpinRec completely changed my career. Within 3 months, my tracks were being played by over 50 active DJs globally.",
    author: "Maya Chen",
    role: "Electronic Producer",
    avatar: "MC",
  },
  {
    quote:
      "The quality of DJs on the platform is unmatched. My indie track got featured in sets across 12 countries.",
    author: "Jade Rivers",
    role: "R&B Artist & Songwriter",
    avatar: "JR",
  },
  {
    quote:
      "As an independent artist, SpinRec gave me the exposure that major labels never could. Absolutely worth every penny.",
    author: "Kai Nakamura",
    role: "Hip-Hop Producer",
    avatar: "KN",
  },
  {
    quote:
      "The analytics dashboard alone is worth the subscription. I can see exactly how my music is performing across the platform.",
    author: "Sophia Delgado",
    role: "Pop Artist",
    avatar: "SD",
  },
];

const FEATURED_ARTISTS = [
  { name: "Luna Wave", genre: "House / Tech House", avatar: "LW" },
  { name: "DJ Phoenix", genre: "Drum & Bass", avatar: "DP" },
  { name: "Amara Sol", genre: "Afrobeats / Afro House", avatar: "AS" },
  { name: "The Void", genre: "Techno / Industrial", avatar: "TV" },
  { name: "Echo Park", genre: "Lo-Fi / Chill", avatar: "EP" },
  { name: "Nyx Protocol", genre: "Progressive House", avatar: "NP" },
];

export const metadata: Metadata = {
  title: "Artist Portal — Promote Your Music to Top DJs | SpinRec",
  description:
    "Submit your music to thousands of curated DJs worldwide. Get approved, get promoted, and grow your audience with SpinRec's artist platform.",
  keywords: [
    "artist promotion",
    "DJ pool",
    "music submission",
    "independent artist",
    "music marketing",
    "DJ directory",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SpinRec",
    title: "Artist Portal — Promote Your Music to Top DJs | SpinRec",
    description:
      "Submit your music to thousands of curated DJs worldwide. Get approved, get promoted, and grow your audience.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SpinRec Artist Portal" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@spinrec",
    creator: "@spinrec",
    title: "Artist Portal — Promote Your Music to Top DJs | SpinRec",
    description:
      "Submit your music to thousands of curated DJs worldwide.",
    images: ["/og-image.png"],
  },
};

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              SpinRec
            </a>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Connecting independent artists with top DJs worldwide.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" aria-label="Twitter / X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.98-.32-2.12-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">About</a></li>
              <li><a href="/artist#how-it-works" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">How It Works</a></li>
              <li><a href="/artist#pricing" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Pricing</a></li>
              <li><a href="/dj" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">DJ Pool</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Blog</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Help Center</a></li>
              <li><a href="/contact" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">DMCA</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {"\u00A9"} {new Date().getFullYear()} SpinRec. All rights reserved.
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Made with care for independent artists
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function ArtistPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-violet-950/30 dark:via-black dark:to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.15),rgba(255,255,255,0))]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-36 lg:py-44">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              Trusted by 2,000+ independent artists
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight mb-6">
              Promote Your Music to{" "}
              <span className="gradient-text">Top DJs</span> Worldwide
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10">
              Submit your tracks to thousands of curated DJs. Get approved, get featured,
              and grow your audience — all from one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-semibold text-base hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 shadow-lg shadow-zinc-900/10 dark:shadow-white/5"
              >
                View Pricing
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-base hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200"
              >
                How It Works
              </a>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                4.9/5 rating
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span>10,000+ tracks promoted</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span>5,000+ active DJs</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span>50+ countries</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <svg className="w-full h-16 sm:h-24 text-white dark:text-black" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,60 C360,100 720,0 1080,50 C1260,75 1380,60 1440,60 L1440,100 L0,100 Z" />
          </svg>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Three Steps to DJ Exposure
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Getting your music in front of the right DJs has never been simpler.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative group">
                {item.step !== "3" && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent" />
                )}
                <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 bg-white dark:bg-zinc-950 card-hover hover:border-violet-300 dark:hover:border-violet-800 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white mb-6">
                    {item.icon}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Plans That Scale With You
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Choose the plan that fits your career stage. Cancel or upgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                  plan.highlighted
                    ? "border-violet-500 bg-white dark:bg-zinc-900 shadow-xl shadow-violet-500/10 scale-[1.02] md:scale-105 z-10"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 card-hover"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <svg
                        className="w-5 h-5 shrink-0 text-violet-500 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.stripePath}
                  className={`block w-full text-center py-3.5 rounded-full font-semibold text-base transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
                      : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              30-day money-back guarantee &middot; Cancel anytime &middot; No hidden fees
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 sm:py-32 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Trusted by Artists Worldwide
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Hear from independent artists who have grown their audience with SpinRec.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 bg-white dark:bg-zinc-950 card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                  {"\u201C"}{t.quote}{"\u201D"}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                      {t.author}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ARTISTS SECTION */}
      <section className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              Featured Artists
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Artists Already on SpinRec
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Join a growing community of independent artists getting real DJ rotation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_ARTISTS.map((artist) => (
              <div
                key={artist.name}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 card-hover text-center transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-800"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold mb-4">
                  {artist.avatar}
                </div>
                <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                  {artist.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {artist.genre}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 sm:py-32 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                Ready to Get Your Music Heard?
              </h2>
              <p className="text-lg text-violet-100 max-w-xl mx-auto mb-8">
                Join thousands of independent artists who are growing their audience with SpinRec{"'"}s DJ platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#pricing"
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

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
