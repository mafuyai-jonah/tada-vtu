'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IonIcon } from '@/components/ion-icon';
import { LogoInline } from '@/components/logo';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface LoadingScreenProps {
  message?: string;
  timeout?: number; // milliseconds before showing slow connection warning
}

export function LoadingScreen({ message = 'Loading...', timeout = 8000 }: LoadingScreenProps) {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const slowTimer = setTimeout(() => setIsTakingLong(true), timeout);
    const retryTimer = setTimeout(() => setShowRetry(true), timeout * 2);

    return () => {
      clearTimeout(slowTimer);
      clearTimeout(retryTimer);
    };
  }, [timeout]);

  const handleRetry = () => {
    window.location.reload();
  };

  // Offline state
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <IonIcon name="cloud-offline-outline" size="32px" color="#ef4444" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No Internet Connection</h2>
            <p className="text-muted-foreground">
              Please check your internet connection and try again.
            </p>
            <Button onClick={handleRetry} className="bg-green-500 hover:bg-green-600 text-white">
              <IonIcon name="refresh-outline" size="18px" className="mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  // Show retry option after long wait
  if (showRetry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
              <IonIcon name="time-outline" size="32px" color="#eab308" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Taking Too Long</h2>
            <p className="text-muted-foreground">
              {isSlowConnection 
                ? "Your connection seems slow. Please wait or try again."
                : "Something might be wrong. Please try refreshing the page."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} className="bg-green-500 hover:bg-green-600 text-white">
                <IonIcon name="refresh-outline" size="18px" className="mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normal loading with slow connection warning
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Logo with pulse animation */}
        <div className="animate-pulse">
          <LogoInline size="lg" showText={false} className="justify-center" />
        </div>
        
        <div className="space-y-2">
          <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">{message}</p>
        </div>
        
        {(isTakingLong || isSlowConnection) && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg max-w-xs mx-auto">
            <div className="flex items-center gap-2 text-yellow-500 text-sm">
              <IonIcon name="warning-outline" size="16px" />
              <span>
                {isSlowConnection 
                  ? "Slow connection detected" 
                  : "This is taking longer than usual"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
