import { useState } from "react";
import { Link } from "wouter";
import FloatingEmojis from "@/components/floating-emojis";
import QRCodeGenerator from "@/components/qr-code-generator";
import MoodSubmissionForm from "@/components/mood-submission-form";
import { Button } from "@/components/ui/button";

export default function Home() {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

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
              <Link href="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium" data-testid="link-dashboard">
                  📊 View Dashboard
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* QR Code Section */}
          <QRCodeGenerator url={currentUrl} />

          {/* Mood Submission Form */}
          <MoodSubmissionForm />
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
