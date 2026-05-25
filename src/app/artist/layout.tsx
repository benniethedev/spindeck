/**
 * Artist Portal Layout
 * Wraps all artist routes with the shared Navbar and SEO metadata.
 */
import type { Metadata } from "next";
import { generateOrganizationJsonLd, generateWebSiteJsonLd, generateSoftwareApplicationJsonLd, generateBreadcrumbJsonLd } from '@/app/lib/structured-data';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: "Artist Portal — Promote Your Music to Top DJs | SpinRec",
  description: "Submit your music to thousands of curated DJs worldwide. Get approved, get promoted, and grow your audience with SpinRec's artist platform.",
  keywords: [
    "artist promotion", "DJ pool", "music submission", "independent artist",
    "music marketing", "DJ directory", "electronic music promotion",
    "house music promotion", "techno promotion", "hip-hop promotion",
  ],
  authors: [{ name: "SpinRec" }],
  creator: "SpinRec",
  publisher: "SpinRec",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website", locale: "en_US", siteName: "SpinRec",
    title: "Artist Portal — Promote Your Music to Top DJs | SpinRec",
    description: "Submit your music to thousands of curated DJs worldwide.",
    url: "/artist",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SpinRec Artist Portal" }],
  },
  twitter: {
    card: "summary_large_image", site: "@spinrec", creator: "@spinrec",
    title: "Artist Portal — Promote Your Music to Top DJs | SpinRec",
    description: "Submit your music to thousands of curated DJs worldwide.",
    images: ["/og-image.png"],
  },
};

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateOrganizationJsonLd() }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateWebSiteJsonLd() }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateSoftwareApplicationJsonLd() }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateBreadcrumbJsonLd() }} />
      {children}
    </div>
  );
}
