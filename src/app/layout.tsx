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

const metadataBase = new URL(
  process.env.NEXT_PUBLIC_BASE_URL || "https://spinrec.com"
);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "SpinRec — Promote Your Music to Top DJs",
    template: "%s | SpinRec",
  },
  description: "Submit your music to thousands of curated DJs worldwide. Get approved, get promoted, and grow your audience with SpinRec's artist platform.",
  keywords: ["artist promotion", "DJ pool", "music submission", "independent artist", "music marketing", "DJ directory"],
  authors: [{ name: "SpinRec" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SpinRec",
    title: "SpinRec — Promote Your Music to Top DJs",
    description: "Submit your music to thousands of curated DJs worldwide.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@spinrec",
    creator: "@spinrec",
    title: "SpinRec — Promote Your Music to Top DJs",
    description: "Submit your music to thousands of curated DJs worldwide.",
    images: ["/og-image.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
