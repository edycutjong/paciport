import { NextResponse } from 'next/server';
import { getMigrations } from '@/lib/db-mock';

export async function GET() {
  try {
    const migrations = getMigrations();
    return NextResponse.json({ migrations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
