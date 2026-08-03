import { isAuthenticated } from '@/lib/auth/apiAuth';

export async function GET() {
  const authed = await isAuthenticated();
  return Response.json({ authenticated: authed });
}
