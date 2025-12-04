'use client';

import { useState, useCallback } from 'react';

interface InitiatePaymentParams {
  amount: number;
  email: string;
  name?: string;
  phone?: string;
  redirect_url?: string;
  meta?: Record<string, unknown>;
}

interface PaymentResponse {
  status: string;
  message: string;
  data?: {
    link: string;
    tx_ref: string;
  };
}

export function useFlutterwavePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(async (params: InitiatePaymentParams): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/flutterwave/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const result: PaymentResponse = await response.json();

      if (result.status === 'success' && result.data?.link) {
        // Store pending payment info
        localStorage.setItem('pending_payment', JSON.stringify({
          amount: params.amount,
          tx_ref: result.data.tx_ref,
        }));
        return result.data.link;
      }

      throw new Error(result.message || 'Failed to initiate payment');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyPayment = useCallback(async (tx_ref: string) => {
    try {
      const response = await fetch(`/api/flutterwave/verify?tx_ref=${tx_ref}`);
      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Verification error:', err);
      return null;
    }
  }, []);

  const redirectToPayment = useCallback((paymentLink: string) => {
    if (typeof window !== 'undefined' && paymentLink) {
      window.location.href = paymentLink;
    }
  }, []);

  return {
    initiatePayment,
    verifyPayment,
    redirectToPayment,
    loading,
    error,
  };
}
