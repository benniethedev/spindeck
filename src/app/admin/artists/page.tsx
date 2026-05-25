/**
 * Artist/DJ Directory - CRUD for users
 */
'use client';

import { useState, useEffect, useCallback } from 'react';

type ArtistStatus = 'pending' | 'active' | 'suspended' | 'deleted';

interface ArtistRecord {
  id: string;
  key: string;
  data: {
    name: string;
    email: string;
    plan: string;
    status: ArtistStatus;
    stripeCustomerId: string;
    submissionCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

const STATUS_COLORS: Record<ArtistStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-green-400', bg: 'bg-green-400/10' },
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  suspended: { label: 'Suspended', color: 'text-red-400', bg: 'bg-red-400/10' },
  deleted: { label: 'Deleted', color: 'text-zinc-500', bg: 'bg-zinc-800/30' },
};

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', plan: 'starter' });

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/artists?status=' + statusFilter);
      const data = await res.json();
      if (data.success) setArtists(data.artists || []);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load artists' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchArtists(); }, [fetchArtists]);

  const handleCreate = async () => {
    if (!createForm.name || !createForm.email) return;
    try {
      const res = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', data: createForm }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Artist created' });
        setShowCreateModal(false);
        setCreateForm({ name: '', email: '', plan: 'starter' });
        fetchArtists();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: ArtistStatus) => {
    const newStatus: ArtistStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', artistId: id, data: { status: newStatus } }),
      });
      setMessage({ type: 'success', text: `Artist ${newStatus}` });
      fetchArtists();
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artist?')) return;
    try {
      await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', artistId: id }),
      });
      setMessage({ type: 'success', text: 'Artist deleted' });
      fetchArtists();
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const filtered = artists.filter((a) => {
    const q = searchQuery.toLowerCase();
    return !q || a.data.name.toLowerCase().includes(q) || a.data.email.toLowerCase().includes(q);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Artist/DJ Directory</h3>
          <p className="text-sm text-zinc-400 mt-1">Manage all registered artists and DJs</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Artist
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="text" placeholder="Search artists..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-zinc-800/50">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Artist</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plan</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Submissions</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-zinc-800/30">
              {loading ? (<tr><td colSpan={6}><div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div></td></tr>)
              : filtered.length === 0 ? (<tr><td colSpan={6}><div className="text-center py-16"><div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-3"><svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg></div><p className="text-zinc-500 text-sm">No artists found</p></div></td></tr>)
              : filtered.map((a) => { const d = a.data; const sc = STATUS_COLORS[d.status] || STATUS_COLORS.active; return (
                  <tr key={a.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{d.name.charAt(0).toUpperCase()}</div><span className="text-white font-medium text-sm">{d.name}</span></div></td>
                    <td className="px-5 py-3.5 text-zinc-400 text-sm">{d.email}</td>
                    <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-lg bg-zinc-800/50 text-xs font-medium text-zinc-300 capitalize">{d.plan}</span></td>
                    <td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.color}`}><span className={`w-1.5 h-1.5 rounded-full ${sc.bg === 'bg-green-400/10' ? 'bg-green-400' : sc.bg === 'bg-amber-400/10' ? 'bg-amber-400' : sc.bg === 'bg-red-400/10' ? 'bg-red-400' : 'bg-zinc-500'}`}></span>{sc.label}</span></td>
                    <td className="px-5 py-3.5 text-zinc-400 text-sm">{d.submissionCount}</td>
                    <td className="px-5 py-3.5 text-right"><div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleToggleStatus(a.id, d.status)} className="p-1.5 rounded-lg bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-400 hover:text-white transition-all" title={d.status === 'active' ? 'Suspend' : 'Activate'}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={d.status === 'active' ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} /></svg>
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all" title="Delete"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                    </div></td>
                  </tr>
              ); })}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-zinc-800/30">
          {loading ? (<div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>)
          : filtered.length === 0 ? (<div className="text-center py-12"><p className="text-zinc-500 text-sm">No artists found</p></div>)
          : filtered.map((a) => { const d = a.data; const sc = STATUS_COLORS[d.status] || STATUS_COLORS.active; return (
              <div key={a.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">{d.name.charAt(0).toUpperCase()}</div><div className="flex-1 min-w-0"><p className="text-white font-medium text-sm truncate">{d.name}</p><p className="text-zinc-500 text-xs">{d.email}</p></div></div>
                <div className="flex items-center gap-2 text-xs text-zinc-500"><span className="px-2 py-0.5 bg-zinc-800/50 rounded-md capitalize">{d.plan}</span><span>•</span><span className={`px-2 py-0.5 rounded-md ${sc.bg} ${sc.color}`}>{sc.label}</span><span>•</span><span>{d.submissionCount} subs</span></div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleStatus(a.id, d.status)} className="flex-1 py-2 bg-zinc-800/80 text-zinc-300 text-xs font-medium rounded-xl hover:bg-zinc-700/80 transition-all">{d.status === 'active' ? 'Suspend' : 'Activate'}</button>
                  <button onClick={() => handleDelete(a.id)} className="flex-1 py-2 bg-red-500/10 text-red-400 text-xs font-medium rounded-xl hover:bg-red-500/20 transition-all">Delete</button>
                </div>
              </div>
          ); })}
        </div>
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white">Add New Artist</h4>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm text-zinc-400 mb-1.5">Name</label><input type="text" value={createForm.name} onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="Artist name" /></div>
              <div><label className="block text-sm text-zinc-400 mb-1.5">Email</label><input type="email" value={createForm.email} onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50" placeholder="artist@example.com" /></div>
              <div><label className="block text-sm text-zinc-400 mb-1.5">Plan</label><select value={createForm.plan} onChange={(e) => setCreateForm(f => ({ ...f, plan: e.target.value }))} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"><option value="starter">Starter</option><option value="professional">Professional</option><option value="enterprise">Enterprise</option></select></div>
              <button onClick={handleCreate} disabled={!createForm.name || !createForm.email} className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Create Artist</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
