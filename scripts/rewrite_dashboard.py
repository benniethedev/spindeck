content = '''"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Submission, SubmissionStatus } from "@/types";
import SubmissionsList from "../components/SubmissionsList";
import SubmissionsFilter from "../components/SubmissionsFilter";

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; bg: string; dotColor: string }> = {
  pending: { label: "Pending", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", dotColor: "bg-amber-500" },
  approved: { label: "Approved", color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/40", dotColor: "bg-green-500" },
  rejected: { label: "Rejected", color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40", dotColor: "bg-red-500" },
  in_campaign: { label: "In Campaign", color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/40", dotColor: "bg-violet-500" },
};

const STATUS_FLOW: SubmissionStatus[] = ["pending", "approved", "rejected", "in_campaign"];

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}

function getStatusIndex(status: SubmissionStatus) {
  return STATUS_FLOW.indexOf(status);
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; name: string; plan: string } | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("spin_token");
    const userStr = localStorage.getItem("spin_user");
    if (!token || !userStr) {
      router.push("/login");
      return false;
    }
    setUser(JSON.parse(userStr));
    return true;
  }, [router]);

  const fetchSubmissions = useCallback(async () => {
    const token = localStorage.getItem("spin_token");
    if (!token) return;
    try {
      const res = await fetch("/api/submissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!checkAuth()) return;
    fetchSubmissions();
  }, [checkAuth, fetchSubmissions]);

  function handleLogout() {
    localStorage.removeItem("spin_token");
    localStorage.removeItem("spin_user");
    router.push("/login");
  }

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    inCampaign: submissions.filter((s) => s.status === "in_campaign").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Spin<span className="gradient-text">Rec</span>
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
            <button onClick={handleLogout} className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
            Welcome back, {user?.name?.split(" ")[0] || "Artist"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Track your submissions and manage your artist profile.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <a href="/artist/submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Submission
          </a>
          <button onClick={() => { setLoading(true); setRefreshing(true); fetchSubmissions(); }} disabled={refreshing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all disabled:opacity-50">
            <svg className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-zinc-900 dark:text-white" },
            { label: "Pending", value: stats.pending, color: "text-amber-600 dark:text-amber-400" },
            { label: "Approved", value: stats.approved, color: "text-green-600 dark:text-green-400" },
            { label: "In Campaign", value: stats.inCampaign, color: "text-violet-600 dark:text-violet-400" },
            { label: "Rejected", value: stats.rejected, color: "text-red-600 dark:text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 card-hover transition-all">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Submission Lifecycle</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FLOW.map((status, i) => {
              const config = STATUS_CONFIG[status];
              return (
                <div key={status} className="flex items-center gap-2">
                  <div className={`rounded-xl px-4 py-2.5 border ${config.bg} border-opacity-50 ${config.color} text-sm font-medium flex items-center gap-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    {config.label}
                    {getStatusIndex(status) < stats.total && (
                      <span className="ml-1 px-1.5 py-0.5 rounded bg-white/50 dark:bg-black/30 text-xs font-bold">
                        {submissions.filter(s => s.status === status).length}
                      </span>
                    )}
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

        <div className="mb-4">
          <SubmissionsFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        <SubmissionsList submissions={submissions} loading={loading}
          onRefresh={() => { setLoading(true); setRefreshing(true); fetchSubmissions(); }}
          filterStatus={activeFilter as SubmissionStatus | 'all'} />
      </main>
    </div>
  );
}
'''

with open('/home/benbond/Documents/spinrec/src/app/artist/dashboard/page.tsx', 'w') as f:
    f.write(content)
print(f'Dashboard rewritten: {len(content)} bytes')
