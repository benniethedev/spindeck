/**
 * Admin Dashboard - Overview with stats and recent activity
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  in_campaign: number;
  total: number;
  artists: number;
}

interface Submission {
  id: string;
  key: string;
  data: {
    trackName: string;
    genre: string;
    bpm: number;
    isClean: boolean;
    status: string;
    artistId: string;
    createdAt: string;
  };
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, in_campaign: 0, total: 0, artists: 0 });
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, subsRes, artistsRes] = await Promise.all([
        fetch('/api/admin/submissions?action=stats'),
        fetch('/api/admin/submissions?status=all&limit=5'),
        fetch('/api/admin/artists?action=count'),
      ]);
      const statsData = await statsRes.json();
      if (statsData.success) setStats(s => ({ ...s, ...statsData.stats }));
      const subsData = await subsRes.json();
      if (subsData.success) setRecentSubmissions(subsData.submissions || []);
      const artistsData = await artistsRes.json();
      if (artistsData.success) setStats(s => ({ ...s, artists: artistsData.count || 0 }));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statCards = [
    { label: 'Total Submissions', value: stats.total, gradient: 'from-violet-600 to-indigo-600', shadow: 'shadow-violet-500/20', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    )},
    { label: 'Pending Review', value: stats.pending, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { label: 'Approved', value: stats.approved, gradient: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/20', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { label: 'Rejected', value: stats.rejected, gradient: 'from-red-500 to-rose-600', shadow: 'shadow-red-500/20', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { label: 'In Campaign', value: stats.in_campaign, gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3a2.25 2.25 0 010 4.5l-2 3" />
      </svg>
    )},
    { label: 'Artists', value: stats.artists, gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    )},
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-400 mt-4 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13l5 5 5-5m-5-5V3a1 1 0 011-1h1a1 1 0 011 1v5a1 1 0 01-1 1h-1a1 1 0 01-1-1V8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Welcome back to SpinRec Admin</h3>
            <p className="text-zinc-400 text-sm">Manage submissions, artists, and campaigns all in one place.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/50 transition-all duration-300 hover:shadow-lg"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-3 shadow-lg ${stat.shadow}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/submissions" className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/20 transition-all">
            Review Pending ({stats.pending})
          </Link>
          <Link href="/admin/tracks" className="px-4 py-2.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 text-sm font-medium rounded-xl border border-zinc-700/50 transition-all">
            All Tracks
          </Link>
          <Link href="/admin/artists" className="px-4 py-2.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 text-sm font-medium rounded-xl border border-zinc-700/50 transition-all">
            Manage Artists
          </Link>
          <Link href="/admin/email" className="px-4 py-2.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 text-sm font-medium rounded-xl border border-zinc-700/50 transition-all">
            Email Blast
          </Link>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Recent Submissions</h3>
          <Link href="/admin/submissions" className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">No submissions yet</p>
            <p className="text-zinc-600 text-xs mt-1">Submissions will appear here as they come in</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSubmissions.slice(0, 5).map((sub) => {
              const d = sub.data;
              const statusColors: Record<string, { label: string; color: string; bg: string }> = {
                pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                approved: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-400/10' },
                rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/10' },
                in_campaign: { label: 'In Campaign', color: 'text-violet-400', bg: 'bg-violet-400/10' },
              };
              const sc = statusColors[d.status] || statusColors.pending;
              return (
                <Link key={sub.id} href={`/admin/tracks/${sub.id}`} className="flex items-center gap-4 p-3 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-xl transition-all group">
                  <div className={`px-2.5 py-1 rounded-lg ${sc.bg} ${sc.color} text-xs font-medium`}>{sc.label}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{d.trackName}</p>
                    <p className="text-zinc-500 text-xs">{d.genre} • {d.bpm} BPM</p>
                  </div>
                  <div className="text-zinc-600 text-xs">{new Date(d.createdAt).toLocaleDateString()}</div>
                  <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
