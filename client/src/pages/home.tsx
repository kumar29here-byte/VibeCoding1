import { useState } from "react";
import { Link } from "wouter";
import FloatingEmojis from "@/components/floating-emojis";
import QRCodeGenerator from "@/components/qr-code-generator";
import MoodSubmissionForm from "@/components/mood-submission-form";
import { Button } from "@/components/ui/button";
import vendastaLogo from "@assets/5f0ae6b5d0e3720001a31e00-198x149-1x_1756147904599.webp";

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
              <img 
                src={vendastaLogo} 
                alt="Vendasta" 
                className="h-8 w-8"
                data-testid="nav-vendasta-logo"
              />
              <h1 className="text-xl font-bold text-gray-900">VENDASTA</h1>
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

      {/* Hero Section */}
      <div className="pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="text-center mb-12 animate-fade-in">
            {/* Event Name */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Ideas on Tap
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-teal-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="text-8xl mb-4 animate-bounce-gentle">🎭</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-teal-500 bg-clip-text text-transparent mb-4">
              Share Your Vibe!
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Help us capture the energy of this moment. Your mood matters! ✨
            </p>
          </div>

          {/* Mood Submission Form */}
          <MoodSubmissionForm />
        </div>
      </div>

      {/* QR Code Section - Moved Below */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-teal-100 py-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📱 Share with Others</h2>
            <p className="text-gray-600">Spread the word! Let others join the mood tracking</p>
          </div>
          <QRCodeGenerator url={currentUrl} />
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
