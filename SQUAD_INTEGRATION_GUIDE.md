# Squad Payment Gateway Integration Guide

This guide provides step-by-step instructions for integrating Squad (GTBank) payment gateway into your TADA VTU application.

## Overview

Squad is a payment gateway by GTBank that allows you to accept payments through multiple channels including cards, bank transfers, USSD, and more. This integration supports both one-time payments and recurring payments.

## Setup Instructions

### 1. Create Squad Account

1. **Sandbox Account (for testing):** Visit https://sandbox.squadco.com/sign-up
2. **Production Account (for live transactions):** Visit https://dashboard.squadco.com/sign-up
3. Complete your KYC verification for production account
4. Navigate to Settings > Developer to get your API keys

### 2. Configure Environment Variables

Update your `.env.local` file with your Squad credentials:

```env
# Squad Payment Gateway Configuration (GTBank)
SQUAD_SECRET_KEY=your_squad_secret_key_here
SQUAD_ENVIRONMENT=sandbox # Use 'production' for live transactions
SQUAD_WEBHOOK_SECRET=your_squad_webhook_secret_here # Optional
```

### 3. Configure Webhook URL

In your Squad dashboard:
1. Go to Settings > Webhooks
2. Add your webhook URL: `https://yourdomain.com/api/squad/webhook`
3. Enable webhook notifications for payment events

## Available API Routes

### Payment Initiation
- **Endpoint:** `POST /api/squad/initiate`
- **Purpose:** Initialize a payment and get checkout URL
- **Request Body:**
```json
{
  "amount": 100,              // Amount in NGN (100 = ₦100)
  "email": "customer@email.com",
  "customer_name": "John Doe",
  "callback_url": "https://yourdomain.com/payment/success",
  "payment_channels": ["card", "bank", "ussd", "transfer"],
  "metadata": {
    "service_type": "airtime",
    "phone_number": "08012345678"
  }
}
```

### Transaction Verification
- **Endpoint:** `GET /api/squad/transaction?reference={transaction_ref}`
- **Purpose:** Verify a transaction status
- **Query Parameters:** `reference` (transaction reference)

### Transaction History
- **Endpoint:** `POST /api/squad/transaction`
- **Purpose:** Query transaction history
- **Request Body:**
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "page": 1,
  "perpage": 20
}
```

### Card Charging (Recurring Payments)
- **Endpoint:** `POST /api/squad/charge-card`
- **Purpose:** Charge a saved card using token
- **Request Body:**
```json
{
  "amount": 100,              // Amount in NGN
  "token_id": "AUTH_lBlGESHDLMX_60049043",
  "transaction_ref": "unique_reference"
}
```

### Payment Simulation (Testing Only)
- **Endpoint:** `POST /api/squad/simulate`
- **Purpose:** Simulate payment for testing transfer payments
- **Request Body:**
```json
{
  "virtual_account_number": "9279755518",
  "amount": "20000"
}
```

## React Hooks Usage

### Basic Payment Flow

```tsx
import { useSquadPayment, useSquadCheckout } from '@/hooks/use-squad-api';

function PaymentComponent() {
  const { initiatePayment, loading, error } = useSquadPayment({
    onSuccess: (data) => {
      console.log('Payment initiated:', data);
      // Redirect to checkout URL
      window.location.href = data.checkout_url;
    },
    onError: (error) => {
      console.error('Payment failed:', error);
    }
  });

  const handlePayment = async () => {
    try {
      await initiatePayment({
        amount: 100, // ₦100
        email: 'customer@email.com',
        customer_name: 'John Doe',
        metadata: {
          service_type: 'airtime',
          phone_number: '08012345678'
        }
      });
    } catch (error) {
      // Handle error
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay with Squad'}
    </button>
  );
}
```

### Transaction Verification

```tsx
import { useSquadTransaction } from '@/hooks/use-squad-api';

function TransactionVerification({ reference }: { reference: string }) {
  const { verifyTransaction, loading, data, error } = useSquadTransaction();

  useEffect(() => {
    if (reference) {
      verifyTransaction(reference);
    }
  }, [reference]);

  if (loading) return <div>Verifying transaction...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h3>Transaction Status: {data.data.transaction_status}</h3>
      <p>Amount: ₦{data.data.transaction_amount / 100}</p>
      <p>Reference: {data.data.transaction_ref}</p>
    </div>
  );
}
```

### Recurring Payments

```tsx
import { useSquadCardCharge } from '@/hooks/use-squad-api';

function RecurringPayment({ tokenId }: { tokenId: string }) {
  const { chargeCard, loading, error } = useSquadCardCharge();

  const handleRecurringPayment = async () => {
    try {
      await chargeCard({
        amount: 500, // ₦500
        token_id: tokenId,
        transaction_ref: `recurring_${Date.now()}`
      });
      console.log('Recurring payment successful');
    } catch (error) {
      console.error('Recurring payment failed:', error);
    }
  };

  return (
    <button onClick={handleRecurringPayment} disabled={loading}>
      {loading ? 'Processing...' : 'Make Recurring Payment'}
    </button>
  );
}
```

## Payment Channels

Squad supports the following payment channels:

1. **Card Payments** - Visa, Mastercard, Verve
2. **Bank Transfer** - Dynamic virtual accounts
3. **USSD** - *737#, *919#, etc.
4. **Bank** - Direct bank debit

You can specify which channels to enable in your payment request:

```json
{
  "payment_channels": ["card", "bank", "ussd"]
}
```

## Webhook Events

The webhook endpoint (`/api/squad/webhook`) handles these events:

- `charge_successful` - Payment completed successfully
- `charge_failed` - Payment failed
- `transfer_successful` - Transfer payment completed
- `refund_successful` - Refund processed successfully

## Testing

### Test Cards (Sandbox)

Use these test cards in sandbox environment:

- **Success Card:** 5200000000000007
- **Decline Card:** 5105105105105100
- **Insufficient Funds:** 4000000000000002

### Test Amounts

- Amounts ending in `00` - Success
- Amounts ending in `11` - Failed transaction
- Amounts ending in `22` - Pending transaction

### Simulating Transfer Payments

1. Initiate payment with transfer channel enabled
2. Copy the virtual account number from the checkout modal
3. Use the simulate endpoint to complete the payment:

```bash
curl -X POST http://localhost:3000/api/squad/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "virtual_account_number": "9279755518",
    "amount": "20000"
  }'
```

## Error Handling

Common error responses:

```json
{
  "error": "Amount and email are required"
}
```

```json
{
  "error": "Squad API key not configured"
}
```

```json
{
  "error": "Failed to initiate payment: Invalid API key"
}
```

## Security Best Practices

1. **Never expose your secret key** - Keep `SQUAD_SECRET_KEY` in environment variables only
2. **Validate webhook signatures** - Implement webhook signature verification
3. **Use HTTPS** - Always use HTTPS in production
4. **Validate amounts** - Double-check amounts before processing payments
5. **Log transactions** - Keep detailed logs for audit purposes

## Production Deployment

1. **Update Environment:**
   ```env
   SQUAD_ENVIRONMENT=production
   SQUAD_SECRET_KEY=your_live_secret_key
   ```

2. **Configure Live Webhook URL:**
   ```
   https://yourdomain.com/api/squad/webhook
   ```

3. **Test with small amounts first**

4. **Monitor webhook logs**

5. **Set up error monitoring**

## Support

- **Squad Documentation:** https://docs.squadco.com/
- **Squad Support:** help@squadco.com
- **Integration Support:** Join Squad Integration Channel on Teams

## Integration Status

✅ Payment initiation
✅ Transaction verification
✅ Transaction history queries
✅ Card tokenization
✅ Recurring payments
✅ Webhook handling
✅ Payment simulation (testing)
✅ React hooks
✅ TypeScript support

Your Squad integration is now ready for testing and deployment!