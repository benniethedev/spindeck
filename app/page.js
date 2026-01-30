import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "@/components/ButtonSignin";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import config from "@/config";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "SpinRec - Premier DJ Pool & Music Promotion Platform",
  description: "The #1 record pool and music promotion platform for artists and DJs. Access exclusive tracks, promote your music to 10,000+ DJs, and grow your audience worldwide.",
  keywords: [
    "DJ pool",
    "record pool",
    "music promotion",
    "DJ promo service",
    "music distribution",
    "DJ music downloads",
    "exclusive tracks",
    "hip hop record pool",
    "electronic record pool",
    "artist promotion platform",
    "music marketing",
    "DJ remix pool",
  ],
  canonicalUrlRelative: "/",
});

const features = [
  {
    title: "Music Promotion Platform",
    description: "Upload your tracks to our DJ pool and get them in front of 10,000+ professional DJs and industry tastemakers across all genres.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    title: "Multi-Genre Record Pool",
    description: "Access our exclusive record pool featuring hip-hop, R&B, pop, electronic, house, and techno tracks from verified artists worldwide.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    title: "DJ Email Campaigns",
    description: "Reach 100,000+ DJs, radio programmers, and media contacts with targeted promotional email blasts for maximum exposure.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "DJ MixMaster",
    role: "Club DJ, New York",
    quote: "SpinRec's DJ pool has the freshest tracks before anyone else. My sets always stand out because of the exclusive music I find here.",
    rating: 5,
  },
  {
    name: "Marcus Taylor",
    role: "Independent Artist, Atlanta",
    quote: "Since using SpinRec for music promotion, my tracks have been downloaded by DJs in over 30 countries. The exposure is incredible.",
    rating: 5,
  },
  {
    name: "DJ SoundWave",
    role: "Radio DJ, Los Angeles",
    quote: "The best record pool I've used in 15 years of DJing. The quality, variety, and BPM filtering makes finding the perfect track effortless.",
    rating: 5,
  },
];

const stats = [
  { label: "Active DJs", value: "10,000+" },
  { label: "Tracks Uploaded", value: "50,000+" },
  { label: "Email Reach", value: "100K+" },
  { label: "Countries", value: "50+" },
];

export default function Page() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      {renderSchemaTags()}
      
      <PublicHeader />

      <main className="bg-black text-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero.png"
              alt="SpinRec - Professional DJ Pool and Music Promotion Platform"
              fill
              className="object-cover"
              priority
              quality={100}
            />
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-spindeck-red/20 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              The #1 DJ Pool &amp;
              <span className="text-spindeck-red block">Music Promotion Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-spindeck-gray mb-10 max-w-3xl mx-auto">
              The premier multi-genre record pool connecting artists with 10,000+ professional DJs worldwide. Promote your music, grow your fanbase, and get your tracks spinning in clubs globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn btn-primary btn-lg bg-spindeck-red hover:bg-red-600 border-none text-lg px-8">
                Start Promoting Your Music →
              </Link>
              <Link href="/dj-pool" className="btn btn-outline btn-lg border-spindeck-gray hover:bg-spindeck-dark hover:border-spindeck-gray">
                Access DJ Pool (Free for DJs)
              </Link>
            </div>
            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-spindeck-gray">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by 10,000+ DJs
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                50,000+ Tracks Promoted
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                50+ Countries
              </span>
            </div>
          </div>
          
          {/* Animated background element */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-spindeck-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-spindeck-red mb-2">
                    {stat.value}
                  </div>
                  <div className="text-spindeck-gray">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Complete Record Pool &amp; <span className="text-spindeck-red">Promotion Suite</span>
              </h2>
              <p className="text-xl text-spindeck-gray max-w-2xl mx-auto">
                Everything artists and DJs need — from track distribution to promotional email campaigns and detailed analytics.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-spindeck-dark rounded-lg p-8 hover:bg-opacity-80 transition-all duration-300 border border-transparent hover:border-spindeck-red"
                >
                  <div className="text-spindeck-red mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-spindeck-gray">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-spindeck-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                How It <span className="text-spindeck-red">Works</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Choose Your Plan</h3>
                    <p className="text-spindeck-gray">Select from our range of promotional packages designed for every budget and goal.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Upload Your Music</h3>
                    <p className="text-spindeck-gray">Submit your tracks, mixtapes, or videos with artwork and metadata.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Reach Your Audience</h3>
                    <p className="text-spindeck-gray">Your music gets distributed to our network of DJs and industry professionals.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
                    <p className="text-spindeck-gray">Monitor downloads, plays, and engagement with detailed analytics.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src="/screenshot.png"
                      alt="SpinRec Dashboard Screenshot"
                      width={1200}
                      height={675}
                      className="w-full h-full object-cover"
                      quality={100}
                    />
                  </div>
                  <p className="text-center text-spindeck-gray text-sm">
                    SpinRec Artist Dashboard - Track your music's performance in real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials Section */}
        <section className="py-20 bg-spindeck-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Trusted by <span className="text-spindeck-red">Artists &amp; DJs Worldwide</span>
              </h2>
              <p className="text-xl text-spindeck-gray max-w-2xl mx-auto">
                See why thousands of music professionals choose SpinRec for their record pool and promotion needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-black rounded-lg p-8 border border-gray-800 hover:border-spindeck-red transition-all duration-300"
                >
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-spindeck-gray mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-spindeck-gray">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/CTA.png"
              alt="Join SpinRec Music Promotion Platform"
              fill
              className="object-cover object-top"
              quality={100}
            />
          </div>
          {/* Red Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-spindeck-red/80 to-red-700/80"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Grow Your Music Career?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 10,000+ artists and DJs using SpinRec's DJ pool and music promotion platform to reach new audiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn btn-lg bg-black hover:bg-gray-900 text-white border-none text-lg px-8">
                Start Your Promotion Campaign →
              </Link>
              <Link href="/dj-pool" className="btn btn-lg bg-white/10 hover:bg-white/20 text-white border-none">
                Join as DJ (Free)
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <PublicFooter />
    </>
  );
}