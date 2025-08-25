import { MoodSubmission } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface LiveMoodFeedProps {
  submissions: MoodSubmission[];
}

const moodEmojis: Record<string, string> = {
  'super-happy': '🤩',
  'happy': '😊',
  'neutral': '😐',
  'anxious': '😰',
  'sad': '😢',
};

export default function LiveMoodFeed({ submissions }: LiveMoodFeedProps) {
  const recentSubmissions = submissions.slice(0, 10);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🎭 Live Mood Feed
      </h3>
      <div className="space-y-3 h-64 overflow-y-auto" data-testid="live-mood-feed">
        {recentSubmissions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📭</div>
            <p>No mood submissions yet</p>
          </div>
        ) : (
          recentSubmissions.map((submission, index) => (
            <div
              key={submission.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`mood-feed-item-${index}`}
            >
              <div className="text-2xl">{moodEmojis[submission.mood] || '😐'}</div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(submission.timestamp), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
