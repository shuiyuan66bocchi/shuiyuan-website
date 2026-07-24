import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { signSessionToken } from '@/lib/auth/session';
import { jwtConfig } from '@/lib/auth/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      );
    }

    // Get admin profile (which stores the password hash)
    let profile = await prisma.profile.findUnique({ where: { id: 'default' } });

    // If no profile exists, create a fallback
    if (!profile) {
      return NextResponse.json(
        { message: 'Admin not configured' },
        { status: 500 }
      );
    }

    // Check if a password hash exists
    const passwordHash = (profile as Record<string, unknown>).passwordHash as string | null;

    if (!passwordHash) {
      return NextResponse.json(
        { message: 'Admin password not set. Run `npx prisma db seed` first.' },
        { status: 500 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = await signSessionToken({ sub: 'admin' });

    // Create response with httpOnly cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set(jwtConfig.cookieName, token, jwtConfig.cookie);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
