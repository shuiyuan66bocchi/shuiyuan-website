import { cookies } from 'next/headers';
import { jwtConfig } from './config';
import { verifySessionToken } from './session';

/**
 * Check if the current request has a valid admin session.
 * Use in API routes to gate POST/PUT/DELETE operations.
 *
 * @returns true if the session cookie contains a valid JWT token
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(jwtConfig.cookieName)?.value;
    if (!token) return false;

    const session = await verifySessionToken(token);
    return session !== null;
  } catch {
    return false;
  }
}

/**
 * Require authentication for an API route.
 * Returns a 401 JSON response if the request is not authenticated.
 *
 * @returns null if authenticated, or a Response to return immediately.
 *
 * @example
 * const authError = await requireAuth();
 * if (authError) return authError;
 */
export async function requireAuth(): Promise<Response | null> {
  const authed = await isAuthenticated();
  if (!authed) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
