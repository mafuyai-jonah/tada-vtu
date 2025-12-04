'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getUser, 
  updateUser, 
  initializeStore, 
  getTransactions,
  creditWallet,
  debitWallet,
  type UserData, 
  type Transaction 
} from '@/lib/store';

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useUser: Starting user initialization...');
    
    let loadingTimeout: NodeJS.Timeout;
    let isCompleted = false;
    
    const completeLoading = (userData: UserData | null) => {
      if (!isCompleted) {
        isCompleted = true;
        if (userData) {
          setUser(userData);
        }
        setLoading(false);
        console.log('useUser: Loading completed with user:', userData);
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
      }
    };
    
    // Add a timeout to prevent infinite loading
    loadingTimeout = setTimeout(() => {
      console.warn('User loading timeout - creating default user');
      const defaultUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 11),
        fullName: 'Guest User',
        email: 'guest@tadavtu.com',
        phoneNumber: '08000000000',
        walletBalance: 0,
        accountCreated: new Date().toISOString(),
        referralCode: 'TADA' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      };
      completeLoading(defaultUser);
    }, 3000); // 3 second timeout
    
    // Initialize immediately (don't wait for timeout)
    try {
      console.log('useUser: Calling initializeStore...');
      const userData = initializeStore();
      console.log('useUser: Store initialized successfully:', userData);
      completeLoading(userData);
    } catch (error) {
      console.error('useUser: Failed to initialize user:', error);
      // Create a default user if initialization fails
      const defaultUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 11),
        fullName: 'Guest User',
        email: 'guest@tadavtu.com',
        phoneNumber: '08000000000',
        walletBalance: 0,
        accountCreated: new Date().toISOString(),
        referralCode: 'TADA' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      };
      completeLoading(defaultUser);
    }

    const handleUpdate = (e: CustomEvent<UserData>) => {
      console.log('useUser: User updated event received:', e.detail);
      setUser(e.detail);
    };

    window.addEventListener('user-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('user-updated', handleUpdate as EventListener);
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, []);

  const refreshUser = useCallback(() => {
    const userData = getUser();
    if (userData) setUser(userData);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserData>) => {
    const updated = updateUser(updates);
    setUser(updated);
    return updated;
  }, []);

  const credit = useCallback((amount: number, reference: string, description: string) => {
    const txn = creditWallet(amount, reference, description);
    refreshUser();
    return txn;
  }, [refreshUser]);

  const debit = useCallback((
    amount: number,
    type: Transaction['type'],
    description: string,
    recipient?: string,
    network?: string
  ) => {
    const txn = debitWallet(amount, type, description, recipient, network);
    refreshUser();
    return txn;
  }, [refreshUser]);

  return { user, loading, refreshUser, updateProfile, credit, debit };
}

export function useTransactions(limit?: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const txns = getTransactions(limit);
    setTransactions(txns);
  }, [limit]);

  useEffect(() => {
    refresh();
    setLoading(false);

    const handleUpdate = () => refresh();
    window.addEventListener('transactions-updated', handleUpdate);
    window.addEventListener('user-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('transactions-updated', handleUpdate);
      window.removeEventListener('user-updated', handleUpdate);
    };
  }, [refresh]);

  return { transactions, loading, refresh };
}