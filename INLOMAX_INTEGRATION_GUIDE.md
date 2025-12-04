# Inlomax API Integration Guide

## Overview
This guide explains how to use the Inlomax API integration in your TADA VTU web application.

## Setup

### 1. Environment Variables
Add your Inlomax API key to your `.env.local` file:
```
INLOMAX_API_KEY=your_inlomax_api_key_here
```

Get your API key from: https://inlomax.com/dashboard/settings/api

### 2. Available API Routes
The following API routes are available:

- `GET /api/inlomax/balance` - Check account balance
- `POST /api/inlomax/airtime` - Buy airtime
- `POST /api/inlomax/data` - Buy data bundles
- `GET /api/inlomax/services` - Get available services
- `GET /api/inlomax/transaction/[reference]` - Get transaction details
- `POST /api/inlomax/cable` - Subscribe to cable TV
- `POST /api/inlomax/electricity` - Buy electricity tokens
- `POST /api/inlomax/webhook` - Webhook endpoint for transaction updates

### 3. Using the React Hooks

#### Basic Usage with useInlomaxApi
```typescript
import { useInlomaxApi } from '@/hooks/use-inlomax-api';

function MyComponent() {
  const { loading, error, execute } = useInlomaxApi();

  const handleTransaction = async () => {
    const result = await execute('/airtime', 'POST', {
      serviceID: 'mtn',
      amount: 100,
      mobileNumber: '08012345678'
    });

    if (result?.status === 'success') {
      console.log('Airtime purchased successfully:', result.data);
    } else {
      console.error('Error:', result?.message || error);
    }
  };

  return (
    <div>
      <button onClick={handleTransaction} disabled={loading}>
        {loading ? 'Processing...' : 'Buy Airtime'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

#### Using Specific Hooks
```typescript
import { useInlomaxAirtime, useInlomaxBalance } from '@/hooks/use-inlomax-api';

function Dashboard() {
  const { loading: balanceLoading, error: balanceError, getBalance } = useInlomaxBalance();
  const { loading: airtimeLoading, error: airtimeError, buyAirtime } = useInlomaxAirtime();

  const handleCheckBalance = async () => {
    const result = await getBalance();
    if (result?.status === 'success') {
      console.log('Balance:', result.data);
    }
  };

  const handleBuyAirtime = async () => {
    const result = await buyAirtime('mtn', 500, '08012345678');
    if (result?.status === 'success') {
      console.log('Airtime purchased successfully');
    }
  };

  return (
    <div>
      <button onClick={handleCheckBalance} disabled={balanceLoading}>
        Check Balance
      </button>
      <button onClick={handleBuyAirtime} disabled={airtimeLoading}>
        Buy Airtime
      </button>
      {(balanceError || airtimeError) && (
        <p className="text-red-500">{balanceError || airtimeError}</p>
      )}
    </div>
  );
}
```

## API Response Format

All API responses follow this format:
```json
{
  "status": "success" | "error",
  "message": "Response message",
  "data": { /* Response data */ }
}
```

## Service IDs

Common service IDs for different networks:
- **MTN**: `mtn`
- **Airtel**: `airtel`
- **Glo**: `glo`
- **9mobile**: `9mobile`

## Error Handling

The integration includes comprehensive error handling:
- Network errors are caught and displayed
- API validation errors are properly formatted
- Loading states are managed automatically

## Webhook Configuration

Set up your webhook URL in the Inlomax dashboard:
```
https://yourdomain.com/api/inlomax/webhook
```

The webhook will receive transaction status updates in this format:
```json
{
  "reference": "transaction_reference",
  "status": "success" | "processing" | "failed",
  "message": "Transaction status update",
  "data": { /* Additional transaction data */ }
}
```

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the API routes:
   ```bash
   # Check balance
   curl http://localhost:3000/api/inlomax/balance

   # Buy airtime (replace with your test data)
   curl -X POST http://localhost:3000/api/inlomax/airtime \
     -H "Content-Type: application/json" \
     -d '{"serviceID":"mtn","amount":100,"mobileNumber":"08012345678"}'
   ```

## Production Deployment

1. Set your production API key in your hosting environment
2. Configure the webhook URL in your Inlomax dashboard
3. Test all endpoints thoroughly before going live

## Support

For Inlomax API support, visit: https://inlomax.com/docs/
For integration issues, check the console logs for detailed error messages.