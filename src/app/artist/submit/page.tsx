/**
 * Artist Submission Page
 * Allows authenticated artists to submit tracks for DJ promotion.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmissionForm from '../components/SubmissionForm';

export default function SubmitPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <a href="/artist" className="text-lg font-bold tracking-tight text-white">
            Spin<span className="text-violet-500">Rec</span>
          </a>
        </div>
      </header>

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {success ? (
          <div className="text-center py-16 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Submission Received!</h3>
            <p className="text-zinc-500 mb-6">Your track is in our review queue. We&apos;ll notify you when it&apos;s approved.</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 text-zinc-400 text-sm">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Redirecting to dashboard...
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Submit Your Track</h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-md mx-auto">
                Get your music in front of curated DJs worldwide.
              </p>
            </div>
            <SubmissionForm onSuccess={() => setSuccess(true)} onCancel={() => router.push('/artist/dashboard')} />
          </>
        )}
      </main>
    </div>
  );
}
