import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const moodOptions = [
  { 
    id: "super-happy", 
    emoji: "🤩", 
    label: "Super Happy", 
    gradient: "bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300",
    border: "hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-200",
    glow: "hover:ring-4 hover:ring-yellow-200"
  },
  { 
    id: "happy", 
    emoji: "😊", 
    label: "Happy", 
    gradient: "bg-gradient-to-br from-green-300 via-emerald-300 to-teal-300",
    border: "hover:border-green-400 hover:shadow-lg hover:shadow-green-200",
    glow: "hover:ring-4 hover:ring-green-200"
  },
  { 
    id: "neutral", 
    emoji: "😐", 
    label: "Neutral", 
    gradient: "bg-gradient-to-br from-slate-200 via-gray-200 to-zinc-200",
    border: "hover:border-gray-400 hover:shadow-lg hover:shadow-gray-200",
    glow: "hover:ring-4 hover:ring-gray-200"
  },
  { 
    id: "anxious", 
    emoji: "😰", 
    label: "Anxious", 
    gradient: "bg-gradient-to-br from-pink-300 via-rose-300 to-red-300",
    border: "hover:border-pink-400 hover:shadow-lg hover:shadow-pink-200",
    glow: "hover:ring-4 hover:ring-pink-200"
  },
  { 
    id: "sad", 
    emoji: "😢", 
    label: "Sad", 
    gradient: "bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300",
    border: "hover:border-blue-400 hover:shadow-lg hover:shadow-blue-200",
    glow: "hover:ring-4 hover:ring-blue-200"
  },
];

export default function MoodSubmissionForm() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitMoodMutation = useMutation({
    mutationFn: async (data: { mood: string; name?: string; email?: string; consent: boolean }) => {
      const response = await apiRequest("POST", "/api/moods", data);
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/moods/stats"] });
      
      // Reset form after 1 second
      setTimeout(() => {
        setSelectedMood("");
        setName("");
        setEmail("");
        setConsent(false);
      }, 1000);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      toast({
        title: "Success!",
        description: "Your mood has been recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit mood. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please agree to the privacy terms before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitMoodMutation.mutate({
      mood: selectedMood,
      name: name || undefined,
      email: email || undefined,
      consent,
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 animate-fade-in relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-3">How are you feeling?</h2>
        <p className="text-gray-600 text-lg">Share your mood to help us understand the event vibe</p>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {moodOptions.map((mood) => (
          <div
            key={mood.id}
            className={`mood-option ${mood.gradient} rounded-2xl p-6 text-center cursor-pointer border-2 transition-all duration-300 transform ${
              selectedMood === mood.id 
                ? "ring-4 ring-purple-400 border-purple-400 scale-105 shadow-xl" 
                : `border-transparent ${mood.border} ${mood.glow} hover:scale-110`
            }`}
            onClick={() => setSelectedMood(mood.id)}
            data-testid={`mood-option-${mood.id}`}
          >
            <div className="text-6xl mb-3 transform transition-transform duration-300 group-hover:scale-110">{mood.emoji}</div>
            <div className="text-sm font-semibold text-gray-800">{mood.label}</div>
          </div>
        ))}
      </div>

      {/* Optional Information */}
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name (Optional)
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2"
            data-testid="input-name"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email (Optional)
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
            data-testid="input-email"
          />
        </div>
      </div>

      {/* Privacy Consent */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked as boolean)}
            data-testid="checkbox-consent"
          />
          <Label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
            I consent to sharing my mood anonymously on the live dashboard. Personal information (name/email) will be kept private and only used for event analytics.
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={submitMoodMutation.isPending}
        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 hover:from-purple-600 hover:via-pink-600 hover:to-teal-600 text-white font-bold py-6 px-8 rounded-2xl transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        data-testid="button-submit-mood"
      >
        {submitMoodMutation.isPending ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>✨</span>
            <span>Share My Mood</span>
            <span>🚀</span>
          </div>
        )}
      </Button>

      {/* Success Message */}
      {showSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-slide-up" data-testid="success-message">
          <div className="flex items-center space-x-2">
            <div className="text-green-500 text-xl">✅</div>
            <div className="text-green-800 font-medium">Thank you! Your mood has been recorded.</div>
          </div>
        </div>
      )}
    </div>
  );
}
