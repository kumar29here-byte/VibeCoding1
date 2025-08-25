import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import FloatingEmojis from "@/components/floating-emojis";
import MoodPieChart from "@/components/charts/mood-pie-chart";
import TrendChart from "@/components/charts/trend-chart";
import LiveMoodFeed from "@/components/live-mood-feed";
import MoodHeatmap from "@/components/mood-heatmap";
import { Button } from "@/components/ui/button";
import { MoodSubmission } from "@shared/schema";

export default function Dashboard() {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch mood submissions
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<MoodSubmission[]>({
    queryKey: ["/api/moods"],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  // Fetch mood statistics
  const { data: stats, isLoading: statsLoading } = useQuery<{
    superHappy: number;
    happy: number;
    neutral: number;
    anxious: number;
    sad: number;
    total: number;
  }>({
    queryKey: ["/api/moods/stats"],
    refetchInterval: 5000,
  });

  // Update timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExport = async () => {
    try {
      const response = await fetch('/api/moods/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mood-submissions.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  if (submissionsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const defaultStats = {
    superHappy: 0,
    happy: 0,
    neutral: 0,
    anxious: 0,
    sad: 0,
    total: 0,
  };

  const moodStats = stats || defaultStats;
  const secondsAgo = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);

  return (
    <div className="min-h-screen">
      {/* Floating Emojis Background */}
      <FloatingEmojis />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎭</div>
              <h1 className="text-xl font-bold text-gray-900">Mood Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium" data-testid="link-home">
                  📝 Submit Mood
                </Button>
              </Link>
              <Button 
                onClick={handleExport}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium"
                data-testid="button-export-csv"
              >
                📤 Export CSV
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="text-8xl mb-4 animate-bounce-gentle">📊</div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-teal-500 bg-clip-text text-transparent mb-4">
              Live Mood Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-6">Real-time participant feedback ✨</p>
            <div className="inline-flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-2xl border border-white/50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">Live Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" data-testid="total-submissions">
                  {moodStats.total}
                </span>
                <span className="text-sm text-gray-600 font-medium">submissions</span>
              </div>
              <div className="text-sm text-gray-500 font-medium" data-testid="last-update">
                Updated {secondsAgo}s ago
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Mood Distribution Pie Chart */}
            <div className="lg:col-span-1">
              <MoodPieChart data={moodStats} />
            </div>

            {/* Live Emoji Feed */}
            <div className="lg:col-span-1">
              <LiveMoodFeed submissions={submissions} />
            </div>

            {/* Mood Heatmap Grid */}
            <div className="lg:col-span-1">
              <MoodHeatmap submissions={submissions} />
            </div>
          </div>

          {/* Trend Chart */}
          <TrendChart submissions={submissions} />

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-12">
            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="text-5xl mb-2">🤩</div>
              <div className="text-4xl font-bold mb-1" data-testid="count-super-happy">{moodStats.superHappy}</div>
              <div className="text-sm font-semibold opacity-90">Super Happy</div>
            </div>
            <div className="bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="text-5xl mb-2">😊</div>
              <div className="text-4xl font-bold mb-1" data-testid="count-happy">{moodStats.happy}</div>
              <div className="text-sm font-semibold opacity-90">Happy</div>
            </div>
            <div className="bg-gradient-to-br from-slate-400 via-gray-400 to-zinc-400 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="text-5xl mb-2">😐</div>
              <div className="text-4xl font-bold mb-1" data-testid="count-neutral">{moodStats.neutral}</div>
              <div className="text-sm font-semibold opacity-90">Neutral</div>
            </div>
            <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="text-5xl mb-2">😰</div>
              <div className="text-4xl font-bold mb-1" data-testid="count-anxious">{moodStats.anxious}</div>
              <div className="text-sm font-semibold opacity-90">Anxious</div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="text-5xl mb-2">😢</div>
              <div className="text-4xl font-bold mb-1" data-testid="count-sad">{moodStats.sad}</div>
              <div className="text-sm font-semibold opacity-90">Sad</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            🎭 Mood Dashboard - Capturing the vibe of your event in real-time
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Privacy-focused • Anonymous dashboard • Secure data handling
          </p>
        </div>
      </footer>
    </div>
  );
}
