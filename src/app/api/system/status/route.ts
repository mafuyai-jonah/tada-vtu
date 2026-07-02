import { NextResponse } from 'next/server';
import { getMaintenanceStatus } from '@/lib/system-settings';

// Public, unauthenticated — polled by MaintenanceGate on the frontend.
export async function GET() {
  try {
    const status = await getMaintenanceStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('[system/status] error (failing open):', error);
    // Fail open: never let a settings lookup failure lock users out of the app.
    return NextResponse.json({ active: false, message: null, eta: null });
  }
}
