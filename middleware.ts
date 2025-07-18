import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Маршруты, которые не требуют аутентификации
const publicRoutes = ['/admin/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Проверяем, является ли текущий маршрут частью админки
  if (pathname.startsWith('/admin') && !publicRoutes.includes(pathname)) {
    const sessionToken = request.cookies.get('admin-session');
    console.log(sessionToken);
    // Если нет токена сессии, перенаправляем на страницу входа
    if (!sessionToken) {
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