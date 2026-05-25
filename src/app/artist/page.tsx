/**
 * Artist Landing Page
 *
 * Public-facing page for independent artists.
 * Sections: Hero → How It Works → Pricing → Features → Testimonials → Featured Artists → FAQ → CTA → Footer
 *
 * SEO-optimized with JSON-LD structured data in layout.tsx
 * Mobile-first, responsive design per DESIGN.md
 */
import HeroSection from '@/app/components/HeroSection';
import HowItWorksSection from '@/app/components/HowItWorksSection';
import PricingSection from '@/app/components/PricingSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import FeaturedArtists from '@/app/components/FeaturedArtists';
import FAQSection from '@/app/components/FAQSection';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function ArtistLandingPage() {
  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-black">
      {/* Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Features Comparison */}
        <FeaturesSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Featured Artists */}
        <FeaturedArtists />

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <section className="py-20 sm:py-28 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                  Ready to Get Your Music Heard?
                </h2>
                <p className="text-lg text-violet-100 max-w-xl mx-auto mb-8">
                  Join thousands of independent artists who are growing their audience with SpinRec&apos;s DJ platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/artist/signup"
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
