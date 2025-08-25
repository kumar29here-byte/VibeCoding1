import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Chart: any;
  }
}

interface MoodPieChartProps {
  data: {
    superHappy: number;
    happy: number;
    neutral: number;
    anxious: number;
    sad: number;
    total: number;
  };
}

export default function MoodPieChart({ data }: MoodPieChartProps) {
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
  }, [data]);

  const initChart = () => {
    if (chartRef.current && window.Chart) {
      const ctx = chartRef.current.getContext('2d');
      
      chartInstanceRef.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Super Happy', 'Happy', 'Neutral', 'Anxious', 'Sad'],
          datasets: [{
            data: [data.superHappy, data.happy, data.neutral, data.anxious, data.sad],
            backgroundColor: ['#F59E0B', '#10B981', '#94A3B8', '#FB7185', '#60A5FA'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  };

  const updateChart = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.datasets[0].data = [
        data.superHappy, 
        data.happy, 
        data.neutral, 
        data.anxious, 
        data.sad
      ];
      chartInstanceRef.current.update();
    }
  };

  const getPercentage = (value: number) => {
    if (data.total === 0) return 0;
    return Math.round((value / data.total) * 100);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300">
      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center justify-center">
        <span className="text-2xl mr-2">📊</span>
        Mood Distribution
      </h3>
      <div className="relative h-64">
        <canvas ref={chartRef} data-testid="mood-pie-chart"></canvas>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span data-testid="stat-super-happy">{getPercentage(data.superHappy)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span data-testid="stat-happy">{getPercentage(data.happy)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span data-testid="stat-neutral">{getPercentage(data.neutral)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
          <span data-testid="stat-anxious">{getPercentage(data.anxious)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span data-testid="stat-sad">{getPercentage(data.sad)}%</span>
        </div>
      </div>
    </div>
  );
}
