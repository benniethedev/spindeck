import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — SpinRec",
  description:
    "Get in touch with the SpinRec team. Questions about artist promotion, DJ pool access, or partnerships?",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Have questions about SpinRec? We&apos;d love to hear from you.
          </p>
        </section>

        {/* Contact options */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Email */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-zinc-600 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Email
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              For general inquiries, press, or partnerships.
            </p>
            <a
              href="mailto:hello@spinrec.com"
              className="text-zinc-900 dark:text-white font-medium hover:underline"
            >
              hello@spinrec.com
            </a>
          </div>

          {/* DJ Pool */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-zinc-600 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              DJ Applications
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Want to join the DJ pool? Apply directly through your dashboard.
            </p>
            <a
              href="/dj"
              className="text-zinc-900 dark:text-white font-medium hover:underline"
            >
              Apply Now
            </a>
          </div>

          {/* Artist Support */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-zinc-600 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Artist Support
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Submission issues, account questions, or feature requests.
            </p>
            <a
              href="mailto:support@spinrec.com"
              className="text-zinc-900 dark:text-white font-medium hover:underline"
            >
              support@spinrec.com
            </a>
          </div>

          {/* Social */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-zinc-600 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Social
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Follow us for updates, tips, and featured artists.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-zinc-900 dark:text-white hover:underline"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-zinc-900 dark:text-white hover:underline"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-zinc-900 dark:text-white hover:underline"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
