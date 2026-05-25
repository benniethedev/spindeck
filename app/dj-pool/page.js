import Link from "next/link";
import Image from "next/image";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `DJ Pool | ${config.appName}`,
  description: "Access thousands of exclusive tracks, remixes, and edits from top artists across all genres. The ultimate DJ pool for professional DJs.",
  canonicalUrlRelative: "/dj-pool",
});

const features = [
  {
    title: "Exclusive Tracks",
    description: "Access to the latest releases from verified artists before they hit mainstream platforms.",
    icon: "🎵",
  },
  {
    title: "High-Quality Downloads",
    description: "Download tracks in premium quality formats perfect for professional DJ sets.",
    icon: "💎",
  },
  {
    title: "Advanced Filtering",
    description: "Find tracks by genre, BPM, key, energy level, and more to match your sets perfectly.",
    icon: "🔍",
  },
  {
    title: "Multi-Genre Collection",
    description: "Hip-hop, R&B, pop, electronic, house, techno, and many more genres in one place.",
    icon: "🌟",
  },
  {
    title: "Real-Time Updates",
    description: "New tracks added daily with instant notifications for your favorite genres.",
    icon: "⚡",
  },
  {
    title: "DJ Tools & Info",
    description: "Track metadata including BPM, key, intro/outro lengths, and mixing cues.",
    icon: "🛠️",
  },
];

const genres = [
  { name: "Hip-Hop", count: "2,500+", color: "from-red-500 to-pink-500" },
  { name: "R&B", count: "1,800+", color: "from-purple-500 to-indigo-500" },
  { name: "Pop", count: "1,200+", color: "from-blue-500 to-cyan-500" },
  { name: "Electronic", count: "3,200+", color: "from-green-500 to-teal-500" },
  { name: "House", count: "2,100+", color: "from-yellow-500 to-orange-500" },
  { name: "Techno", count: "1,600+", color: "from-gray-500 to-slate-500" },
];

const stats = [
  { label: "Total Tracks", value: "15,000+" },
  { label: "Active DJs", value: "10,000+" },
  { label: "New Tracks Weekly", value: "500+" },
  { label: "Countries Served", value: "50+" },
];

export default function DJPoolPage() {
  return (
    <>
      <PublicHeader />

      <main className="bg-black text-white pt-20">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/record.png"
              alt="Vinyl Records Background"
              fill
              className="object-cover"
              priority
              quality={100}
            />
          </div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-spindeck-red/20 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              The Ultimate
              <span className="text-spindeck-red block">DJ Pool</span>
            </h1>
            <p className="text-xl md:text-2xl text-spindeck-gray mb-10 max-w-3xl mx-auto">
              Access thousands of exclusive tracks, remixes, and edits from top artists across all genres. Your go-to source for fresh music.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signin?role=dj" className="btn btn-primary btn-lg bg-spindeck-red hover:bg-red-600 border-none">
                Join as DJ
              </Link>
              <Link href="/pricing" className="btn btn-outline btn-lg border-spindeck-gray hover:bg-spindeck-dark hover:border-spindeck-gray">
                View Pricing
              </Link>
            </div>
          </div>
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

        {/* Genre Showcase */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Every <span className="text-spindeck-red">Genre</span> You Need
              </h2>
              <p className="text-xl text-spindeck-gray max-w-2xl mx-auto">
                From underground hits to chart-toppers, discover music across all genres
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {genres.map((genre, index) => (
                <div key={index} className="group">
                  <div className={`bg-gradient-to-br ${genre.color} rounded-lg p-6 h-32 flex flex-col justify-between relative overflow-hidden hover:scale-105 transition-transform duration-300`}>
                    <div className="relative z-10">
                      <h3 className="text-white font-bold text-xl mb-1">{genre.name}</h3>
                      <p className="text-white/80 text-sm">{genre.count} tracks</p>
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-20 text-white text-6xl font-bold">
                      ♪
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-spindeck-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Built for <span className="text-spindeck-red">Professional DJs</span>
              </h2>
              <p className="text-xl text-spindeck-gray max-w-2xl mx-auto">
                Every feature designed to enhance your workflow and elevate your sets
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-black rounded-lg p-8 hover:bg-opacity-80 transition-all duration-300 border border-gray-800 hover:border-spindeck-red">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-spindeck-gray">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
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
                    <h3 className="text-xl font-semibold mb-2">Sign Up as a DJ</h3>
                    <p className="text-spindeck-gray">Create your DJ account and get instant access to our exclusive track library.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Browse & Filter</h3>
                    <p className="text-spindeck-gray">Use our advanced filters to find exactly what you need - by genre, BPM, key, and more.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Preview & Download</h3>
                    <p className="text-spindeck-gray">Listen to full previews and download high-quality files ready for your sets.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Rock Your Sets</h3>
                    <p className="text-spindeck-gray">Take your audience on a journey with exclusive tracks they can't hear anywhere else.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-spindeck-red/20 to-spindeck-dark rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-spindeck-red rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <p className="text-spindeck-gray">DJ Pool Access</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-spindeck-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Trusted by <span className="text-spindeck-red">Top DJs</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black rounded-lg p-6 border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold mr-3">
                    DJ
                  </div>
                  <div>
                    <h4 className="font-semibold">DJ MixMaster</h4>
                    <p className="text-sm text-spindeck-gray">Club DJ, NYC</p>
                  </div>
                </div>
                <p className="text-spindeck-gray">
                  "SpinRec has the freshest tracks before anyone else. My sets always stand out because of the exclusive music I get here."
                </p>
              </div>
              
              <div className="bg-black rounded-lg p-6 border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold mr-3">
                    DJ
                  </div>
                  <div>
                    <h4 className="font-semibold">DJ SoundWave</h4>
                    <p className="text-sm text-spindeck-gray">Radio DJ, LA</p>
                  </div>
                </div>
                <p className="text-spindeck-gray">
                  "The quality and variety is unmatched. I can find everything from underground hip-hop to mainstream hits in one place."
                </p>
              </div>
              
              <div className="bg-black rounded-lg p-6 border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-spindeck-red rounded-full flex items-center justify-center text-white font-bold mr-3">
                    DJ
                  </div>
                  <div>
                    <h4 className="font-semibold">DJ Frequency</h4>
                    <p className="text-sm text-spindeck-gray">Festival DJ, Miami</p>
                  </div>
                </div>
                <p className="text-spindeck-gray">
                  "The filtering system is incredible. I can find the perfect track for any moment in my set based on BPM and key."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-spindeck-red to-red-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Elevate Your Sets?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of DJs who trust SpinRec for the freshest music.
            </p>
            <Link href="/signin?role=dj" className="btn btn-lg bg-black hover:bg-gray-900 text-white border-none">
              Access DJ Pool Now
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}