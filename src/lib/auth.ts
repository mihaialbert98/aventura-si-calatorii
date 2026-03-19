import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SECRET = process.env.ADMIN_SECRET || 'secret';

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === SECRET;
}

export function createSession(): { name: string; value: string; options: object } {
  return {
    name: SESSION_COOKIE,
    value: SECRET,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    },
  };
}

export function destroySession(): { name: string; value: string; options: object } {
  return {
    name: SESSION_COOKIE,
    value: '',
    options: { maxAge: 0, path: '/' },
  };
}
