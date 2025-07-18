'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '~/app/lib/prisma';
import { z } from 'zod';
import { getCurrentUser } from './auth';
import type { Service } from '@prisma/client';

// Обновляем схему валидации для сервиса
const serviceSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().min(1, 'Описание обязательно'),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
  advantages: z.array(z.string()).default([]), // Добавляем преимущества
  timeline: z.object({
    consultation: z.string().default('30-60 минут'),
    execution: z.string().default('3-14 дней')
  }).default({
    consultation: '30-60 минут',
    execution: '3-14 дней'
  }) // Добавляем сроки
});

type ServiceFormData = z.infer<typeof serviceSchema>;

// Обновляем функцию маппинга данных для включения новых полей
function mapServiceToDto(service: Service) {
  return {
    id: service.id,
    name: service.title,
    description: service.description,
    category: 'tailoring', // Временное значение, в будущем можно добавить поле в модель
    price: null, // Временное значение, в будущем можно добавить поле
    duration: null, // Временное значение, в будущем можно добавить поле
    image: service.image || '',
    icon: service.icon || null, // Добавляем иконку
    features: [], // Временное значение, в будущем можно добавить поле
    isActive: service.isActive,
    order: service.order,
    advantages: service.advantages || [], // Добавляем преимущества
    timeline: service.timeline || { // Добавляем сроки
      consultation: '30-60 минут',
      execution: '3-14 дней'
    },
    details: {
      process: [],
      materials: [],
      recommendations: []
    },
    createdAt: service.createdAt,
    updatedAt: service.updatedAt
  };
}

// Получение всех сервисов
export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
    
    return services.map(mapServiceToDto);
  } catch (error) {
    console.error('Ошибка при получении сервисов:', error);
    return [];
  }
}

// Получение сервиса по ID
export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id }
    });
    
    if (!service) return null;
    
    return mapServiceToDto(service);
  } catch (error) {
    console.error(`Ошибка при получении сервиса с ID ${id}:`, error);
    return null;
  }
}

// Создание нового сервиса
export async function createService(data: ServiceFormData) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const result = serviceSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, errors: result.error.format() };
    }

    const newService = await prisma.service.create({
      data: result.data
    });

    revalidatePath('/admin/services');
    revalidatePath('/services');
    
    return { success: true, data: newService };
  } catch (error) {
    console.error('Ошибка при создании сервиса:', error);
    return { success: false, error: 'Ошибка при создании сервиса' };
  }
}

// Обновление сервиса
export async function updateService(id: string, data: ServiceFormData) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const result = serviceSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, errors: result.error.format() };
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: result.data
    });

    revalidatePath('/admin/services');
    revalidatePath('/services');
    
    return { success: true, data: updatedService };
  } catch (error) {
    console.error(`Ошибка при обновлении сервиса с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при обновлении сервиса' };
  }
}

// Удаление сервиса
export async function deleteService(id: string) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    await prisma.service.delete({
      where: { id }
    });

    revalidatePath('/admin/services');
    revalidatePath('/services');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении сервиса с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при удалении сервиса' };
  }
}

// Изменение порядка сервиса
export async function updateServiceOrder(id: string, newOrder: number) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    await prisma.service.update({
      where: { id },
      data: { order: newOrder }
    });

    revalidatePath('/admin/services');
    revalidatePath('/services');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при изменении порядка сервиса с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при изменении порядка' };
  }
}

// Переключение активности сервиса
export async function toggleServiceActive(id: string) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const service = await prisma.service.findUnique({
      where: { id },
      select: { isActive: true }
    });
    
    if (!service) {
      return { success: false, error: 'Сервис не найден' };
    }
    
    await prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive }
    });

    revalidatePath('/admin/services');
    revalidatePath('/services');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при изменении активности сервиса с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при изменении активности' };
  }
} 