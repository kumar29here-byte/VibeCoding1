import { MoodSubmission } from "@shared/schema";

interface MoodHeatmapProps {
  submissions: MoodSubmission[];
}

const moodIntensity: Record<string, number> = {
  'super-happy': 5,
  'happy': 4,
  'neutral': 2,
  'anxious': 3,
  'sad': 1,
};

const intensityColors = [
  'bg-gray-100', // 0
  'bg-blue-200', // 1
  'bg-gray-200', // 2
  'bg-pink-200', // 3
  'bg-green-200', // 4
  'bg-yellow-400', // 5
];

export default function MoodHeatmap({ submissions }: MoodHeatmapProps) {
  // Create a 8x8 grid representing recent mood intensity
  const generateHeatmapData = () => {
    const gridSize = 64; // 8x8
    const grid: number[] = [];
    
    // Initialize with neutral intensity
    for (let i = 0; i < gridSize; i++) {
      grid.push(2);
    }
    
    // Map recent submissions to grid positions
    const recentSubmissions = submissions.slice(0, gridSize);
    recentSubmissions.forEach((submission, index) => {
      if (index < gridSize) {
        grid[index] = moodIntensity[submission.mood] || 2;
      }
    });
    
    return grid;
  };

  const heatmapData = generateHeatmapData();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all duration-300">
      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center justify-center">
        <span className="text-2xl mr-2">🔥</span>
        Mood Intensity
      </h3>
      <div className="grid grid-cols-8 gap-1 h-64" data-testid="mood-heatmap">
        {heatmapData.map((intensity, index) => (
          <div
            key={index}
            className={`${intensityColors[intensity]} rounded aspect-square transition-colors duration-300`}
            data-testid={`heatmap-cell-${index}`}
            title={`Intensity: ${intensity}`}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
