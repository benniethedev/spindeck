"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import ButtonAccount from "@/components/ButtonAccount";
import BrandLogo from "@/components/BrandLogo";
import TrackUpload from "./TrackUpload";
import TracksList from "./TracksList";
import AnalyticsView from "./AnalyticsView";
import toast from "react-hot-toast";

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

  const supabase = createClient();

  useEffect(() => {
    fetchStats();
    fetchPlanInfo();
  }, [user.id]);

  const fetchStats = async () => {
    try {
      // First ensure user has a profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: createError } = await supabase
          .from("profiles")
          .insert([{ 
            id: user.id, 
            role: 'artist',
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null
          }]);
        
        if (createError) {
          console.error("Error creating profile:", createError);
        }
      }

      // Fetch track stats
      const { data: tracks, error: tracksError } = await supabase
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
      console.error("Error details:", error.message, error.code, error.details);
      toast.error("Failed to load statistics");
      
      // Set default stats to prevent UI issues
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
      // Get user's current plan
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("plan_id")
        .eq("id", user.id)
        .single();

      if (profile?.plan_id) {
        // Get plan details
        const { data: plan, error: planError } = await supabase
          .from("plans")
          .select("*")
          .eq("id", profile.plan_id)
          .single();

        if (plan) {
          setPlanInfo(plan);
        }
      } else {
        // User doesn't have a plan - show default/free tier
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
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "upload", label: "Upload Track", icon: "⬆️" },
    { id: "tracks", label: "My Tracks", icon: "🎵" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

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
              <span className="text-sm text-spindeck-gray">
                Welcome, {profile?.full_name || user.email}
              </span>
              <ButtonAccount />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Artist Dashboard</h1>
          <p className="text-spindeck-gray">Manage your music, track performance, and grow your audience</p>
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
              <h2 className="text-2xl font-semibold mb-6">Overview</h2>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-spindeck-dark rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-8 bg-gray-600 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                    <h3 className="text-sm font-medium text-spindeck-gray mb-2">Total Tracks</h3>
                    <p className="text-3xl font-bold text-white">{stats.totalTracks}</p>
                  </div>
                  <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                    <h3 className="text-sm font-medium text-spindeck-gray mb-2">Approved</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.approvedTracks}</p>
                  </div>
                  <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                    <h3 className="text-sm font-medium text-spindeck-gray mb-2">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-500">{stats.pendingTracks}</p>
                  </div>
                  <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                    <h3 className="text-sm font-medium text-spindeck-gray mb-2">Total Plays</h3>
                    <p className="text-3xl font-bold text-blue-500">{stats.totalPlays}</p>
                  </div>
                  <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                    <h3 className="text-sm font-medium text-spindeck-gray mb-2">Downloads</h3>
                    <p className="text-3xl font-bold text-spindeck-red">{stats.totalDownloads}</p>
                  </div>
                </div>
              )}

              {/* Plan Information */}
              {planInfo && (
                <div className="bg-gradient-to-r from-spindeck-red/10 to-red-700/10 rounded-lg p-6 border border-spindeck-red/20 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Current Plan: <span className="text-spindeck-red">{planInfo.name}</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-spindeck-gray">Monthly Tracks:</span>
                          <span className="ml-2 font-medium">
                            {planInfo.features?.tracks_per_month === "unlimited" 
                              ? "Unlimited" 
                              : planInfo.features?.tracks_per_month || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-spindeck-gray">Email Blasts:</span>
                          <span className="ml-2 font-medium">
                            {planInfo.features?.email_blasts === "unlimited" 
                              ? "Unlimited" 
                              : planInfo.features?.email_blasts || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-spindeck-gray">Analytics:</span>
                          <span className="ml-2 font-medium">
                            {planInfo.features?.analytics ? "✅ Enabled" : "❌ Disabled"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {planInfo.name === "Free" ? (
                        <Link href="/pricing" className="btn btn-primary bg-spindeck-red hover:bg-red-600 border-none">
                          Upgrade Plan
                        </Link>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold text-spindeck-red">${planInfo.price}</p>
                          <p className="text-sm text-spindeck-gray">
                            {planInfo.features?.duration === "one_time" ? "One-time" : "per month"}
                          </p>
                          <Link href="/pricing" className="btn btn-outline btn-sm mt-2 border-spindeck-red text-spindeck-red hover:bg-spindeck-red hover:text-white">
                            Manage Plan
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Usage indicators */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tracks Used This Month</span>
                        <span>{stats.totalTracks} / {planInfo.features?.tracks_per_month === "unlimited" ? "∞" : planInfo.features?.tracks_per_month || 0}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-spindeck-red h-2 rounded-full" 
                          style={{
                            width: planInfo.features?.tracks_per_month === "unlimited" 
                              ? "0%" 
                              : `${Math.min(100, (stats.totalTracks / (planInfo.features?.tracks_per_month || 1)) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Plan Status</span>
                        <span className="text-green-500">Active</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="flex items-center space-x-3 p-4 bg-spindeck-red hover:bg-red-600 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">⬆️</span>
                    <div className="text-left">
                      <p className="font-medium">Upload New Track</p>
                      <p className="text-sm opacity-80">Share your latest music</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("tracks")}
                    className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">🎵</span>
                    <div className="text-left">
                      <p className="font-medium">Manage Tracks</p>
                      <p className="text-sm opacity-80">View and edit your music</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">📈</span>
                    <div className="text-left">
                      <p className="font-medium">View Analytics</p>
                      <p className="text-sm opacity-80">Track your performance</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
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
      </div>
    </div>
  );
}