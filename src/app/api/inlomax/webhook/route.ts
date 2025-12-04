import { NextRequest, NextResponse } from 'next/server';

// Webhook handler for Inlomax transaction updates
// Configure this URL in your Inlomax dashboard: https://yourdomain.com/api/inlomax/webhook

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the webhook payload for debugging
    console.log('Inlomax Webhook received:', JSON.stringify(body, null, 2));

    const { 
      transaction_id,
      status,
      type,
      amount,
      phone,
      network,
      message 
    } = body;

    // Verify the webhook is from Inlomax (add signature verification in production)
    // const signature = request.headers.get('x-inlomax-signature');
    // if (!verifySignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // Process based on transaction status
    switch (status) {
      case 'success':
        // Update transaction in database
        // await updateTransaction(transaction_id, 'completed');
        // Send notification to user
        // await sendNotification(userId, `Your ${type} purchase of ₦${amount} was successful`);
        console.log(`Transaction ${transaction_id} completed successfully`);
        break;

      case 'failed':
        // Update transaction in database
        // await updateTransaction(transaction_id, 'failed');
        // Refund user wallet
        // await refundWallet(userId, amount);
        // Send notification
        // await sendNotification(userId, `Your ${type} purchase failed. ₦${amount} has been refunded.`);
        console.log(`Transaction ${transaction_id} failed: ${message}`);
        break;

      case 'pending':
        // Update transaction status
        // await updateTransaction(transaction_id, 'pending');
        console.log(`Transaction ${transaction_id} is pending`);
        break;

      default:
        console.log(`Unknown status: ${status}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ 
      status: true, 
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Still return 200 to prevent retries for parsing errors
    return NextResponse.json({ 
      status: false, 
      message: 'Webhook processing failed' 
    });
  }
}

// GET method for webhook verification (some providers require this)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    status: true, 
    message: 'Inlomax webhook endpoint is active' 
  });
}
