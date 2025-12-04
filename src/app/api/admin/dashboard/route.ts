import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Verify admin token
function verifyToken(token: string): { valid: boolean; adminId?: string } {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) {
      return { valid: false };
    }
    return { valid: true, adminId: payload.id };
  } catch {
    return { valid: false };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check env vars
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase env vars');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { valid, adminId } = verifyToken(token);

    if (!valid || !adminId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify admin exists
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('id', adminId)
      .eq('is_active', true)
      .single();

    if (adminError || !admin) {
      console.error('Admin not found:', adminError);
      return NextResponse.json({ error: 'Admin not found' }, { status: 401 });
    }

    // Fetch stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Active users (with balance > 0)
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('balance', 0);

    // Total transactions
    const { count: totalTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // Today's transactions
    const { count: todayTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Pending transactions
    const { count: pendingTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Total revenue (sum of deposits)
    const { data: revenueData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'deposit')
      .eq('status', 'success');

    const totalRevenue = revenueData?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

    // Fetch users (last 100)
    const { data: users } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone_number, balance, created_at, is_active')
      .order('created_at', { ascending: false })
      .limit(100);

    // Fetch transactions (last 100) - simplified query
    const { data: transactions } = await supabase
      .from('transactions')
      .select('id, user_id, type, amount, status, description, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalTransactions: totalTransactions || 0,
        todayTransactions: todayTransactions || 0,
        pendingTransactions: pendingTransactions || 0,
        totalRevenue,
      },
      users: users || [],
      transactions: transactions || [],
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
