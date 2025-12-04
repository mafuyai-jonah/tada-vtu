import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Paystack Webhook Handler
// Configure in Paystack Dashboard: Settings → API Keys & Webhooks
// URL: https://yourdomain.com/api/paystack/webhook

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    
    // Verify webhook signature
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (secretKey && signature) {
      const hash = crypto
        .createHmac('sha512', secretKey)
        .update(body)
        .digest('hex');
      
      if (hash !== signature) {
        console.error('Invalid Paystack webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const { event, data } = payload;

    console.log('Paystack Webhook:', event, JSON.stringify(data, null, 2));

    switch (event) {
      case 'charge.success':
        // Payment successful (card or bank transfer)
        const { reference, amount, customer, channel, paid_at } = data;
        
        console.log(`Payment received: ₦${amount / 100} from ${customer?.email}`);
        
        // TODO: Implement in production:
        // 1. Find user by customer email or reference
        // const user = await findUserByEmail(customer.email);
        
        // 2. Credit user's wallet (amount is in kobo, divide by 100)
        // await creditWallet(user.id, amount / 100);
        
        // 3. Record transaction
        // await createTransaction({
        //   userId: user.id,
        //   type: 'credit',
        //   amount: amount / 100,
        //   reference,
        //   channel,
        //   status: 'completed',
        //   description: 'Wallet funding',
        // });
        
        // 4. Send notification
        // await sendNotification(user.id, {
        //   title: 'Wallet Funded',
        //   message: `₦${(amount / 100).toLocaleString()} has been added to your wallet`,
        // });
        
        break;

      case 'dedicatedaccount.assign.success':
        // Virtual account assigned to customer
        console.log('Dedicated account assigned:', data);
        break;

      case 'transfer.success':
        // Withdrawal completed
        console.log('Transfer successful:', data);
        // TODO: Update withdrawal status
        break;

      case 'transfer.failed':
        // Withdrawal failed
        console.log('Transfer failed:', data);
        // TODO: Refund user and notify
        break;

      case 'transfer.reversed':
        // Transfer was reversed
        console.log('Transfer reversed:', data);
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
