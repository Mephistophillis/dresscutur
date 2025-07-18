'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '~/app/actions/admin/auth';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const user = await getCurrentUser();
        const isAuth = !!user;
        setIsAuthenticated(isAuth);
        
        if (!isAuth) {
          router.push('/admin/auth');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        router.push('/admin/auth');
      }
    };

    validateAuth();
  }, [router]);

  // Показываем загрузчик, пока проверяем авторизацию
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-violet-600 rounded-full opacity-20"></div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Проверяем авторизацию...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, ничего не рендерим
  // редирект на страницу авторизации уже выполнен в useEffect
  if (isAuthenticated === false) {
    return null;
  }

  // Если пользователь авторизован, показываем содержимое
  return <>{children}</>;
} 