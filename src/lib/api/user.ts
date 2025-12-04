// User API Service
// This will connect to your backend API for user data

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  walletBalance: number;
  accountCreated: string;
  referralCode: string;
  referredBy?: string;
}

// Mock API - Replace with your actual backend API
export async function getUserData(userId: string): Promise<UserData> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/users/${userId}`);
  // return await response.json();
  
  // Mock data for now
  return {
    id: userId,
    fullName: "James Anderson",
    email: "james@example.com",
    phoneNumber: "08012345678",
    walletBalance: 5000,
    accountCreated: "2024-01-15",
    referralCode: "TADA2024XYZ",
    referredBy: undefined,
  };
}

// Update user profile
export async function updateUserProfile(userId: string, data: Partial<UserData>) {
  // TODO: Implement actual API call
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

// Get user transactions
export async function getUserTransactions(userId: string, limit = 10) {
  // TODO: Implement actual API call
  // const response = await fetch(`/api/users/${userId}/transactions?limit=${limit}`);
  // return await response.json();
  
  // Mock data for now
  return [
    { id: '1', type: 'Data Purchase', amount: -500, status: 'success', date: '2024-12-02', network: 'MTN' },
    { id: '2', type: 'Wallet Deposit', amount: 5000, status: 'success', date: '2024-12-01', network: null },
    { id: '3', type: 'Airtime Purchase', amount: -200, status: 'success', date: '2024-12-01', network: 'Airtel' }
  ];
}

// Get user beneficiaries
export async function getUserBeneficiaries(userId: string) {
  // TODO: Implement actual API call
  return [];
}

// Add beneficiary
export async function addBeneficiary(userId: string, data: any) {
  // TODO: Implement actual API call
  const response = await fetch(`/api/users/${userId}/beneficiaries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}
