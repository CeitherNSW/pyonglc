// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = verifyToken(token);
    return NextResponse.json({ user });
  } catch (err) {
    console.error('Token verification failed:', err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
