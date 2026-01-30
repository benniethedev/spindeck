"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/libs/pressbase/client";
import ButtonAccount from "@/components/ButtonAccount";
import ButtonPortal from "@/components/ButtonPortal";
import BrandLogo from "@/components/BrandLogo";
import TrackUpload from "./TrackUpload";
import TracksList from "./TracksList";
import AnalyticsView from "./AnalyticsView";
import toast from "react-hot-toast";

// Icon components for cleaner UI
const icons = {
  overview: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  upload: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  tracks: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  analytics: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

// Stat card with icon
const StatCard = ({ icon, label, value, color, trend }) => (
  <div className="group relative bg-gradient-to-br from-spindeck-dark to-black rounded-xl p-6 border border-gray-800/50 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 overflow-hidden">
    {/* Background glow effect */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${color === 'green' ? 'from-green-500' : color === 'yellow' ? 'from-yellow-500' : color === 'blue' ? 'from-blue-500' : color === 'red' ? 'from-spindeck-red' : 'from-white'} to-transparent`} />
    
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-spindeck-gray mb-1">{label}</p>
      <p className={`text-4xl font-bold tracking-tight ${
        color === 'green' ? 'text-green-400' : 
        color === 'yellow' ? 'text-yellow-400' : 
        color === 'blue' ? 'text-blue-400' : 
        color === 'red' ? 'text-spindeck-red' : 
        'text-white'
      }`}>
        {value.toLocaleString()}
      </p>
    </div>
  </div>
);

// Quick action card
const QuickActionCard = ({ icon, title, description, onClick, primary }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center gap-4 p-5 rounded-xl transition-all duration-300 text-left w-full overflow-hidden ${
      primary 
        ? 'bg-gradient-to-r from-spindeck-red to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20' 
        : 'bg-spindeck-dark border border-gray-800/50 hover:border-gray-700 hover:bg-gray-800/50'
    }`}
  >
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
      primary ? 'bg-white/20' : 'bg-gray-800'
    }`}>
      <span className="text-2xl">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-white mb-1">{title}</p>
      <p className={`text-sm ${primary ? 'text-white/70' : 'text-spindeck-gray'}`}>{description}</p>
    </div>
    <svg className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${primary ? 'text-white/70' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export default function ArtistDashboard({ user, profile }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalTracks: 0,
    approvedTracks: 0,
    pendingTracks: 0,
    totalPlays: 0,
    totalDownloads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [planInfo, setPlanInfo] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  const pb = createClient();

  useEffect(() => {
    fetchStats();
    fetchPlanInfo();
  }, [user.id]);

  const fetchStats = async () => {
    try {
      const { data: profile, error: profileError } = await pb
        .from("profiles")
        .select("*")
        .eq("owner_user_id", user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // PressBase automatically sets owner_user_id when authenticated
        const { error: createError } = await pb
          .from("profiles")
          .insert([{ 
            role: 'artist',
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null
          }]);
        
        if (createError) {
          console.error("Error creating profile:", createError);
        }
      }

      const { data: tracks, error: tracksError } = await pb
        .from("tracks")
        .select("status, play_count, download_count")
        .eq("user_id", user.id);

      if (tracksError) {
        console.error("Tracks query error:", tracksError);
        throw tracksError;
      }

      const totalTracks = tracks?.length || 0;
      const approvedTracks = tracks?.filter(track => track.status === "approved").length || 0;
      const pendingTracks = tracks?.filter(track => track.status === "pending").length || 0;
      const totalPlays = tracks?.reduce((sum, track) => sum + (track.play_count || 0), 0) || 0;
      const totalDownloads = tracks?.reduce((sum, track) => sum + (track.download_count || 0), 0) || 0;

      setStats({
        totalTracks,
        approvedTracks,
        pendingTracks,
        totalPlays,
        totalDownloads,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
      setStats({
        totalTracks: 0,
        approvedTracks: 0,
        pendingTracks: 0,
        totalPlays: 0,
        totalDownloads: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanInfo = async () => {
    try {
      const { data: profile, error: profileError } = await pb
        .from("profiles")
        .select("plan_id, customer_id")
        .eq("owner_user_id", user.id)
        .single();

      if (profile?.customer_id) {
        setCustomerId(profile.customer_id);
      }

      if (profile?.plan_id) {
        const { data: plan, error: planError } = await pb
          .from("plans")
          .select("*")
          .eq("id", profile.plan_id)
          .single();

        if (plan) {
          setPlanInfo(plan);
        }
      } else {
        setPlanInfo({
          name: "Free",
          price: 0,
          features: { tracks_per_month: 0, email_blasts: 0, analytics: false }
        });
      }
    } catch (error) {
      console.error("Error fetching plan info:", error);
      setPlanInfo({
        name: "Free",
        price: 0,
        features: { tracks_per_month: 0, email_blasts: 0, analytics: false }
      });
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: icons.overview },
    { id: "upload", label: "Upload", icon: icons.upload },
    { id: "tracks", label: "My Tracks", icon: icons.tracks },
    { id: "analytics", label: "Analytics", icon: icons.analytics },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <BrandLogo />
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-spindeck-red text-white shadow-lg shadow-red-500/20"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{profile?.full_name || 'Artist'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <ButtonAccount />
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-800/50">
          <div className="flex overflow-x-auto hide-scrollbar px-4 py-2 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-spindeck-red text-white"
                    : "text-gray-400 hover:text-white bg-gray-800/30"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-spindeck-red rounded-full" />
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === "overview" && "Dashboard"}
              {activeTab === "upload" && "Upload Track"}
              {activeTab === "tracks" && "My Tracks"}
              {activeTab === "analytics" && "Analytics"}
            </h1>
          </div>
          <p className="text-gray-500 ml-5">
            {activeTab === "overview" && "Track your music performance and manage your catalog"}
            {activeTab === "upload" && "Share your latest music with DJs worldwide"}
            {activeTab === "tracks" && "Manage and organize your uploaded tracks"}
            {activeTab === "analytics" && "Deep dive into your music performance"}
          </p>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <section>
                <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-4">Performance</h2>
                {loading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-spindeck-dark rounded-xl p-6 border border-gray-800/50 animate-pulse">
                        <div className="h-8 w-8 bg-gray-700 rounded mb-3"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-700 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard icon="🎵" label="Total Tracks" value={stats.totalTracks} color="white" />
                    <StatCard icon="✅" label="Approved" value={stats.approvedTracks} color="green" />
                    <StatCard icon="⏳" label="Pending" value={stats.pendingTracks} color="yellow" />
                    <StatCard icon="▶️" label="Total Plays" value={stats.totalPlays} color="blue" />
                    <StatCard icon="⬇️" label="Downloads" value={stats.totalDownloads} color="red" />
                  </div>
                )}
              </section>

              {/* Plan & Quick Actions Grid */}
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Plan Information - Takes 3 columns */}
                {planInfo && (
                  <section className="lg:col-span-3">
                    <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Plan</h2>
                    <div className="relative bg-gradient-to-br from-spindeck-dark via-spindeck-dark to-red-950/20 rounded-xl p-6 border border-gray-800/50 overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-spindeck-red rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      </div>
                      
                      <div className="relative">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-3xl">💎</span>
                              <div>
                                <h3 className="text-2xl font-bold text-white">{planInfo.name}</h3>
                                <p className="text-gray-500 text-sm">
                                  {planInfo.features?.duration === "one_time" ? "Lifetime access" : "Monthly subscription"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="bg-black/30 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Tracks/month</p>
                                <p className="text-lg font-bold text-white">
                                  {planInfo.features?.tracks_per_month === "unlimited" ? "∞" : planInfo.features?.tracks_per_month || 0}
                                </p>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Email Blasts</p>
                                <p className="text-lg font-bold text-white">
                                  {planInfo.features?.email_blasts === "unlimited" ? "∞" : planInfo.features?.email_blasts || 0}
                                </p>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Analytics</p>
                                <p className="text-lg font-bold">
                                  {planInfo.features?.analytics ? (
                                    <span className="text-green-400">Active</span>
                                  ) : (
                                    <span className="text-gray-500">—</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            {/* Usage Bar */}
                            {planInfo.features?.tracks_per_month !== "unlimited" && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Monthly usage</span>
                                  <span className="text-white font-medium">
                                    {stats.totalTracks} / {planInfo.features?.tracks_per_month || 0} tracks
                                  </span>
                                </div>
                                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-spindeck-red to-red-400 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${Math.min(100, (stats.totalTracks / (planInfo.features?.tracks_per_month || 1)) * 100)}%`
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            {planInfo.name !== "Free" && (
                              <div className="text-right mb-2">
                                <p className="text-3xl font-bold text-white">${planInfo.price}</p>
                                <p className="text-sm text-gray-500">per month</p>
                              </div>
                            )}
                            
                            {planInfo.name === "Free" ? (
                              <Link 
                                href="/pricing" 
                                className="inline-flex items-center gap-2 px-6 py-3 bg-spindeck-red hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                              >
                                Upgrade Plan
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </Link>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <ButtonPortal 
                                  customerId={customerId}
                                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 text-sm"
                                >
                                  Manage Subscription
                                </ButtonPortal>
                                <Link 
                                  href="/pricing" 
                                  className="text-center text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                  Compare plans
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Quick Actions - Takes 2 columns */}
                <section className="lg:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <QuickActionCard
                      icon="🚀"
                      title="Upload New Track"
                      description="Share your latest music"
                      onClick={() => setActiveTab("upload")}
                      primary
                    />
                    <QuickActionCard
                      icon="🎵"
                      title="Manage Tracks"
                      description="View and edit your catalog"
                      onClick={() => setActiveTab("tracks")}
                    />
                    <QuickActionCard
                      icon="📈"
                      title="View Analytics"
                      description="Track your performance"
                      onClick={() => setActiveTab("analytics")}
                    />
                  </div>
                </section>
              </div>
            </>
          )}

          {activeTab === "upload" && (
            <TrackUpload userId={user.id} onSuccess={() => { fetchStats(); setActiveTab("tracks"); }} />
          )}

          {activeTab === "tracks" && (
            <TracksList userId={user.id} />
          )}

          {activeTab === "analytics" && (
            <AnalyticsView userId={user.id} />
          )}
        </div>
      </main>
      
      {/* Custom styles for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
