import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "@/components/ButtonSignin";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: config.appName,
  description: config.appDescription,
  canonicalUrlRelative: "/",
});

const features = [
  {
    title: "Artist Promotion",
    description: "Upload your tracks and get them in front of thousands of DJs and industry professionals across all genres.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    title: "Multi-Genre DJ Pool",
    description: "Access exclusive tracks, mixtapes, and remixes from verified artists spanning hip-hop, R&B, pop, electronic, and more.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    title: "Email Campaigns",
    description: "Reach thousands of DJs and media contacts with targeted email blasts.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
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
      <PublicHeader />

      <main className="bg-black text-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-spindeck-red/20 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Where Music
              <span className="text-spindeck-red block">Meets the Industry</span>
            </h1>
            <p className="text-xl md:text-2xl text-spindeck-gray mb-10 max-w-3xl mx-auto">
              The premier multi-genre record pool and music promotion platform connecting artists with DJs, labels, and media worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn btn-primary btn-lg bg-spindeck-red hover:bg-red-600 border-none">
                Start Promoting
              </Link>
              <Link href="/signin?role=dj" className="btn btn-outline btn-lg border-spindeck-gray hover:bg-spindeck-dark hover:border-spindeck-gray">
                Join as DJ
              </Link>
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
                Everything You Need to <span className="text-spindeck-red">Succeed</span>
              </h2>
              <p className="text-xl text-spindeck-gray max-w-2xl mx-auto">
                From track distribution to analytics, we've got you covered.
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
                <div className="aspect-video bg-gradient-to-br from-spindeck-red/20 to-spindeck-dark rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-spindeck-red rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-spindeck-gray">Watch Demo Video</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-spindeck-red to-red-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Take Your Music to the Next Level?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of artists who are already using SpinDeck to grow their careers.
            </p>
            <Link href="/pricing" className="btn btn-lg bg-black hover:bg-gray-900 text-white border-none">
              Get Started Today
            </Link>
          </div>
        </section>

      </main>
      
      <PublicFooter />
    </>
  );
}