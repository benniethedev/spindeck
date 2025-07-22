"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";

export default function AnalyticsView({ userId }) {
  const [analytics, setAnalytics] = useState({
    totalPlays: 0,
    totalDownloads: 0,
    totalEmailOpens: 0,
    topTracks: [],
    recentActivity: [],
    dailyStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  const supabase = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, [userId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Get date range
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      // Fetch tracks for this user
      const { data: tracks, error: tracksError } = await supabase
        .from("tracks")
        .select("id, title, artist_name, play_count, download_count")
        .eq("user_id", userId);

      if (tracksError) throw tracksError;

      const trackIds = tracks?.map(track => track.id) || [];

      // Fetch analytics data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from("analytics")
        .select("*")
        .in("track_id", trackIds)
        .gte("timestamp", startDate.toISOString())
        .order("timestamp", { ascending: false });

      if (analyticsError) throw analyticsError;

      // Process analytics data
      const plays = analyticsData?.filter(event => event.event === "play") || [];
      const downloads = analyticsData?.filter(event => event.event === "download") || [];
      const emailOpens = analyticsData?.filter(event => event.event === "email_open") || [];

      // Calculate daily stats
      const dailyStats = {};
      analyticsData?.forEach(event => {
        const date = new Date(event.timestamp).toISOString().split("T")[0];
        if (!dailyStats[date]) {
          dailyStats[date] = { plays: 0, downloads: 0, date };
        }
        if (event.event === "play") dailyStats[date].plays++;
        if (event.event === "download") dailyStats[date].downloads++;
      });

      // Get top tracks by performance
      const topTracks = tracks
        ?.map(track => ({
          ...track,
          totalEngagement: (track.play_count || 0) + (track.download_count || 0) * 5, // Weight downloads more
        }))
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 5) || [];

      // Get recent activity
      const recentActivity = analyticsData?.slice(0, 20).map(event => ({
        ...event,
        track: tracks?.find(t => t.id === event.track_id),
      })) || [];

      setAnalytics({
        totalPlays: plays.length,
        totalDownloads: downloads.length,
        totalEmailOpens: emailOpens.length,
        topTracks,
        recentActivity,
        dailyStats: Object.values(dailyStats).sort((a, b) => new Date(a.date) - new Date(b.date)),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (event) => {
    switch (event) {
      case "play":
        return "▶️";
      case "download":
        return "⬇️";
      case "email_open":
        return "📧";
      default:
        return "📊";
    }
  };

  const getEventColor = (event) => {
    switch (event) {
      case "play":
        return "text-blue-500";
      case "download":
        return "text-spindeck-red";
      case "email_open":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 animate-pulse">
              <div className="h-4 bg-gray-600 rounded mb-2 w-1/2"></div>
              <div className="h-8 bg-gray-600 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Analytics</h2>
        
        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 bg-spindeck-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <span className="text-2xl">▶️</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-spindeck-gray">Total Plays</h3>
              <p className="text-3xl font-bold text-blue-500">{analytics.totalPlays}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <span className="text-2xl">⬇️</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-spindeck-gray">Total Downloads</h3>
              <p className="text-3xl font-bold text-spindeck-red">{analytics.totalDownloads}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <span className="text-2xl">📧</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-spindeck-gray">Email Opens</h3>
              <p className="text-3xl font-bold text-green-500">{analytics.totalEmailOpens}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Tracks */}
        <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Top Performing Tracks</h3>
          {analytics.topTracks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-spindeck-gray">No track performance data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.topTracks.map((track, index) => (
                <div key={track.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-spindeck-red rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-sm text-spindeck-gray truncate">{track.artist_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-blue-500">{track.play_count || 0} plays</span>
                      <span className="text-spindeck-red">{track.download_count || 0} downloads</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {analytics.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-spindeck-gray">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <span className="text-lg">{getEventIcon(activity.event)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">
                      <span className={getEventColor(activity.event)}>
                        {activity.event === "play" ? "Played" : 
                         activity.event === "download" ? "Downloaded" : "Email opened"}
                      </span>
                      {activity.track && (
                        <span className="text-white"> "{activity.track.title}"</span>
                      )}
                    </p>
                    <p className="text-spindeck-gray">
                      {new Date(activity.timestamp).toLocaleDateString()} at{" "}
                      {new Date(activity.timestamp).toLocaleTimeString([], { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Chart (Simple Bar Chart) */}
      {analytics.dailyStats.length > 0 && (
        <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 mt-8">
          <h3 className="text-lg font-semibold mb-4">Daily Activity</h3>
          <div className="grid grid-cols-7 md:grid-cols-14 lg:grid-cols-21 xl:grid-cols-30 gap-1">
            {analytics.dailyStats.slice(-30).map((day, index) => {
              const maxActivity = Math.max(...analytics.dailyStats.map(d => d.plays + d.downloads));
              const height = maxActivity > 0 ? ((day.plays + day.downloads) / maxActivity) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-full bg-spindeck-red rounded-sm mb-1 min-h-[2px]"
                    style={{ height: `${Math.max(height, 2)}px` }}
                    title={`${day.date}: ${day.plays} plays, ${day.downloads} downloads`}
                  ></div>
                  <div className="text-xs text-spindeck-gray transform rotate-45 origin-bottom-left">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}