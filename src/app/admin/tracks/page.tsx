/**
 * All Tracks - Track management with metadata editing and status changes
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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
    audioFileName: string | null;
    artworkFileName: string | null;
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

const GENRES = [
  'House', 'Tech House', 'Techno', 'Trance', 'Drum & Bass',
  'Dubstep', 'Trap', 'Hip-Hop', 'R&B', 'Pop',
  'Lo-Fi', 'Afrobeats', 'Afro House', 'Ambient', 'Electro',
  'Indie', 'Rock', 'Reggaeton', 'Latin', 'K-Pop',
];

export default function TracksPage() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, unknown>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/submissions?status=all');
      const data = await res.json();
      if (data.success) setSubmissions(data.submissions || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load tracks' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleSave = async (id: string) => {
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_metadata', submissionId: id, metadata: editForm }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Track updated successfully' });
        setEditingId(null);
        fetchSubmissions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Update failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const handleStatusChange = async (id: string, status: SubmissionStatus) => {
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', submissionId: id, status, note: `Status changed to ${status}` }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Status changed to ${status}` });
        fetchSubmissions();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const filtered = submissions.filter((s) => {
    const q = searchQuery.toLowerCase();
    const d = s.data;
    const matchesSearch = !q || d.trackName.toLowerCase().includes(q) || d.genre.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesGenre = genreFilter === 'all' || d.genre === genreFilter;
    return matchesSearch && matchesStatus && matchesGenre;
  });

  const allGenres = Array.from(new Set(submissions.map((s) => s.data.genre))).sort();

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

      <div>
        <h3 className="text-xl font-bold text-white">All Tracks</h3>
        <p className="text-sm text-zinc-400 mt-1">Manage metadata, status, and file details for all tracks</p>
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="in_campaign">In Campaign</option>
        </select>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        >
          <option value="all">All Genres</option>
          {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl">
            <p className="text-zinc-500 text-sm">No tracks found</p>
          </div>
        ) : filtered.map((sub) => {
          const d = sub.data;
          const sc = STATUS_COLORS[d.status] || STATUS_COLORS.pending;
          const isEditing = editingId === sub.id;
          return (
            <div key={sub.id} className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href={"/admin/tracks/" + sub.id} className="text-white text-lg font-bold hover:text-violet-400 transition-colors">
                    {d.trackName}
                  </Link>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                    {sc.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={d.status}
                    onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="in_campaign">In Campaign</option>
                  </select>
                  <button
                    onClick={() => isEditing ? handleSave(sub.id) : setEditingId(sub.id)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-violet-600/20 text-zinc-400 hover:text-violet-400 transition-all"
                    title={isEditing ? 'Save changes' : 'Edit'}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {isEditing
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      }
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Genre</p>
                  {isEditing ? (
                    <select
                      value={editForm.genre as string || d.genre}
                      onChange={(e) => setEditForm(f => ({ ...f, genre: e.target.value }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                    >
                      {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  ) : (
                    <p className="text-sm text-zinc-300">{d.genre}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">BPM</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.bpm as number || d.bpm}
                      onChange={(e) => setEditForm(f => ({ ...f, bpm: Number(e.target.value) }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  ) : (
                    <p className="text-sm text-zinc-300">{d.bpm}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Clean</p>
                  {isEditing ? (
                    <select
                      value={editForm.isClean ? 'true' : 'false'}
                      onChange={(e) => setEditForm(f => ({ ...f, isClean: e.target.value === 'true' }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <p className="text-sm text-zinc-300">{d.isClean ? 'Yes' : 'No'}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Artist ID</p>
                  <p className="text-sm text-zinc-300 truncate">{d.artistId.slice(0, 16)}{d.artistId.length > 16 ? '...' : ''}</p>
                </div>
              </div>

              {isEditing && (
                <div className="pt-3 border-t border-zinc-800/50">
                  <div className="mb-3">
                    <label className="text-xs text-zinc-500 mb-1 block">Notes</label>
                    <textarea
                      value={editForm.notes as string || d.notes}
                      onChange={(e) => setEditForm(f => ({ ...f, notes: e.target.value }))}
                      rows={2}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
                      placeholder="Notes about this track..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(sub.id)}
                      className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/20 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-medium rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-zinc-600">
                <span>Created: {new Date(d.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(d.updatedAt).toLocaleDateString()}</span>
                {d.audioFileName && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                    Audio uploaded
                  </span>
                )}
                {d.artworkFileName && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                    Artwork uploaded
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
