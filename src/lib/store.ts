// Local Storage Store for Testing
// This simulates a database using localStorage

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  walletBalance: number;
  accountCreated: string;
  referralCode: string;
  referredBy?: string;
  pin?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'airtime' | 'data' | 'cable' | 'electricity';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  description: string;
  reference: string;
  recipient?: string;
  network?: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  USER: 'tada_user',
  TRANSACTIONS: 'tada_transactions',
};

// Default user for first-time visitors
function createDefaultUser(): UserData {
  return {
    id: 'user_' + Math.random().toString(36).substring(2, 11),
    fullName: 'Test User',
    email: 'test@tadavtu.com',
    phoneNumber: '08012345678',
    walletBalance: 0,
    accountCreated: new Date().toISOString(),
    referralCode: 'TADA' + Math.random().toString(36).substring(2, 8).toUpperCase(),
  };
}

// Initialize store
export function initializeStore(): UserData {
  console.log('Store: initializeStore called');
  
  if (typeof window === 'undefined') {
    console.log('Store: Window undefined, returning default user');
    return createDefaultUser();
  }
  
  try {
    // Check if localStorage is available
    if (!window.localStorage) {
      console.warn('Store: localStorage not available, using default user');
      return createDefaultUser();
    }
    
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    console.log('Store: Retrieved stored user:', stored);
    
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        console.log('Store: Successfully parsed stored user:', parsedUser);
        return parsedUser;
      } catch (parseError) {
        console.error('Store: Error parsing stored user data:', parseError);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    
    // First time - create new user
    console.log('Store: Creating new default user');
    const newUser = createDefaultUser();
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    console.log('Store: New user created and stored:', newUser);
    return newUser;
  } catch (error) {
    console.error('Store: Error initializing store:', error);
    // If localStorage fails, return default user without storing
    return createDefaultUser();
  }
}

// Get user data
export function getUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : null;
}

// Update user data
export function updateUser(updates: Partial<UserData>): UserData {
  const current = getUser() || createDefaultUser();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('user-updated', { detail: updated }));
  return updated;
}

// Credit wallet
export function creditWallet(amount: number, reference: string, description: string): Transaction {
  const user = getUser();
  if (!user) throw new Error('User not found');
  
  // Update balance
  const newBalance = user.walletBalance + amount;
  updateUser({ walletBalance: newBalance });
  
  // Add transaction
  const transaction: Transaction = {
    id: 'txn_' + Math.random().toString(36).substring(2, 11),
    type: 'deposit',
    amount: amount,
    status: 'success',
    description,
    reference,
    createdAt: new Date().toISOString(),
  };
  
  addTransaction(transaction);
  return transaction;
}

// Debit wallet
export function debitWallet(
  amount: number, 
  type: Transaction['type'],
  description: string,
  recipient?: string,
  network?: string
): Transaction | null {
  const user = getUser();
  if (!user) throw new Error('User not found');
  
  if (user.walletBalance < amount) {
    return null; // Insufficient balance
  }
  
  // Update balance
  const newBalance = user.walletBalance - amount;
  updateUser({ walletBalance: newBalance });
  
  // Add transaction
  const transaction: Transaction = {
    id: 'txn_' + Math.random().toString(36).substring(2, 11),
    type,
    amount: -amount,
    status: 'success',
    description,
    reference: 'REF' + Date.now(),
    recipient,
    network,
    createdAt: new Date().toISOString(),
  };
  
  addTransaction(transaction);
  return transaction;
}

// Get transactions
export function getTransactions(limit?: number): Transaction[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions: Transaction[] = stored ? JSON.parse(stored) : [];
  
  // Sort by date descending
  transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return limit ? transactions.slice(0, limit) : transactions;
}

// Add transaction
export function addTransaction(transaction: Transaction): void {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  window.dispatchEvent(new CustomEvent('transactions-updated'));
}

// Get deposits only
export function getDeposits(limit?: number): Transaction[] {
  return getTransactions(limit).filter(t => t.type === 'deposit');
}

// Clear all data (for testing)
export function clearStore(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  window.dispatchEvent(new CustomEvent('store-cleared'));
}