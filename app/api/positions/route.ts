import { NextResponse } from 'next/server';
import { getMockPositions } from '@/lib/db-mock';

export async function GET() {
  try {
    const positions = getMockPositions();
    return NextResponse.json({ positions });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
