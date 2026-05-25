import Link from "next/link";
import Image from "next/image";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `About | ${config.appName}`,
  description: "Learn about SpinRec's mission to democratize music industry access and meet founder Leonard Madu.",
  canonicalUrlRelative: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PublicHeader />

      <main className="bg-black text-white pt-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-spindeck-red/20 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About <span className="text-spindeck-red">SpinRec</span>
              </h1>
              <p className="text-xl text-spindeck-gray max-w-3xl mx-auto">
                Where real music industry access meets cutting-edge technology
              </p>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-20 bg-spindeck-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-spindeck-red/20 to-transparent p-1">
                  <Image
                    src="/madu.png"
                    alt="Leonard Madu - Founder & CEO of SpinRec"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-spindeck-red text-white px-6 py-3 rounded-lg shadow-lg">
                  <p className="font-bold">Leonard Madu</p>
                  <p className="text-sm">Founder & CEO</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Led by <span className="text-spindeck-red">Industry Legacy</span>
                </h2>
                <p className="text-lg text-spindeck-gray leading-relaxed">
                  Leonard Madu got his start at iHeart Radio's 103 Jamz in Norfolk, VA, and went on to work with 
                  icons like <span className="text-white font-medium">Teddy Riley, Clipse, Prodigy, Monica,</span> and 
                  <span className="text-white font-medium"> Bizzy Bone</span>.
                </p>
                <p className="text-lg text-spindeck-gray leading-relaxed">
                  He sharpened his skills in New York through Digiwaxx, Voxonic, and J Records, running promotions 
                  for both major and independent acts. Today, he leads The Madu Group, co-founded the label A.N.D, 
                  and brings his decades of industry expertise to SpinRec with backing from 
                  <span className="text-white font-medium"> Empire</span> and 
                  <span className="text-white font-medium"> Sparta Distribution</span>.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="bg-black/50 border border-spindeck-red/30 px-4 py-2 rounded-lg">
                    <p className="text-sm text-spindeck-gray">Industry Experience</p>
                    <p className="text-xl font-bold text-spindeck-red">20+ Years</p>
                  </div>
                  <div className="bg-black/50 border border-spindeck-red/30 px-4 py-2 rounded-lg">
                    <p className="text-sm text-spindeck-gray">Artists Worked With</p>
                    <p className="text-xl font-bold text-spindeck-red">100+</p>
                  </div>
                  <div className="bg-black/50 border border-spindeck-red/30 px-4 py-2 rounded-lg">
                    <p className="text-sm text-spindeck-gray">DJ Network</p>
                    <p className="text-xl font-bold text-spindeck-red">65,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              The <span className="text-spindeck-red">SpinRec</span> Story
            </h2>
            
            <div className="space-y-8 text-lg text-spindeck-gray leading-relaxed">
              <p>
                SpinRec is a next-generation music promotion and DJ record pool platform founded by Leonard Madu, 
                a seasoned industry executive with deep roots in hip-hop, R&B, and urban music culture. With decades 
                of experience in radio promotions, tour management, and industry rollouts, Madu created SpinRec to 
                bridge the gap between emerging artists and the decision-makers who move the culture.
              </p>
              
              <p>
                SpinRec empowers independent artists, DJs, and labels by offering powerful tools for music distribution, 
                promotional email blasts, mixtape servicing, and strategic exposure. Whether you're an artist looking 
                to get your latest single heard by 65,000+ DJs or a label ready to launch a full campaign, SpinRec 
                delivers real industry access — <span className="text-white font-medium">no gatekeeping, just growth</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-b from-black to-spindeck-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <span className="text-spindeck-red">Mission</span>
              </h2>
              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-xl text-spindeck-gray leading-relaxed">
                  SpinRec exists to make real music industry promotion accessible and transparent.
                </p>
                <p className="text-lg text-spindeck-gray leading-relaxed">
                  We don't just upload tracks — we push records into real DJ sets, playlists, radio rotations, 
                  and newsletters where they get noticed. We're the plug behind the scenes — now plugged into the future.
                </p>
              </div>
            </div>

            {/* Mission Values */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-spindeck-dark rounded-lg p-8 border border-gray-800 hover:border-spindeck-red transition-colors">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-3">Direct Access</h3>
                <p className="text-spindeck-gray">
                  Connect directly with 65,000+ DJs, radio programmers, and industry tastemakers without the middleman.
                </p>
              </div>
              
              <div className="bg-spindeck-dark rounded-lg p-8 border border-gray-800 hover:border-spindeck-red transition-colors">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-3">Real Analytics</h3>
                <p className="text-spindeck-gray">
                  Track your music's impact with transparent data on downloads, plays, and engagement metrics.
                </p>
              </div>
              
              <div className="bg-spindeck-dark rounded-lg p-8 border border-gray-800 hover:border-spindeck-red transition-colors">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-3">Industry Tools</h3>
                <p className="text-spindeck-gray">
                  Professional-grade promotion tools that major labels use, now available to independent artists.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-spindeck-red to-red-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join the Movement?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get your music in front of the DJs and tastemakers who matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn btn-lg bg-black hover:bg-gray-900 text-white border-none">
                Start Your Campaign
              </Link>
              <Link href="/contact" className="btn btn-lg bg-transparent hover:bg-white/10 text-white border-2 border-white">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}