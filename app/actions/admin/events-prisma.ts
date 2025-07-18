'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '~/app/lib/prisma';
import { z } from 'zod';
import { getCurrentUser } from './auth';
import type { Prisma } from '@prisma/client';

// Схема валидации для событий
const eventSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен'),
  description: z.string().optional().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  category: z.string().min(1, 'Категория обязательна'),
  clientName: z.string().optional().nullable(),
  clientContact: z.string().optional().nullable(),
  clientEmail: z.string().optional().nullable(),
  status: z.string().default('pending'),
  isAllDay: z.boolean().default(false),
  notes: z.string().optional().nullable(),
});

type EventFormData = z.infer<typeof eventSchema>;

// Получение всех событий с фильтрацией
export async function getEvents(
  startDate?: string, 
  endDate?: string, 
  status?: string
) {
  try {
    const whereClause: Prisma.EventWhereInput = {};
    
    // Фильтр по дате
    if (startDate && endDate) {
      whereClause.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    // Фильтр по статусу
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { startDate: 'asc' }
    });

    return events.map(event => ({
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Ошибка при получении событий:', error);
    throw new Error('Не удалось загрузить события');
  }
}

// Получение одного события
export async function getEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new Error('Событие не найдено');
    }

    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Ошибка при получении события:', error);
    throw new Error('Не удалось загрузить событие');
  }
}

// Создание нового события
export async function createEvent(data: EventFormData) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    const result = eventSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Ошибка валидации: ${result.error.errors.map(e => e.message).join(', ')}`);
    }

    const event = await prisma.event.create({
      data: result.data
    });

    revalidatePath('/admin/calendar');
    revalidatePath('/admin');
    
    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Ошибка при создании события:', error);
    throw new Error('Не удалось создать событие');
  }
}

// Обновление события
export async function updateEvent(id: string, data: Partial<EventFormData>) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    const result = eventSchema.partial().safeParse(data);
    if (!result.success) {
      throw new Error(`Ошибка валидации: ${result.error.errors.map(e => e.message).join(', ')}`);
    }

    const event = await prisma.event.update({
      where: { id },
      data: result.data
    });

    revalidatePath('/admin/calendar');
    revalidatePath('/admin');
    
    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Ошибка при обновлении события:', error);
    throw new Error('Не удалось обновить событие');
  }
}

// Удаление события
export async function deleteEvent(id: string) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    await prisma.event.delete({
      where: { id }
    });

    revalidatePath('/admin/calendar');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении события:', error);
    throw new Error('Не удалось удалить событие');
  }
}

// Изменение статуса события
export async function updateEventStatus(id: string, status: string) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    const event = await prisma.event.update({
      where: { id },
      data: { status }
    });

    revalidatePath('/admin/calendar');
    revalidatePath('/admin');
    
    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Ошибка при изменении статуса события:', error);
    throw new Error('Не удалось изменить статус события');
  }
}

// Получение статистики событий
export async function getEventsStatistics() {
  try {
    const [total, pending, confirmed, completed] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: 'pending' } }),
      prisma.event.count({ where: { status: 'confirmed' } }),
      prisma.event.count({ where: { status: 'completed' } })
    ]);

    return {
      total,
      pending,
      confirmed,
      completed
    };
  } catch (error) {
    console.error('Ошибка при получении статистики событий:', error);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0
    };
  }
} 