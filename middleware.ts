import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-for-development'
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/api/auth')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Pass the user payload via headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  // Protect Frontend routes (Dashboard, Projects, Tasks, Admin)
  if (['/dashboard', '/projects', '/tasks', '/admin'].some(p => request.nextUrl.pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Additional check for admin route
      if (request.nextUrl.pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/projects/:path*', '/tasks/:path*', '/admin/:path*'],
};
