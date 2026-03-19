import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Parolă incorectă' }, { status: 401 });
    }

    const session = createSession();
    const response = NextResponse.json({ success: true });
    response.cookies.set(session.name, session.value, session.options as Parameters<typeof response.cookies.set>[2]);

    return response;
  } catch {
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 });
  }
}
