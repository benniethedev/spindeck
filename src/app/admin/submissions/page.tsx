/**
 * Submission Queue - View pending tracks with Approve/Reject buttons
 */
'use client';

import { useState, useEffect, useCallback } from 'react';

type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'in_campaign';

interface SubmissionRecord {
  id: string;
  key: string;
  data: {
    trackName: string;
    genre: string;
    bpm: number;
    isClean: boolean;
    notes: string;
    links: Record<string, string>;
    status: SubmissionStatus;
    statusHistory: Array<{ status: string; timestamp: string; note?: string }>;
    artistId: string;
    audioFileKey: string | null;
    artworkFileKey: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

const STATUS_COLORS: Record<SubmissionStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' },
  approved: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-400/10', dot: 'bg-green-400' },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
  in_campaign: { label: 'In Campaign', color: 'text-violet-400', bg: 'bg-violet-400/10', dot: 'bg-violet-400' },
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [filter, setFilter] = useState<'all' | SubmissionStatus>('all');
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?status=${filter}`);
      const data = await res.json();
      if (data.success) setSubmissions(data.submissions || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load submissions' });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleApprove = async (id: string) => {
    setActioning(id);
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', submissionId: id, status: 'approved', note: 'Approved via admin' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Track approved!' });
        fetchSubmissions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to approve' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioning(id);
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', submissionId: id, status: 'rejected', note: 'Rejected via admin' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Track rejected!' });
        fetchSubmissions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reject' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setActioning(null);
    }
  };

  const handleBulkApprove = async () => {
    setActioning('bulk_approve');
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk_approve', ids: Array.from(selected), note: 'Bulk approved via admin' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `${data.results.filter((r: { success: boolean }) => r.success).length} tracks approved` });
        setSelected(new Set());
        fetchSubmissions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Bulk approval failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setActioning(null);
    }
  };

  const handleBulkReject = async () => {
    setActioning('bulk_reject');
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk_reject', ids: Array.from(selected), note: 'Bulk rejected via admin' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `${data.results.filter((r: { success: boolean }) => r.success).length} tracks rejected` });
        setSelected(new Set());
        fetchSubmissions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Bulk reject failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setActioning(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(s => s.id)));
    }
  };

  const filtered = submissions.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const d = s.data;
      return d.trackName.toLowerCase().includes(q) || d.genre.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          message.type === 'success'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`} onClick={() => setMessage(null)}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {message.type === 'success'
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            }
          </svg>
          <span className="text-sm font-medium">{message.text}</span>
          <svg className="w-4 h-4 ml-auto opacity-50 cursor-pointer hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Submission Queue</h3>
          <p className="text-sm text-zinc-400 mt-1">Review and manage track submissions</p>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <>
              <button
                onClick={handleBulkApprove}
                disabled={actioning !== null}
                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
              >
                Approve {selected.size}
              </button>
              <button
                onClick={handleBulkReject}
                disabled={actioning !== null}
                className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
              >
                Reject {selected.size}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          />
        </div>
        <div className="flex gap-1 bg-zinc-800/50 rounded-xl p-1 border border-zinc-700/50">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
            >
              {f === 'all' ? `All (${submissions.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${submissions.filter(s => s.data.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50">
                <th className="px-5 py-3.5 text-left">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-violet-500 focus:ring-violet-500"
                  />
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Track</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Genre</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Submitted</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {loading ? (
                <tr><td colSpan={6}><div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                </div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="text-center py-16">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <p className="text-zinc-500 text-sm">No submissions found</p>
                  </div>
                </td></tr>
              ) : filtered.map((sub) => {
                const d = sub.data;
                const sc = STATUS_COLORS[d.status] || STATUS_COLORS.pending;
                return (
                  <tr key={sub.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.has(sub.id)}
                        onChange={() => toggleSelect(sub.id)}
                        className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-violet-500 focus:ring-violet-500"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <a href={`/admin/tracks/${sub.id}`} className="text-white text-sm font-medium hover:text-violet-400 transition-colors">
                        {d.trackName}
                      </a>
                      <p className="text-zinc-600 text-xs mt-0.5">ID: {sub.id.slice(0, 12)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-zinc-300 text-sm">{d.genre}</span>
                      <span className="text-zinc-600 text-xs ml-2">{d.bpm} BPM</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 text-sm">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-right">
                      {d.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleApprove(sub.id)}
                            disabled={actioning === sub.id}
                            className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all disabled:opacity-50"
                            title="Approve"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReject(sub.id)}
                            disabled={actioning === sub.id}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all disabled:opacity-50"
                            title="Reject"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-zinc-800/30">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 text-sm">No submissions found</p>
            </div>
          ) : filtered.map((sub) => {
            const d = sub.data;
            const sc = STATUS_COLORS[d.status] || STATUS_COLORS.pending;
            return (
              <div key={sub.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <a href={`/admin/tracks/${sub.id}`} className="text-white font-medium">{d.trackName}</a>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${sc.bg} ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                    {sc.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{d.genre}</span>
                  <span>•</span>
                  <span>{d.bpm} BPM</span>
                  <span>•</span>
                  <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
                {d.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(sub.id)}
                      disabled={actioning === sub.id}
                      className="flex-1 py-2 bg-green-600/20 text-green-400 text-sm font-medium rounded-xl hover:bg-green-600/30 transition-all disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(sub.id)}
                      disabled={actioning === sub.id}
                      className="flex-1 py-2 bg-red-600/20 text-red-400 text-sm font-medium rounded-xl hover:bg-red-600/30 transition-all disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
