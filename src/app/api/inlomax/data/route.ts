import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { purchaseData, getDataPlans, getNetworkServiceId } from '@/lib/api/inlomax';

// Create Supabase admin client
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, network, phone, planId, type, amount, planName, userId } = body;

    const useSandbox = process.env.INLOMAX_SANDBOX !== 'false';

    // Get data plans
    if (action === 'get_plans') {
      if (!network) {
        return NextResponse.json(
          { status: false, message: 'Network is required' },
          { status: 400 }
        );
      }

      if (useSandbox) {
        // Return empty - frontend uses local plans in sandbox mode
        return NextResponse.json({ status: true, data: [] });
      }

      const plans = await getDataPlans(network);
      return NextResponse.json({ status: true, data: plans });
    }

    // Purchase data
    if (!network || !phone || !planId || !type) {
      return NextResponse.json(
        { status: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!/^0\d{10}$/.test(phone)) {
      return NextResponse.json(
        { status: false, message: 'Invalid phone number format. Use format: 08012345678' },
        { status: 400 }
      );
    }

    const numAmount = Number(amount) || 0;
    const supabase = getSupabaseAdmin();

    // If userId provided, verify balance and create transaction
    if (userId && numAmount > 0) {
      // Get user's current balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { status: false, message: 'User not found' },
          { status: 404 }
        );
      }

      if ((profile.balance || 0) < numAmount) {
        return NextResponse.json(
          { status: false, message: 'Insufficient balance' },
          { status: 400 }
        );
      }

      // Create pending transaction
      const { data: transaction, error: txnError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'data',
          amount: -numAmount,
          status: 'pending',
          description: `${network} ${planName || type} Data - ${phone}`,
          metadata: { network, phone, planId, type, serviceId: getNetworkServiceId(network) }
        })
        .select()
        .single();

      if (txnError) {
        console.error('Transaction creation error:', txnError);
        return NextResponse.json(
          { status: false, message: 'Failed to create transaction' },
          { status: 500 }
        );
      }

      try {
        let result;
        
        if (useSandbox) {
          // Sandbox mode - simulate successful purchase
          result = {
            status: 'success' as const,
            message: `Data purchase successful (sandbox) - ${planName || planId} to ${phone}`,
            data: {
              reference: 'SANDBOX_' + Date.now(),
              network,
              phone,
              planId,
              type,
            },
          };
        } else {
          // Production mode - call actual Inlomax API
          result = await purchaseData({ network, phone, planId, type });
        }

        if (result.status === 'success') {
          // Deduct from wallet and update transaction
          await supabase
            .from('profiles')
            .update({ balance: profile.balance - numAmount })
            .eq('id', userId);

          const responseData = result.data as Record<string, unknown> | undefined;
          await supabase
            .from('transactions')
            .update({ 
              status: 'success',
              reference: responseData?.reference as string || undefined,
              metadata: { ...(transaction.metadata as object), apiResponse: responseData }
            })
            .eq('id', transaction.id);

          return NextResponse.json({
            status: true,
            message: result.message,
            data: {
              ...(responseData || {}),
              transactionId: transaction.id,
              newBalance: profile.balance - numAmount,
            },
          });
        } else {
          // Mark transaction as failed
          await supabase
            .from('transactions')
            .update({ status: 'failed', metadata: { ...(transaction.metadata as object), error: result.message } })
            .eq('id', transaction.id);

          return NextResponse.json({
            status: false,
            message: result.message || 'Purchase failed',
          });
        }
      } catch (apiError) {
        // Mark transaction as failed
        await supabase
          .from('transactions')
          .update({ 
            status: 'failed', 
            metadata: { ...(transaction.metadata as object), error: String(apiError) } 
          })
          .eq('id', transaction.id);

        throw apiError;
      }
    }

    // No userId - just process without wallet (for testing)
    if (useSandbox) {
      return NextResponse.json({
        status: true,
        message: 'Data purchase successful (sandbox)',
        data: {
          reference: 'SANDBOX_' + Date.now(),
          network,
          phone,
          planId,
          type,
        },
      });
    }

    const result = await purchaseData({ network, phone, planId, type });
    return NextResponse.json({
      status: result.status === 'success',
      message: result.message,
      data: result.data,
    });

  } catch (error) {
    console.error('Data purchase error:', error);
    return NextResponse.json(
      { status: false, message: error instanceof Error ? error.message : 'Purchase failed' },
      { status: 500 }
    );
  }
}
