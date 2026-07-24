import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Read env var inside the function for better Edge Runtime compatibility
    const adminToken = process.env.ADMIN_TOKEN;

    // If no ADMIN_TOKEN is configured, allow access (dev mode)
    if (!adminToken) {
      console.warn('ADMIN_TOKEN not set — /admin is open to everyone');
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token || token !== adminToken) {
      // Redirect to home page
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
