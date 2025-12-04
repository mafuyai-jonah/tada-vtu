import { useState, useCallback } from 'react';

interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

interface UseInlomaxApiReturn {
  loading: boolean;
  error: string | null;
  execute: <T = any>(endpoint: string, method?: 'GET' | 'POST', data?: any) => Promise<ApiResponse<T> | null>;
}

export function useInlomaxApi(): UseInlomaxApiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T = any>(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET', 
    data?: any
  ): Promise<ApiResponse<T> | null> => {
    setLoading(true);
    setError(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method === 'POST' && data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`/api/inlomax${endpoint}`, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'API request failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
}

// Specific hooks for common operations
export function useInlomaxBalance() {
  const { loading, error, execute } = useInlomaxApi();

  const getBalance = useCallback(async () => {
    return execute('/balance');
  }, [execute]);

  return { loading, error, getBalance };
}

export function useInlomaxAirtime() {
  const { loading, error, execute } = useInlomaxApi();

  const buyAirtime = useCallback(async (serviceID: string, amount: number, mobileNumber: string) => {
    return execute('/airtime', 'POST', { serviceID, amount, mobileNumber });
  }, [execute]);

  return { loading, error, buyAirtime };
}

export function useInlomaxData() {
  const { loading, error, execute } = useInlomaxApi();

  const buyData = useCallback(async (serviceID: string, mobileNumber: string) => {
    return execute('/data', 'POST', { serviceID, mobileNumber });
  }, [execute]);

  return { loading, error, buyData };
}

export function useInlomaxServices() {
  const { loading, error, execute } = useInlomaxApi();

  const getServices = useCallback(async () => {
    return execute('/services');
  }, [execute]);

  return { loading, error, getServices };
}

export function useInlomaxTransaction() {
  const { loading, error, execute } = useInlomaxApi();

  const getTransactionDetails = useCallback(async (reference: string) => {
    return execute(`/transaction/${reference}`);
  }, [execute]);

  return { loading, error, getTransactionDetails };
}