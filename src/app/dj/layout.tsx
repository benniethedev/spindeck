import type { Metadata } from "next";
import { DJProvider } from "@/app/dj/context/DJContext";
import { DJFilterProvider } from "@/app/dj/context/DJFilterContext";
import Navbar from "@/app/components/Navbar";
import DJFooter from "./components/Footer";

export const generateMetadata = (): Metadata => ({
  title: "DJ Pool — Browse & Preview Tracks | SpinRec",
  description: "Browse the SpinRec DJ pool. Filter by genre, BPM, mood, and preview tracks before requesting full downloads.",
  keywords: ["DJ pool", "music downloads", "DJ tracks", "electronic music", "house music", "techno", "DJ downloads", "music promotion"],
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
          <DJFooter />
        </div>
      </DJFilterProvider>
    </DJProvider>
  );
}
