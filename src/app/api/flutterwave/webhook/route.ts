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
    const signature = request.headers.get('verif-hash');
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

    // Verify webhook signature if secret is configured
    if (secretHash && secretHash !== 'your_webhook_secret_here' && signature !== secretHash) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 401 });
    }

    const payload = await request.json();
    const { event, data } = payload;

    console.log('Flutterwave webhook received:', event, data?.tx_ref);

    if (event === 'charge.completed' && data.status === 'successful') {
      const supabase = getSupabaseAdmin();
      const userId = data.meta?.user_id;
      const amount = data.amount;
      const txRef = data.tx_ref;

      if (!userId || !amount) {
        console.error('Missing user_id or amount in webhook data');
        return NextResponse.json({ status: 'error', message: 'Missing data' }, { status: 400 });
      }

      // Check if transaction already processed
      const { data: existingTxn } = await supabase
        .from('transactions')
        .select('id')
        .eq('reference', txRef)
        .single();

      if (existingTxn) {
        console.log('Transaction already processed:', txRef);
        return NextResponse.json({ status: 'success', message: 'Already processed' });
      }

      // Get user's current balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error('User not found:', userId);
        return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
      }

      // Credit wallet
      const newBalance = (profile.balance || 0) + amount;
      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      // Create transaction record
      await supabase.from('transactions').insert({
        user_id: userId,
        type: 'deposit',
        amount: amount,
        status: 'success',
        description: 'Wallet funding via Flutterwave',
        reference: txRef,
        metadata: {
          flw_ref: data.flw_ref,
          payment_type: data.payment_type,
          customer_email: data.customer?.email,
        }
      });

      console.log('Wallet credited:', { userId, amount, newBalance, txRef });
      return NextResponse.json({ status: 'success', message: 'Wallet credited' });
    }

    // Handle other events
    console.log('Unhandled webhook event:', event);
    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error', message: 'Webhook processing failed' }, { status: 500 });
  }
}
