"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/pressbase/client";
import toast from "react-hot-toast";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalPlays: 0,
    totalDownloads: 0,
    totalEmailOpens: 0,
    topTracks: [],
    topArtists: [],
    genreStats: [],
    recentActivity: [],
    userGrowth: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  const pb = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Get date range
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      // Fetch all analytics data
      const { data: analyticsData, error: analyticsError } = await pb
        .from("analytics")
        .select("*")
        .gte("timestamp", startDate.toISOString())
        .order("timestamp", { ascending: false });

      if (analyticsError) throw analyticsError;

      // Fetch tracks with user info
      const { data: tracks, error: tracksError } = await pb
        .from("tracks")
        .select(`
          *,
          profiles (
            full_name,
            username
          )
        `);

      if (tracksError) throw tracksError;

      // Fetch user growth data
      const { data: users, error: usersError } = await pb
        .from("profiles")
        .select("created_at, role")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (usersError) throw usersError;

      // Process analytics data
      const plays = analyticsData?.filter(event => event.event === "play") || [];
      const downloads = analyticsData?.filter(event => event.event === "download") || [];
      const emailOpens = analyticsData?.filter(event => event.event === "email_open") || [];

      // Calculate top tracks
      const trackStats = {};
      analyticsData?.forEach(event => {
        if (!trackStats[event.track_id]) {
          const track = tracks?.find(t => t.id === event.track_id);
          if (track) {
            trackStats[event.track_id] = {
              track,
              plays: 0,
              downloads: 0,
            };
          }
        }
        if (trackStats[event.track_id]) {
          if (event.event === "play") trackStats[event.track_id].plays++;
          if (event.event === "download") trackStats[event.track_id].downloads++;
        }
      });

      const topTracks = Object.values(trackStats)
        .sort((a, b) => (b.plays + b.downloads * 5) - (a.plays + a.downloads * 5))
        .slice(0, 10);

      // Calculate top artists
      const artistStats = {};
      topTracks.forEach(({ track, plays, downloads }) => {
        const artistName = track.artist_name;
        if (!artistStats[artistName]) {
          artistStats[artistName] = {
            name: artistName,
            plays: 0,
            downloads: 0,
            tracks: 0,
          };
        }
        artistStats[artistName].plays += plays;
        artistStats[artistName].downloads += downloads;
        artistStats[artistName].tracks += 1;
      });

      const topArtists = Object.values(artistStats)
        .sort((a, b) => (b.plays + b.downloads * 5) - (a.plays + a.downloads * 5))
        .slice(0, 10);

      // Calculate genre stats
      const genreStats = {};
      tracks?.forEach(track => {
        const genre = track.genre || "Unknown";
        if (!genreStats[genre]) {
          genreStats[genre] = {
            genre,
            trackCount: 0,
            plays: 0,
            downloads: 0,
          };
        }
        genreStats[genre].trackCount += 1;
        genreStats[genre].plays += track.play_count || 0;
        genreStats[genre].downloads += track.download_count || 0;
      });

      const sortedGenreStats = Object.values(genreStats)
        .sort((a, b) => b.trackCount - a.trackCount)
        .slice(0, 10);

      // Process user growth
      const dailyGrowth = {};
      users?.forEach(user => {
        const date = new Date(user.created_at).toISOString().split("T")[0];
        if (!dailyGrowth[date]) {
          dailyGrowth[date] = { date, count: 0 };
        }
        dailyGrowth[date].count += 1;
      });

      const userGrowth = Object.values(dailyGrowth).sort((a, b) => new Date(a.date) - new Date(b.date));

      // Get recent activity
      const recentActivity = analyticsData?.slice(0, 50).map(event => ({
        ...event,
        track: tracks?.find(t => t.id === event.track_id),
      })) || [];

      setAnalytics({
        totalPlays: plays.length,
        totalDownloads: downloads.length,
        totalEmailOpens: emailOpens.length,
        topTracks,
        topArtists,
        genreStats: sortedGenreStats,
        recentActivity,
        userGrowth,
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
        <h2 className="text-2xl font-semibold mb-6">Platform Analytics</h2>
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
        <h2 className="text-2xl font-semibold">Platform Analytics</h2>
        
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
              <p className="text-3xl font-bold text-blue-500">{analytics.totalPlays.toLocaleString()}</p>
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
              <p className="text-3xl font-bold text-spindeck-red">{analytics.totalDownloads.toLocaleString()}</p>
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
              <p className="text-3xl font-bold text-green-500">{analytics.totalEmailOpens.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
              {analytics.topTracks.slice(0, 5).map((item, index) => (
                <div key={item.track.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-spindeck-red rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.track.title}</p>
                    <p className="text-sm text-spindeck-gray truncate">{item.track.artist_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-blue-500">{item.plays} plays</span>
                      <span className="text-spindeck-red">{item.downloads} downloads</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Artists */}
        <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Top Artists</h3>
          {analytics.topArtists.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎤</div>
              <p className="text-spindeck-gray">No artist data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.topArtists.slice(0, 5).map((artist, index) => (
                <div key={artist.name} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-spindeck-red rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{artist.name}</p>
                    <p className="text-sm text-spindeck-gray">{artist.tracks} tracks</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-blue-500">{artist.plays} plays</span>
                      <span className="text-spindeck-red">{artist.downloads} downloads</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Genre Stats */}
      <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800 mb-8">
        <h3 className="text-lg font-semibold mb-4">Genre Distribution</h3>
        {analytics.genreStats.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎵</div>
            <p className="text-spindeck-gray">No genre data yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {analytics.genreStats.map((genre) => (
              <div key={genre.genre} className="text-center p-4 bg-gray-800 rounded-lg">
                <p className="font-medium">{genre.genre}</p>
                <p className="text-2xl font-bold text-spindeck-red mt-1">{genre.trackCount}</p>
                <p className="text-sm text-spindeck-gray">tracks</p>
                <div className="text-xs text-spindeck-gray mt-2">
                  <div>{genre.plays} plays</div>
                  <div>{genre.downloads} downloads</div>
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
            {analytics.recentActivity.slice(0, 20).map((activity, index) => (
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
  );
}