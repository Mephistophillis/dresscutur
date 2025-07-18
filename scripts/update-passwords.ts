import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Инициализируем Prisma клиент
const prisma = new PrismaClient();

/**
 * Хеширует пароль с использованием bcrypt
 * @param password Пароль для хеширования
 * @returns Хешированный пароль
 */
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Скрипт для обновления паролей пользователей в базе данных
 * Используется для миграции с хранения паролей в открытом виде к хешированию через bcrypt
 */
async function updatePasswords() {
  try {
    console.log('Начинаем обновление паролей пользователей...');
    
    // Получаем всех пользователей
    const users = await prisma.user.findMany();
    console.log(`Найдено ${users.length} пользователей для обновления`);
    
    // Обновляем пароли для каждого пользователя
    for (const user of users) {
      // Для демонстрационных целей используем стандартные пароли
      // В реальном проекте нужно организовать сброс паролей через email
      
      let plainPassword: string;
      
      // Определяем пароль по умолчанию на основе роли
      if (user.role === 'ADMIN') {
        plainPassword = 'admin123';
      } else if (user.role === 'EDITOR') {
        plainPassword = 'editor123';
      } else {
        plainPassword = 'user123';
      }
      
      // Хешируем пароль
      const hashedPassword = await hashPassword(plainPassword);
      
      // Обновляем пароль в базе данных
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      
      console.log(`Обновлен пароль для пользователя: ${user.email}`);
    }
    
    console.log('Обновление паролей успешно завершено!');
  } catch (error) {
    console.error('Ошибка при обновлении паролей:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем функцию обновления паролей
updatePasswords(); 