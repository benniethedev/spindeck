'use client';

import { useState, useEffect, useCallback } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';

const planOptions = ['free', 'starter', 'professional', 'enterprise'] as const;

export default function ArtistsDirectory() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [editingArtist, setEditingArtist] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/artists');
      const data = await res.json();
      setArtists(data.artists || []);
    } catch (err) {
      console.error('Failed to fetch artists:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = artists.filter((a) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q);
    }
    return true;
  }).filter((a) => {
    if (filterPlan !== 'all' && a.plan !== filterPlan) return false;
    return true;
  });

  const planStats = {
    total: artists.length,
    paying: artists.filter(a => a.plan !== 'free').length,
    free: artists.filter(a => a.plan === 'free').length,
  };

  const handleEdit = (artist: any) => {
    setEditingArtist(artist);
    setEditForm({
      name: artist.name || '',
      email: artist.email || '',
      plan: artist.plan || 'free',
    });
  };

  const handleSave = async () => {
    if (!editingArtist) return;
    try {
      const res = await fetch('/api/admin/artists/' + editingArtist.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Artist updated successfully' });
        setEditingArtist(null);
        await fetchData();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to update artist' });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch('/api/admin/artists/' + deleteConfirm.id, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Artist deleted' });
        setDeleteConfirm(null);
        await fetchData();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to delete artist' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-zinc-800/50 rounded-2xl animate-pulse" />)}
        </div>
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 h-[500px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Artists and DJs</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage user accounts and subscription plans</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">{planStats.total} total</span>
          <div className="h-3 w-px bg-zinc-700" />
          <span className="text-xs text-emerald-400">{planStats.paying} paying</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-4">
          <p className="text-2xl font-bold text-white">{planStats.total}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Total Users</p>
        </div>
        <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4">
          <p className="text-2xl font-bold text-emerald-400">{planStats.paying}</p>
          <p className="text-xs text-emerald-500/60 mt-0.5">Paying</p>
        </div>
        <div className="rounded-2xl bg-zinc-500/5 border border-zinc-700/30 p-4">
          <p className="text-2xl font-bold text-zinc-400">{planStats.free}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Free Tier</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <option value="all">All Plans</option>
          {planOptions.map(p => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-zinc-500 text-sm">No artists found</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="hidden lg:block rounded-2xl bg-zinc-900/30 border border-zinc-800/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">User</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Plan</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Joined</th>
                  <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {filtered.map((artist) => (
                  <tr key={artist.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {artist.name?.charAt(0)?.toUpperCase() || "?" }
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200">{artist.name || 'Unknown'}</p>
                          <p className="text-xs text-zinc-500">{artist.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={artist.plan} />
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-500 tabular-nums">
                      {new Date(artist.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(artist)} className="p-2 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteConfirm(artist)} className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:hidden space-y-2">
            {filtered.map((artist) => (
              <div key={artist.id} className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{artist.name?.charAt(0)?.toUpperCase() || '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{artist.name || 'Unknown'}</p>
                  <p className="text-xs text-zinc-500 truncate">{artist.email}</p>
                </div>
                <StatusBadge status={artist.plan} />
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(artist)} className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteConfirm(artist)} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {statusMsg && (
        <div className={'flex items-center gap-2 p-4 rounded-2xl border ' + (statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400')}>
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

      {editingArtist && (
        <Modal isOpen={!!editingArtist} onClose={() => setEditingArtist(null)} title={'Edit: ' + (editingArtist.name || 'Unknown')} size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Subscription Plan</label>
              <select value={editForm.plan} onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                {planOptions.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingArtist(null)} className="flex-1 py-3 rounded-full text-sm font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all">Save Changes</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Artist" size="sm">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <p className="text-sm text-red-300">
                Are you sure you want to delete <strong className="text-white">{deleteConfirm.name || 'this artist'}</strong>?
              </p>
              <p className="text-xs text-red-400/70 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-full text-sm font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all">Delete Artist</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
