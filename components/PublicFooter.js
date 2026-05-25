import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import config from "@/config";

export default function PublicFooter() {
  return (
    <footer className="py-16 bg-void border-t border-border-subtle/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <BrandLogo />
            </div>
            <p className="body-md text-text-secondary mb-4">
              Where Music Meets the Industry.
            </p>
            <p className="label-sm text-text-secondary">
              The premier record pool and music promotion platform for artists, DJs, and labels across all genres.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="label-md tracking-wider text-on-surface mb-6">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/pricing" className="body-md text-text-secondary hover:text-text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/dj-pool" className="body-md text-text-secondary hover:text-text-primary transition-colors">DJ Pool</Link></li>
              <li><Link href="/dj-pool/browse" className="body-md text-text-secondary hover:text-text-primary transition-colors">Browse Tracks</Link></li>
              <li><Link href="/about" className="body-md text-text-secondary hover:text-text-primary transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="label-md tracking-wider text-on-surface mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="body-md text-text-secondary hover:text-text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="body-md text-text-secondary hover:text-text-primary transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="body-md text-text-secondary hover:text-text-primary transition-colors">Blog</Link></li>
              <li><a href="https://netswagger.com" target="_blank" rel="noopener noreferrer" className="body-md text-text-secondary hover:text-text-primary transition-colors">NetSwagger LLC</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="label-md tracking-wider text-on-surface mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/tos" className="body-md text-text-secondary hover:text-text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="body-md text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border-subtle/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="label-sm text-text-secondary">
              © {new Date().getFullYear()} {config.appName}. All rights reserved.
            </p>
            <p className="label-sm text-text-secondary">
              A subsidiary of{" "}
              <a
                href="https://netswagger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="thermal-gradient-text hover:opacity-80 transition-opacity"
              >
                NetSwagger LLC
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
