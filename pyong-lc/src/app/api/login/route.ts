// app/api/login/route.ts
import { signToken } from '@/lib/jwt';
import { ADMIN_USERNAME, ADMIN_PASSWORD_HASH } from '@/lib/credentials';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username !== ADMIN_USERNAME) {
    console.log("username")
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) {
    console.log("pword")
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ role: 'admin' });

  const res = NextResponse.json({ message: 'Login successful' });
  res.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
  });

  return res;
}
