import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction, verifyTransactionByRef } from '@/lib/api/flutterwave';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transaction_id = searchParams.get('transaction_id');
    const tx_ref = searchParams.get('tx_ref');

    if (!transaction_id && !tx_ref) {
      return NextResponse.json(
        { status: 'error', message: 'transaction_id or tx_ref is required' },
        { status: 400 }
      );
    }

    let result;
    if (transaction_id) {
      result = await verifyTransaction(transaction_id);
    } else if (tx_ref) {
      result = await verifyTransactionByRef(tx_ref);
    }

    if (result?.data?.status === 'successful') {
      return NextResponse.json({
        status: 'success',
        message: 'Transaction verified',
        data: {
          amount: result.data.amount,
          currency: result.data.currency,
          tx_ref: result.data.tx_ref,
          flw_ref: result.data.flw_ref,
          status: result.data.status,
          customer: result.data.customer,
        },
      });
    }

    return NextResponse.json({
      status: 'error',
      message: 'Transaction not successful',
      data: result?.data,
    });
  } catch (error) {
    console.error('Flutterwave verify error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Verification failed',
      },
      { status: 500 }
    );
  }
}
