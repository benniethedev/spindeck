/**
 * SpinRec Landing Page
 *
 * Public-facing page for independent artists.
 * Sections: Hero → Pricing → Features → How It Works → Testimonials → FAQ → Footer
 */
import HeroSection from '@/app/components/HeroSection';
import PricingSection from '@/app/components/PricingSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import HowItWorksSection from '@/app/components/HowItWorksSection';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import FAQSection from '@/app/components/FAQSection';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PricingSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
