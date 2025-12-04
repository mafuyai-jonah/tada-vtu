import { NextRequest, NextResponse } from 'next/server';
import { getInlomaxServices } from '@/lib/api/inlomax';

export async function GET(request: NextRequest) {
  try {
    const services = await getInlomaxServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching Inlomax services:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to fetch services' 
      },
      { status: 500 }
    );
  }
}