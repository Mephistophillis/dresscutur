import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Маршруты, которые не требуют аутентификации
const publicRoutes = ['/admin/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware debug:', {
    pathname,
    cookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
    sessionCookie: !!request.cookies.get('admin-session'),
    userAgent: request.headers.get('user-agent')?.substring(0, 50)
  });
  
  // Проверяем, является ли текущий маршрут частью админки
  if (pathname.startsWith('/admin') && !publicRoutes.includes(pathname)) {
    const sessionToken = request.cookies.get('admin-session');
    // Если нет токена сессии, перенаправляем на страницу входа
    if (!sessionToken) {
      console.log('No session token in middleware, redirecting to auth');
      const url = new URL('/admin/auth', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Конфигурация для middleware
export const config = {
  matcher: [
    '/admin/:path*'
  ],
}; 