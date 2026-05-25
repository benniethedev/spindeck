'use client';

import { useState, useEffect, useCallback } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

export default function SubmissionQueue() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('pending');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<any>(null);
  const [rejectModal, setRejectModal] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setStatusMsg({ type: 'error', text: 'Failed to load submissions' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [filter]);

  const filtered = submissions.filter((s) => {
    if (filter === 'all') return true;
    if ((filter as string) !== 'all' && s.status !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.trackName?.toLowerCase().includes(q) ||
        s.artistName?.toLowerCase().includes(q) ||
        s.genre?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(s => s.id)));
    }
  };

  const handleBulkAction = async (status: string) => {
    if (selectedIds.size === 0) return;
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), status }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Successfully ${status}d ${selectedIds.size} track(s)` });
        setSelectedIds(new Set());
        await fetchData();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to update tracks' });
    }
  };

  const handleSingleAction = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Track ${status}` });
        await fetchData();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to update track' });
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    try {
      const res = await fetch(`/api/submissions/${rejectModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', notes: rejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Track rejected' });
        setRejectModal(null);
        setRejectReason('');
        await fetchData();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to reject track' });
    }
  };

  const statusColors = { pending: 'amber', approved: 'emerald', rejected: 'red', in_campaign: 'violet' };

  const genreColors: Record<string, string> = {
    house: 'bg-violet-500/10 text-violet-400',
    tech_house: 'bg-indigo-500/10 text-indigo-400',
    techno: 'bg-zinc-500/10 text-zinc-400',
    drum_and_bass: 'bg-rose-500/10 text-rose-400',
    ambient: 'bg-cyan-500/10 text-cyan-400',
    lo_fi: 'bg-amber-500/10 text-amber-400',
    hip_hop: 'bg-orange-500/10 text-orange-400',
    rnb: 'bg-pink-500/10 text-pink-400',
    pop: 'bg-fuchsia-500/10 text-fuchsia-400',
    afrobeats: 'bg-emerald-500/10 text-emerald-400',
    afro_house: 'bg-teal-500/10 text-teal-400',
    progressive_house: 'bg-blue-500/10 text-blue-400',
    trance: 'bg-sky-500/10 text-sky-400',
    dubstep: 'bg-red-500/10 text-red-400',
    industrial: 'bg-gray-500/10 text-gray-400',
    other: 'bg-zinc-500/10 text-zinc-400',
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4].map(i => <div key={i} className="h-10 bg-zinc-800/50 rounded-lg animate-pulse" />)}
        </div>
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Submission Queue</h1>
        <p className="text-sm text-zinc-500 mt-1">Review, approve, or reject artist submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {([['all', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected']] as [FilterTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === key
                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent'
            }`}
          >
            {label}
            {key === 'pending' && pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px]">{pendingCount}</span>
            )}
            {key === 'all' && (
              <span className="ml-2 px-1.5 py-0.5 rounded-md bg-zinc-700/30 text-zinc-400 text-[10px]">{submissions.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
          <span className="text-sm text-violet-300 font-medium">{selectedIds.size} selected</span>
          <div className="flex-1" />
          <button
            onClick={() => setBulkAction('approve')}
            className="px-4 py-2 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            Approve Selected
          </button>
          <button
            onClick={() => setBulkAction('reject')}
            className="px-4 py-2 rounded-full text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            Reject Selected
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by track, artist, or genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50"
        />
      </div>

      {/* Submission Table */}
      <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">
              {filter === 'all' ? 'No submissions yet' : `No ${filter} submissions`}
            </p>
            <p className="text-zinc-600 text-xs mt-1">Tracks will appear here once submitted</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800/50">
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-violet-500 focus:ring-violet-500/30"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Track</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Artist</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Genre</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">BPM</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Rating</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Date</th>
                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {filtered.map((sub) => (
                    <tr key={sub.id} className={`hover:bg-zinc-800/20 transition-colors ${selectedIds.has(sub.id) ? 'bg-violet-500/5' : ''}`}>
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(sub.id)}
                          onChange={() => toggleSelect(sub.id)}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-violet-500 focus:ring-violet-500/30"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {sub.artworkUrl ? (
                            <img src={sub.artworkUrl} alt="" className="w-9 h-9 rounded-lg object-cover bg-zinc-800" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                            </div>
                          )}
                          <span className="text-sm font-medium text-zinc-200 truncate max-w-[160px]">{sub.trackName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-zinc-400">{sub.artistName}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${genreColors[sub.genre] || 'bg-zinc-500/10 text-zinc-400'}`}>
                          {sub.genre?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-zinc-400 tabular-nums">{sub.bpm}</td>
                      <td className="px-6 py-3">
                        {sub.rating === 'explicit' ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-red-500/10 text-red-400 border border-red-500/20">Explicit</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Clean</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-3 text-xs text-zinc-500 tabular-nums">{new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailModal(sub)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                            title="View details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {sub.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleSingleAction(sub.id, 'approved')}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                title="Approve"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setRejectModal(sub)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Reject"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-zinc-800/30">
              {filtered.map((sub) => (
                <div key={sub.id} className="p-4 hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-start gap-3">
                    {sub.artworkUrl ? (
                      <img src={sub.artworkUrl} alt="" className="w-14 h-14 rounded-xl object-cover bg-zinc-800 flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-zinc-200 truncate">{sub.trackName}</p>
                        <StatusBadge status={sub.status} />
                      </div>
                      <p className="text-xs text-zinc-500">{sub.artistName}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${genreColors[sub.genre] || 'bg-zinc-500/10 text-zinc-400'}`}>
                          {sub.genre?.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-zinc-400 bg-zinc-500/10">{sub.bpm} BPM</span>
                      </div>
                    </div>
                  </div>
                  {sub.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleSingleAction(sub.id, 'approved')}
                        className="flex-1 py-2 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectModal(sub)}
                        className="flex-1 py-2 rounded-full text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setDetailModal(sub)}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20"
                      >
                        Details
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-zinc-600 mt-2 tabular-nums">{new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Status Message */}
      {statusMsg && (
        <div className={`flex items-center gap-2 p-4 rounded-2xl border ${
          statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={statusMsg.type === 'success' ? 'M5 13l4 4L19 7' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
          </svg>
          <span className="text-sm font-medium">{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="ml-auto p-1 text-current hover:opacity-70">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title={detailModal.trackName} size="lg">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {detailModal.artworkUrl ? (
                <img src={detailModal.artworkUrl} alt={detailModal.trackName} className="w-full sm:w-48 h-48 rounded-xl object-cover bg-zinc-800" />
              ) : (
                <div className="w-full sm:w-48 h-48 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              )}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={detailModal.status} size="md" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Artist</p>
                  <p className="text-sm text-zinc-200 font-medium">{detailModal.artistName}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Genre</p>
                    <p className="text-sm text-zinc-200">{detailModal.genre?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">BPM</p>
                    <p className="text-sm text-zinc-200 tabular-nums">{detailModal.bpm}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Rating</p>
                    <p className="text-sm text-zinc-200">{detailModal.rating}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Submitted</p>
                    <p className="text-sm text-zinc-200">{new Date(detailModal.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            {detailModal.links && detailModal.links.length > 0 && (
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">Links</p>
                <div className="space-y-2">
                  {detailModal.links.map((link: any, i: number) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30 hover:border-violet-500/30 transition-colors group">
                      <svg className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-sm text-zinc-300 group-hover:text-violet-300 transition-colors">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {detailModal.notes && (
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Admin Notes</p>
                <p className="text-sm text-zinc-300 bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-3">{detailModal.notes}</p>
              </div>
            )}

            {/* Actions */}
            {detailModal.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-zinc-800/50">
                <button
                  onClick={() => { handleSingleAction(detailModal.id, 'approved'); setDetailModal(null); }}
                  className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all"
                >
                  Approve Track
                </button>
                <button
                  onClick={() => { setDetailModal(null); setRejectModal(detailModal); }}
                  className="flex-1 py-3 rounded-full text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  Reject Track
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <Modal isOpen={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }} title="Reject Track" size="sm">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-300">
                Rejecting <span className="font-semibold text-white">{rejectModal.trackName}</span> by <span className="font-semibold text-white">{rejectModal.artistName}</span>
              </p>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Reason (optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                placeholder="e.g., Track doesn't meet quality standards..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 py-3 rounded-full text-sm font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Bulk action confirm */}
      {bulkAction && (
        <Modal isOpen={!!bulkAction} onClose={() => setBulkAction(null)} title={`Confirm ${bulkAction === 'approve' ? 'Approve' : 'Reject'}`} size="sm">
          <div className="space-y-4">
            <p className="text-sm text-zinc-300">
              Are you sure you want to <strong className="text-white">{bulkAction}</strong> {selectedIds.size} selected track(s)?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBulkAction(null)}
                className="flex-1 py-3 rounded-full text-sm font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50"
              >
                Cancel
              </button>
              <button
                onClick={() => { handleBulkAction(bulkAction); setBulkAction(null); }}
                className={`flex-1 py-3 rounded-full text-sm font-semibold text-white ${
                  bulkAction === 'approve'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                    : 'bg-gradient-to-r from-red-600 to-rose-600'
                }`}
              >
                {bulkAction === 'approve' ? 'Approve All' : 'Reject All'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
