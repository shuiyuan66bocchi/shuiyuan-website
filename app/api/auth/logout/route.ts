import { NextResponse } from 'next/server';
import { jwtConfig } from '@/lib/auth/config';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the session cookie
  response.cookies.set(jwtConfig.cookieName, '', {
    ...jwtConfig.cookie,
    maxAge: 0, // immediately expire
  });

  return response;
}
