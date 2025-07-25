"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ButtonSignin from "@/components/ButtonSignin";
import BrandLogo from "@/components/BrandLogo";

export default function PublicHeader() {
  const pathname = usePathname();

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
    <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-spindeck-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BrandLogo />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  isActive(link.href)
                    ? "text-spindeck-red"
                    : "text-spindeck-gray hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-spindeck-red" />
                )}
              </Link>
            ))}
            <ButtonSignin text="Login" />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <MobileMenu navLinks={navLinks} isActive={isActive} />
            <ButtonSignin text="Login" />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ navLinks, isActive }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-spindeck-dark border-b border-gray-800 z-50">
            <nav className="flex flex-col space-y-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded transition-colors ${
                    isActive(link.href)
                      ? "text-spindeck-red bg-spindeck-red/10"
                      : "text-spindeck-gray hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

