import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin-auth';
import { getMaintenanceStatus, setMaintenanceMode } from '@/lib/system-settings';

function isAuthorized(req: NextRequest): boolean {
  // Same dual-auth pattern as /api/admin/bot-mode: admin JWT OR internal CORE_SECRET.
  const auth = req.headers.get('authorization') ?? '';
  if (auth.startsWith('Bearer ')) {
    const { valid } = verifyToken(auth.slice(7));
    if (valid) return true;
  }
  const secret = req.headers.get('x-core-secret');
  if (secret && secret === process.env.CORE_SECRET) return true;
  return false;
}

// GET /api/admin/maintenance → current maintenance status
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const status = await getMaintenanceStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('[admin/maintenance] GET error:', error);
    return NextResponse.json({ error: 'Failed to read maintenance status' }, { status: 500 });
  }
}

// POST /api/admin/maintenance  body: { active: boolean, message?: string, eta?: string }
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { active?: boolean; message?: string; eta?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body.active !== 'boolean') {
    return NextResponse.json({ error: '"active" must be a boolean' }, { status: 400 });
  }

  try {
    const status = await setMaintenanceMode(body.active, body.message, body.eta ?? null);
    console.log(`[admin] maintenance mode set to: ${body.active}`);
    return NextResponse.json(status);
  } catch (error) {
    console.error('[admin/maintenance] POST error:', error);
    return NextResponse.json({ error: 'Failed to update maintenance status' }, { status: 500 });
  }
}
