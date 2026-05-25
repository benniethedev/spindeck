/**
 * Track Detail - View and edit a single track submission
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Submission {
  id: string;
  key: string;
  data: {
    trackName: string;
    genre: string;
    bpm: number;
    isClean: boolean;
    notes: string;
    links: Record<string, string>;
    status: string;
    statusHistory: Array<{ status: string; timestamp: string; note?: string }>;
    artistId: string;
    audioFileKey: string | null;
    artworkFileKey: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

const STATUS_COLORS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  approved: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-400/10' },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/10' },
  in_campaign: { label: 'In Campaign', color: 'text-violet-400', bg: 'bg-violet-400/10' },
};

export default function TrackDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTrack = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?action=stats`);
      const data = await res.json();
      // Get individual track - fall back to listing and finding
      const allRes = await fetch('/api/admin/submissions?status=all');
      const allData = await allRes.json();
      const found = (allData.submissions || []).find((s: Submission) => s.id === params.id);
      if (found) setSubmission(found);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load track details' });
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchTrack();
  }, [fetchTrack]);

  const handleStatusChange = async (status: string) => {
    if (!submission) return;
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', submissionId: submission.id, status, note: `Status changed to ${status}` }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Status changed to ${status}` });
        fetchTrack();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-400 mt-4 text-sm">Loading track details...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <p className="text-zinc-500 text-lg">Track not found</p>
        <button onClick={() => router.push('/admin/tracks')} className="mt-3 text-violet-400 hover:text-violet-300 text-sm font-medium">Back to All Tracks</button>
      </div>
    );
  }

  const d = submission.data;
  const sc = STATUS_COLORS[d.status] || STATUS_COLORS.pending;

  return (
    <div className="space-y-6">
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`} onClick={() => setMessage(null)}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {message.type === 'success' ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />}
          </svg>
          <span className="text-sm font-medium">{message.text}</span>
          <svg className="w-4 h-4 ml-auto opacity-50 cursor-pointer hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
      )}

      <button onClick={() => router.back()} className="text-zinc-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Back
      </button>

      {/* Track Header */}
      <div className="bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white">{d.trackName}</h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-zinc-400">
              <span>ID: {submission.id.slice(0, 16)}</span>
              <span>•</span>
              <span>Artist: {d.artistId.slice(0, 16)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${sc.bg} ${sc.color}`}>
              <span className={`w-2 h-2 rounded-full ${sc.bg === 'bg-amber-400/10' ? 'bg-amber-400' : sc.bg === 'bg-green-400/10' ? 'bg-green-400' : sc.bg === 'bg-red-400/10' ? 'bg-red-400' : 'bg-violet-400'}`}></span>
              {sc.label}
            </span>
            <select
              value={d.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in_campaign">In Campaign</option>
            </select>
          </div>
        </div>
      </div>

      {/* Track Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 space-y-5">
          <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Track Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-zinc-500 mb-1">Genre</p><p className="text-white text-sm font-medium">{d.genre}</p></div>
            <div><p className="text-xs text-zinc-500 mb-1">BPM</p><p className="text-white text-sm font-medium">{d.bpm}</p></div>
            <div><p className="text-xs text-zinc-500 mb-1">Clean Version</p><p className="text-white text-sm font-medium">{d.isClean ? 'Yes' : 'No'}</p></div>
            <div><p className="text-xs text-zinc-500 mb-1">Created</p><p className="text-white text-sm font-medium">{new Date(d.createdAt).toLocaleDateString()}</p></div>
          </div>
          {d.notes && (
            <div>
              <p className="text-xs text-zinc-500 mb-1.5">Notes</p>
              <p className="text-sm text-zinc-300 bg-zinc-800/50 rounded-lg p-3 whitespace-pre-wrap">{d.notes}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-zinc-500 mb-1.5">Files</p>
            <div className="flex gap-2">
              {d.audioFileKey && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 rounded-lg text-xs text-zinc-300">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                  Audio uploaded
                </span>
              )}
              {d.artworkFileKey && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 rounded-lg text-xs text-zinc-300">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                  Artwork uploaded
                </span>
              )}
              {!d.audioFileKey && !d.artworkFileKey && (
                <span className="text-xs text-zinc-600">No files uploaded</span>
              )}
            </div>
          </div>
        </div>

        {/* Status History */}
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 space-y-5">
          <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Status History</h4>
          <div className="space-y-4">
            {d.statusHistory.map((h, i) => {
              const hsc = STATUS_COLORS[h.status] || STATUS_COLORS.pending;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${hsc.bg === 'bg-amber-400/10' ? 'bg-amber-400' : hsc.bg === 'bg-green-400/10' ? 'bg-green-400' : hsc.bg === 'bg-red-400/10' ? 'bg-red-400' : 'bg-violet-400'}`}></div>
                  <div>
                    <span className={`text-sm font-medium ${hsc.color}`}>{h.status}</span>
                    {h.note && <span className="text-xs text-zinc-500 ml-2">— {h.note}</span>}
                    <p className="text-xs text-zinc-600 mt-0.5">{new Date(h.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
