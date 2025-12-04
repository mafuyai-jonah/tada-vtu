import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { purchaseAirtime, getNetworkServiceId } from '@/lib/api/inlomax';

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
    const { network, phone, amount, userId } = body;

    // Validate input
    if (!network || !phone || !amount) {
      return NextResponse.json(
        { status: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number format (Nigerian numbers - 11 digits starting with 0)
    if (!/^0\d{10}$/.test(phone)) {
      return NextResponse.json(
        { status: false, message: 'Invalid phone number format. Use format: 08012345678' },
        { status: 400 }
      );
    }

    // Validate amount
    const numAmount = Number(amount);
    if (numAmount < 50 || numAmount > 50000) {
      return NextResponse.json(
        { status: false, message: 'Amount must be between ₦50 and ₦50,000' },
        { status: 400 }
      );
    }

    // Check sandbox mode
    const useSandbox = process.env.INLOMAX_SANDBOX !== 'false';
    const supabase = getSupabaseAdmin();

    // If userId provided, verify balance and create transaction
    if (userId) {
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
          type: 'airtime',
          amount: -numAmount,
          status: 'pending',
          description: `${network} Airtime - ${phone}`,
          metadata: { network, phone, serviceId: getNetworkServiceId(network) }
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
            message: `Airtime purchase successful (sandbox) - ₦${numAmount} to ${phone}`,
            data: {
              reference: 'SANDBOX_' + Date.now(),
              network,
              phone,
              amount: numAmount,
              amountCharged: numAmount * 0.98,
            },
          };
        } else {
          // Production mode - call actual Inlomax API
          result = await purchaseAirtime({ network, phone, amount: numAmount });
        }

        if (result.status === 'success') {
          // Deduct from wallet and update transaction
          await supabase
            .from('profiles')
            .update({ balance: profile.balance - numAmount })
            .eq('id', userId);

          await supabase
            .from('transactions')
            .update({ 
              status: 'success',
              reference: result.data?.reference,
              metadata: { ...transaction.metadata, apiResponse: result.data }
            })
            .eq('id', transaction.id);

          return NextResponse.json({
            status: true,
            message: result.message,
            data: {
              ...result.data,
              transactionId: transaction.id,
              newBalance: profile.balance - numAmount,
            },
          });
        } else {
          // Mark transaction as failed
          await supabase
            .from('transactions')
            .update({ status: 'failed', metadata: { ...transaction.metadata, error: result.message } })
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
            metadata: { ...transaction.metadata, error: String(apiError) } 
          })
          .eq('id', transaction.id);

        throw apiError;
      }
    }

    // No userId - just process without wallet (for testing)
    if (useSandbox) {
      return NextResponse.json({
        status: true,
        message: `Airtime purchase successful (sandbox) - ₦${numAmount} to ${phone}`,
        data: {
          reference: 'SANDBOX_' + Date.now(),
          network,
          phone,
          amount: numAmount,
          amountCharged: numAmount * 0.98,
        },
      });
    }

    const result = await purchaseAirtime({ network, phone, amount: numAmount });
    return NextResponse.json({
      status: result.status === 'success',
      message: result.message,
      data: result.data,
    });

  } catch (error) {
    console.error('Airtime purchase error:', error);
    return NextResponse.json(
      { status: false, message: error instanceof Error ? error.message : 'Purchase failed' },
      { status: 500 }
    );
  }
}
