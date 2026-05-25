import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpinRec — Promote Your Music to Top DJs",
  description:
    "SpinRec connects independent artists with top DJs, bloggers, and music influencers. Submit your track and get real DJ plays, engagement, and career growth.",
  keywords: [
    "music promotion",
    "DJ pool",
    "music submission",
    "independent artist",
    "music marketing",
    "DJ networking",
    "electronic music",
    "house music promotion",
    "techno promotion",
    "hip-hop promotion",
  ],
  authors: [{ name: "SpinRec" }],
  creator: "SpinRec",
  publisher: "SpinRec",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.spinrec.com"
  ),
  openGraph: {
    title: "SpinRec — Promote Your Music to Top DJs",
    description:
      "Connect with 500+ DJs worldwide. Submit your track, get real plays, and grow your audience.",
    type: "website",
    locale: "en_US",
    siteName: "SpinRec",
    url: "/",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SpinRec — Music Promotion Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpinRec — Promote Your Music to Top DJs",
    description:
      "Connect with 500+ DJs worldwide. Submit your track, get real plays, and grow your audience.",
    images: ["/og-image.svg"],
  },
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
  verification: {
    // Add your verification tokens when available
    // google: 'your-google-verification-token',
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SpinRec",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.spinrec.com",
  description:
    "Music promotion platform connecting independent artists with top DJs worldwide.",
  potentialAction: {
    "@type": "SearchAction",
    target: "{search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
