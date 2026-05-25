/**
 * Artist Dashboard
 * Main hub for managing submissions, tracking status, and viewing campaigns.
 * Status flow: Pending -> Approved -> Rejected -> In Campaign
 */
'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'in_campaign';

interface Submission {
  id: string;
  key: string;
  data: {
    trackName: string;
    genre: string;
    bpm: number;
    isClean: boolean;
    notes: string;
    status: SubmissionStatus;
    statusHistory: Array<{ status: SubmissionStatus; timestamp: string; note?: string }>;
    campaignIds: string[];
    createdAt: string;
    updatedAt: string;
  };
}

const GENRES = [
  'House', 'Tech House', 'Techno', 'Trance', 'Drum & Bass',
  'Dubstep', 'Trap', 'Hip-Hop', 'R&B', 'Pop',
  'Lo-Fi', 'Afrobeats', 'Afro House', 'Ambient', 'Electro',
  'Indie', 'Rock', 'Reggaeton', 'Latin', 'K-Pop',
];

function getStatusBadge(status: SubmissionStatus) {
  const map: Record<SubmissionStatus, { label: string; color: string; bg: string; dot: string }> = {
    pending: { label: 'Pending Review', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/20', dot: 'bg-amber-400' },
    approved: { label: 'Approved', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-50 dark:bg-green-900/20', dot: 'bg-green-400' },
    rejected: { label: 'Rejected', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-400' },
    in_campaign: { label: 'In Campaign', color: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50 dark:bg-violet-900/20', dot: 'bg-violet-400' },
  };
  return map[status];
}

function getStatusTimeline(statuses: Array<{ status: SubmissionStatus; timestamp: string; note?: string }>) {
  const statusOrder: SubmissionStatus[] = ['pending', 'approved', 'rejected', 'in_campaign'];
  const lastActiveStatus = statuses.length > 0
    ? statuses[statuses.length - 1].status
    : 'pending';

  return statusOrder.map((s, i) => {
    const isActive = lastActiveStatus === s;
    const isCompleted = lastActiveStatus === 'in_campaign'
      ? s !== 'rejected'
      : lastActiveStatus === 'rejected'
        ? s === 'pending'
        : statusOrder.indexOf(lastActiveStatus) >= i && s !== 'rejected';

    const isRejected = s === 'rejected' && lastActiveStatus === 'rejected';

    return {
      status: s,
      active: isActive,
      completed: isCompleted && !isRejected,
      label: getStatusBadge(s).label,
      color: s === 'rejected' && isRejected
        ? 'text-red-400'
        : isCompleted
          ? 'text-violet-500'
          : 'text-zinc-300 dark:text-zinc-600',
      dotColor: s === 'rejected' && isRejected
        ? 'bg-red-400'
        : isCompleted
          ? 'bg-violet-500'
          : 'bg-zinc-300 dark:bg-zinc-600',
      lineColor: (i < 3 && isCompleted)
        ? 'bg-violet-500'
        : 'bg-zinc-200 dark:bg-zinc-700',
    };
  });
}

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [artistName] = useState('Luna Wave');
  const [artistEmail] = useState('luna@artist.com');
  const [plan] = useState('professional');
  const [showNewSubmission, setShowNewSubmission] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', artistId: 'demo-artist-001' }),
      });
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      // Demo data for when API is unavailable
      setSubmissions([
        {
          id: 'demo1', key: 'submission:demo-artist-001:demo1',
          data: { trackName: 'Midnight Groove', genre: 'Tech House', bpm: 126, isClean: true, notes: 'My latest tech house track', status: 'in_campaign', statusHistory: [{ status: 'pending', timestamp: '2026-05-10T10:00:00Z', note: 'Submitted' }, { status: 'approved', timestamp: '2026-05-12T14:00:00Z', note: 'Approved' }, { status: 'in_campaign', timestamp: '2026-05-15T09:00:00Z', note: 'Added to DJ campaign' }], campaignIds: ['camp_001'], createdAt: '2026-05-10T10:00:00Z', updatedAt: '2026-05-15T09:00:00Z' },
        },
        {
          id: 'demo2', key: 'submission:demo-artist-001:demo2',
          data: { trackName: 'Neon Dreams', genre: 'Synthwave', bpm: 118, isClean: false, notes: 'Clean mix with heavy synth leads', status: 'pending', statusHistory: [{ status: 'pending', timestamp: '2026-05-20T16:00:00Z', note: 'Submitted' }], campaignIds: [], createdAt: '2026-05-20T16:00:00Z', updatedAt: '2026-05-20T16:00:00Z' },
        },
        {
          id: 'demo3', key: 'submission:demo-artist-001:demo3',
          data: { trackName: 'Underground Pulse', genre: 'Techno', bpm: 132, isClean: true, notes: 'Dark industrial techno', status: 'rejected', statusHistory: [{ status: 'pending', timestamp: '2026-05-08T12:00:00Z', note: 'Submitted' }, { status: 'rejected', timestamp: '2026-05-09T10:00:00Z', note: 'Missing metadata fields' }], campaignIds: [], createdAt: '2026-05-08T12:00:00Z', updatedAt: '2026-05-09T10:00:00Z' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [refreshKey]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.data.status === 'pending').length,
    approved: submissions.filter(s => s.data.status === 'approved').length,
    rejected: submissions.filter(s => s.data.status === 'rejected').length,
    inCampaign: submissions.filter(s => s.data.status === 'in_campaign').length,
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return iso; }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Spin<span className="text-violet-600">Rec</span>
            </a>
            <div className="hidden md:flex items-center gap-1 text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium">Dashboard</span>
              <a href="/artist/dashboard/new" className="px-3 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">New Submission</a>
              <a href="#" className="px-3 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Analytics</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-zinc-400 dark:text-zinc-500 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 font-medium">
              {plan} plan
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
              LW
            </div>
            <a href="/artist/login" className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Welcome back, {artistName}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your track submissions and track their progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-950">
            <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-950">
            <p className="text-xs font-medium text-amber-500 uppercase tracking-wider">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-950">
            <p className="text-xs font-medium text-green-500 uppercase tracking-wider">Approved</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-950">
            <p className="text-xs font-medium text-red-500 uppercase tracking-wider">Rejected</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-950">
            <p className="text-xs font-medium text-violet-500 uppercase tracking-wider">In Campaign</p>
            <p className="mt-2 text-3xl font-bold text-violet-600">{stats.inCampaign}</p>
          </div>
        </div>

        {/* New Submission CTA */}
        <div className="mb-8">
          <a
            href="/artist/dashboard/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Submission
          </a>
        </div>

        {/* Submissions List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Your Submissions</h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 animate-pulse">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-48 mb-4" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-32 mb-3" />
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-24" />
                </div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 bg-white dark:bg-zinc-950 text-center">
              <svg className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8" /></svg>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No submissions yet</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Submit your first track to get started with DJ promotion.</p>
              <a href="/artist/dashboard/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Submit a Track
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => {
                const statusBadge = getStatusBadge(sub.data.status);
                const timeline = getStatusTimeline(sub.data.statusHistory);

                return (
                  <div key={sub.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                              {sub.data.trackName}
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                              {statusBadge.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8" /></svg>
                              {sub.data.genre}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {sub.data.bpm} BPM
                            </span>
                            <span className="flex items-center gap-1.5">
                              {sub.data.isClean ? (
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                              ) : (
                                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                              )}
                              {sub.data.isClean ? 'Clean' : 'Explicit'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              {formatDate(sub.data.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`/artist/dashboard/submissions/${sub.id}`}
                            className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="px-6 pb-6">
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {timeline.map((step, i) => (
                          <div key={step.status} className="flex items-center gap-2 shrink-0">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                                step.completed
                                  ? 'bg-violet-100 dark:bg-violet-900/40 ' + (step.status === 'rejected' && step.active ? 'text-red-600 dark:text-red-300' : 'text-violet-600 dark:text-violet-300')
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                              }`}>
                                {step.completed ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                ) : (
                                  step.status === 'pending' ? '1' : step.status === 'approved' ? '2' : step.status === 'rejected' ? '3' : '4'
                                )}
                              </div>
                              <span className={`text-xs mt-1 ${step.active ? step.color : 'text-zinc-400 dark:text-zinc-500'}`}>
                                {step.label}
                              </span>
                            </div>
                            {i < timeline.length - 1 && (
                              <div className={`w-12 h-0.5 rounded ${step.completed ? 'bg-violet-400 dark:bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {sub.data.notes && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl px-4 py-3">
                          {sub.data.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
