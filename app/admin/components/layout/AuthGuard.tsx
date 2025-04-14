'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// В реальном приложении здесь будет импорт getCurrentUser из server actions
const checkAuth = async () => {
  // Имитация проверки авторизации
  // В реальном приложении здесь будет запрос к серверу
  return true; // Для демонстрации всегда возвращаем true
};

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const isAuth = await checkAuth();
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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