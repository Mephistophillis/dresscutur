'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginResult = {
  success: boolean;
  message?: string;
};

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    // Проверка валидации ввода
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      return {
        success: false,
        message: result.error.errors[0]?.message || 'Ошибка валидации',
      };
    }
    
    // В реальном приложении здесь будет запрос к базе данных и проверка пароля
    // Для демонстрации используем мок-данные
    if (email === 'admin@example.com' && password === 'password') {
      // Устанавливаем cookie сессии
      (await cookies()).set('admin-session', 'dummy-session-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 неделя
        path: '/',
      });
      
      return { success: true };
    }
    
    return {
      success: false,
      message: 'Неверный email или пароль',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Произошла ошибка при входе',
    };
  }
}

export async function logout() {
  (await cookies()).delete('admin-session');
  redirect('/admin/auth');
}

export async function getCurrentUser() {
  // В реальном приложении здесь будет проверка сессии и получение данных пользователя
  // Для демонстрации возвращаем мок-данные
  const sessionToken = (await cookies()).get('admin-session')?.value;
  
  if (!sessionToken) {
    return null;
  }
  
  // Проверка токена будет выполняться здесь
  return {
    id: 'user-1',
    name: 'Администратор',
    email: 'admin@example.com',
    role: 'ADMIN' as const,
  };
} 