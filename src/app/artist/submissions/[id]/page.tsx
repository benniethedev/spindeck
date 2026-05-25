'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SubmissionStatus } from '@/types';

interface SubmissionData {
  id: string;
  artistId: string;
  artistName: string;
  trackName: string;
  genre: string;
  bpm: number;
  rating: string;
  isClean: boolean;
  status: SubmissionStatus;
  audioFileUrl?: string;
  artworkUrl?: string;
  links: Array<{ label: string; url: string }>;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_FLOW: SubmissionStatus[] = ['pending', 'approved', 'rejected', 'in_campaign'];

const STATUS_CONFIG: Record<SubmissionStatus, {
  label: string;
  description: string;
  color: string;
  bg: string;
  border: string;
  dotColor: string;
  icon: string;
}> = {
  pending: {
    label: 'Pending',
    description: 'Your submission is being reviewed by our team. Expect a decision within 1-2 business days.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  approved: {
    label: 'Approved',
    description: 'Your track has been approved and is being matched with relevant DJs in our network.',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    dotColor: 'bg-green-500',
    icon: 'M5 13l4 4L19 7',
  },
  rejected: {
    label: 'Rejected',
    description: 'Your track did not meet our current criteria. You can make improvements and resubmit.',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    dotColor: 'bg-red-500',
    icon: 'M6 18L18 6M6 6l12 12',
  },
  in_campaign: {
    label: 'In Campaign',
    description: 'Your track is actively being promoted to DJs. Check your dashboard for performance metrics.',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
    dotColor: 'bg-violet-500',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
};

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' '); }

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [sub, setSub] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchSubmission = useCallback(async () => {
    const token = localStorage.getItem('spin_token');
    if (!token) { router.push('/login'); return; }
    try {
      const resolvedParams = await params;
      const res = await fetch(`/api/submissions/${resolvedParams.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) { router.push('/login'); return; }
        setError('Failed to load submission');
        return;
      }
      const data = await res.json();
      if (data.submission) {
        setSub(data.submission as SubmissionData);
        setNotes((data.submission as SubmissionData).notes || '');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [params, router]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  const handleUpdateNotes = async () => {
    const token = localStorage.getItem('spin_token');
    if (!token || !sub) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/submissions/${sub.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setSub(prev => prev ? { ...prev, notes } : null);
      }
    } catch (err) {
      console.error('Failed to update notes:', err);
    } finally {
      setUpdating(false);
    }
  };

  const currentIdx = sub ? STATUS_FLOW.indexOf(sub.status) : -1;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error || !sub) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Submission Not Found</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">{error || 'This submission may have been removed.'}</p>
          <a href="/artist/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[sub.status];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/artist/dashboard" className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
              {sub.trackName}
            </h1>
          </div>
          <StatusBadge status={sub.status} />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Submission Details Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-8">
          {/* Artwork / Cover */}
          <div className="relative h-48 sm:h-56 bg-gradient-to-br from-violet-400/20 to-indigo-600/20 flex items-center justify-center">
            {sub.artworkUrl ? (
              <img src={sub.artworkUrl} alt={sub.trackName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                {sub.trackName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            {/* Title + Artist */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">{sub.trackName}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">by {sub.artistName}</p>
              </div>
              <StatusBadge status={sub.status} />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Genre', value: capitalize(sub.genre.replace(/_/g, ' ')) },
                { label: 'BPM', value: String(sub.bpm) },
                { label: 'Rating', value: sub.isClean ? 'Clean' : 'Explicit' },
                { label: 'Submitted', value: new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Links */}
            {sub.links && sub.links.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Links</h3>
                <div className="flex flex-wrap gap-2">
                  {sub.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                    >
                      {capitalize(link.label)}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes / Feedback */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Notes</h3>
              {sub.status === 'rejected' ? (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 p-4">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {sub.notes || 'No specific feedback provided. You can resubmit your track after making improvements.'}
                  </p>
                  <a href="/artist/submit" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Resubmit this track
                  </a>
                </div>
              ) : (
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all resize-none"
                  rows={4}
                  placeholder="Add notes about this submission..."
                />
              )}
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleUpdateNotes}
                  disabled={updating || sub.status === 'rejected'}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
                >
                  {updating ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>

            {/* Audio Preview */}
            {sub.audioFileUrl && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Audio</h3>
                <audio controls className="w-full rounded-lg" src={sub.audioFileUrl}>
                  Your browser does not support audio playback.
                </audio>
                <a
                  href={sub.audioFileUrl}
                  download
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download audio file
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-8">Submission Lifecycle</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
            {STATUS_FLOW.map((status, i) => {
              const config = STATUS_CONFIG[status];
              const isActive = i === currentIdx;
              const isCompleted = i < currentIdx;
              const isPending = i > currentIdx;

              return (
                <div key={status} className="flex items-center">
                  {/* Status node */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? `${config.bg} ${config.border} ${config.color} shadow-lg scale-110`
                        : isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={config.icon} />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs font-semibold mt-2 ${
                      isActive ? config.color : isCompleted ? 'text-green-500' : 'text-zinc-400'
                    }`}>
                      {config.label}
                    </span>
                  </div>

                  {/* Connector line */}
                  {i < STATUS_FLOW.length - 1 && (
                    <div className={`w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 ${
                      i < currentIdx
                        ? 'bg-green-500'
                        : i === currentIdx
                        ? 'bg-gradient-to-r from-green-500 to-zinc-300 dark:to-zinc-600'
                        : 'bg-zinc-200 dark:bg-zinc-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Current status description */}
          <div className={`mt-8 p-4 rounded-xl ${statusConfig.bg} ${statusConfig.border} border`}>
            <p className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.description}</p>
          </div>

          {/* Info cards */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Review Time</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">1-2 Business Days</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Next Step</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                {sub.status === 'pending' ? 'Quality Review' :
                 sub.status === 'approved' ? 'DJ Matching' :
                 sub.status === 'rejected' ? 'Resubmit' : 'Campaign Live'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Status Updated</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                {new Date(sub.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Track ID</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{sub.id}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6 mb-12">
          <a
            href="/artist/submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Submission
          </a>
          <a
            href="/artist/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
