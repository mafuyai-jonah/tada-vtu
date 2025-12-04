'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const checkCountRef = useRef(0);

  // Actually test connection speed with a real fetch
  const checkConnectionSpeed = useCallback(async () => {
    if (!navigator.onLine) {
      setIsSlowConnection(false);
      return;
    }

    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      // Use a small request with cache busting
      const response = await fetch(`/api/health?t=${Date.now()}`, { 
        method: 'GET',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const duration = Date.now() - startTime;
        // If response takes more than 2 seconds, consider it slow
        // Otherwise, connection is good - clear the warning
        const isSlow = duration > 2000;
        setIsSlowConnection(isSlow);
        
        // If connection is good, increment check count
        if (!isSlow) {
          checkCountRef.current += 1;
        }
      }
    } catch {
      // Fetch failed - might be offline or very slow
      // Don't set slow here, let the offline handler deal with it
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    // Only check speed if online
    if (navigator.onLine) {
      // Small delay to let the page load first
      const timer = setTimeout(checkConnectionSpeed, 2000);
      return () => clearTimeout(timer);
    }
  }, [checkConnectionSpeed]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsSlowConnection(false); // Optimistically clear slow warning
      // Re-check speed after a moment
      setTimeout(checkConnectionSpeed, 1500);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setIsSlowConnection(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnectionSpeed]);

  // Auto-recheck when slow (every 15 seconds, max 5 times)
  useEffect(() => {
    if (isSlowConnection && checkCountRef.current < 5) {
      const intervalId = setInterval(() => {
        checkConnectionSpeed();
      }, 15000);
      
      return () => clearInterval(intervalId);
    }
  }, [isSlowConnection, checkConnectionSpeed]);

  return { 
    isOnline, 
    isSlowConnection, 
    isChecking,
    recheckConnection: checkConnectionSpeed 
  };
}
