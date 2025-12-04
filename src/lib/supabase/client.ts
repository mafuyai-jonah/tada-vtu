import { createBrowserClient, type SupabaseClient } from '@supabase/ssr';
import type { Database } from '../../types/database';

export type TypedSupabaseClient = SupabaseClient<Database>;

export function createClient(): TypedSupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('Missing Supabase environment variables:', { url: !!url, key: !!key });
    throw new Error('Missing Supabase environment variables');
  }
  
  return createBrowserClient<Database>(url, key);
}

// Singleton instance for client-side - only create on client
let supabaseInstance: TypedSupabaseClient | null = null;

export function getSupabase(): TypedSupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side: always create new instance
    return createClient();
  }
  
  // Client-side: use singleton
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}
