/**
 * Footer - Global footer with links, legal, social
 * DESIGN.md: dark surface, text hierarchy, social icons
 */

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "DJ Pool", href: "/dj" },
    { label: "Submit Music", href: "/artist/submit" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight mb-4 focus-visible-ring">
              <span className="gradient-text">Spin</span>
              <span className="text-zinc-300">Rec</span>
            </a>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mb-6">
              Connecting independent artists with 5,000+ professional DJs worldwide.
              Get your music played.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/spinrec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className="hover:text-white transition-colors focus-visible-ring p-1 rounded"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/spinrec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="hover:text-white transition-colors focus-visible-ring p-1 rounded"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://soundcloud.com/spinrec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on SoundCloud"
                className="hover:text-white transition-colors focus-visible-ring p-1 rounded"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.236 2.154.236 2.108c.007.06.05.103.101.103.05 0 .09-.043.099-.103l.225-2.108-.272-2.154c-.009-.06-.05-.1-.098-.1m-.899.828c-.074 0-.113.056-.119.114l-.217 1.321.217 1.276c.007.064.046.114.119.114.069 0 .113-.05.12-.114l.196-1.276-.236-1.321c-.008-.063-.051-.114-.119-.114m1.892-.778c-.061 0-.112.046-.119.114l-.201 1.08.201 1.58c.007.067.058.114.119.114.06 0 .112-.047.119-.114l.181-1.58-.22-1.08c-.007-.068-.059-.114-.119-.114m.899-.322c-.068 0-.119.053-.126.12l-.182 1.402.182 1.257c.007.067.058.12.126.12.067 0 .12-.053.127-.12l.163-1.257-.201-1.402c-.007-.067-.06-.12-.127-.12m.899-.163c-.074 0-.126.059-.133.127l-.163 1.565.163 1.172c.007.067.059.127.133.127.073 0 .126-.06.133-.127l.144-1.172-.182-1.565c-.007-.068-.06-.127-.133-.127m.9-.017c-.08 0-.134.06-.141.134l-.144 1.582.144 1.103c.007.067.061.134.141.134.079 0 .134-.067.141-.134l.125-1.103-.163-1.582c-.007-.074-.062-.134-.141-.134m.899.067c-.086 0-.141.06-.148.134l-.125 1.515.125 1.05c.007.067.062.134.148.134.08 0 .142-.067.148-.134l.106-1.05-.144-1.515c-.006-.074-.068-.134-.148-.134m.899.151c-.092 0-.148.067-.155.141l-.106 1.362.106 1.017c.007.067.063.141.155.141.086 0 .148-.074.155-.141l.087-1.017-.125-1.362c-.007-.074-.069-.141-.155-.141m.898.185c-.098 0-.155.074-.162.148l-.087 1.177.087.967c.007.074.064.148.162.148.092 0 .155-.074.162-.148l.069-.967-.106-1.177c-.007-.074-.07-.148-.162-.148m.899.252c-.105 0-.162.08-.169.155l-.069 1.024.069.917c.007.074.064.155.169.155.098 0 .162-.081.169-.155l.051-.917-.087-1.024c-.007-.075-.071-.155-.169-.155m3.137-1.265c-.486 0-.917.067-1.294.174v12.95c.377.107.808.174 1.294.174 2.166 0 3.556-1.344 3.556-3.727 0-2.383-1.39-3.747-3.556-3.747v.176zm-1.892-1.432c-.074 0-.126.06-.133.134l-.087.86.087.86c.007.074.059.134.133.134.074 0 .134-.06.134-.134l.069-.86-.069-.86c0-.074-.06-.134-.134-.134m1.892 1.606c.486 0 .884.053 1.19.155v-3.627c-.306-.101-.704-.155-1.19-.155-2.166 0-3.556 1.344-3.556 3.747 0 2.383 1.39 3.727 3.556 3.727.486 0 .884-.053 1.19-.155v-3.693c-.306.101-.704.155-1.19.155-.972 0-1.594-.672-1.594-1.546 0-.874.622-1.546 1.594-1.546.043 0 .084.002.125.006-.041-.004-.082-.006-.125-.006zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://open.spotify.com/user/spinrec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Spotify"
                className="hover:text-white transition-colors focus-visible-ring p-1 rounded"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.41.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors focus-visible-ring px-1 rounded">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors focus-visible-ring px-1 rounded">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors focus-visible-ring px-1 rounded">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} SpinRec. All rights reserved.
          </p>
          <p className="text-sm text-zinc-600">
            Built with care for independent artists everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
