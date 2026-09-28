import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySession } from './auth';

// Anropas först i varje server action som bara admin får köra.
export async function requireAdmin() {
  const s = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!s) redirect('/admin/login');
  return s;
}
