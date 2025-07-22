"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import ButtonAccount from "@/components/ButtonAccount";
import UserManagement from "./UserManagement";
import TrackApproval from "./TrackApproval";
import EmailBlastManager from "./EmailBlastManager";
import AdminAnalytics from "./AdminAnalytics";
import toast from "react-hot-toast";

export default function AdminDashboard({ user, profile }) {
  const [activeTab, setActiveTab] = useState("overview");
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

  const supabase = createClient();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch user stats
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("role");

      if (usersError) throw usersError;

      // Fetch track stats
      const { data: tracks, error: tracksError } = await supabase
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
    { id: "emails", label: "Email Blasts", icon: "📧" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-spindeck-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="SpinDeck Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-2 py-1 bg-spindeck-red text-xs font-medium rounded-full">
                ADMIN
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