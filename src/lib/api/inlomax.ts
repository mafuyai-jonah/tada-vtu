// Inlomax API Service
// Documentation: https://inlomax.com/api-documentation

const INLOMAX_API_URL = 'https://inlomax.com/api';

// Network to Service ID mapping (case-insensitive)
const NETWORK_SERVICE_IDS: Record<string, string> = {
  mtn: '100',
  airtel: '200',
  glo: '300',
  '9mobile': '400',
  etisalat: '400', // alias for 9mobile
};

export function getNetworkServiceId(network: string): string {
  return NETWORK_SERVICE_IDS[network.toLowerCase()] || '100';
}

interface InlomaxResponse<T = unknown> {
  status: 'success' | 'processing' | 'failed';
  message: string;
  data?: T;
}

// Server-side API call (use in API routes only)
export async function inlomaxRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  data?: Record<string, unknown>
): Promise<InlomaxResponse<T>> {
  const apiKey = process.env.INLOMAX_API_KEY;

  if (!apiKey) {
    throw new Error('INLOMAX_API_KEY is not configured');
  }

  try {
    const response = await fetch(`${INLOMAX_API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${apiKey}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.statusText}`);
    }

    return result;
  } catch (error) {
    console.error('Inlomax API Error:', error);
    throw error;
  }
}

// ============ BALANCE ============

export interface BalanceData {
  funds: number;
}

export async function getWalletBalance() {
  return inlomaxRequest<BalanceData>('/balance', 'GET');
}

// ============ AIRTIME SERVICES ============

export interface AirtimeData {
  type: string;
  reference: string;
  amount: number;
  amountCharged: number;
  phoneNumber: string;
  network: string;
  status: string;
}

export async function purchaseAirtime(data: {
  network: string;
  phone: string;
  amount: number;
}) {
  const serviceID = getNetworkServiceId(data.network);

  return inlomaxRequest<AirtimeData>('/airtime', 'POST', {
    serviceID,
    amount: data.amount,
    mobileNumber: data.phone,
  });
}

// ============ DATA SERVICES ============

export interface DataPlan {
  id: string;
  network: string;
  name: string;
  size: string;
  price: number;
  validity: string;
  type: string;
}

export async function getDataPlans(network: string): Promise<DataPlan[]> {
  const serviceID = NETWORK_SERVICE_IDS[network.toUpperCase()] || '100';
  const response = await inlomaxRequest<DataPlan[]>('/data/plans', 'POST', {
    serviceID,
  });
  return response.data || [];
}

export async function purchaseData(data: {
  network: string;
  phone: string;
  planId: string;
  type: string;
}) {
  const serviceID = NETWORK_SERVICE_IDS[data.network.toUpperCase()] || '100';

  return inlomaxRequest('/data', 'POST', {
    serviceID,
    mobileNumber: data.phone,
    planID: data.planId,
    dataType: data.type,
  });
}

// ============ CABLE TV SERVICES ============

export interface CablePlan {
  id: string;
  name: string;
  price: number;
  provider: string;
}

export async function getCablePlans(provider: string): Promise<CablePlan[]> {
  const response = await inlomaxRequest<CablePlan[]>('/cable/plans', 'POST', {
    provider,
  });
  return response.data || [];
}

export async function verifyCableCard(data: {
  provider: string;
  smartCardNumber: string;
}) {
  return inlomaxRequest('/cable/verify', 'POST', {
    provider: data.provider,
    smartCardNumber: data.smartCardNumber,
  });
}

export async function purchaseCable(data: {
  provider: string;
  smartCardNumber: string;
  planId: string;
}) {
  return inlomaxRequest('/cable', 'POST', {
    provider: data.provider,
    smartCardNumber: data.smartCardNumber,
    planID: data.planId,
  });
}

// ============ ELECTRICITY SERVICES ============

export interface ElectricityDisco {
  id: string;
  name: string;
  code: string;
}

export async function getElectricityDiscos(): Promise<ElectricityDisco[]> {
  const response = await inlomaxRequest<ElectricityDisco[]>(
    '/electricity/discos',
    'GET'
  );
  return response.data || [];
}

export async function verifyMeter(data: {
  disco: string;
  meterNumber: string;
  meterType: 'prepaid' | 'postpaid';
}) {
  return inlomaxRequest('/electricity/verify', 'POST', {
    disco: data.disco,
    meterNumber: data.meterNumber,
    meterType: data.meterType,
  });
}

export async function purchaseElectricity(data: {
  disco: string;
  meterNumber: string;
  amount: number;
  meterType: 'prepaid' | 'postpaid';
}) {
  return inlomaxRequest('/electricity', 'POST', {
    disco: data.disco,
    meterNumber: data.meterNumber,
    amount: data.amount,
    meterType: data.meterType,
  });
}

// ============ TRANSACTIONS ============

export async function getTransactionHistory(limit = 20) {
  return inlomaxRequest('/transactions', 'GET');
}

export async function verifyTransaction(reference: string) {
  return inlomaxRequest(`/transaction/${reference}`, 'GET');
}
