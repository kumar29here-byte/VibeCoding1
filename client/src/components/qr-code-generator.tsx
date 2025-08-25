import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  url: string;
}

export default function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1E293B',
          light: '#FFFFFF'
        }
      }).catch((err) => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [url]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 text-center relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 opacity-50"></div>
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <canvas ref={canvasRef} className="border-4 border-white rounded-2xl shadow-lg" data-testid="qr-code-canvas"></canvas>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-bounce">
              📱
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-4 text-lg font-medium">Scan to join the mood tracking! 🎯</p>
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Direct Link</p>
          <code className="text-sm text-gray-700 break-all" data-testid="qr-code-url">{url}</code>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Live Updates</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span>Anonymous</span>
          </div>
        </div>
      </div>
    </div>
  );
}