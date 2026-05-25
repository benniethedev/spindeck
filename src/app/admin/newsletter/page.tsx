'use client';

import { useState, useEffect, useCallback } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';

const genreOptions = [
  'house', 'tech_house', 'techno', 'drum_and_bass', 'ambient',
  'lo_fi', 'hip_hop', 'rnb', 'pop', 'afrobeats', 'afro_house',
  'progressive_house', 'trance', 'dubstep', 'industrial', 'other',
];

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

export default function NewsletterCreator() {
  const [approvedTracks, setApprovedTracks] = useState<any[]>([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    bodyText: '',
    sendTo: 'all' as 'all' | 'selected',
    selectedRecipients: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      const tracks = (data.submissions || []).filter((s: any) => s.status === 'approved');
      setApprovedTracks(tracks);
    } catch (err) {
      console.error('Failed to fetch tracks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = approvedTracks.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.trackName?.toLowerCase().includes(q) || t.artistName?.toLowerCase().includes(q);
    }
    return true;
  }).filter((t) => {
    if (genreFilter !== 'all' && t.genre !== genreFilter) return false;
    return true;
  });

  const toggleTrack = (id: string) => {
    setSelectedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedTrackIds.size === filtered.length) {
      setSelectedTrackIds(new Set());
    } else {
      setSelectedTrackIds(new Set(filtered.map(t => t.id)));
    }
  };

  const handleSend = async () => {
    if (selectedTrackIds.size === 0 || !form.title) return;
    setSending(true);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          subtitle: form.subtitle,
          bodyText: form.bodyText,
          trackIds: Array.from(selectedTrackIds),
          selectedArtists: form.sendTo === 'selected' ? form.selectedRecipients.split(',').map((s: string) => s.trim()) : [],
          preview: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Newsletter sent successfully!' });
        setForm({ title: '', subtitle: '', bodyText: '', sendTo: 'all', selectedRecipients: '' });
        setSelectedTrackIds(new Set());
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to send newsletter' });
    } finally {
      setSending(false);
    }
  };

  const handlePreview = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title || 'Preview Newsletter',
          subtitle: form.subtitle,
          bodyText: form.bodyText,
          trackIds: Array.from(selectedTrackIds),
          selectedArtists: form.sendTo === 'selected' ? form.selectedRecipients.split(',').map((s: string) => s.trim()) : [],
          preview: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Preview logged to console (check terminal)' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to generate preview' });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-zinc-800/50 rounded-2xl animate-pulse" />)}
        </div>
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 h-[400px] animate-pulse" />
      </div>
    );
  }

  const selectedTracksList = approvedTracks.filter((t) => selectedTrackIds.has(t.id));

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Newsletter Creator</h1>
          <p className="text-sm text-zinc-500 mt-1">Send curated track drops to your DJ subscribers</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20">
            {selectedTrackIds.size} track{selectedTrackIds.size !== 1 ? 's' : ''} selected
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-4">
          <p className="text-2xl font-bold text-white">{approvedTracks.length}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Approved Tracks</p>
        </div>
        <div className="rounded-2xl bg-violet-500/5 border border-violet-500/10 p-4">
          <p className="text-2xl font-bold text-violet-400">{selectedTrackIds.size}</p>
          <p className="text-xs text-violet-500/60 mt-0.5">Selected</p>
        </div>
        <div className="rounded-2xl bg-zinc-500/5 border border-zinc-700/30 p-4">
          <p className="text-2xl font-bold text-zinc-400">0</p>
          <p className="text-xs text-zinc-500 mt-0.5">Sent This Month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: Form */}
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-6 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-zinc-200">Newsletter Content</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Compose your email blast</p>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., New Drops: Week 22"
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="e.g., 15 fresh tracks from emerging artists"
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Body Text</label>
              <textarea
                value={form.bodyText}
                onChange={(e) => setForm({ ...form, bodyText: e.target.value })}
                rows={4}
                placeholder="Write your newsletter message..."
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Send To</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setForm({ ...form, sendTo: 'all' })}
                  className={'flex-1 py-2 rounded-xl text-xs font-semibold transition-all ' + (form.sendTo === 'all' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-zinc-500 bg-zinc-800/30 border border-zinc-700/30 hover:bg-zinc-700/50')}
                >
                  All Subscribers
                </button>
                <button
                  onClick={() => setForm({ ...form, sendTo: 'selected' })}
                  className={'flex-1 py-2 rounded-xl text-xs font-semibold transition-all ' + (form.sendTo === 'selected' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-zinc-500 bg-zinc-800/30 border border-zinc-700/30 hover:bg-zinc-700/50')}
                >
                  Specific DJs
                </button>
              </div>
            </div>

            {form.sendTo === 'selected' && (
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Recipient Emails (comma separated)</label>
                <textarea
                  value={form.selectedRecipients}
                  onChange={(e) => setForm({ ...form, selectedRecipients: e.target.value })}
                  rows={3}
                  placeholder="dj1@email.com, dj2@email.com, ..."
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
                />
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                onClick={handleSend}
                disabled={selectedTrackIds.size === 0 || !form.title || sending}
                className="w-full py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Newsletter'}
              </button>
              <button
                onClick={handlePreview}
                disabled={selectedTrackIds.size === 0 || sending}
                className="w-full py-3 rounded-full text-xs font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50 disabled:opacity-40 transition-all"
              >
                Preview (Console)
              </button>
            </div>
          </div>

          {/* Selected Tracks Summary */}
          {selectedTracksList.length > 0 && (
            <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-6">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3">Selected Tracks ({selectedTracksList.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedTracksList.map((track) => (
                  <div key={track.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/20 border border-zinc-700/20">
                    {track.artworkUrl ? (
                      <img src={track.artworkUrl} alt="" className="w-8 h-8 rounded-md object-cover bg-zinc-800" />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-zinc-200 truncate">{track.trackName}</p>
                      <p className="text-[10px] text-zinc-500">{track.artistName}</p>
                    </div>
                    <button
                      onClick={() => toggleTrack(track.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Track Selection */}
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200">Select Tracks</h2>
            <button
              onClick={toggleAll}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium"
            >
              {selectedTrackIds.size === filtered.length ? 'Deselect All' : 'Select All'} ({filtered.length})
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((track) => {
              const isSelected = selectedTrackIds.has(track.id);
              return (
                <div
                  key={track.id}
                  onClick={() => toggleTrack(track.id)}
                  className={'group cursor-pointer rounded-2xl border overflow-hidden transition-all ' + (
                    isSelected
                      ? 'border-violet-500/50 bg-violet-500/5 shadow-lg shadow-violet-500/10'
                      : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700/50 hover:bg-zinc-900/50'
                  )}
                >
                  <div className="flex p-3 gap-3">
                    <div className={isSelected ? 'w-5 h-5 rounded-md border bg-violet-600 border-violet-500 flex items-center justify-center flex-shrink-0 transition-all' : 'w-5 h-5 rounded-md border border-zinc-700 group-hover:border-zinc-600 flex items-center justify-center flex-shrink-0 transition-all'}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {track.artworkUrl ? (
                      <img src={track.artworkUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-zinc-800 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-200 truncate">{track.trackName}</p>
                      <p className="text-xs text-zinc-500">{track.artistName}</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className={'px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ' + (genreColors[track.genre] || 'bg-zinc-500/10 text-zinc-400')}>
                          {track.genre?.replace('_', ' ')}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-zinc-400 bg-zinc-500/10 tabular-nums">
                          {track.bpm} BPM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 py-16 text-center">
              <p className="text-zinc-500 text-sm">No approved tracks found</p>
              <p className="text-zinc-600 text-xs mt-1">Approved tracks will appear here for selection</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {statusMsg && (
        <div className={'flex items-center gap-2 p-4 rounded-2xl border ' + (
          statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        )}>
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
    </div>
  );
}
