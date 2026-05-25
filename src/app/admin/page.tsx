'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface StatsCard {
  title: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  href: string;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [subRes, artRes] = await Promise.all([
        fetch('/api/admin/submissions'),
        fetch('/api/admin/artists'),
      ]);

      const subData = await subRes.json();
      const artData = await artRes.json();

      const submissions = subData.submissions || [];
      const artists = artData.artists || [];

      const pending = submissions.filter((s: any) => s.status === 'pending').length;
      const approved = submissions.filter((s: any) => s.status === 'approved').length;
      const rejected = submissions.filter((s: any) => s.status === 'rejected').length;

      setStats([
        {
          title: 'Total Submissions',
          value: submissions.length,
          change: `${pending} pending`,
          changeType: 'neutral',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          href: '/admin/submissions',
          color: 'from-violet-500/20 to-indigo-500/20 border-violet-500/30',
        },
        {
          title: 'Approved',
          value: approved,
          change: 'Ready for DJ pool',
          changeType: 'positive',
          icon: 'M5 13l4 4L19 7',
          href: '/admin/tracks',
          color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
        },
        {
          title: 'Pending Review',
          value: pending,
          change: 'Needs attention',
          changeType: pending > 0 ? 'negative' : 'neutral',
          icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
          href: '/admin/submissions',
          color: pending > 0 ? 'from-amber-500/20 to-orange-500/20 border-amber-500/30' : 'from-zinc-500/20 to-zinc-600/20 border-zinc-500/30',
        },
        {
          title: 'Total Artists',
          value: artists.length,
          change: `${artists.filter((a: any) => a.plan !== 'free').length} paying`,
          changeType: 'positive',
          icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
          href: '/admin/artists',
          color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
        },
      ]);

      setRecentSubmissions(
        submissions
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      );
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'in_campaign': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-800 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-40 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-4 w-56 bg-zinc-800/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-zinc-800/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Welcome to your SpinRec admin panel</p>
          </div>
        </div>
        <Link
          href="/admin/newsletter"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send Newsletter
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{stat.title}</p>
                <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white tracking-tight">{stat.value.toLocaleString()}</p>
              <p className={`text-xs mt-1 font-medium ${
                stat.changeType === 'positive' ? 'text-emerald-400' :
                stat.changeType === 'negative' ? 'text-amber-400' : 'text-zinc-500'
              }`}>
                {stat.change}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Review Pending', desc: `${stats.find(s => s.title === 'Pending Review')?.value || 0} tracks to review`, href: '/admin/submissions', color: 'amber' },
            { label: 'Manage Tracks', desc: 'Edit metadata and statuses', href: '/admin/tracks', color: 'violet' },
            { label: 'Browse Artists', desc: 'View and manage user directory', href: '/admin/artists', color: 'blue' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                <svg className={`w-5 h-5 text-${action.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{action.label}</p>
                <p className="text-xs text-zinc-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Recent Submissions</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Latest tracks submitted to SpinRec</p>
          </div>
          <Link href="/admin/submissions" className="text-xs text-violet-400 hover:text-violet-300 font-medium">
            View all →
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">No submissions yet</p>
            <p className="text-zinc-600 text-xs mt-1">Tracks will appear here once submitted</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/30">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-zinc-800/20 transition-colors">
                {sub.artworkUrl ? (
                  <img src={sub.artworkUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{sub.trackName}</p>
                  <p className="text-xs text-zinc-500">{sub.artistName} · {sub.genre?.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${getStatusColor(sub.status)}`}>
                    {sub.status}
                  </span>
                  <span className="text-[10px] text-zinc-600 tabular-nums">
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
