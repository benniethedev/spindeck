import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "@/components/ButtonSignin";
import config from "@/config";

export default function ContactPage() {
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
              <Link href="/pricing" className="text-spindeck-gray hover:text-white transition">
                Pricing
              </Link>
              <Link href="/dj-pool" className="text-spindeck-gray hover:text-white transition">
                DJ Pool
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Get In <span className="text-spindeck-red">Touch</span>
            </h1>
            <p className="text-xl text-spindeck-gray max-w-2xl mx-auto">
              Have questions about SpinDeck? Want to learn more about our services? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-spindeck-dark rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="artist">Artist Support</option>
                    <option value="dj">DJ Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
                    placeholder="Tell us how we can help..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-spindeck-red rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Support</h3>
                      <p className="text-spindeck-gray">support@spindeck.com</p>
                      <p className="text-sm text-spindeck-gray">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-spindeck-red rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Headquarters</h3>
                      <p className="text-spindeck-gray">
                        NetSwagger LLC<br />
                        Music Division<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-spindeck-red rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-spindeck-gray">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Weekend: Emergency support only
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/pricing" className="block text-spindeck-red hover:text-red-400 transition">
                    View Pricing Plans →
                  </Link>
                  <Link href="/dj-pool" className="block text-spindeck-red hover:text-red-400 transition">
                    Explore DJ Pool →
                  </Link>
                  <Link href="/signin" className="block text-spindeck-red hover:text-red-400 transition">
                    Sign Up / Login →
                  </Link>
                </div>
              </div>

              <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                <h3 className="font-semibold mb-3">For Media Inquiries</h3>
                <p className="text-spindeck-gray mb-3">
                  Press releases, interviews, and media partnerships:
                </p>
                <a href="mailto:media@spindeck.com" className="text-spindeck-red hover:text-red-400 transition">
                  media@spindeck.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 bg-black border-t border-spindeck-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
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
    </>
  );
}