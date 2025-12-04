import { NextRequest, NextResponse } from 'next/server';
import { createCustomer, createDedicatedAccount, getDedicatedAccounts } from '@/lib/api/paystack';

// Get or create dedicated virtual account for user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, firstName, lastName, phone } = body;

    if (!userId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { status: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // First, create or get customer
    let customerCode: string;
    
    try {
      // Try to create new customer
      const customerResult = await createCustomer({
        email,
        firstName,
        lastName,
        phone,
      });
      customerCode = customerResult.data.customer_code;
    } catch (error: unknown) {
      // Customer might already exist, extract customer code from error or use email
      // Paystack returns customer_code in error if customer exists
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('Customer')) {
        // Try to get existing dedicated accounts using email as identifier
        customerCode = `CUS_${email.replace(/[^a-zA-Z0-9]/g, '')}`;
      } else {
        throw error;
      }
    }

    // Try to get existing dedicated accounts
    try {
      const existingAccounts = await getDedicatedAccounts(customerCode);
      if (existingAccounts.data && existingAccounts.data.length > 0) {
        return NextResponse.json({
          status: true,
          data: {
            accounts: existingAccounts.data.map(acc => ({
              bankName: acc.bank.name,
              accountNumber: acc.account_number,
              accountName: acc.account_name,
            })),
          },
        });
      }
    } catch {
      // No existing accounts, create new one
    }

    // Create dedicated account
    const accountResult = await createDedicatedAccount(customerCode);

    return NextResponse.json({
      status: true,
      data: {
        accounts: [{
          bankName: accountResult.data.bank.name,
          accountNumber: accountResult.data.account_number,
          accountName: accountResult.data.account_name,
        }],
      },
    });

  } catch (error) {
    console.error('Account creation error:', error);
    return NextResponse.json(
      { status: false, message: error instanceof Error ? error.message : 'Failed to get account' },
      { status: 500 }
    );
  }
}
