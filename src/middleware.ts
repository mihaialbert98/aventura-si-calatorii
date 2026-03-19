import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip auth check for the login page itself and API routes
    if (pathname === '/admin/login' || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Check auth for all other /admin routes
    if (pathname.startsWith('/admin')) {
        const session = request.cookies.get('admin_session');
        const secret = process.env.ADMIN_SECRET || 'secret';

        if (session?.value !== secret) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
