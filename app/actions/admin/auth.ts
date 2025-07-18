'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '~/app/lib/prisma';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginResult = {
  success: boolean;
  message?: string;
};

export async function login(email: string, password: string, rememberMe: boolean = false): Promise<LoginResult> {
  try {
    // Проверка валидации ввода
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      return {
        success: false,
        message: result.error.errors[0]?.message || 'Ошибка валидации',
      };
    }
    
    // Поиск пользователя в базе данных
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Если пользователь не найден или неактивен
    if (!user || !user.isActive) {
      return {
        success: false,
        message: 'Неверный email или пароль',
      };
    }
    
    // Проверка пароля с использованием bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Неверный email или пароль',
      };
    }
    
    // Обновляем время последнего входа
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    
    // Устанавливаем cookie сессии
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 дней если "Запомнить меня", иначе 7 дней
    (await cookies()).set('admin-session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge,
      path: '/',
    });
    
    return { success: true };
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
  try {
    const sessionToken = (await cookies()).get('admin-session')?.value;
    
    if (!sessionToken) {
      return null;
    }
    
    // Получаем пользователя по ID сессии
    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLogin: true
      }
    });
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Хеширует пароль с использованием bcrypt
 * @param password Пароль для хеширования
 * @returns Хешированный пароль
 */
export async function hashPassword(password: string): Promise<string> {
  // Генерация соли с 12 раундами (оптимальный баланс между безопасностью и производительностью)
  const salt = await bcrypt.genSalt(12);
  // Хеширование пароля с сгенерированной солью
  return bcrypt.hash(password, salt);
} 