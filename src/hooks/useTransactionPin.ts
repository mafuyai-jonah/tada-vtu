'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useTransactionPin() {
  const { profile } = useAuth();
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [showVerifyPin, setShowVerifyPin] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const hasPin = !!profile?.pin;

  // Check if user needs to create PIN (first time after registration)
  const checkPinSetup = useCallback(() => {
    if (!hasPin) {
      const skipped = localStorage.getItem('pinSkipped');
      if (!skipped) {
        setShowCreatePin(true);
        return true;
      }
    }
    return false;
  }, [hasPin]);

  // Require PIN verification before an action
  const requirePin = useCallback((action: () => void) => {
    if (!hasPin) {
      // User needs to create PIN first
      setShowCreatePin(true);
      return;
    }
    
    // Show PIN verification modal
    setPendingAction(() => action);
    setShowVerifyPin(true);
  }, [hasPin]);

  // Called when PIN is verified successfully
  const onPinVerified = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowVerifyPin(false);
  }, [pendingAction]);

  // Called when PIN is created successfully
  const onPinCreated = useCallback(() => {
    setShowCreatePin(false);
    localStorage.removeItem('pinSkipped');
  }, []);

  return {
    hasPin,
    userPin: profile?.pin || null,
    showCreatePin,
    showVerifyPin,
    setShowCreatePin,
    setShowVerifyPin,
    checkPinSetup,
    requirePin,
    onPinVerified,
    onPinCreated,
  };
}
