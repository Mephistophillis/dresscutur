'use server';

import { prisma } from '~/app/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';

// Схема валидации для FAQ
const faqSchema = z.object({
  category: z.string().min(1, 'Категория обязательна'),
  title: z.string().optional().nullable(),
  question: z.string().min(1, 'Вопрос обязателен'),
  answer: z.string().min(1, 'Ответ обязателен'),
  isActive: z.boolean().default(true),
  order: z.number().default(0)
});

type FAQFormData = z.infer<typeof faqSchema>;

// Получение всех FAQ
export async function getFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });
    
    return faqs;
  } catch (error) {
    console.error('Ошибка при получении FAQ:', error);
    return [];
  }
}

// Получение FAQ по ID
export async function getFAQById(id: string) {
  try {
    const faq = await prisma.fAQ.findUnique({
      where: { id }
    });
    
    return faq;
  } catch (error) {
    console.error(`Ошибка при получении FAQ с ID ${id}:`, error);
    return null;
  }
}

// Получение FAQ по категории
export async function getFAQsByCategory(category: string) {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { 
        category,
        isActive: true
      },
      orderBy: { order: 'asc' }
    });
    
    return faqs;
  } catch (error) {
    console.error(`Ошибка при получении FAQ в категории ${category}:`, error);
    return [];
  }
}

// Создание нового FAQ
export async function createFAQ(data: FAQFormData) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const result = faqSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, errors: result.error.format() };
    }
    
    const newFAQ = await prisma.fAQ.create({
      data: {
        ...result.data
      }
    });
    
    revalidatePath('/admin/faqs');
    revalidatePath('/faqs');
    
    return { success: true, data: newFAQ };
  } catch (error) {
    console.error('Ошибка при создании FAQ:', error);
    return { success: false, error: 'Ошибка при создании FAQ' };
  }
}

// Обновление FAQ
export async function updateFAQ(id: string, data: FAQFormData) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const result = faqSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, errors: result.error.format() };
    }
    
    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: result.data
    });
    
    revalidatePath('/admin/faqs');
    revalidatePath('/faqs');
    
    return { success: true, data: updatedFAQ };
  } catch (error) {
    console.error(`Ошибка при обновлении FAQ с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при обновлении FAQ' };
  }
}

// Удаление FAQ
export async function deleteFAQ(id: string) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    await prisma.fAQ.delete({
      where: { id }
    });
    
    revalidatePath('/admin/faqs');
    revalidatePath('/faqs');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении FAQ с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при удалении FAQ' };
  }
}

// Изменение порядка FAQ
export async function updateFAQOrder(id: string, newOrder: number) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    await prisma.fAQ.update({
      where: { id },
      data: { order: newOrder }
    });
    
    revalidatePath('/admin/faqs');
    revalidatePath('/faqs');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при изменении порядка FAQ с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при изменении порядка' };
  }
}

// Переключение активности FAQ
export async function toggleFAQActive(id: string) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const faq = await prisma.fAQ.findUnique({
      where: { id },
      select: { isActive: true }
    });
    
    if (!faq) {
      return { success: false, error: 'FAQ не найден' };
    }
    
    await prisma.fAQ.update({
      where: { id },
      data: { isActive: !faq.isActive }
    });
    
    revalidatePath('/admin/faqs');
    revalidatePath('/faqs');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при изменении активности FAQ с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при изменении активности' };
  }
}

// Функция оценки полезности FAQ удалена, поскольку поля helpful и notHelpful отсутствуют в схеме 