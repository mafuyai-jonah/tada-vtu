import { NextRequest, NextResponse } from 'next/server';
import { getInlomaxBalance } from '@/lib/api/inlomax';

export async function GET(request: NextRequest) {
  try {
    const balance = await getInlomaxBalance();
    return NextResponse.json(balance);
  } catch (error) {
    console.error('Error fetching Inlomax balance:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to fetch balance' 
      },
      { status: 500 }
    );
  }
}