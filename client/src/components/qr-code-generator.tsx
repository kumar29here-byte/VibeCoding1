import { useEffect, useRef } from "react";

declare global {
  interface Window {
    QRCode: any;
  }
}

interface QRCodeGeneratorProps {
  url: string;
}

export default function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load QR Code library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
    script.onload = () => {
      if (canvasRef.current && window.QRCode) {
        window.QRCode.toCanvas(canvasRef.current, url, {
          width: 150,
          height: 150,
          margin: 2,
          color: {
            dark: '#1E293B',
            light: '#FFFFFF'
          }
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [url]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">📱 Share with Participants</h2>
      <div className="flex justify-center mb-4">
        <canvas ref={canvasRef} className="border rounded-lg" data-testid="qr-code-canvas"></canvas>
      </div>
      <p className="text-sm text-gray-600">Scan QR code to submit your mood</p>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <code className="text-sm text-gray-700" data-testid="qr-code-url">{url}</code>
      </div>
    </div>
  );
}
