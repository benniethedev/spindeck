import Link from "next/link";
import ButtonSignin from "@/components/ButtonSignin";
import SpinDeckPricing from "@/components/SpinDeckPricing";
import config from "@/config";

export default function PricingPage() {
  return (
    <>
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-spindeck-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="SpinDeck Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-spindeck-gray hover:text-white transition">
                Home
              </Link>
              <Link href="/about" className="text-spindeck-gray hover:text-white transition">
                About
              </Link>
              <Link href="/contact" className="text-spindeck-gray hover:text-white transition">
                Contact
              </Link>
              <ButtonSignin text="Login" />
            </nav>
            <div className="md:hidden">
              <ButtonSignin text="Login" />
            </div>
          </div>
        </div>
      </header>

      <main className="bg-black text-white pt-20">
        <SpinDeckPricing />
      </main>

      <footer className="py-12 bg-black border-t border-spindeck-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-spindeck-gray">© 2024 {config.appName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}