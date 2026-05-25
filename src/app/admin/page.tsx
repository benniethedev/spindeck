<<<<<<< Updated upstream
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
=======
/**
 * Admin Dashboard - Core functionality
 * Features: Login, Submission Queue, Track Management, User Directory, Email Blast
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/admin/api/auth/verify');
      if (res.ok) {
        setAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
>>>>>>> Stashed changes
      </div>
    );
  }

<<<<<<< Updated upstream
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
=======
  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-zinc-900/50 border-r border-zinc-800 flex flex-col fixed left-0 top-0">
        <div className="p-6 border-b border-zinc-800">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.15 1.682a7.5 7.5 0 01-3.15 0m0 0a6.01 6.01 0 00-1.5.189m1.5-.189a6.01 6.01 0 011.5.189m-3.15 0a6.01 6.01 0 00-1.5-.189m-1.5.189a6.01 6.01 0 011.5-.189m1.5 0a6.01 6.01 0 001.5.189m1.5-.189a6.01 6.01 0 01-1.5-.189m4.8 1.682a6 6 0 01-4.8 0" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">SpinRec</span>
          </a>
          <p className="text-xs text-zinc-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'submissions', label: 'Submissions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { id: 'tracks', label: 'Tracks', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8' },
            { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { id: 'email', label: 'Email Blast', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
                (activeTab === item.id
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-600/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50')
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={async () => {
              await fetch('/admin/api/auth/logout', { method: 'POST' });
              router.push('/admin/login');
              router.refresh();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'submissions' && <SubmissionQueue />}
        {activeTab === 'tracks' && <TrackManagement />}
        {activeTab === 'users' && <UserDirectory />}
        {activeTab === 'email' && <EmailBlastCreator />}
      </main>
    </div>
  );
}

/* ========== Dashboard Overview ========== */
function DashboardOverview() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0, users: 0, campaigns: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/admin/api/submissions?status=pending').then(r => r.json()),
      fetch('/admin/api/submissions?status=approved').then(r => r.json()),
      fetch('/admin/api/submissions?status=rejected').then(r => r.json()),
      fetch('/admin/api/submissions').then(r => r.json()),
      fetch('/admin/api/users').then(r => r.json()),
    ]).then(([pending, approved, rejected, all, users]) => {
      setStats({
        pending: pending.submissions?.length || 0,
        approved: approved.submissions?.length || 0,
        rejected: rejected.submissions?.length || 0,
        total: all.submissions?.length || 0,
        users: users.users?.length || 0,
        campaigns: 0,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Pending Tracks', value: stats.pending, color: 'amber', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Approved Tracks', value: stats.approved, color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Rejected Tracks', value: stats.rejected, color: 'red', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Users', value: stats.users, color: 'violet', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-zinc-800 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', iconBg: 'bg-amber-500/20' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', iconBg: 'bg-green-500/20' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', iconBg: 'bg-red-500/20' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', iconBg: 'bg-violet-500/20' },
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-zinc-400 mt-1">Welcome to the SpinRec admin panel. Here is a quick summary.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <div key={stat.label} className={`rounded-2xl border ${colors.border} ${colors.bg} p-6`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${colors.text}`}>{stat.label}</span>
                <div className={`${colors.iconBg} p-2 rounded-lg`}>
                  <svg className={`w-4 h-4 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="?tab=submissions" className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 hover:border-violet-600/30 hover:bg-violet-600/5 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">Review Pending</p>
              <p className="text-xs text-zinc-500">Check pending submissions</p>
            </div>
          </a>
          <a href="?tab=email" className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 hover:border-violet-600/30 hover:bg-violet-600/5 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">Send Email Blast</p>
              <p className="text-xs text-zinc-500">Create a newsletter</p>
            </div>
          </a>
          <a href="?tab=users" className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 hover:border-violet-600/30 hover:bg-violet-600/5 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">Manage Users</p>
              <p className="text-xs text-zinc-500">View and edit users</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ========== Submission Queue ========== */
function SubmissionQueue() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState<string | null>(null);

  const loadSubmissions = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/admin/api/submissions${status !== 'all' ? `?status=${status}` : ''}`);
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSubmissions(filter); }, [filter]);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      await fetch('/admin/api/submissions', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data: { status: 'approved' } }),
      });
      loadSubmissions(filter);
    } finally { setProcessing(null); }
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      await fetch('/admin/api/submissions', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data: { status: 'rejected' } }),
      });
      loadSubmissions(filter);
    } finally { setProcessing(null); }
  };

  const formatStatus = (s: string) => {
    const map: Record<string, { label: string; bg: string; border: string; text: string }> = {
      pending: { label: 'Pending', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
      approved: { label: 'Approved', bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
      rejected: { label: 'Rejected', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
      in_campaign: { label: 'In Campaign', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400' },
    };
    return map[s] || { label: s, bg: 'bg-zinc-800', border: 'border-zinc-700', text: 'text-zinc-400' };
  };

  const formatFilter = (f: string) => ({ all: 'All', pending: 'Pending', approved: 'Approved', rejected: 'Rejected', in_campaign: 'In Campaign' }[f] || f);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Submission Queue</h1>
          <p className="text-zinc-400 mt-1">Review and manage track submissions from artists.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {submissions.length} submissions
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected', 'in_campaign'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' : 'text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-zinc-700'}`}>{formatFilter(f)}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-800 rounded-xl" />)}</div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8" /></svg>
            <p className="text-zinc-500">No submissions found</p>
            <p className="text-zinc-600 text-sm mt-1">Submissions will appear here when artists submit tracks.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {submissions.map((sub) => {
              const status = sub.data?.status || 'pending';
              const info = formatStatus(status);
              const d = sub.data as any;
              const createdAt = d?.createdAt || '';
              return (
                <div key={sub.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{d?.trackName || 'Untitled'}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500">{d?.artistName || 'Unknown'}</span>
                      <span className="text-xs text-zinc-700">{"\u00b7"}</span>
                      <span className="text-xs text-zinc-500">{d?.genre || 'Unknown'}</span>
                      <span className="text-xs text-zinc-700">{"\u00b7"}</span>
                      <span className="text-xs text-zinc-500">{d?.bpm || '\u2014'} BPM</span>
                      {d?.isClean !== undefined && (
                        <>
                          <span className="text-xs text-zinc-700">{"\u00b7"}</span>
                          <span className={d.isClean ? 'text-green-400' : 'text-amber-400'}>{d.isClean ? 'Clean' : 'Explicit'}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${info.bg} ${info.text} ${info.border} border`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${info.text.replace('text-', 'bg-')}`} />
                    {info.label}
                  </span>
                  <span className="hidden md:block text-xs text-zinc-600">{createdAt ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}</span>
                  {status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleApprove(sub.id)} disabled={processing === sub.id} className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 transition-all disabled:opacity-50">Approve</button>
                      <button onClick={() => handleReject(sub.id)} disabled={processing === sub.id} className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition-all disabled:opacity-50">Reject</button>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600">Updated {createdAt ? new Date(createdAt).toLocaleDateString() : '\u2014'}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== Track Management ========== */
function TrackManagement() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrack, setEditingTrack] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [statusFilter, setStatusFilter] = useState('all');

  const loadTracks = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/admin/api/submissions${status !== 'all' ? `?status=${status}` : ''}`);
      const data = await res.json();
      setTracks(data.submissions || []);
    } catch { setTracks([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadTracks(statusFilter); }, [statusFilter]);

  const startEdit = (sub: any) => {
    setEditingTrack(sub.id);
    const d = sub.data as any;
    setEditForm({
      trackName: d?.trackName || '', artistName: d?.artistName || '', genre: d?.genre || '',
      bpm: d?.bpm || 0, rating: d?.rating || '', isClean: d?.isClean ?? false,
      notes: d?.notes || '', status: d?.status || 'pending',
    });
  };

  const saveEdit = async () => {
    if (!editingTrack) return;
    try {
      await fetch('/admin/api/submissions', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingTrack, data: editForm }),
      });
      setEditingTrack(null);
      loadTracks(statusFilter);
    } catch (e) { console.error('Failed to save:', e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this track?')) return;
    try { await fetch(`/admin/api/tracks/${id}`, { method: 'DELETE' }); loadTracks(statusFilter); }
    catch (e) { console.error('Failed to delete:', e); }
  };

  const statusOptions = ['pending', 'approved', 'rejected', 'in_campaign'];

  const fmtStatus = (s: string) => s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  const statusBadge = (s: string) => {
    if (s === 'approved') return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (s === 'rejected') return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (s === 'in_campaign') return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Track Management</h1>
          <p className="text-zinc-400 mt-1">Edit metadata, manage status, and handle files for all tracks.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${statusFilter === 'all' ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' : 'text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-zinc-700'}`}>All</button>
        {statusOptions.map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${statusFilter === f ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' : 'text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-zinc-700'}`}>{f.replace('_', ' ')}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-zinc-800 rounded-xl" />)}</div></div>
        ) : tracks.length === 0 ? (
          <div className="p-12 text-center"><svg className="w-16 h-16 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8" /></svg><p className="text-zinc-500">No tracks found</p></div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {tracks.map((track) => {
              const d = track.data as any;
              const isEditing = editingTrack === track.id;
              return (
                <div key={track.id} className={`${isEditing ? 'bg-zinc-800/30' : 'hover:bg-zinc-800/20'} transition-colors`}>
                  {isEditing ? (
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-white">Editing Track</h3>
                        <div className="flex items-center gap-2">
                          <button onClick={saveEdit} className="px-4 py-1.5 rounded-full text-xs font-medium bg-violet-600/20 text-violet-400 border border-violet-500/30 hover:bg-violet-600/30">Save</button>
                          <button onClick={() => setEditingTrack(null)} className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-zinc-200">Cancel</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="block text-xs text-zinc-400 mb-1">Track Name</label><input value={editForm.trackName || ''} onChange={e => setEditForm({ ...editForm, trackName: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" /></div>
                        <div><label className="block text-xs text-zinc-400 mb-1">Artist Name</label><input value={editForm.artistName || ''} onChange={e => setEditForm({ ...editForm, artistName: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" /></div>
                        <div><label className="block text-xs text-zinc-400 mb-1">Genre</label><input value={editForm.genre || ''} onChange={e => setEditForm({ ...editForm, genre: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" /></div>
                        <div><label className="block text-xs text-zinc-400 mb-1">BPM</label><input type="number" value={editForm.bpm || ''} onChange={e => setEditForm({ ...editForm, bpm: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" /></div>
                        <div><label className="block text-xs text-zinc-400 mb-1">Rating</label><select value={editForm.rating || ''} onChange={e => setEditForm({ ...editForm, rating: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"><option value="">Select</option><option value="G">G</option><option value="PG">PG</option><option value="R">R</option><option value="X">X</option></select></div>
                        <div><label className="block text-xs text-zinc-400 mb-1">Status</label><select value={editForm.status || 'pending'} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">{statusOptions.map(s => <option key={s} value={s}>{fmtStatus(s)}</option>)}</select></div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={editForm.isClean || false} onChange={e => setEditForm({ ...editForm, isClean: e.target.checked })} className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500" />
                            <span className="text-sm text-zinc-300">Clean Version</span>
                          </label>
                        </div>
                        <div className="sm:col-span-2"><label className="block text-xs text-zinc-400 mb-1">Notes</label><textarea value={editForm.notes || ''} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none" /></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">{d?.trackName || 'Untitled'}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-zinc-500">{d?.artistName || 'Unknown'}</span>
                          <span className="text-xs text-zinc-700">{"\u00b7"}</span>
                          <span className="text-xs text-zinc-500">{d?.genre || 'Unknown'}</span>
                          <span className="text-xs text-zinc-700">{"\u00b7"}</span>
                          <span className="text-xs text-zinc-500">{d?.bpm || '\u2014'} BPM</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(d?.status || 'pending')} border`}>{fmtStatus(d?.status || 'pending')}</span>
                      <button onClick={() => startEdit(track)} className="text-zinc-500 hover:text-violet-400 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(track.id)} className="text-zinc-500 hover:text-red-400 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== User Directory ========== */
function UserDirectory() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', type: 'artist', bio: '' });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  const loadUsers = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/admin/api/users${type !== 'all' ? `?type=${type}` : ''}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch { setUsers([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(filter); }, [filter]);

  const handleCreate = async () => {
    try {
      await fetch('/admin/api/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: createForm }),
      });
      setShowCreateModal(false);
      setCreateForm({ name: '', email: '', type: 'artist', bio: '' });
      loadUsers(filter);
    } catch (e) { console.error('Failed to create:', e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await fetch(`/admin/api/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      loadUsers(filter);
    } catch (e) { console.error('Failed to delete:', e); }
  };

  const startEdit = (user: any) => {
    setEditingUser(user.id);
    const d = user.data as any;
    setEditForm({
      name: d?.name || '', email: d?.email || '', type: d?.type || 'artist',
      bio: d?.bio || '', status: d?.status || 'active',
    });
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    try {
      await fetch('/admin/api/users', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingUser, data: editForm }),
      });
      setEditingUser(null);
      loadUsers(filter);
    } catch (e) { console.error('Failed to save:', e); }
  };

  const typeColors: Record<string, { bg: string; text: string; border: string }> = {
    artist: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
    dj: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  };

  const formatFilter = (f: string) => ({ all: 'All Users', artist: 'Artists', dj: 'DJs' }[f] || f);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Artist & DJ Directory</h1>
          <p className="text-zinc-400 mt-1">Manage artists and DJs on the platform.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25">
          + Add User
        </button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Create New User</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs text-zinc-400 mb-1">Name</label><input value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" /></div>
              <div><label className="block text-xs text-zinc-400 mb-1">Email</label><input type="email" value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" /></div>
              <div><label className="block text-xs text-zinc-400 mb-1">Type</label><select value={createForm.type} onChange={e => setCreateForm({ ...createForm, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"><option value="artist">Artist</option><option value="dj">DJ</option></select></div>
              <div><label className="block text-xs text-zinc-400 mb-1">Bio</label><textarea value={createForm.bio} onChange={e => setCreateForm({ ...createForm, bio: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none" /></div>
              <button onClick={handleCreate} className="w-full py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all">Create User</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'artist', 'dj'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' : 'text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-zinc-700'}`}>{formatFilter(f)}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="animate-pulse space-y-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-zinc-800 rounded-xl" />)}</div></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center"><svg className="w-16 h-16 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg><p className="text-zinc-500">No users found</p></div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {users.map((user) => {
              const d = user.data as any;
              const isEditing = editingUser === user.id;
              const tc = typeColors[d?.type as string] || typeColors.artist;
              return (
                <div key={user.id} className={`${isEditing ? 'bg-zinc-800/30' : 'hover:bg-zinc-800/20'} transition-colors`}>
                  {isEditing ? (
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">Editing User</h3>
                        <div className="flex items-center gap-2">
                          <button onClick={saveEdit} className="px-4 py-1.5 rounded-full text-xs font-medium bg-violet-600/20 text-violet-400 border border-violet-500/30 hover:bg-violet-600/30">Save</button>
                          <button onClick={() => setEditingUser(null)} className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-zinc-200">Cancel</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="block text-xs text-zinc-400 mb-1">Name</label><input value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" /></div>
                        <div><label className="block text-xs text-zinc-400 mb-1">Email</label><input value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" /></div>
                        <div><label className="block text-xs text-zinc-400 mb-1">Type</label><select value={editForm.type || 'artist'} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"><option value="artist">Artist</option><option value="dj">DJ</option></select></div>
                        <div><label className="block text-xs text-zinc-400 mb-1">Status</label><select value={editForm.status || 'active'} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"><option value="active">Active</option><option value="suspended">Suspended</option></select></div>
                        <div className="sm:col-span-2"><label className="block text-xs text-zinc-400 mb-1">Bio</label><textarea value={editForm.bio || ''} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none" /></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className={`w-10 h-10 rounded-xl ${tc.bg} ${tc.text} border ${tc.border} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-sm font-semibold">{(d?.name || 'U')[0].toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">{d?.name || 'Unknown'}</h3>
                        <p className="text-xs text-zinc-500 truncate">{d?.email || '\u2014'}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tc.bg} ${tc.text} ${tc.border} border capitalize`}>{d?.type || 'artist'}</span>
                      <span className={`text-xs ${(d?.status || 'active') === 'active' ? 'text-green-400' : 'text-red-400'}`}>{d?.status || 'active'}</span>
                      <button onClick={() => startEdit(user)} className="text-zinc-500 hover:text-violet-400 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-zinc-500 hover:text-red-400 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== Email Blast Creator ========== */
function EmailBlastCreator() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [recipientType, setRecipientType] = useState<'all' | 'approved' | 'selected'>('approved');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [allTracks, setAllTracks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/admin/api/submissions?status=approved&limit=100')
      .then(r => r.json())
      .then(d => { setAllTracks(d.submissions || []); setLoading(false); })
      .catch(() => { setAllTracks([]); setLoading(false); });
  }, []);

  const handleSend = async () => {
    if (!subject.trim()) return;
    setSending(true);
    try {
      await fetch('/admin/api/email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, trackIds: recipientType === 'selected' ? selectedTracks : [], recipientType }),
      });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } finally { setSending(false); }
  };

  const toggleTrack = (id: string) => setSelectedTracks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  const selectAll = () => setSelectedTracks(allTracks.map(t => t.id));
  const deselectAll = () => setSelectedTracks([]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Email Blast Creator</h1>
        <p className="text-zinc-400 mt-1">Select tracks and send newsletters to your DJ pool.</p>
      </div>

      {sent && (
        <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="text-sm text-green-400">Email blast sent successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Email Composition */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Subject</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject line" className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Body</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your newsletter content..." rows={12} className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none" />
            </div>
            <button onClick={handleSend} disabled={sending || !subject.trim()} className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Sending...
                </span>
              ) : 'Send Email Blast'}
            </button>
          </div>
        </div>

        {/* Track Selection */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Recipients</label>
              <div className="space-y-2">
                {[
                  { value: 'approved' as const, label: 'All Approved Artists' },
                  { value: 'selected' as const, label: 'Selected Tracks Only' },
                  { value: 'all' as const, label: 'All Subscribers' },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="recipient" checked={recipientType === opt.value} onChange={() => setRecipientType(opt.value)} className="w-4 h-4 text-violet-600 focus:ring-violet-500 border-zinc-600 bg-zinc-800" />
                    <span className="text-sm text-zinc-300">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {recipientType === 'selected' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-zinc-300">Select Tracks</label>
                  <div className="flex items-center gap-2">
                    <button onClick={selectAll} className="text-xs text-violet-400 hover:text-violet-300">Select All</button>
                    <span className="text-zinc-700">{"|"}</span>
                    <button onClick={deselectAll} className="text-xs text-zinc-400 hover:text-zinc-300">Deselect All</button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                  {loading ? (
                    <div className="animate-pulse space-y-2">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-zinc-800 rounded-lg" />)}</div>
                  ) : allTracks.length === 0 ? (
                    <p className="text-sm text-zinc-500">No approved tracks yet.</p>
                  ) : (
                    allTracks.map((track) => {
                      const d = track.data as any;
                      const isSelected = selectedTracks.includes(track.id);
                      return (
                        <label key={track.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-violet-500/30 bg-violet-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleTrack(track.id)} className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{d?.trackName || 'Untitled'}</p>
                            <p className="text-xs text-zinc-500 truncate">{d?.artistName || 'Unknown'}</p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-2">{selectedTracks.length} track(s) selected</p>
              </div>
            )}
          </div>
        </div>
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
