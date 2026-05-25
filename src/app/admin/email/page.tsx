/**
 * Email Blast Creator - UI to select approved tracks and send newsletter
 */
'use client';

import { useState, useEffect, useCallback } from 'react';

interface TrackRecord {
  id: string;
  key: string;
  data: {
    trackName: string;
    genre: string;
    bpm: number;
    isClean: boolean;
    notes: string;
    status: string;
    artistId: string;
    createdAt: string;
  };
}

export default function EmailPage() {
  const [approvedTracks, setApprovedTracks] = useState<TrackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; subject: string; preview: string }>>([]);

  const fetchApprovedTracks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email?action=get_approved');
      const data = await res.json();
      if (data.success) setApprovedTracks(data.approvedTracks || []);
    } catch {
      // If email API doesn't have get_approved, fall back to submissions
      try {
        const res2 = await fetch('/api/admin/submissions?status=approved');
        const data2 = await res2.json();
        if (data2.success) setApprovedTracks(data2.submissions || []);
      } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/email?action=get_templates');
      const data = await res.json();
      if (data.success) setTemplates(data.templates || []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchApprovedTracks();
    fetchTemplates();
  }, [fetchApprovedTracks, fetchTemplates]);

  const handleToggleTrack = (id: string) => {
    setSelectedTracks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_newsletter',
          newsletter: {
            title: 'Weekly Picks',
            content: 'Check out this weeks top submissions',
            trackIds: Array.from(selectedTracks),
            recipients: 'all',
            fromEmail: 'noreply@spinrec.com',
            fromName: 'SpinRec',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Newsletter sent to all recipients! (${data.newsletter?.trackIds?.length || 0} tracks included)` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send newsletter' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSending(false);
    }
  };

  const filtered = approvedTracks.filter((t) => {
    const q = searchQuery.toLowerCase();
    return !q || t.data.trackName.toLowerCase().includes(q) || t.data.genre.toLowerCase().includes(q);
  });

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

      <div>
        <h3 className="text-xl font-bold text-white">Email Blast Creator</h3>
        <p className="text-sm text-zinc-400 mt-1">Select approved tracks and send newsletters to your DJ pool</p>
      </div>

      {/* Compose Card */}
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">Compose Newsletter</h4>
          <button onClick={() => setShowTemplates(!showTemplates)} className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            {showTemplates ? 'Hide Templates' : 'Show Templates'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Subject Line</label>
              <input type="text" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="Enter newsletter subject..." />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">From Name</label>
              <input type="text" defaultValue="SpinRec" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">From Email</label>
              <input type="email" defaultValue="noreply@spinrec.com" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Recipients</label>
              <select className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option value="all">All DJs</option>
                <option value="active">Active DJs Only</option>
                <option value="genre_house">House Music DJs</option>
                <option value="genre_techno">Techno DJs</option>
                <option value="custom">Custom List</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Email Content</label>
              <textarea rows={6} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none" placeholder="Write your newsletter content here...&#10;&#10;Use {{track_name}}, {{genre}}, {{bpm}} as placeholders." />
            </div>
            <button onClick={handleSend} disabled={sending || selectedTracks.size === 0} className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                  Send Newsletter ({selectedTracks.size} tracks)
                </>
              )}
            </button>
          </div>

          {/* Track Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-semibold text-zinc-300">Select Tracks ({selectedTracks.size} selected)</h5>
              <div className="flex gap-2">
                <button onClick={() => setSelectedTracks(new Set(filtered.map(t => t.id)))} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Select All</button>
                <button onClick={() => setSelectedTracks(new Set())} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Clear</button>
              </div>
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              <input type="text" placeholder="Filter tracks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
            <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl overflow-y-auto max-h-[400px] space-y-1">
              {loading ? (<div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>)
              : filtered.length === 0 ? (<div className="text-center py-8"><p className="text-zinc-500 text-sm">No approved tracks</p></div>)
              : filtered.map((track) => {
                  const isSelected = selectedTracks.has(track.id);
                  return (
                    <button key={track.id} onClick={() => handleToggleTrack(track.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${isSelected ? 'bg-violet-600/15 border border-violet-500/30' : 'hover:bg-zinc-800/50 border border-transparent'}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-violet-500 border-violet-500' : 'border-zinc-600'}`}>
                        {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-violet-300' : 'text-white'}`}>{track.data.trackName}</p>
                        <p className="text-xs text-zinc-500">{track.data.genre} • {track.data.bpm} BPM</p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Templates */}
      {showTemplates && (
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 space-y-4">
          <h4 className="text-lg font-semibold text-white">Email Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <div key={tpl.id} className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 hover:border-violet-500/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <span className="text-white font-medium text-sm">{tpl.name}</span>
                </div>
                <p className="text-xs text-violet-400 mb-2">{tpl.subject}</p>
                <p className="text-xs text-zinc-500">{tpl.preview}</p>
              </div>
            ))}
            {templates.length === 0 && (
              <p className="text-zinc-500 text-sm col-span-3 text-center py-4">No templates available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
