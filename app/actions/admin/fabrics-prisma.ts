'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '~/app/lib/prisma';
import { z } from 'zod';
import { getCurrentUser } from './auth';

// Схема валидации для базовых данных ткани
const fabricBaseSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().min(1, 'Описание обязательно'),
  category: z.string().min(1, 'Категория обязательна'),
  image: z.string().optional().nullable(),
  purpose: z.array(z.string()),
  colors: z.array(z.string()),
  price: z.number().optional().nullable(),
  properties: z.array(z.string()),
  recommendations: z.array(z.string()),
  isActive: z.boolean().default(true),
  order: z.number().default(0)
});

// Схема валидации для детальной информации о ткани
const fabricDetailsSchema = z.object({
  composition: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
  weight: z.number().optional().nullable(),
  care: z.array(z.string()),
  origin: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

// Схема для полных данных ткани
const fabricSchema = fabricBaseSchema.extend({
  details: fabricDetailsSchema.optional().nullable()
});

type FabricFormData = z.infer<typeof fabricSchema>;

// Получение всех тканей
export async function getFabrics() {
  try {
    const fabrics = await prisma.fabric.findMany({
      include: {
        details: true,
        gallery: true
      },
      orderBy: { order: 'asc' }
    });
    
    return fabrics;
  } catch (error) {
    console.error('Ошибка при получении тканей:', error);
    return [];
  }
}

// Получение ткани по ID
export async function getFabricById(id: string) {
  try {
    const fabric = await prisma.fabric.findUnique({
      where: { id },
      include: {
        details: true,
        gallery: true
      }
    });
    
    return fabric;
  } catch (error) {
    console.error(`Ошибка при получении ткани с ID ${id}:`, error);
    return null;
  }
}

// Создание новой ткани
export async function createFabric(data: FabricFormData) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const result = fabricSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, errors: result.error.format() };
    }

    const { details, ...fabricData } = result.data;
    
    const newFabric = await prisma.fabric.create({
      data: {
        ...fabricData,
        details: details ? {
          create: details
        } : undefined
      },
      include: {
        details: true
      }
    });

    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true, data: newFabric };
  } catch (error) {
    console.error('Ошибка при создании ткани:', error);
    return { success: false, error: 'Ошибка при создании ткани' };
  }
}

// Обновление ткани
export async function updateFabric(id: string, data: FabricFormData) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const result = fabricSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, errors: result.error.format() };
    }

    const { details, ...fabricData } = result.data;
    
    const fabric = await prisma.fabric.findUnique({
      where: { id },
      include: { details: true }
    });
    
    if (!fabric) {
      return { success: false, error: 'Ткань не найдена' };
    }
    
    const updatedFabric = await prisma.fabric.update({
      where: { id },
      data: {
        ...fabricData,
        details: details ? {
          upsert: {
            create: details,
            update: details
          }
        } : undefined
      },
      include: {
        details: true
      }
    });

    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true, data: updatedFabric };
  } catch (error) {
    console.error(`Ошибка при обновлении ткани с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при обновлении ткани' };
  }
}

// Удаление ткани
export async function deleteFabric(id: string) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    await prisma.fabric.delete({
      where: { id }
    });

    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении ткани с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при удалении ткани' };
  }
}

// Добавление изображения в галерею ткани
export async function addFabricImage(fabricId: string, imageUrl: string, alt: string = '') {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const newImage = await prisma.fabricGallery.create({
      data: {
        fabricId,
        url: imageUrl,
        alt
      }
    });

    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true, data: newImage };
  } catch (error) {
    console.error(`Ошибка при добавлении изображения для ткани с ID ${fabricId}:`, error);
    return { success: false, error: 'Ошибка при добавлении изображения' };
  }
}

// Удаление изображения из галереи ткани
export async function deleteFabricImage(imageId: string) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    await prisma.fabricGallery.delete({
      where: { id: imageId }
    });

    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении изображения с ID ${imageId}:`, error);
    return { success: false, error: 'Ошибка при удалении изображения' };
  }
}

// Изменение порядка ткани
export async function updateFabricOrder(id: string, newOrder: number) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    await prisma.fabric.update({
      where: { id },
      data: { order: newOrder }
    });

    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при изменении порядка ткани с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при изменении порядка' };
  }
}

// Переключение активности ткани
export async function toggleFabricActive(id: string) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const fabric = await prisma.fabric.findUnique({
      where: { id },
      select: { isActive: true }
    });
    
    if (!fabric) {
      return { success: false, error: 'Ткань не найдена' };
    }
    
    await prisma.fabric.update({
      where: { id },
      data: { isActive: !fabric.isActive }
    });

    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при изменении активности ткани с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при изменении активности' };
  }
} 