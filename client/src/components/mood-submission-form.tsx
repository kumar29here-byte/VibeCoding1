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
    gradient: "bg-gradient-to-b from-yellow-100 to-yellow-200",
    border: "hover:border-yellow-400"
  },
  { 
    id: "happy", 
    emoji: "😊", 
    label: "Happy", 
    gradient: "bg-gradient-to-b from-green-100 to-green-200",
    border: "hover:border-green-400"
  },
  { 
    id: "neutral", 
    emoji: "😐", 
    label: "Neutral", 
    gradient: "bg-gradient-to-b from-gray-100 to-gray-200",
    border: "hover:border-gray-400"
  },
  { 
    id: "anxious", 
    emoji: "😰", 
    label: "Anxious", 
    gradient: "bg-gradient-to-b from-pink-100 to-pink-200",
    border: "hover:border-pink-400"
  },
  { 
    id: "sad", 
    emoji: "😢", 
    label: "Sad", 
    gradient: "bg-gradient-to-b from-blue-100 to-blue-200",
    border: "hover:border-blue-400"
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
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">How are you feeling?</h2>
        <p className="text-gray-600">Share your mood to help us understand the event vibe</p>
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {moodOptions.map((mood) => (
          <div
            key={mood.id}
            className={`mood-option ${mood.gradient} rounded-xl p-4 text-center cursor-pointer border-2 transition-all ${
              selectedMood === mood.id 
                ? "ring-4 ring-purple-400 border-purple-400" 
                : `border-transparent ${mood.border}`
            }`}
            onClick={() => setSelectedMood(mood.id)}
            data-testid={`mood-option-${mood.id}`}
          >
            <div className="text-5xl mb-2">{mood.emoji}</div>
            <div className="text-sm font-medium text-gray-700">{mood.label}</div>
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
        className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="button-submit-mood"
      >
        {submitMoodMutation.isPending ? "Submitting..." : "✨ Share My Mood"}
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
