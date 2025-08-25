import { useEffect, useRef } from "react";
import { MoodSubmission } from "@shared/schema";

declare global {
  interface Window {
    Chart: any;
  }
}

interface TrendChartProps {
  submissions: MoodSubmission[];
}

export default function TrendChart({ submissions }: TrendChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Chart.js library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      initChart();
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (window.Chart && chartInstanceRef.current) {
      updateChart();
    }
  }, [submissions]);

  const processDataForChart = () => {
    // Group submissions by 15-minute intervals
    const intervals: Record<string, Record<string, number>> = {};
    const now = new Date();
    const labels: string[] = [];

    // Generate time labels for the last 2 hours
    for (let i = 7; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 15 * 60 * 1000);
      const label = time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      labels.push(label);
      intervals[label] = {
        'super-happy': 0,
        'happy': 0,
        'neutral': 0,
        'anxious': 0,
        'sad': 0,
      };
    }

    // Count submissions in each interval
    submissions.forEach(submission => {
      const submissionTime = new Date(submission.timestamp);
      const intervalIndex = Math.floor((now.getTime() - submissionTime.getTime()) / (15 * 60 * 1000));
      
      if (intervalIndex >= 0 && intervalIndex < 8) {
        const labelIndex = 7 - intervalIndex;
        const label = labels[labelIndex];
        if (intervals[label] && intervals[label][submission.mood] !== undefined) {
          intervals[label][submission.mood]++;
        }
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Super Happy',
          data: labels.map(label => intervals[label]['super-happy']),
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4
        },
        {
          label: 'Happy', 
          data: labels.map(label => intervals[label]['happy']),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Neutral',
          data: labels.map(label => intervals[label]['neutral']),
          borderColor: '#94A3B8',
          backgroundColor: 'rgba(148, 163, 184, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const initChart = () => {
    if (chartRef.current && window.Chart) {
      const ctx = chartRef.current.getContext('2d');
      const chartData = processDataForChart();
      
      chartInstanceRef.current = new window.Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  };

  const updateChart = () => {
    if (chartInstanceRef.current) {
      const chartData = processDataForChart();
      chartInstanceRef.current.data = chartData;
      chartInstanceRef.current.update();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300">
      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center justify-center">
        <span className="text-2xl mr-2">📈</span>
        Mood Trends Over Time
      </h3>
      <div className="h-64">
        <canvas ref={chartRef} data-testid="trend-chart"></canvas>
      </div>
    </div>
  );
}
