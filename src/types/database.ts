export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone_number: string | null;
          email: string | null;
          balance: number;
          referral_code: string | null;
          referred_by: string | null;
          pin: string | null;
          kyc_level: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone_number?: string | null;
          email?: string | null;
          balance?: number;
          referral_code?: string | null;
          referred_by?: string | null;
          pin?: string | null;
          kyc_level?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone_number?: string | null;
          email?: string | null;
          balance?: number;
          referral_code?: string | null;
          referred_by?: string | null;
          pin?: string | null;
          kyc_level?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'deposit' | 'airtime' | 'data' | 'cable' | 'electricity' | 'betting';
          amount: number;
          phone_number: string | null;
          service_id: string | null;
          network: string | null;
          status: 'pending' | 'success' | 'failed';
          reference: string;
          external_reference: string | null;
          description: string | null;
          response_data: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'deposit' | 'airtime' | 'data' | 'cable' | 'electricity' | 'betting';
          amount: number;
          phone_number?: string | null;
          service_id?: string | null;
          network?: string | null;
          status?: 'pending' | 'success' | 'failed';
          reference: string;
          external_reference?: string | null;
          description?: string | null;
          response_data?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'deposit' | 'airtime' | 'data' | 'cable' | 'electricity' | 'betting';
          amount?: number;
          phone_number?: string | null;
          service_id?: string | null;
          network?: string | null;
          status?: 'pending' | 'success' | 'failed';
          reference?: string;
          external_reference?: string | null;
          description?: string | null;
          response_data?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'credit' | 'debit';
          amount: number;
          description: string | null;
          reference: string | null;
          balance_before: number;
          balance_after: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'credit' | 'debit';
          amount: number;
          description?: string | null;
          reference?: string | null;
          balance_before: number;
          balance_after: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'credit' | 'debit';
          amount?: number;
          description?: string | null;
          reference?: string | null;
          balance_before?: number;
          balance_after?: number;
          created_at?: string;
        };
      };
      beneficiaries: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone_number: string;
          network: string | null;
          service_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone_number: string;
          network?: string | null;
          service_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone_number?: string;
          network?: string | null;
          service_type?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Functions: {
      update_user_balance: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_type: 'credit' | 'debit';
          p_description?: string;
          p_reference?: string;
        };
        Returns: void;
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type WalletTransaction = Database['public']['Tables']['wallet_transactions']['Row'];
export type Beneficiary = Database['public']['Tables']['beneficiaries']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
