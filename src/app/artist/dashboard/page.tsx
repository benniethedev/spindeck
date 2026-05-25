'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< Updated upstream
import { ArtistAuthProvider, useArtistAuth } from '../context/ArtistAuthContext';
import type { Submission, SubmissionStatus } from '@/types';
import SubmissionsList from '../components/SubmissionsList';
import SubmissionsFilter from '../components/SubmissionsFilter';

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; bg: string; dotColor: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', dotColor: 'bg-amber-500' },
  approved: { label: 'Approved', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40', dotColor: 'bg-green-500' },
  rejected: { label: 'Rejected', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40', dotColor: 'bg-red-500' },
  in_campaign: { label: 'In Campaign', color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40', dotColor: 'bg-violet-500' },
};

const STATUS_FLOW: SubmissionStatus[] = ['pending', 'approved', 'rejected', 'in_campaign'];

function getStatusIndex(status: SubmissionStatus) {
  return STATUS_FLOW.indexOf(status);
}

function DashboardContent() {
  const { user, loading, isAuthenticated, logout } = useArtistAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
=======
import { useAuth } from '@/lib/auth-context';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  pending:    { label: 'Pending',      color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  approved:   { label: 'Approved',     color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', dot: 'bg-green-500' },
  rejected:   { label: 'Rejected',     color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-500' },
  in_campaign:{ label: 'In Campaign',  color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800', dot: 'bg-violet-500' },
};

interface Submission {
  id: string;
  key: string;
  data: {
    userEmail?: string;
    artistName?: string;
    trackName: string;
    genre: string;
    bpm: number;
    rating: string;
    isClean: boolean;
    status: string;
    artworkUrl?: string;
    artworkFileType?: string;
    audioUrl?: string;
    audioFileType?: string;
    links?: Array<{label: string; url: string}>;
    notes: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
>>>>>>> Stashed changes
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

<<<<<<< Updated upstream
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const fetchSubmissions = useCallback(async () => {
    const token = localStorage.getItem('spin_token');
    if (!token) return;
    setFetching(true);
    setRefreshing(true);
    try {
      const res = await fetch('/api/submissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      } else if (res.status === 401) {
        logout();
        router.push('/login');
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  }, [logout, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated, fetchSubmissions]);
=======
  const filters = ['all', 'pending', 'approved', 'rejected', 'in_campaign'];

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/submissions?userEmail=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (res.ok) {
        setSubmissions(data.submissions || []);
      } else {
        setError(data.error || 'Failed to load submissions');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setSubmissions(prev => prev.map(s =>
          s.id === id ? { ...s, data: { ...s.data, status: newStatus, updatedAt: new Date().toISOString() } } : s
        ));
        fetchSubmissions(); // Refresh from server
      }
    } catch {
      // silently fail — status update is optional
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/artist/login');
  };
>>>>>>> Stashed changes

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    inCampaign: submissions.filter((s) => s.status === 'in_campaign').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

<<<<<<< Updated upstream
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Loading dashboard...</p>
=======
  const filtered = activeFilter === 'all' ? submissions : submissions.filter((s) => s.data.status === activeFilter);

  // Check auth
  if (!user && !loading) {
    return (
      <div className='min-h-screen bg-white dark:bg-black flex items-center justify-center px-6'>
        <div className='text-center'>
          <p className='text-zinc-600 dark:text-zinc-400 mb-4'>Please log in to access your dashboard.</p>
          <a href='/artist/login' className='px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all'>
            Sign In
          </a>
>>>>>>> Stashed changes
        </div>
      </div>
    );
  }
<<<<<<< Updated upstream

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/artist" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Spin<span className="text-violet-600 dark:text-violet-400">Rec</span>
          </a>
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500 uppercase">{user.plan}</span>
              </div>
            )}
            <button onClick={() => { logout(); router.push('/login'); }} className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
              Sign Out
            </button>
=======

  if (loading) return (
    <div className='min-h-screen bg-white dark:bg-black flex items-center justify-center'>
      <div className='text-center'>
        <svg className='animate-spin w-8 h-8 mx-auto text-violet-500 mb-4' fill='none' viewBox='0 0 24 24'>
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
        </svg>
        <p className='text-zinc-500 dark:text-zinc-400'>Loading your dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className='min-h-screen bg-white dark:bg-black flex items-center justify-center px-6'>
      <div className='text-center'>
        <p className='text-red-600 dark:text-red-400 mb-4'>Error: {error}</p>
        <button onClick={() => fetchSubmissions()} className='px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all'>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-white dark:bg-black'>
      {/* Top Nav */}
      <div className='border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-10'>
        <div className='max-w-6xl mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <a href='/' className='text-xl font-bold tracking-tight text-zinc-900 dark:text-white'>
              Spin<span className='text-violet-600'>Rec</span>
            </a>
            <span className='text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline'>| Dashboard</span>
          </div>
          <div className='flex items-center gap-3'>
            <a href='/artist/submit' className='px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25'>
              Submit Track
            </a>
            <div className='flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-800'>
              <div className='w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold'>
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium'>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-6 py-12'>
        {/* Welcome */}
        <div className='mb-10'>
          <h1 className='text-3xl font-bold text-zinc-900 dark:text-white mb-1'>
            Welcome, {user?.name || 'Artist'}
          </h1>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Track your submissions and manage your artist profile.
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10'>
          {filters.filter(f => f !== 'all').map((f) => {
            const count = submissions.filter((s) => s.data.status === f).length;
            const info = STATUS_LABELS[f];
            return (
              <div key={f} className={`rounded-2xl border ${info.border} ${info.bg} p-5 cursor-pointer transition-all hover:scale-[1.02]`}
                   onClick={() => setActiveFilter(f)}>
                <p className={`text-sm font-medium ${info.color}`}>{info.label}</p>
                <p className='text-3xl font-bold text-zinc-900 dark:text-white mt-1'>{count}</p>
              </div>
            );
          })}
          <div className='rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 transition-all'
               onClick={() => setActiveFilter('all')}>
            <p className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>Total</p>
            <p className='text-3xl font-bold text-zinc-900 dark:text-white mt-1'>{submissions.length}</p>
>>>>>>> Stashed changes
          </div>
        </div>
      </nav>

<<<<<<< Updated upstream
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Artist'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Track your submissions and manage your artist profile.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <a href="/artist/submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Submission
          </a>
          <button onClick={fetchSubmissions} disabled={refreshing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all disabled:opacity-50">
            <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-zinc-900 dark:text-white' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Approved', value: stats.approved, color: 'text-green-600 dark:text-green-400' },
            { label: 'In Campaign', value: stats.inCampaign, color: 'text-violet-600 dark:text-violet-400' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-600 dark:text-red-400' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 card-hover transition-all">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Submission Lifecycle Visual */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Submission Lifecycle</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FLOW.map((status, i) => {
              const config = STATUS_CONFIG[status];
              return (
                <div key={status} className="flex items-center gap-2">
                  <div className={`rounded-xl px-4 py-2.5 border ${config.bg} ${config.color} text-sm font-medium flex items-center gap-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    {config.label}
                    {stats.total > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded bg-white/50 dark:bg-black/30 text-xs font-bold">
                        {submissions.filter(s => s.status === status).length}
                      </span>
                    )}
=======
        {/* Submissions List */}
        <div className='rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
          {/* Filter Tabs */}
          <div className='p-6 border-b border-zinc-200 dark:border-zinc-800'>
            <div className='flex flex-wrap gap-2'>
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === f
                      ? 'bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 ring-1 ring-violet-200 dark:ring-violet-800'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {f === 'all' ? 'All Submissions' : STATUS_LABELS[f].label}
                  <span className='ml-1.5 text-xs opacity-60'>
                    ({f === 'all' ? submissions.length : submissions.filter(s => s.data.status === f).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {filtered.length === 0 ? (
            <div className='p-16 text-center'>
              <svg className='w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8' />
              </svg>
              <p className='text-zinc-500 dark:text-zinc-400 text-lg mb-2'>
                {activeFilter === 'all' ? 'No submissions yet' : `No ${activeFilter} submissions`}
              </p>
              <p className='text-zinc-400 dark:text-zinc-500 text-sm mb-6'>
                {activeFilter === 'all'
                  ? 'Your submitted tracks will appear here.'
                  : `You don't have any ${activeFilter} tracks right now.`
                }
              </p>
              <a href='/artist/submit' className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Submit Your First Track
              </a>
            </div>
          ) : (
            <div className='divide-y divide-zinc-100 dark:divide-zinc-800/50'>
              {filtered.map((sub) => {
                const info = STATUS_LABELS[sub.data.status] || STATUS_LABELS.pending;
                return (
                  <div key={sub.id} className='flex items-center gap-4 px-6 py-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group'>
                    {/* Artwork */}
                    <div className='w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0'>
                      {sub.data.artworkUrl ? (
                        <img src={sub.data.artworkUrl} alt={sub.data.trackName} className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600'>
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8' />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-sm font-semibold text-zinc-900 dark:text-white truncate'>{sub.data.trackName}</h3>
                      <div className='flex items-center gap-2 mt-1 flex-wrap'>
                        <span className='text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md'>{sub.data.genre}</span>
                        <span className='text-xs text-zinc-300 dark:text-zinc-700'>·</span>
                        <span className='text-xs text-zinc-500 dark:text-zinc-400'>{sub.data.bpm} BPM</span>
                        <span className='text-xs text-zinc-300 dark:text-zinc-700'>·</span>
                        <span className='text-xs text-zinc-500 dark:text-zinc-400'>{sub.data.isClean ? 'Clean' : 'Explicit'}</span>
                        <span className='text-xs text-zinc-300 dark:text-zinc-700'>·</span>
                        <span className='text-xs text-zinc-500 dark:text-zinc-400'>{formatDate(sub.data.createdAt)}</span>
                      </div>
                    </div>

                    {/* Status with inline update */}
                    <div className='flex items-center gap-2'>
                      <select
                        value={sub.data.status}
                        onChange={(e) => updateStatus(sub.id, e.target.value)}
                        disabled={updatingId === sub.id}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${info.bg} ${info.color} ${info.border} transition-all disabled:opacity-50`}
                      >
                        <option value='pending'>Pending</option>
                        <option value='approved'>Approved</option>
                        <option value='rejected'>Rejected</option>
                        <option value='in_campaign'>In Campaign</option>
                      </select>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      {sub.data.audioUrl && (
                        <a href={sub.data.audioUrl} target='_blank' rel='noopener noreferrer' className='p-2 text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors' title='Listen'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                        </a>
                      )}
                    </div>
>>>>>>> Stashed changes
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <SubmissionsFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Submissions List */}
        <SubmissionsList submissions={submissions} loading={fetching}
          onRefresh={fetchSubmissions}
          filterStatus={activeFilter as SubmissionStatus | 'all'} />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ArtistAuthProvider>
      <DashboardContent />
    </ArtistAuthProvider>
  );
}
