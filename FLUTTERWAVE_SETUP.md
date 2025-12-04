# Flutterwave Integration Setup Guide for TADA VTU

## Overview
This guide walks you through integrating Flutterwave payment gateway into your TADA VTU platform for seamless payment processing.

## Prerequisites
- Verified Flutterwave merchant account
- Next.js development environment setup
- Basic understanding of API integration

## Step 1: Get Your Flutterwave Credentials

### From Flutterwave Dashboard
1. Login to your Flutterwave dashboard at https://app.flutterwave.com
2. Navigate to Settings → API
3. Copy your:
   - **Public Key** (for frontend)
   - **Secret Key** (for backend)
   - **Encryption Key** (for webhook verification)

### Test vs Live Keys
- **Test Keys**: Use these for development and testing
- **Live Keys**: Use these for production (after testing)

## Step 2: Environment Setup

### Add to `.env.local`
```bash
# Flutterwave Configuration
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_public_key_here
FLUTTERWAVE_SECRET_KEY=your_secret_key_here
FLUTTERWAVE_ENCRYPTION_KEY=your_encryption_key_here
FLUTTERWAVE_WEBHOOK_SECRET=your_webhook_secret_here

# Environment
NEXT_PUBLIC_FLUTTERWAVE_ENV=test  # or 'live' for production
```

## Step 3: Install Flutterwave Package

```bash
npm install flutterwave-react-native
# or for web version
npm install flutterwave-node-v3
```

## Step 4: Create Flutterwave Service

### File: `src/lib/flutterwave.ts`
```typescript
import FlutterwaveNode from 'flutterwave-node-v3';

const flw = new FlutterwaveNode(
  process.env.FLUTTERWAVE_SECRET_KEY!,
  process.env.NEXT_PUBLIC_FLUTTERWAVE_ENV === 'live' ? 'live' : 'staging'
);

export interface PaymentRequest {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    name: string;
    phonenumber?: string;
  };
  customizations?: {
    title: string;
    description: string;
    logo: string;
  };
}

export const createPayment = async (paymentData: PaymentRequest) => {
  try {
    const response = await flw.StandardPayment.create(paymentData);
    return response;
  } catch (error) {
    console.error('Flutterwave payment creation error:', error);
    throw error;
  }
};

export const verifyPayment = async (transactionId: string) => {
  try {
    const response = await flw.Transaction.verify({ id: transactionId });
    return response;
  } catch (error) {
    console.error('Flutterwave payment verification error:', error);
    throw error;
  }
};
```

## Step 5: Create Payment Component

### File: `src/components/PaymentButton.tsx`
```typescript
'use client';

import { useState } from 'react';
import { createPayment } from '@/lib/flutterwave';

interface PaymentButtonProps {
  amount: number;
  service: string;
  userEmail: string;
  userName: string;
}

export default function PaymentButton({ 
  amount, 
  service, 
  userEmail, 
  userName 
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const txRef = `TADA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentData = {
        tx_ref: txRef,
        amount: amount,
        currency: 'NGN',
        redirect_url: `${window.location.origin}/payment/callback`,
        customer: {
          email: userEmail,
          name: userName,
        },
        customizations: {
          title: 'TADA VTU',
          description: `Payment for ${service}`,
          logo: 'https://your-domain.com/logo.png',
        },
      };

      const response = await createPayment(paymentData);
      
      if (response.status === 'success') {
        // Redirect to Flutterwave payment page
        window.location.href = response.data.link;
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Pay ₦${amount}`}
    </button>
  );
}
```

## Step 6: Create Payment Callback Handler

### File: `src/app/payment/callback/page.tsx`
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyPayment } from '@/lib/flutterwave';

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyTransaction = async () => {
      const transactionId = searchParams.get('transaction_id');
      const txRef = searchParams.get('tx_ref');
      const status = searchParams.get('status');

      if (status === 'successful' && transactionId) {
        try {
          const verification = await verifyPayment(transactionId);
          
          if (verification.data.status === 'successful') {
            // Update your database with successful payment
            // Credit user's wallet or process VTU service
            setStatus('success');
            setMessage('Payment successful! Your service has been activated.');
          } else {
            setStatus('failed');
            setMessage('Payment verification failed.');
          }
        } catch (error) {
          setStatus('failed');
          setMessage('Error verifying payment.');
        }
      } else {
        setStatus('failed');
        setMessage('Payment was not successful.');
      }
    };

    verifyTransaction();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Verifying your payment...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
```

## Step 7: Create Webhook Handler (Backend)

### File: `src/app/api/webhooks/flutterwave/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('verif-hash');
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHash('sha256')
      .update(process.env.FLUTTERWAVE_ENCRYPTION_KEY!)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { event, data } = body;

    if (event === 'charge.completed') {
      // Handle successful payment
      if (data.status === 'successful') {
        // Update database, credit user wallet, etc.
        console.log('Payment successful:', data.tx_ref);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

## Step 8: Configure Webhook in Flutterwave Dashboard

1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/webhooks/flutterwave`
3. Set webhook secret (save this in your `.env.local`)
4. Test webhook connection

## Step 9: Test Integration

### Test Scenarios:
1. **Successful Payment**: Use test card `5531886652142950`
2. **Failed Payment**: Use test card `5590130000000000`
3. **Insufficient Funds**: Use test card `5590130000000001`

### Test Card Details:
- Card Number: `5531886652142950`
- CVV: `564`
- Expiry: `09/32`
- PIN: `3310`
- OTP: `12345`

## Step 10: Go Live Checklist

- [ ] Switch from test to live keys
- [ ] Update webhook URL to production domain
- [ ] Test with real small amount first
- [ ] Set up proper error handling and logging
- [ ] Configure email notifications
- [ ] Set up customer support process

## Common Issues & Solutions

### 1. CORS Issues
- Ensure your domain is whitelisted in Flutterwave dashboard
- Check redirect URLs match exactly

### 2. Webhook Not Working
- Verify webhook signature matches
- Check server can receive external requests
- Test webhook URL accessibility

### 3. Payment Verification Fails
- Ensure transaction ID is valid
- Check API keys are correct
- Verify environment (test vs live)

## Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify webhook signatures**
3. **Use HTTPS** for all payment endpoints
4. **Implement proper error handling**
5. **Log all payment attempts** for audit
6. **Set up monitoring** for failed transactions

## Next Steps

Once you provide your test keys, I can help you:
1. Implement the actual integration code
2. Set up proper error handling
3. Create payment forms for your VTU services
4. Test the complete payment flow

Ready to proceed with the integration?