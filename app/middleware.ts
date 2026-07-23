import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export function middleware(request: NextRequest) {
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow requests to static assets and API routes within admin
    if (request.nextUrl.pathname.startsWith('/admin/projects/new') ||
        request.nextUrl.pathname.startsWith('/admin/posts/new')) {
      // These need the token check too
    }

    const token = request.cookies.get('admin_token')?.value;

    // If no ADMIN_TOKEN is configured, allow access (fallback for dev)
    if (!ADMIN_TOKEN) {
      return NextResponse.next();
    }

    if (!token || token !== ADMIN_TOKEN) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
