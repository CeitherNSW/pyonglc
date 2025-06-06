// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.set('token', '', { maxAge: 0 });
  return res;
}
