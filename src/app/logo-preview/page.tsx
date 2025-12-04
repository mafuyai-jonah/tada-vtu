'use client';

import Image from 'next/image';
import Link from 'next/link';

const logos = [
  { name: 'V1 - Signal Waves', file: '/logos/logo-v1-signal.svg', desc: 'T with signal waves - tech/connectivity feel' },
  { name: 'V2 - Lightning Circle', file: '/logos/logo-v2-circle.svg', desc: 'Circular with lightning bolt - speed/energy' },
  { name: 'V3 - Phone Gradient', file: '/logos/logo-v3-gradient.svg', desc: 'Gradient with phone icon - mobile focus' },
  { name: 'V4 - Hexagon', file: '/logos/logo-v4-modern.svg', desc: 'Modern hexagon shape - tech/innovation' },
  { name: 'V5 - Minimal', file: '/logos/logo-v5-minimal.svg', desc: 'Clean minimal design - professional' },
  { name: 'V6 - Bold', file: '/logos/logo-v6-bold.svg', desc: 'Bold 3D effect - strong presence' },
  { name: 'V7 - WiFi', file: '/logos/logo-v7-wifi.svg', desc: 'WiFi symbol - data/connectivity' },
  { name: 'V8 - Stacked', file: '/logos/logo-v8-stacked.svg', desc: 'Vertical layout - app icon style' },
];

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-green-500 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Logo Variations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Pick your favorite! Tell me the version number you like.
        </p>

        <div className="grid gap-6">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{logo.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{logo.desc}</p>
                </div>
              </div>
              
              {/* Light background preview */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-3">
                <Image 
                  src={logo.file} 
                  alt={logo.name}
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                />
              </div>
              
              {/* Dark background preview */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <Image 
                  src={logo.file} 
                  alt={logo.name}
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-300 text-sm">
            <strong>How to choose:</strong> Just tell me "I like V3" or "Use version 5" and I'll update the app with that logo!
          </p>
        </div>
      </div>
    </div>
  );
}
