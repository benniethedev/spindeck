/**
 * Payment Error Page
 * 
 * Shown when:
 * - User cancels checkout at Stripe
 * - Payment fails (card declined, insufficient funds, etc.)
 * - Session verification fails after Stripe redirect
 * 
 * Displays a clear error message with retry and support options.
 */
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An unexpected error occurred. Your payment was not processed.';
  const plan = searchParams.get('plan');

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-8 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
          Payment Failed
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
          {message}
        </p>

        {/* Plan info if available */}
        {plan && (
          <div className="mb-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Plan selected:{' '}
              <span className="font-medium text-zinc-900 dark:text-white capitalize">
                {plan}
              </span>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/#pricing"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-500/25"
          >
            Try Again
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-base hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200"
          >
            Contact Support
          </a>
        </div>

        <p className="mt-8 text-sm text-zinc-400 dark:text-zinc-500">
          No charges were made to your card. If you see a pending charge, it will be reversed automatically.
        </p>
      </div>
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
