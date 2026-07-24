import { SignJWT, jwtVerify } from 'jose';
import { jwtConfig } from './config';

const encoder = new TextEncoder();

function getSecretKey(): Uint8Array {
  return encoder.encode(jwtConfig.secret);
}

export interface SessionPayload {
  /** Admin user ID */
  sub: string;
  /** Login timestamp */
  iat?: number;
}

/**
 * Sign a JWT token for the admin session.
 * Called after successful login.
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(jwtConfig.expiresIn)
    .sign(getSecretKey());
}

/**
 * Verify a JWT token and return the session payload.
 * Called on every /admin request via proxy.ts.
 * Returns null if token is invalid or expired.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
