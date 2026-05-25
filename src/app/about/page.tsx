import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — SpinRec",
  description:
    "Learn about SpinRec, the artist promotion platform that connects independent musicians with top DJs worldwide.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl mb-6">
            About SpinRec
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            SpinRec is the modern platform for independent artists who want their
            music heard by the right ears.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The music industry has always been gatekept by connections, not talent.
            SpinRec flips that model. We give every artist — regardless of label
            backing or budget — a direct path to DJs who can amplify their music
            to real audiences.
          </p>
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
            How It Works
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Submit Your Music",
                desc: "Create an artist profile, upload your tracks with metadata, and submit them for review.",
              },
              {
                step: "02",
                title: "Get Approved",
                desc: "Our team reviews your submission for quality and fit. Approved tracks enter the DJ pool.",
              },
              {
                step: "03",
                title: "Reach DJs",
                desc: "Your music is available to thousands of verified DJs who can browse, preview, and download your tracks.",
              },
              {
                step: "04",
                title: "Track Your Impact",
                desc: "Monitor your submissions, download counts, and campaign performance from your artist dashboard.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-5 items-start rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900"
              >
                <span className="text-3xl font-bold text-zinc-300 dark:text-zinc-700 shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* For DJs */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
            For DJs
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Join our curated DJ pool to discover fresh, high-quality music from
            independent artists around the world. Get early access to new tracks,
            filter by genre and BPM, and build your library with exclusive downloads.
          </p>
          <a
            href="/dj"
            className="inline-block mt-4 px-6 py-3 rounded-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            Join the DJ Pool
          </a>
        </section>
      </main>
    </div>
  );
}
