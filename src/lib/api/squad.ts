// Squad Payment API Service
// Documentation: https://docs.squadco.com/

const SQUAD_BASE_URLS = {
  sandbox: 'https://sandbox-api-d.squadco.com',
  production: 'https://api-d.squadco.com'
};

export interface SquadInitiatePaymentRequest {
  amount: number; // Amount in kobo (10000 = 100 NGN)
  email: string;
  currency?: 'NGN' | 'USD';
  initiate_type?: 'inline';
  transaction_ref?: string;
  customer_name?: string;
  callback_url?: string;
  payment_channels?: ('card' | 'bank' | 'ussd' | 'transfer')[];
  metadata?: Record<string, any>;
  pass_charge?: boolean;
  is_recurring?: boolean;
}

export interface SquadInitiatePaymentResponse {
  status: number;
  message: string;
  data: {
    auth_url: string | null;
    access_token: string | null;
    merchant_info: {
      merchant_response: string | null;
      merchant_name: string | null;
      merchant_logo: string | null;
      merchant_id: string;
    };
    currency: string;
    recurring: {
      frequency: string | null;
      duration: string | null;
      type: number;
      plan_code: string | null;
      customer_name: string | null;
    };
    is_recurring: boolean;
    plan_code: string | null;
    callback_url: string;
    transaction_ref: string;
    transaction_memo: string | null;
    transaction_amount: number;
    authorized_channels: string[];
    checkout_url: string;
  };
}

export interface SquadTransactionQuery {
  currency?: string;
  start_date: string; // YYYY-MM-DD format
  end_date: string; // YYYY-MM-DD format
  page?: number;
  perpage?: number;
  reference?: string;
}

export interface SquadTransaction {
  id: number;
  transaction_amount: number;
  transaction_ref: string;
  email: string;
  merchant_id: string;
  merchant_amount: number;
  merchant_name: string;
  merchant_business_name: string;
  merchant_email: string;
  customer_email: string;
  customer_name: string;
  meta_data: string;
  meta: Record<string, any>;
  transaction_status: 'success' | 'failed' | 'pending';
  transaction_charges: number;
  transaction_currency_id: string;
  transaction_gateway_id: string;
  transaction_type: string;
  flat_charge: number;
  is_suspicious: boolean;
  is_refund: boolean;
  created_at: string;
}

export interface SquadChargeCardRequest {
  amount: number;
  token_id: string;
  transaction_ref?: string;
}

export interface SquadSimulatePaymentRequest {
  virtual_account_number: string;
  amount: string;
}

class SquadService {
  private apiKey: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;

  constructor(apiKey: string, environment: 'sandbox' | 'production' = 'sandbox') {
    this.apiKey = apiKey;
    this.environment = environment;
    this.baseUrl = SQUAD_BASE_URLS[environment];
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' = 'POST',
    data?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Squad API Error: ${result.message || 'Unknown error'}`);
      }

      return result;
    } catch (error) {
      console.error('Squad API Request failed:', error);
      throw error;
    }
  }

  // Initialize payment and get checkout URL
  async initiatePayment(request: SquadInitiatePaymentRequest): Promise<SquadInitiatePaymentResponse> {
    const payload = {
      ...request,
      currency: request.currency || 'NGN',
      initiate_type: request.initiate_type || 'inline',
    };

    return this.makeRequest<SquadInitiatePaymentResponse>('/transaction/initiate', 'POST', payload);
  }

  // Charge a card using token (for recurring payments)
  async chargeCard(request: SquadChargeCardRequest) {
    return this.makeRequest('/transaction/charge_card', 'POST', request);
  }

  // Cancel recurring payment
  async cancelRecurringPayment(authCode: string) {
    return this.makeRequest('/transaction/cancel/recurring', 'PATCH', {
      auth_code: [authCode]
    });
  }

  // Query transactions
  async queryTransactions(params: SquadTransactionQuery) {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ).toString();

    return this.makeRequest(`/transaction?${queryString}`, 'GET');
  }

  // Simulate payment (for testing transfer payments)
  async simulatePayment(request: SquadSimulatePaymentRequest) {
    return this.makeRequest('/virtual-account/simulate/payment', 'POST', request);
  }

  // Verify transaction by reference
  async verifyTransaction(reference: string) {
    return this.makeRequest(`/transaction?reference=${reference}`, 'GET');
  }
}

// Export singleton instance
let squadInstance: SquadService | null = null;

export function initializeSquad(apiKey: string, environment: 'sandbox' | 'production' = 'sandbox') {
  squadInstance = new SquadService(apiKey, environment);
  return squadInstance;
}

export function getSquad(): SquadService {
  if (!squadInstance) {
    throw new Error('Squad service not initialized. Call initializeSquad() first.');
  }
  return squadInstance;
}

export default SquadService;