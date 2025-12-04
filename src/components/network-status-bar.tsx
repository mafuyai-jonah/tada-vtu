'use client';

import { useState, useEffect, useRef } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { IonIcon } from '@/components/ion-icon';

export function NetworkStatusBar() {
  const { isOnline, isSlowConnection, isChecking, recheckConnection } = useNetworkStatus();
  const [showRecovered, setShowRecovered] = useState(false);
  const prevStatusRef = useRef({ isOnline: true, isSlowConnection: false });

  // Track when connection recovers
  useEffect(() => {
    const prevWasBad = !prevStatusRef.current.isOnline || prevStatusRef.current.isSlowConnection;
    const nowIsGood = isOnline && !isSlowConnection && !isChecking;

    // Connection just recovered
    if (prevWasBad && nowIsGood) {
      setShowRecovered(true);
      // Auto-hide after 2.5 seconds
      const timer = setTimeout(() => {
        setShowRecovered(false);
      }, 2500);
      return () => clearTimeout(timer);
    }

    // Update previous status (only when not checking)
    if (!isChecking) {
      prevStatusRef.current = { isOnline, isSlowConnection };
    }
  }, [isOnline, isSlowConnection, isChecking]);

  const handleRetry = () => {
    recheckConnection();
  };

  // Show "Connection restored" briefly then hide
  if (showRecovered) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] px-4 py-2 text-center text-sm font-medium bg-green-500 text-white animate-in slide-in-from-top duration-200">
        <div className="flex items-center justify-center gap-2">
          <IonIcon name="checkmark-circle" size="16px" />
          <span>Connection restored!</span>
        </div>
      </div>
    );
  }

  // Don't show anything if connection is good
  if (isOnline && !isSlowConnection && !isChecking) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] px-4 py-2 text-center text-sm font-medium animate-in slide-in-from-top duration-200 ${
      !isOnline 
        ? 'bg-red-500 text-white' 
        : 'bg-yellow-500 text-yellow-900'
    }`}>
      <div className="flex items-center justify-center gap-2">
        {isChecking ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Checking connection...</span>
          </>
        ) : (
          <>
            <IonIcon 
              name={!isOnline ? "cloud-offline-outline" : "warning-outline"} 
              size="16px" 
            />
            <span>
              {!isOnline 
                ? "You're offline. Some features may not work." 
                : "Slow connection detected. Loading may take longer."}
            </span>
            <button 
              onClick={handleRetry}
              className="ml-2 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 transition-colors text-xs font-semibold"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
