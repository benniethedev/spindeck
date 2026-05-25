'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';

export default function TrackDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trackId = searchParams.get('id');

  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [statusHistory, setStatusHistory] = useState<Array<{ status: string; date: string; note?: string }>>([]);

  const fetchData = useCallback(async () => {
    if (!trackId) return;
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      const found = (data.submissions || []).find((s: any) => s.id === trackId);
      if (found) {
        setTrack(found);
        setEditForm({
          trackName: found.trackName || '',
          artistName: found.artistName || '',
          genre: found.genre || 'other',
          bpm: found.bpm?.toString() || '',
          rating: found.rating || 'clean',
          notes: found.notes || '',
        });
        setStatusHistory([
          { status: found.status, date: found.createdAt || new Date().toISOString() },
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch track:', err);
    } finally {
      setLoading(false);
    }
  }, [trackId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!trackId) return;
    try {
      const res = await fetch(`/api/submissions/${trackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackName: editForm.trackName,
          genre: editForm.genre,
          bpm: parseInt(editForm.bpm) || track.bpm,
          rating: editForm.rating,
          notes: editForm.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Track updated successfully' });
        setEditing(false);
        await fetchData();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to update track' });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!trackId) return;
    try {
      const res = await fetch(`/api/submissions/${trackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Status changed to ${newStatus}` });
        await fetchData();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to update status' });
    }
  };

  const handleDelete = async () => {
    if (!trackId) return;
    try {
      const res = await fetch(`/api/submissions/${trackId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Track deleted' });
        router.push('/admin/tracks');
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to delete track' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="h-8 w-64 bg-zinc-800 rounded-lg animate-pulse" />
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 h-[500px] animate-pulse" />
      </div>
    );
  }

  if (!track) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="text-center py-16">
          <p className="text-zinc-500 text-lg">Track not found</p>
          <button onClick={() => router.push('/admin/tracks')} className="mt-4 text-violet-400 hover:text-violet-300 font-medium">
            Back to Tracks
          </button>
        </div>
      </div>
    );
  }

  const genreColors: Record<string, string> = {
    house: 'text-violet-400 bg-violet-500/10',
    tech_house: 'text-indigo-400 bg-indigo-500/10',
    techno: 'text-zinc-400 bg-zinc-500/10',
    drum_and_bass: 'text-rose-400 bg-rose-500/10',
    ambient: 'text-cyan-400 bg-cyan-500/10',
    lo_fi: 'text-amber-400 bg-amber-500/10',
    hip_hop: 'text-orange-400 bg-orange-500/10',
    rnb: 'text-pink-400 bg-pink-500/10',
    pop: 'text-fuchsia-400 bg-fuchsia-500/10',
    afrobeats: 'text-emerald-400 bg-emerald-500/10',
    afro_house: 'text-teal-400 bg-teal-500/10',
    progressive_house: 'text-blue-400 bg-blue-500/10',
    trance: 'text-sky-400 bg-sky-500/10',
    dubstep: 'text-red-400 bg-red-500/10',
    industrial: 'text-gray-400 bg-gray-500/10',
    other: 'text-zinc-400 bg-zinc-500/10',
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/tracks')}
            className="p-2 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{track.trackName}</h1>
            <p className="text-sm text-zinc-500 mt-0.5">by {track.artistName || 'Unknown Artist'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={track.status} size="md" />
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50 transition-all"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Track Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 overflow-hidden">
            {/* Artwork */}
            {track.artworkUrl ? (
              <img src={track.artworkUrl} alt={track.trackName} className="w-full h-64 object-cover bg-zinc-800" />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center border-b border-zinc-800/50">
                <svg className="w-16 h-16 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            )}

            {/* Metadata */}
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Genre</p>
                  <p className={`text-sm font-medium mt-1 px-2 py-0.5 inline-block rounded text-xs ${genreColors[track.genre] || genreColors.other}`}>
                    {track.genre?.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">BPM</p>
                  <p className="text-sm font-medium mt-1 text-white tabular-nums">{track.bpm}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Rating</p>
                  <p className="text-sm font-medium mt-1 text-white capitalize">{track.rating}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Clean</p>
                  <p className="text-sm font-medium mt-1 text-white">{track.isClean ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Links */}
              {track.links && track.links.length > 0 && (
                <div className="mt-6 pt-4 border-t border-zinc-800/50">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-3">Links</p>
                  <div className="flex flex-wrap gap-2">
                    {track.links.map((link: any, i: number) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/30 text-xs text-zinc-300 hover:text-violet-400 hover:border-violet-500/30 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {track.notes && (
                <div className="mt-6 pt-4 border-t border-zinc-800/50">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">Admin Notes</p>
                  <p className="text-sm text-zinc-300 bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-3 whitespace-pre-wrap">{track.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status History */}
          <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-6">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">Status History</h3>
            <div className="space-y-3">
              {statusHistory.map((entry, i) => (
                <div key={i} className="flex items-center gap-3">
                  <StatusBadge status={entry.status} size="sm" />
                  <span className="text-xs text-zinc-500 tabular-nums">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  {entry.note && <span className="text-xs text-zinc-500">— {entry.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200">Status Actions</h3>
            <div className="space-y-2">
              {[
                { status: 'pending', label: 'Set Pending', color: 'amber' },
                { status: 'approved', label: 'Approve', color: 'emerald' },
                { status: 'rejected', label: 'Reject', color: 'red' },
                { status: 'in_campaign', label: 'Mark in Campaign', color: 'violet' },
              ].map((action) => (
                <button
                  key={action.status}
                  onClick={() => handleStatusChange(action.status)}
                  disabled={track.status === action.status}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    track.status === action.status
                      ? `bg-${action.color}-500/10 text-${action.color}-400 border border-${action.color}-500/20`
                      : 'bg-zinc-800/30 border border-zinc-700/30 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200'
                  } disabled:opacity-40`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* File Info */}
          <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200">Files</h3>
            <div className="space-y-2">
              {track.audioFileUrl ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className="text-xs text-zinc-300">Audio File</span>
                </div>
              ) : (
                <div className="text-xs text-zinc-600">No audio file uploaded</div>
              )}
              {track.artworkUrl ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-zinc-300">Artwork</span>
                </div>
              ) : (
                <div className="text-xs text-zinc-600">No artwork uploaded</div>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200">Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Created</span>
                <span className="text-zinc-300 tabular-nums">{new Date(track.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Updated</span>
                <span className="text-zinc-300 tabular-nums">{new Date(track.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ID</span>
                <span className="text-zinc-400 font-mono">{track.id?.slice(0, 12)}...</span>
              </div>
            </div>
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all"
          >
            Delete Track
          </button>
        </div>
      </div>

      {/* Status Message */}
      {statusMsg && (
        <div className={`flex items-center gap-2 p-4 rounded-2xl border ${
          statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <span className="text-sm font-medium">{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="ml-auto p-1 text-current hover:opacity-70">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <Modal isOpen={!!editing} onClose={() => setEditing(false)} title={`Edit: ${track.trackName}`} size="lg">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Track Name</label>
                <input type="text" value={editForm.trackName} onChange={(e) => setEditForm({ ...editForm, trackName: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Artist Name</label>
                <input type="text" value={editForm.artistName} onChange={(e) => setEditForm({ ...editForm, artistName: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Genre</label>
                <select value={editForm.genre} onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                  {['house','tech_house','techno','drum_and_bass','ambient','lo_fi','hip_hop','rnb','pop','afrobeats','afro_house','progressive_house','trance','dubstep','industrial','other'].map(g => (
                    <option key={g} value={g}>{g.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">BPM</label>
                <input type="number" value={editForm.bpm} onChange={(e) => setEditForm({ ...editForm, bpm: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Content Rating</label>
              <select value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                <option value="clean">Clean</option>
                <option value="explicit">Explicit</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Admin Notes</label>
              <textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none" placeholder="Add admin notes..." />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(false)} className="flex-1 py-3 rounded-full text-sm font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all">Save Changes</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
