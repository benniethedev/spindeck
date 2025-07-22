import Link from "next/link";
import Image from "next/image";
import config from "@/config";

export default function PublicFooter() {
  return (
    <footer className="py-12 bg-black border-t border-spindeck-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="SpinDeck Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-spindeck-gray">Where Music Meets the Industry</p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-spindeck-gray hover:text-white transition">Pricing</Link></li>
              <li><Link href="/dj-pool" className="text-spindeck-gray hover:text-white transition">DJ Pool</Link></li>
              <li><Link href="/contact" className="text-spindeck-gray hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-spindeck-gray hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="text-spindeck-gray hover:text-white transition">Contact</Link></li>
              <li><a href="https://netswagger.com" target="_blank" rel="noopener noreferrer" className="text-spindeck-gray hover:text-white transition">NetSwagger LLC</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/tos" className="text-spindeck-gray hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-spindeck-gray hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-spindeck-dark text-center">
          <p className="text-spindeck-gray mb-2">© 2024 {config.appName}. All rights reserved.</p>
          <p className="text-sm text-spindeck-gray">
            SpinDeck is a subsidiary of{" "}
            <a 
              href="https://netswagger.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-spindeck-red hover:text-red-400 transition-colors"
            >
              NetSwagger LLC
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}