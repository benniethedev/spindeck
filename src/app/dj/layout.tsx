/**
 * DJ Pool layout - Wraps all DJ pages with providers, navbar, and footer
 */
import type { Metadata } from "next";
import { DJProvider } from "@/app/dj/context/DJContext";
import { DJFilterProvider } from "@/app/dj/context/DJFilterContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/dj/components/Footer";

export const generateMetadata = (): Metadata => ({
  title: "DJ Pool",
  description: "Browse the SpinRec DJ pool. Filter by genre, BPM, mood, and preview tracks before requesting full downloads.",
  openGraph: {
    title: "DJ Pool — Browse & Preview Tracks",
    description: "Browse the SpinRec DJ pool. Filter by genre, BPM, mood, and preview tracks.",
    type: "website",
  },
  twitter: {
    title: "DJ Pool — Browse & Preview Tracks",
    description: "Browse the SpinRec DJ pool. Filter by genre, BPM, mood, and preview tracks.",
    card: "summary_large_image",
  },
});

export default function DJLayout({ children }: { children: React.ReactNode }) {
  return (
    <DJProvider>
      <DJFilterProvider>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </DJFilterProvider>
    </DJProvider>
  );
}
