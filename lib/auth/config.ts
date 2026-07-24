/**
 * Auth configuration
 *
 * JWT_SECRET: used to sign/verify JWT tokens
 *   - Generate one: openssl rand -base64 32
 *   - Set in .env.local for dev, Vercel env for production
 *
 * ADMIN_PASSWORD: the password used to log into /admin
 *   - Store as bcrypt hash in the database (see seed.cjs)
 *   - Fallback env var for initial setup
 */

export const jwtConfig = {
  /** Secret key for signing JWT — must be at least 32 chars */
  get secret(): string {
    return process.env.JWT_SECRET ?? 'dev-jwt-secret-change-in-production-min-32-chars!!';
  },
  /** Token expiry */
  expiresIn: '24h',
  /** Cookie name */
  cookieName: 'session',
  /** Cookie options */
  cookie: {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours in seconds
  },
};
