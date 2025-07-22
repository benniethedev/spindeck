import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import SpinDeckPricing from "@/components/SpinDeckPricing";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `Pricing | ${config.appName}`,
  description: "Choose the perfect plan to promote your music. From independent artists to major labels, we have a plan for you.",
  canonicalUrlRelative: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PublicHeader />

      <main className="bg-black text-white pt-20">
        <SpinDeckPricing />
      </main>

      <PublicFooter />
    </>
  );
}