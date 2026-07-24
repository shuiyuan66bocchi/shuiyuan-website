import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken) {
      console.warn('ADMIN_TOKEN not set — /admin is open to everyone');
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token || token !== adminToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
