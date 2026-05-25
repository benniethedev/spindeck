"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ButtonSignin from "@/components/ButtonSignin";
import BrandLogo from "@/components/BrandLogo";

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/dj-pool", label: "DJ Pool" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <BrandLogo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`label-md tracking-wider transition-all duration-300 hover:text-text-primary ${
                  isActive(link.href)
                    ? "thermal-gradient-text"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <ButtonSignin text="Login" />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-text-secondary hover:text-white p-2 transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <ButtonSignin text="Login" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-50 glass-subtle">
            <nav className="flex flex-col p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`label-md tracking-wider px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(link.href)
                      ? "thermal-gradient-text bg-deck/50"
                      : "text-text-secondary hover:text-white hover:bg-deck"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 py-2">
                <ButtonSignin text="Login" />
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
