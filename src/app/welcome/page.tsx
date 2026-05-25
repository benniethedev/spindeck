'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function WelcomeContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Verify the checkout session with Stripe
      fetch(`/api/stripe/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSessionData(data);
        })
        .catch((err) => {
          console.error('Failed to verify session:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold text-lg">Welcome to SpinRec! Your account is active.</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Welcome to <span className="text-violet-600 dark:text-violet-400">SpinRec</span>!
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Your artist account has been created. Submit your first track and start getting promoted to top DJs worldwide.
          </p>
        </div>

        {/* Artist Details */}
        {sessionData && (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 bg-white dark:bg-zinc-950 mb-12">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">Account Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Plan</span>
                <span className="font-medium text-zinc-900 dark:text-white capitalize">{(sessionData as any).plan || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Status</span>
                <span className="font-medium text-green-600 dark:text-green-400">Active</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Customer ID</span>
                <span className="font-mono text-xs text-zinc-900 dark:text-zinc-300">{(sessionData as any).customerId || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Subscription ID</span>
                <span className="font-mono text-xs text-zinc-900 dark:text-zinc-300">{(sessionData as any).subscriptionId || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 bg-zinc-50 dark:bg-zinc-950 mb-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">Next Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Upload Your First Track</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Submit a track with metadata, artwork, and genre tags. Our team will review it within 24 hours.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Complete Your Profile</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Add your bio, social media links, and photo to help DJs discover your music.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Track Your Performance</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Monitor plays, downloads, and campaign analytics from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#/submit"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-500/25"
          >
            Submit Your First Track
          </a>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Or{' '}
            <a href="/artist" className="text-violet-600 dark:text-violet-400 hover:underline">
              browse your dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
