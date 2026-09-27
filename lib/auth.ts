import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'ng_admin';
const MAX_AGE = 60 * 60 * 12; // 12 timmar

function secret() {
  const s = process.env.AUTH_SECRET || 'dev-secret-byt-mig-i-vercel-env-minst-32-tecken';
  return new TextEncoder().encode(s);
}

export function adminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || 'admin@admin.se').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'test123',
  };
}

export async function createSession(email: string) {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === 'admin' ? (payload as { email: string }) : null;
  } catch {
    return null;
  }
}

export const sessionMaxAge = MAX_AGE;
