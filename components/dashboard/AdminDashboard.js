"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/pressbase/client";
import ButtonAccount from "@/components/ButtonAccount";
import BrandLogo from "@/components/BrandLogo";
import UserManagement from "./UserManagement";
import TrackApproval from "./TrackApproval";
import EmailBlastManager from "./EmailBlastManager";
import AdminAnalytics from "./AdminAnalytics";
import PlanManagement from "./PlanManagement";
import ArtistDashboard from "./ArtistDashboard";
import DJDashboard from "./DJDashboard";
import toast from "react-hot-toast";

export default function AdminDashboard({ user, profile, isPreviewOnly = false, previewRole = null }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [viewAsRole, setViewAsRole] = useState("admin");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalDJs: 0,
    pendingTracks: 0,
    approvedTracks: 0,
    rejectedTracks: 0,
    totalPlays: 0,
    totalDownloads: 0,
  });
  const [loading, setLoading] = useState(true);

  const pb = createClient();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch user stats
      const { data: users, error: usersError } = await pb
        .from("profiles")
        .select("role");

      if (usersError) throw usersError;

      // Fetch track stats
      const { data: tracks, error: tracksError } = await pb
        .from("tracks")
        .select("status, play_count, download_count");

      if (tracksError) throw tracksError;

      const totalUsers = users?.length || 0;
      const totalArtists = users?.filter(user => user.role === "artist").length || 0;
      const totalDJs = users?.filter(user => user.role === "dj").length || 0;
      
      const pendingTracks = tracks?.filter(track => track.status === "pending").length || 0;
      const approvedTracks = tracks?.filter(track => track.status === "approved").length || 0;
      const rejectedTracks = tracks?.filter(track => track.status === "rejected").length || 0;
      
      const totalPlays = tracks?.reduce((sum, track) => sum + (track.play_count || 0), 0) || 0;
      const totalDownloads = tracks?.reduce((sum, track) => sum + (track.download_count || 0), 0) || 0;

      setStats({
        totalUsers,
        totalArtists,
        totalDJs,
        pendingTracks,
        approvedTracks,
        rejectedTracks,
        totalPlays,
        totalDownloads,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error("Failed to load admin statistics");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "tracks", label: "Track Approval", icon: "🎵" },
    { id: "plans", label: "Plans", icon: "💰" },
    { id: "emails", label: "Email Blasts", icon: "📧" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  // If viewing as another role, render that dashboard
  if (viewAsRole === 'artist' && !isPreviewOnly) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Admin Preview Header */}
        <div className="bg-yellow-500/20 border-b border-yellow-500/50 text-yellow-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Admin Preview Mode:</span>
              <span>Viewing as <strong className="text-yellow-300">Artist</strong></span>
            </div>
            <button
              onClick={() => setViewAsRole('admin')}
              className="text-sm underline hover:text-yellow-100 transition-colors"
            >
              Back to Admin Dashboard
            </button>
          </div>
        </div>
        {/* Artist Dashboard */}
        <ArtistDashboard user={user} profile={{ ...profile, role: 'artist' }} />
      </div>
    );
  }
  
  if (viewAsRole === 'dj' && !isPreviewOnly) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Admin Preview Header */}
        <div className="bg-yellow-500/20 border-b border-yellow-500/50 text-yellow-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Admin Preview Mode:</span>
              <span>Viewing as <strong className="text-yellow-300">DJ</strong></span>
            </div>
            <button
              onClick={() => setViewAsRole('admin')}
              className="text-sm underline hover:text-yellow-100 transition-colors"
            >
              Back to Admin Dashboard
            </button>
          </div>
        </div>
        {/* DJ Dashboard */}
        <DJDashboard user={user} profile={{ ...profile, role: 'dj' }} />
      </div>
    );
  }

  // Otherwise, render the admin dashboard
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-spindeck-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BrandLogo />
            </div>
            <div className="flex items-center space-x-4">
              {/* Role Switcher Dropdown */}
              <div className="relative">
                <select
                  value={viewAsRole}
                  onChange={(e) => setViewAsRole(e.target.value)}
                  className="px-4 py-2 bg-spindeck-dark border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-spindeck-red appearance-none pr-8"
                >
                  <option value="admin">View as: Admin</option>
                  <option value="artist">View as: Artist</option>
                  <option value="dj">View as: DJ</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-spindeck-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                viewAsRole === 'admin' ? 'bg-spindeck-red' : 
                viewAsRole === 'artist' ? 'bg-purple-600' : 
                'bg-green-600'
              }`}>
                {viewAsRole.toUpperCase()}
              </span>
              <span className="text-sm text-spindeck-gray">
                {profile?.full_name || user.email}
              </span>
              <ButtonAccount />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-spindeck-gray">Manage users, approve tracks, and oversee platform operations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-spindeck-dark rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-spindeck-red text-white"
                  : "text-spindeck-gray hover:text-white hover:bg-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Platform Overview</h2>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-spindeck-dark rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-8 bg-gray-600 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* User Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                      <h3 className="text-sm font-medium text-spindeck-gray mb-2">Total Users</h3>
                      <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                      <h3 className="text-sm font-medium text-spindeck-gray mb-2">Artists</h3>
                      <p className="text-3xl font-bold text-blue-500">{stats.totalArtists}</p>
                    </div>
                    <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                      <h3 className="text-sm font-medium text-spindeck-gray mb-2">DJs</h3>
                      <p className="text-3xl font-bold text-green-500">{stats.totalDJs}</p>
                    </div>
                  </div>

                  {/* Track Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                      <h3 className="text-sm font-medium text-spindeck-gray mb-2">Pending Tracks</h3>
                      <p className="text-3xl font-bold text-yellow-500">{stats.pendingTracks}</p>
                    </div>
                    <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                      <h3 className="text-sm font-medium text-spindeck-gray mb-2">Approved Tracks</h3>
                      <p className="text-3xl font-bold text-green-500">{stats.approvedTracks}</p>
                    </div>
                    <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                      <h3 className="text-sm font-medium text-spindeck-gray mb-2">Rejected Tracks</h3>
                      <p className="text-3xl font-bold text-red-500">{stats.rejectedTracks}</p>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                      <h3 className="text-sm font-medium text-spindeck-gray mb-2">Total Plays</h3>
                      <p className="text-3xl font-bold text-blue-500">{stats.totalPlays.toLocaleString()}</p>
                    </div>
                    <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                      <h3 className="text-sm font-medium text-spindeck-gray mb-2">Total Downloads</h3>
                      <p className="text-3xl font-bold text-spindeck-red">{stats.totalDownloads.toLocaleString()}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Quick Actions */}
              <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab("tracks")}
                    className="flex items-center space-x-3 p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">⏳</span>
                    <div className="text-left">
                      <p className="font-medium">Review Tracks</p>
                      <p className="text-sm opacity-80">{stats.pendingTracks} pending</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">👥</span>
                    <div className="text-left">
                      <p className="font-medium">Manage Users</p>
                      <p className="text-sm opacity-80">{stats.totalUsers} total</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("emails")}
                    className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">📧</span>
                    <div className="text-left">
                      <p className="font-medium">Send Blast</p>
                      <p className="text-sm opacity-80">Email campaigns</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">📈</span>
                    <div className="text-left">
                      <p className="font-medium">View Analytics</p>
                      <p className="text-sm opacity-80">Platform insights</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <UserManagement onStatsUpdate={fetchAdminStats} />
          )}

          {activeTab === "tracks" && (
            <TrackApproval onStatsUpdate={fetchAdminStats} />
          )}

          {activeTab === "plans" && (
            <PlanManagement />
          )}

          {activeTab === "emails" && (
            <EmailBlastManager />
          )}

          {activeTab === "analytics" && (
            <AdminAnalytics />
          )}
        </div>
      </div>
    </div>
  );
}