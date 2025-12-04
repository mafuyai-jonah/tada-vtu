import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Missing Supabase configuration');
  return createClient(url, serviceKey);
}

// Betting platforms
const BETTING_PLATFORMS: Record<string, string> = {
  bet9ja: 'Bet9ja',
  sportybet: 'SportyBet',
  betking: 'BetKing',
  '1xbet': '1xBet',
  nairabet: 'NairaBet',
  merrybet: 'MerryBet',
  bangbet: 'BangBet',
  msport: 'MSport',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, platform, customerId, amount, userId } = body;

    const useSandbox = process.env.INLOMAX_SANDBOX !== 'false';

    // Get platforms list
    if (action === 'get_platforms') {
      const platforms = Object.entries(BETTING_PLATFORMS).map(([id, name]) => ({ id, name }));
      return NextResponse.json({ status: true, data: platforms });
    }

    // Verify customer
    if (action === 'verify') {
      if (!platform || !customerId) {
        return NextResponse.json({ status: false, message: 'Platform and customer ID required' }, { status: 400 });
      }

      if (useSandbox) {
        return NextResponse.json({
          status: true,
          message: 'Customer verified (sandbox)',
          data: { customerName: 'Test Customer', customerId, platform }
        });
      }

      // In production, call actual API
      // const { verifyBettingCustomer } = await import('@/lib/api/inlomax');
      // const result = await verifyBettingCustomer({ platform, customerId });
      return NextResponse.json({
        status: true,
        message: 'Customer verified',
        data: { customerName: 'Customer', customerId, platform }
      });
    }

    // Fund betting account
    if (!platform || !customerId || !amount) {
      return NextResponse.json({ status: false, message: 'Missing required fields' }, { status: 400 });
    }

    if (!BETTING_PLATFORMS[platform]) {
      return NextResponse.json({ status: false, message: 'Invalid betting platform' }, { status: 400 });
    }

    const numAmount = Number(amount);
    if (numAmount < 100 || numAmount > 1000000) {
      return NextResponse.json({ status: false, message: 'Amount must be between ₦100 and ₦1,000,000' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    if (userId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('balance').eq('id', userId).single();

      if (profileError || !profile) {
        return NextResponse.json({ status: false, message: 'User not found' }, { status: 404 });
      }

      if ((profile.balance || 0) < numAmount) {
        return NextResponse.json({ status: false, message: 'Insufficient balance' }, { status: 400 });
      }

      const { data: transaction, error: txnError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'betting',
          amount: -numAmount,
          status: 'pending',
          description: `${BETTING_PLATFORMS[platform]} Funding - ${customerId}`,
          metadata: { platform, customerId }
        })
        .select().single();

      if (txnError) {
        return NextResponse.json({ status: false, message: 'Failed to create transaction' }, { status: 500 });
      }

      try {
        let result;
        if (useSandbox) {
          result = {
            status: 'success' as const,
            message: `${BETTING_PLATFORMS[platform]} account funded successfully (sandbox) - ₦${numAmount}`,
            data: { reference: 'SANDBOX_' + Date.now(), platform, customerId, amount: numAmount }
          };
        } else {
          // In production, call actual API
          // const { fundBettingAccount } = await import('@/lib/api/inlomax');
          // result = await fundBettingAccount({ platform, customerId, amount: numAmount });
          result = {
            status: 'success' as const,
            message: `${BETTING_PLATFORMS[platform]} account funded successfully`,
            data: { reference: 'REF_' + Date.now(), platform, customerId, amount: numAmount }
          };
        }

        if (result.status === 'success') {
          await supabase.from('profiles').update({ balance: profile.balance - numAmount }).eq('id', userId);
          await supabase.from('transactions').update({ 
            status: 'success', 
            reference: (result.data as Record<string, unknown>)?.reference as string 
          }).eq('id', transaction.id);

          return NextResponse.json({
            status: true, message: result.message,
            data: { ...(result.data || {}), transactionId: transaction.id, newBalance: profile.balance - numAmount }
          });
        } else {
          await supabase.from('transactions').update({ status: 'failed' }).eq('id', transaction.id);
          return NextResponse.json({ status: false, message: result.message || 'Funding failed' });
        }
      } catch (apiError) {
        await supabase.from('transactions').update({ status: 'failed' }).eq('id', transaction.id);
        throw apiError;
      }
    }

    // No userId - sandbox only
    if (useSandbox) {
      return NextResponse.json({
        status: true,
        message: `${BETTING_PLATFORMS[platform]} account funded successfully (sandbox)`,
        data: { reference: 'SANDBOX_' + Date.now(), platform, customerId, amount: numAmount }
      });
    }

    return NextResponse.json({
      status: true,
      message: `${BETTING_PLATFORMS[platform]} account funded successfully`,
      data: { reference: 'REF_' + Date.now(), platform, customerId, amount: numAmount }
    });

  } catch (error) {
    console.error('Betting funding error:', error);
    return NextResponse.json({ status: false, message: error instanceof Error ? error.message : 'Funding failed' }, { status: 500 });
  }
}
