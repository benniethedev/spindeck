'use client';

import { useState, useEffect, useCallback } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';

const genreOptions = [
  'house', 'tech_house', 'techno', 'drum_and_bass', 'ambient',
  'lo_fi', 'hip_hop', 'rnb', 'pop', 'afrobeats', 'afro_house',
  'progressive_house', 'trance', 'dubstep', 'industrial', 'other',
];

const statusOptions = ['pending', 'approved', 'rejected', 'in_campaign'] as const;

export default function TrackManagement() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrack, setEditingTrack] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [viewTrack, setViewTrack] = useState<any>(null);
  const [uploadModal, setUploadModal] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      setTracks(data.submissions || []);
    } catch (err) {
      console.error('Failed to fetch tracks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = tracks.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.trackName?.toLowerCase().includes(q) || t.artistName?.toLowerCase().includes(q);
    }
    return true;
  }).filter((t) => {
    if (genreFilter !== 'all' && t.genre !== genreFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const handleEdit = (track: any) => {
    setEditingTrack(track);
    setEditForm({
      trackName: track.trackName || '',
      artistName: track.artistName || '',
      genre: track.genre || 'other',
      bpm: track.bpm?.toString() || '',
      rating: track.rating || 'clean',
      notes: track.notes || '',
    });
  };

  const handleSave = async () => {
    if (!editingTrack) return;
    try {
      const res = await fetch(`/api/submissions/${editingTrack.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editForm.status || editingTrack.status,
          notes: editForm.notes,
          trackName: editForm.trackName,
          bpm: parseInt(editForm.bpm) || editingTrack.bpm,
          genre: editForm.genre,
          rating: editForm.rating,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Track updated successfully' });
        setEditingTrack(null);
        await fetchData();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to update track' });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Status changed to ${status}` });
        await fetchData();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to update status' });
    }
  };

  const handleUpload = async () => {
    if (!uploadModal || !uploadFile) return;
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('trackId', uploadModal.id);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success || data.url) {
        setStatusMsg({ type: 'success', text: 'File uploaded successfully' });
        setUploadModal(null);
        setUploadFile(null);
        await fetchData();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to upload file' });
    }
  };

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
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 h-[600px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Track Management</h1>
        <p className="text-sm text-zinc-500 mt-1">Edit metadata, change status, and manage track files</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <option value="all">All Genres</option>
          {genreOptions.map(g => (
            <option key={g} value={g}>{g.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Tracks Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 py-16 text-center">
          <p className="text-zinc-500 text-sm">No tracks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((track) => (
            <div
              key={track.id}
              className="group rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-violet-500/20 overflow-hidden transition-all hover:shadow-lg hover:shadow-violet-500/5"
            >
              {/* Artwork */}
              <div className="relative h-40 bg-gradient-to-br from-violet-900/30 to-indigo-900/30">
                {track.artworkUrl ? (
                  <img src={track.artworkUrl} alt={track.trackName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={track.status} />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-zinc-200 truncate">{track.trackName}</h3>
                    <p className="text-xs text-zinc-500">{track.artistName}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${genreColors[track.genre] || 'bg-zinc-500/10 text-zinc-400'}`}>
                    {track.genre?.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-zinc-400 bg-zinc-500/10 tabular-nums">
                    {track.bpm} BPM
                  </span>
                </div>

                {/* Quick status change */}
                <div className="flex gap-1.5 pt-3 border-t border-zinc-800/50">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(track.id, s)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
                        track.status === s
                          ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(track)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setViewTrack(track)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-zinc-400 bg-zinc-800/30 border border-zinc-700/30 hover:border-zinc-600/50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setUploadModal(track)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-zinc-400 bg-zinc-800/30 border border-zinc-700/30 hover:border-zinc-600/50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {/* Edit Modal */}
      {editingTrack && (
        <Modal isOpen={!!editingTrack} onClose={() => setEditingTrack(null)} title={`Edit: ${editingTrack.trackName}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Track Name</label>
                <input
                  type="text"
                  value={editForm.trackName}
                  onChange={(e) => setEditForm({ ...editForm, trackName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Artist Name</label>
                <input
                  type="text"
                  value={editForm.artistName}
                  onChange={(e) => setEditForm({ ...editForm, artistName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Genre</label>
                <select
                  value={editForm.genre}
                  onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                >
                  {genreOptions.map(g => (
                    <option key={g} value={g}>{g.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">BPM</label>
                <input
                  type="number"
                  value={editForm.bpm}
                  onChange={(e) => setEditForm({ ...editForm, bpm: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Content Rating</label>
                <select
                  value={editForm.rating}
                  onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                >
                  <option value="clean">Clean</option>
                  <option value="explicit">Explicit</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Admin Notes</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                placeholder="Add internal notes about this track..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingTrack(null)}
                className="flex-1 py-3 rounded-full text-sm font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Track Modal */}
      {viewTrack && (
        <Modal isOpen={!!viewTrack} onClose={() => setViewTrack(null)} title={viewTrack.trackName} size="lg">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {viewTrack.artworkUrl ? (
                <img src={viewTrack.artworkUrl} alt={viewTrack.trackName} className="w-full sm:w-48 h-48 rounded-xl object-cover bg-zinc-800" />
              ) : (
                <div className="w-full sm:w-48 h-48 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              )}
              <div className="space-y-3 flex-1">
                <StatusBadge status={viewTrack.status} size="md" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Artist</p>
                    <p className="text-sm text-zinc-200">{viewTrack.artistName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Genre</p>
                    <p className="text-sm text-zinc-200">{viewTrack.genre?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">BPM</p>
                    <p className="text-sm text-zinc-200 tabular-nums">{viewTrack.bpm}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Rating</p>
                    <p className="text-sm text-zinc-200 capitalize">{viewTrack.rating}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Submitted</p>
                  <p className="text-sm text-zinc-200">{new Date(viewTrack.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {viewTrack.notes && (
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Notes</p>
                <p className="text-sm text-zinc-300 bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-3">{viewTrack.notes}</p>
              </div>
            )}

            {/* Status Quick Change */}
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">Change Status</p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => { handleStatusChange(viewTrack.id, s); setViewTrack(null); }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      viewTrack.status === s
                        ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                        : 'text-zinc-400 bg-zinc-800/30 border border-zinc-700/30 hover:bg-zinc-700/50'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <Modal isOpen={!!uploadModal} onClose={() => { setUploadModal(null); setUploadFile(null); }} title={`Upload file for: ${uploadModal.trackName}`} size="sm">
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-violet-500/50 transition-colors"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="audio/*,image/*"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setUploadFile(f); }}
                className="hidden"
              />
              <svg className="w-8 h-8 mx-auto text-zinc-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-zinc-400">
                {uploadFile ? (
                  <span className="text-violet-400 font-medium">{uploadFile.name}</span>
                ) : (
                  <span>Click to upload audio or artwork</span>
                )}
              </p>
              <p className="text-xs text-zinc-600 mt-1">MP3, WAV, OGG, PNG, JPG</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setUploadModal(null); setUploadFile(null); }}
                className="flex-1 py-3 rounded-full text-sm font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFile}
                className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Upload
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
