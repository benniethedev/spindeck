/**
 * PaymentVerification Component
 * Displays subscription status, plan details, and track limits for the artist.
 * Fetches live subscription data via the /api/artist/subscription endpoint.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';

interface SubscriptionData {
  status: string;
  plan: string;
  currentPeriodEnd: string | null;
  trialEnd: string | null;
  cancellationDate: string | null;
  cancelAtPeriodEnd: boolean;
}

interface PlanLimits {
  monthlySubmissions: number;
  maxFileSizeMB: number;
  artworkAllowed: boolean;
  analyticsLevel: 'basic' | 'standard' | 'advanced';
  prioritySupport: boolean;
  customCoverArt: boolean;
  playlistPitching: boolean;
}

const PLAN_CONFIG: Record<string, PlanLimits> = {
  free: {
    monthlySubmissions: 0,
    maxFileSizeMB: 50,
    artworkAllowed: true,
    analyticsLevel: 'basic',
    prioritySupport: false,
    customCoverArt: false,
    playlistPitching: false,
  },
  starter: {
    monthlySubmissions: 3,
    maxFileSizeMB: 200,
    artworkAllowed: true,
    analyticsLevel: 'basic',
    prioritySupport: false,
    customCoverArt: false,
    playlistPitching: false,
  },
  professional: {
    monthlySubmissions: -1,
    maxFileSizeMB: 200,
    artworkAllowed: true,
    analyticsLevel: 'advanced',
    prioritySupport: true,
    customCoverArt: true,
    playlistPitching: false,
  },
  enterprise: {
    monthlySubmissions: -1,
    maxFileSizeMB: 500,
    artworkAllowed: true,
    analyticsLevel: 'advanced',
    prioritySupport: true,
    customCoverArt: true,
    playlistPitching: true,
  },
};

const PLAN_PRICING: Record<string, string> = {
  free: 'Free',
  starter: '$29/month',
  professional: '$79/month',
  enterprise: '$199/month',
};

const PLAN_BADGE: Record<string, { color: string; bg: string }> = {
  free: { color: 'text-zinc-500 dark:text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800' },
  starter: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  professional: { color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40' },
  enterprise: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
};

interface PaymentVerificationProps {
  userId: string;
  userPlan: 'free' | 'starter' | 'professional' | 'enterprise';
  currentUsage: number;
}

export default function PaymentVerification({ userId, userPlan, currentUsage }: PaymentVerificationProps) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [managing, setManaging] = useState(false);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('spin_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch('/api/artist/subscription', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription || null);
      }
    } catch (err) {
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const planConfig = PLAN_CONFIG[userPlan];
  const planBadge = PLAN_BADGE[userPlan];
  const isUnlimited = planConfig.monthlySubmissions === -1;
  const isFree = userPlan === 'free';

  const usagePercent = isUnlimited ? 0 : Math.min(100, (currentUsage / planConfig.monthlySubmissions) * 100);
  const remaining = isUnlimited ? 'Unlimited' : Math.max(0, planConfig.monthlySubmissions - currentUsage);

  const getStatusColor = (status: string): string => {
    var s = status.toLowerCase();
    if (s.indexOf('active') >= 0 || s.indexOf('trialing') >= 0) return 'text-green-600 dark:text-green-400';
    if (s.indexOf('past_due') >= 0) return 'text-amber-600 dark:text-amber-400';
    if (s.indexOf('canc') >= 0) return 'text-red-600 dark:text-red-400';
    if (s.indexOf('unpaid') >= 0) return 'text-red-500 dark:text-red-400';
    return 'text-zinc-500 dark:text-zinc-400';
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading subscription...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Payment &amp; Subscription</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your plan and track limits</p>
        </div>
        <button
          onClick={fetchSubscription}
          className="px-4 py-2 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          Refresh
        </button>
      </div>

      <div className="p-6">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 mb-5 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={"w-12 h-12 rounded-xl " + planBadge.bg + " flex items-center justify-center"}>
                <svg className={"w-6 h-6 " + planBadge.color} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan</h3>
                  <span className={"px-2.5 py-0.5 rounded-full text-xs font-semibold " + planBadge.bg + " " + planBadge.color}>
                    {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{PLAN_PRICING[userPlan]}</p>
              </div>
            </div>
            <a
              href="/artist"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upgrade Plan
            </a>
          </div>
        </div>

        {subscription && subscription.status ? (
          <div className={"rounded-xl border p-4 mb-5 flex items-center gap-3 " + (
            subscription.status.includes('active') || subscription.status.includes('trialing')
              ? 'border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/20'
              : subscription.status.includes('past_due') || subscription.status.includes('unpaid')
              ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20'
              : subscription.status.includes('canc')
              ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20'
              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
          )}>
            <svg
              className={"w-5 h-5 flex-shrink-0 " + getStatusColor(subscription.status)}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              {(subscription.status.includes('active') || subscription.status.includes('trialing'))
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                : subscription.status.includes('past_due') || subscription.status.includes('unpaid')
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                : subscription.status.includes('canc')
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            </svg>
            <div className="flex-1 min-w-0">
              <p className={"text-sm font-semibold " + getStatusColor(subscription.status)}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </p>
              {subscription.currentPeriodEnd && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Next billing: {formatDate(subscription.currentPeriodEnd)}
                  {subscription.cancelAtPeriodEnd && ' \u00b7 Will be cancelled'}
                </p>
              )}
            </div>
            {(subscription.status.includes('past_due') || subscription.status.includes('unpaid'))
              ? <button className="px-4 py-2 rounded-full text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors flex-shrink-0" onClick={() => setManaging(true)}>Update Payment</button>
              : subscription.status.includes('canc')
              ? <button className="px-4 py-2 rounded-full text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors flex-shrink-0" onClick={() => setManaging(true)}>Reactivate</button>
              : subscription.status.includes('active')
              ? <button className="px-4 py-2 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0" onClick={() => setManaging(true)}>Manage</button>
              : null}
          </div>
        ) : isFree ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 mb-5 bg-zinc-50 dark:bg-zinc-900/50 flex items-center gap-3">
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Free Plan</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">No active subscription. Upgrade to submit tracks.</p>
            </div>
            <a href="/artist" className="ml-auto px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all flex-shrink-0">Upgrade</a>
          </div>
        ) : null}

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 mb-5">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Track Submission Limits</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">Monthly Submissions</span>
                <span className={"text-sm font-bold " + (usagePercent >= 100 ? 'text-red-600 dark:text-red-400' : usagePercent >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400')}>
                  {isUnlimited ? 'Unlimited' : currentUsage + ' / ' + planConfig.monthlySubmissions}
                </span>
              </div>
              <div className="h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={"h-full rounded-full transition-all duration-500 " + (usagePercent >= 100 ? 'bg-red-500' : usagePercent >= 75 ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500')}
                  style={{ width: (isUnlimited ? 100 : usagePercent) + '%' }}
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                {isUnlimited
                  ? 'No monthly limit \u2014 submit as many tracks as you want'
                  : remaining === 0
                  ? 'Limit reached \u2014 upgrade to submit more tracks'
                  : remaining + ' submissions remaining this month'}
              </p>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Max file size</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">{planConfig.maxFileSizeMB} MB</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Your Plan Features</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Artwork uploads', enabled: planConfig.artworkAllowed },
              { label: planConfig.analyticsLevel + ' analytics', enabled: true },
              { label: 'Priority support', enabled: planConfig.prioritySupport },
              { label: 'Custom cover art', enabled: planConfig.customCoverArt },
              { label: 'Playlist pitching', enabled: planConfig.playlistPitching },
              { label: 'API access', enabled: userPlan === 'enterprise' },
            ].map(function(feature) {
              return (
                <div key={feature.label} className="flex items-center gap-2 text-sm">
                  {feature.enabled
                    ? <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    : <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                  <span className={feature.enabled ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-500'}>{feature.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
