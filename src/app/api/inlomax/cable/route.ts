import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Missing Supabase configuration');
  return createClient(url, serviceKey);
}

// Cable provider codes for Inlomax
const CABLE_PROVIDERS: Record<string, string> = {
  dstv: 'DSTV',
  gotv: 'GOTV',
  startimes: 'Startimes',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, provider, smartCardNumber, planId, amount, planName, userId } = body;

    const useSandbox = process.env.INLOMAX_SANDBOX !== 'false';

    // Get cable plans
    if (action === 'get_plans') {
      if (!provider) {
        return NextResponse.json({ status: false, message: 'Provider is required' }, { status: 400 });
      }

      if (useSandbox) {
        // Return empty - frontend uses local plans in sandbox mode
        return NextResponse.json({ status: true, data: [] });
      }

      const { getCablePlans } = await import('@/lib/api/inlomax');
      const plans = await getCablePlans(provider);
      return NextResponse.json({ status: true, data: plans });
    }

    // Verify smart card
    if (action === 'verify') {
      if (!provider || !smartCardNumber) {
        return NextResponse.json({ status: false, message: 'Provider and smart card number required' }, { status: 400 });
      }

      if (useSandbox) {
        return NextResponse.json({
          status: true,
          message: 'Smart card verified (sandbox)',
          data: { customerName: 'Test Customer', smartCardNumber, provider }
        });
      }

      const { verifyCableCard } = await import('@/lib/api/inlomax');
      const result = await verifyCableCard({ provider, smartCardNumber });
      return NextResponse.json({ status: result.status === 'success', message: result.message, data: result.data });
    }

    // Purchase subscription
    if (!provider || !smartCardNumber || !planId) {
      return NextResponse.json({ status: false, message: 'Missing required fields' }, { status: 400 });
    }

    const numAmount = Number(amount) || 0;
    const supabase = getSupabaseAdmin();

    if (userId && numAmount > 0) {
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
          type: 'cable',
          amount: -numAmount,
          status: 'pending',
          description: `${CABLE_PROVIDERS[provider] || provider} ${planName || planId} - ${smartCardNumber}`,
          metadata: { provider, smartCardNumber, planId }
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
            message: `Cable subscription successful (sandbox) - ${planName || planId}`,
            data: { reference: 'SANDBOX_' + Date.now(), provider, smartCardNumber, planId }
          };
        } else {
          const { purchaseCable } = await import('@/lib/api/inlomax');
          result = await purchaseCable({ provider, smartCardNumber, planId });
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
          return NextResponse.json({ status: false, message: result.message || 'Purchase failed' });
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
        message: 'Cable subscription successful (sandbox)',
        data: { reference: 'SANDBOX_' + Date.now(), provider, smartCardNumber, planId }
      });
    }

    const { purchaseCable } = await import('@/lib/api/inlomax');
    const result = await purchaseCable({ provider, smartCardNumber, planId });
    return NextResponse.json({ status: result.status === 'success', message: result.message, data: result.data });

  } catch (error) {
    console.error('Cable purchase error:', error);
    return NextResponse.json({ status: false, message: error instanceof Error ? error.message : 'Purchase failed' }, { status: 500 });
  }
}
