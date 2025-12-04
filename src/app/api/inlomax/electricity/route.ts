import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Missing Supabase configuration');
  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, disco, meterNumber, meterType, amount, userId } = body;

    const useSandbox = process.env.INLOMAX_SANDBOX !== 'false';

    // Get DISCOs list
    if (action === 'get_discos') {
      if (useSandbox) {
        return NextResponse.json({ status: true, data: [] });
      }
      const { getElectricityDiscos } = await import('@/lib/api/inlomax');
      const discos = await getElectricityDiscos();
      return NextResponse.json({ status: true, data: discos });
    }

    // Verify meter
    if (action === 'verify') {
      if (!disco || !meterNumber || !meterType) {
        return NextResponse.json({ status: false, message: 'DISCO, meter number and type required' }, { status: 400 });
      }

      if (useSandbox) {
        return NextResponse.json({
          status: true,
          message: 'Meter verified (sandbox)',
          data: { customerName: 'Test Customer', meterNumber, disco, meterType }
        });
      }

      const { verifyMeter } = await import('@/lib/api/inlomax');
      const result = await verifyMeter({ disco, meterNumber, meterType });
      return NextResponse.json({ status: result.status === 'success', message: result.message, data: result.data });
    }

    // Purchase electricity
    if (!disco || !meterNumber || !amount || !meterType) {
      return NextResponse.json({ status: false, message: 'Missing required fields' }, { status: 400 });
    }

    const numAmount = Number(amount);
    if (numAmount < 500 || numAmount > 500000) {
      return NextResponse.json({ status: false, message: 'Amount must be between ₦500 and ₦500,000' }, { status: 400 });
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
          type: 'electricity',
          amount: -numAmount,
          status: 'pending',
          description: `${disco} Electricity (${meterType}) - ${meterNumber}`,
          metadata: { disco, meterNumber, meterType }
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
            message: `Electricity purchase successful (sandbox) - ₦${numAmount}`,
            data: { 
              reference: 'SANDBOX_' + Date.now(), 
              token: '1234-5678-9012-3456-7890', 
              disco, meterNumber, amount: numAmount 
            }
          };
        } else {
          const { purchaseElectricity } = await import('@/lib/api/inlomax');
          result = await purchaseElectricity({ disco, meterNumber, amount: numAmount, meterType });
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
        message: 'Electricity purchase successful (sandbox)',
        data: { reference: 'SANDBOX_' + Date.now(), token: '1234-5678-9012-3456-7890', disco, meterNumber, amount: numAmount }
      });
    }

    const { purchaseElectricity } = await import('@/lib/api/inlomax');
    const result = await purchaseElectricity({ disco, meterNumber, amount: numAmount, meterType });
    return NextResponse.json({ status: result.status === 'success', message: result.message, data: result.data });

  } catch (error) {
    console.error('Electricity purchase error:', error);
    return NextResponse.json({ status: false, message: error instanceof Error ? error.message : 'Purchase failed' }, { status: 500 });
  }
}
