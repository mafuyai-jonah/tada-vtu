import { NextRequest, NextResponse } from 'next/server';
import { getInlomaxTransactionDetails } from '@/lib/api/inlomax';

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const { reference } = params;

    if (!reference) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Transaction reference is required' 
        },
        { status: 400 }
      );
    }

    const transaction = await getInlomaxTransactionDetails(reference);
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching Inlomax transaction details:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to fetch transaction details' 
      },
      { status: 500 }
    );
  }
}