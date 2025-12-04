'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import type { Transaction } from '@/types/database';
import { useAuth } from './useAuth';

export function useSupabaseUser() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  const supabase = getSupabase();

  const fetchTransactions = useCallback(async (limit?: number) => {
    if (!user) return [];
    
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase.from('transactions') as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTransactions(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const creditWallet = useCallback(async (
    amount: number, 
    reference: string, 
    description: string
  ) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.rpc as any)('update_user_balance', {
        p_user_id: user.id,
        p_amount: amount,
        p_type: 'credit',
        p_description: description,
        p_reference: reference,
      });
      
      if (error) throw error;
      
      // Refresh profile and transactions
      await refreshProfile();
      await fetchTransactions();
      
      return { success: true };
    } catch (error) {
      console.error('Error crediting wallet:', error);
      throw error;
    }
  }, [user, supabase, refreshProfile, fetchTransactions]);


  const debitWallet = useCallback(async (
    amount: number,
    type: Transaction['type'],
    description: string,
    phoneNumber?: string,
    network?: string
  ) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.rpc as any)('update_user_balance', {
        p_user_id: user.id,
        p_amount: amount,
        p_type: 'debit',
        p_description: description,
      });
      
      if (error) {
        if (error.message?.includes('Insufficient balance')) {
          return null; // Insufficient balance
        }
        throw error;
      }
      
      // Create transaction record
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: txnError } = await (supabase.from('transactions') as any)
        .insert({
          user_id: user.id,
          type,
          amount: -amount,
          status: 'success',
          reference: 'REF' + Date.now(),
          description,
          phone_number: phoneNumber,
          network,
        })
        .select()
        .single();
      
      if (txnError) throw txnError;
      
      // Refresh profile and transactions
      await refreshProfile();
      await fetchTransactions();
      
      return data;
    } catch (error) {
      console.error('Error debiting wallet:', error);
      throw error;
    }
  }, [user, supabase, refreshProfile, fetchTransactions]);

  // Fetch transactions on mount
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  return {
    user: profile,
    // Only show loading on initial auth load, not on subsequent navigations
    loading: authLoading && !profile,
    transactionsLoading: loading,
    transactions,
    creditWallet,
    debitWallet,
    refreshUser: refreshProfile,
    fetchTransactions,
  };
}

export function useSupabaseTransactions(limit?: number) {
  const { transactions, loading, fetchTransactions } = useSupabaseUser();
  
  return {
    transactions: limit ? transactions.slice(0, limit) : transactions,
    loading,
    refresh: fetchTransactions,
  };
}
