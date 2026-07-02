// System settings — thin wrapper around the existing `system_settings`
// key/value table (see supabase/migrations/016_system_settings_and_polling.sql).
// Used for admin-controlled runtime flags like maintenance mode.

import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key);
}

const MAINTENANCE_KEY = 'maintenance_mode';
const MAINTENANCE_MESSAGE_KEY = 'maintenance_message';
const MAINTENANCE_ETA_KEY = 'maintenance_eta';

const DEFAULT_MESSAGE =
  "We're temporarily closed for maintenance while we work on the mobile app. Deposits and purchases are paused — withdrawals are still available.";

export interface MaintenanceStatus {
  active: boolean;
  message: string;
  eta: string | null;
}

export async function getMaintenanceStatus(): Promise<MaintenanceStatus> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('system_settings')
    .select('key, value')
    .in('key', [MAINTENANCE_KEY, MAINTENANCE_MESSAGE_KEY, MAINTENANCE_ETA_KEY]);

  if (error) {
    // Fail open on read errors — never let a settings-table hiccup take down
    // deposits/purchases platform-wide.
    console.error('[system-settings] getMaintenanceStatus error (failing open):', error);
    return { active: false, message: DEFAULT_MESSAGE, eta: null };
  }

  const row = (key: string) => data?.find((r) => r.key === key)?.value ?? null;

  return {
    active: row(MAINTENANCE_KEY) === 'true',
    message: row(MAINTENANCE_MESSAGE_KEY) || DEFAULT_MESSAGE,
    eta: row(MAINTENANCE_ETA_KEY),
  };
}

export async function isMaintenanceMode(): Promise<boolean> {
  const status = await getMaintenanceStatus();
  return status.active;
}

export async function setMaintenanceMode(
  active: boolean,
  message?: string,
  eta?: string | null
): Promise<MaintenanceStatus> {
  const supabase = getSupabaseAdmin();

  const rows: { key: string; value: string; description: string }[] = [
    {
      key: MAINTENANCE_KEY,
      value: String(active),
      description: 'Whether deposits/purchases are paused platform-wide',
    },
  ];

  if (message !== undefined) {
    rows.push({
      key: MAINTENANCE_MESSAGE_KEY,
      value: message || DEFAULT_MESSAGE,
      description: 'Message shown to users during maintenance',
    });
  }

  if (eta !== undefined) {
    rows.push({
      key: MAINTENANCE_ETA_KEY,
      value: eta || '',
      description: 'Estimated restore time shown to users during maintenance',
    });
  }

  const { error } = await supabase
    .from('system_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) throw error;

  return getMaintenanceStatus();
}
