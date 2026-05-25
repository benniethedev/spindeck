"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/pressbase/client";
import toast from "react-hot-toast";

// Stat card component
const MetricCard = ({ icon, label, value, color, description }) => (
  <div className="group relative bg-gradient-to-br from-spindeck-dark to-black rounded-xl p-6 border border-gray-800/50 hover:border-gray-700 transition-all duration-300 overflow-hidden">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${
      color === 'blue' ? 'from-blue-500' : 
      color === 'red' ? 'from-spindeck-red' : 
      color === 'green' ? 'from-green-500' : 
      'from-white'
    } to-transparent`} />
    
    <div className="relative">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          color === 'blue' ? 'bg-blue-500/10' : 
          color === 'red' ? 'bg-red-500/10' : 
          color === 'green' ? 'bg-green-500/10' : 
          'bg-gray-800'
        }`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-4xl font-bold tracking-tight ${
        color === 'blue' ? 'text-blue-400' : 
        color === 'red' ? 'text-spindeck-red' : 
        color === 'green' ? 'text-green-400' : 
        'text-white'
      }`}>
        {value.toLocaleString()}
      </p>
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  </div>
);

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

  const pb = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, [userId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const { data: tracks, error: tracksError } = await pb
        .from("tracks")
        .select("id, title, artist_name, play_count, download_count")
        .eq("user_id", userId);

      if (tracksError) throw tracksError;

      const trackIds = tracks?.map(track => track.id) || [];

      const { data: analyticsData, error: analyticsError } = await pb
        .from("analytics")
        .select("*")
        .in("track_id", trackIds)
        .gte("timestamp", startDate.toISOString())
        .order("timestamp", { ascending: false });

      if (analyticsError) throw analyticsError;

      const plays = analyticsData?.filter(event => event.event === "play") || [];
      const downloads = analyticsData?.filter(event => event.event === "download") || [];
      const emailOpens = analyticsData?.filter(event => event.event === "email_open") || [];

      const dailyStats = {};
      analyticsData?.forEach(event => {
        const date = new Date(event.timestamp).toISOString().split("T")[0];
        if (!dailyStats[date]) {
          dailyStats[date] = { plays: 0, downloads: 0, date };
        }
        if (event.event === "play") dailyStats[date].plays++;
        if (event.event === "download") dailyStats[date].downloads++;
      });

      const topTracks = tracks
        ?.map(track => ({
          ...track,
          totalEngagement: (track.play_count || 0) + (track.download_count || 0) * 5,
        }))
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 5) || [];

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

  const getEventConfig = (event) => {
    switch (event) {
      case "play":
        return { icon: "▶️", color: "text-blue-400", label: "Played" };
      case "download":
        return { icon: "⬇️", color: "text-spindeck-red", label: "Downloaded" };
      case "email_open":
        return { icon: "📧", color: "text-green-400", label: "Email opened" };
      default:
        return { icon: "📊", color: "text-gray-400", label: event };
    }
  };

  const timeRangeOptions = [
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "90", label: "90 days" },
    { value: "365", label: "1 year" },
  ];

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-40 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-spindeck-dark rounded-xl p-6 border border-gray-800/50 animate-pulse">
              <div className="w-12 h-12 bg-gray-700 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-10 bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Time Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-gray-500">
          Showing data for the last <span className="text-white font-medium">{timeRange} days</span>
        </p>
        
        <div className="flex items-center gap-1 p-1 bg-spindeck-dark rounded-lg border border-gray-800/50">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeRange === option.value
                  ? "bg-spindeck-red text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard 
          icon="▶️" 
          label="Total Plays" 
          value={analytics.totalPlays} 
          color="blue"
          description={`In the last ${timeRange} days`}
        />
        <MetricCard 
          icon="⬇️" 
          label="Total Downloads" 
          value={analytics.totalDownloads} 
          color="red"
          description={`In the last ${timeRange} days`}
        />
        <MetricCard 
          icon="📧" 
          label="Email Opens" 
          value={analytics.totalEmailOpens} 
          color="green"
          description="From your email campaigns"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Tracks */}
        <div className="bg-spindeck-dark rounded-xl border border-gray-800/50 overflow-hidden">
          <div className="p-6 border-b border-gray-800/50">
            <h3 className="text-lg font-semibold">Top Performing Tracks</h3>
            <p className="text-sm text-gray-500">Ranked by engagement score</p>
          </div>
          
          {analytics.topTracks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">📈</span>
              </div>
              <p className="text-gray-500">No track performance data yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              {analytics.topTracks.map((track, index) => (
                <div key={track.id} className="flex items-center gap-4 p-4 hover:bg-black/20 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-sm text-gray-500 truncate">{track.artist_name}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <span className="text-blue-400 font-medium">{track.play_count || 0}</span>
                      <span className="text-gray-500 ml-1">plays</span>
                    </div>
                    <div className="text-right">
                      <span className="text-spindeck-red font-medium">{track.download_count || 0}</span>
                      <span className="text-gray-500 ml-1">DLs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-spindeck-dark rounded-xl border border-gray-800/50 overflow-hidden">
          <div className="p-6 border-b border-gray-800/50">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <p className="text-sm text-gray-500">Latest engagement on your tracks</p>
          </div>
          
          {analytics.recentActivity.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🎯</span>
              </div>
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-800/30">
              {analytics.recentActivity.map((activity, index) => {
                const config = getEventConfig(activity.event);
                return (
                  <div key={index} className="flex items-center gap-3 px-6 py-4 hover:bg-black/20 transition-colors">
                    <span className="text-xl flex-shrink-0">{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className={config.color}>{config.label}</span>
                        {activity.track && (
                          <span className="text-white"> "{activity.track.title}"</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Activity Chart */}
      {analytics.dailyStats.length > 0 && (
        <div className="bg-spindeck-dark rounded-xl border border-gray-800/50 overflow-hidden">
          <div className="p-6 border-b border-gray-800/50">
            <h3 className="text-lg font-semibold">Daily Activity</h3>
            <p className="text-sm text-gray-500">Plays and downloads over time</p>
          </div>
          
          <div className="p-6">
            {/* Legend */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Plays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-spindeck-red rounded-full"></div>
                <span className="text-sm text-gray-400">Downloads</span>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="h-48 flex items-end gap-1">
              {analytics.dailyStats.slice(-30).map((day, index) => {
                const maxActivity = Math.max(
                  ...analytics.dailyStats.map(d => Math.max(d.plays, d.downloads * 3))
                );
                const playHeight = maxActivity > 0 ? (day.plays / maxActivity) * 100 : 0;
                const downloadHeight = maxActivity > 0 ? ((day.downloads * 3) / maxActivity) * 100 : 0;
                
                return (
                  <div 
                    key={index} 
                    className="flex-1 flex flex-col items-center gap-1 group"
                    title={`${day.date}: ${day.plays} plays, ${day.downloads} downloads`}
                  >
                    <div className="w-full flex flex-col gap-0.5 h-40 justify-end">
                      {/* Plays bar */}
                      <div 
                        className="w-full bg-blue-500/80 rounded-t-sm transition-all duration-300 group-hover:bg-blue-400"
                        style={{ height: `${Math.max(playHeight, 2)}%` }}
                      ></div>
                      {/* Downloads bar */}
                      <div 
                        className="w-full bg-spindeck-red/80 rounded-b-sm transition-all duration-300 group-hover:bg-red-400"
                        style={{ height: `${Math.max(downloadHeight, day.downloads > 0 ? 4 : 0)}%` }}
                      ></div>
                    </div>
                    {/* Date label - show only some */}
                    {(index % Math.ceil(analytics.dailyStats.slice(-30).length / 7) === 0 || index === analytics.dailyStats.slice(-30).length - 1) && (
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty state for chart */}
      {analytics.dailyStats.length === 0 && (
        <div className="bg-spindeck-dark rounded-xl p-12 text-center border border-gray-800/50">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No activity data yet</h3>
          <p className="text-gray-500">Activity will appear here once your tracks get plays and downloads</p>
        </div>
      )}
    </div>
  );
}
