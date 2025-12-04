import { toast } from 'sonner';

export const showError = (message: string, description?: string) => {
  toast.error(message, { description });
};

export const showSuccess = (message: string, description?: string) => {
  toast.success(message, { description });
};

export const showNetworkError = () => {
  toast.error('Network Error', {
    description: 'Please check your internet connection and try again.',
  });
};

export const showInsufficientBalance = (required: number, available: number) => {
  toast.error('Insufficient Balance', {
    description: `You need ₦${required.toLocaleString()} but have ₦${available.toLocaleString()}`,
  });
};

export const showTransactionSuccess = (type: string, amount: number, recipient?: string) => {
  toast.success(`${type} Successful!`, {
    description: recipient 
      ? `₦${amount.toLocaleString()} sent to ${recipient}`
      : `₦${amount.toLocaleString()} processed`,
  });
};

export const showTransactionFailed = (reason?: string) => {
  toast.error('Transaction Failed', {
    description: reason || 'Please try again or contact support.',
  });
};

// Parse API errors into user-friendly messages
export const parseApiError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection.';
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Session expired. Please log in again.';
    }
    if (message.includes('insufficient')) {
      return 'Insufficient balance for this transaction.';
    }
    if (message.includes('invalid')) {
      return 'Invalid input. Please check your details.';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};
