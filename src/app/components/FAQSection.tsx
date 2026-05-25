/**
 * FAQSection - Accordion-style FAQ
 */
'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is SpinRec and how does it work?',
    answer:
      'SpinRec connects independent artists with professional DJs, bloggers, and music influencers. You submit your track through our platform, and we deliver it to our curated network of DJs who review and potentially add your music to their sets and playlists.',
  },
  {
    question: 'How many DJs are in the SpinRec network?',
    answer:
      'Our network grows constantly. Currently we have 500+ verified DJs across multiple genres including House, Techno, Hip-Hop, R&B, EDM, and more. Pro+ artists get access to our full premium network.',
  },
  {
    question: 'Do you guarantee my music will be played?',
    answer:
      'We don\'t guarantee specific plays because DJs review submissions independently. However, our data shows that tracks submitted through SpinRec receive 3-5x more DJ engagement than unsolicited submissions. Our Pro and Pro+ plans include priority delivery to increase your odds.',
  },
  {
    question: 'Can I cancel or change my plan?',
    answer:
      'Yes. You can upgrade, downgrade, or cancel your plan at any time from your dashboard. Changes take effect at the start of your next billing cycle. We offer a 30-day money-back guarantee on all paid plans.',
  },
  {
    question: 'What file formats do you accept?',
    answer:
      'We accept WAV and high-bitrate MP3 files (320 kbps recommended). For artwork, we support JPG and PNG in at least 1400x1400 pixels. Your audio files are stored securely and processed for optimal DJ use.',
  },
  {
    question: 'How do I track the performance of my campaign?',
    answer:
      'Your dashboard provides real-time analytics including DJ responses, plays, and engagement metrics. Pro users get advanced reports with genre breakdowns and demographic data. Pro+ users receive white-label reports they can share with their team.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! Our Free Trial plan lets you submit one track at no cost for 7 days. It\'s a great way to experience the SpinRec network before committing to a paid plan.',
  },
  {
    question: 'How does payment work?',
    answer:
      'We use Stripe for all payments. You can pay with major credit cards and debit cards. All transactions are encrypted and secure. Invoices are automatically generated and available in your dashboard.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to know about SpinRec.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="text-base font-semibold text-zinc-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-zinc-400 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Answer panel */}
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            Still have questions?{' '}
            <a href="/contact" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
