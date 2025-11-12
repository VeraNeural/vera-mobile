import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: 'tRPC has been retired. Call Supabase or NestJS endpoints instead.' },
    { status: 410 }
  );
}
