'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '~/app/lib/prisma';
import { z } from 'zod';
import { getCurrentUser } from './auth';
import type { GalleryItem, GalleryRelatedImage } from '@prisma/client';

// Схема валидации для галереи
const galleryItemSchema = z.object({
  src: z.string().min(1, 'Изображение обязательно'),
  alt: z.string().default(''),
  category: z.string().min(1, 'Категория обязательна'),
  description: z.string().min(1, 'Описание обязательно'),
  isNew: z.boolean().default(false),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  client: z.string().optional().nullable(),
  materials: z.array(z.string()).default([]),
  date: z.string().optional().nullable(),
  process: z.string().optional().nullable()
});

type GalleryItemFormData = z.infer<typeof galleryItemSchema>;

// Маппинг данных из базы данных в DTO
function mapGalleryItemToDto(item: GalleryItem, relatedImages: GalleryRelatedImage[] = []) {
  return {
    id: item.id,
    title: item.description.substring(0, 50) + (item.description.length > 50 ? '...' : ''),
    description: item.description,
    category: item.category,
    imageSrc: item.src,
    tags: [], // Можно добавить поле tags в модель GalleryItem
    isActive: item.isActive,
    isFeatured: item.isNew, // Маппинг isNew как isFeatured для совместимости
    order: item.order,
    details: {
      client: item.client || '',
      completionDate: item.date || '',
      additionalImages: relatedImages.map(img => img.src),
      serviceType: '',
      fabric: item.materials?.join(', ') || '',
      notes: item.process || ''
    },
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

// Получение всех элементов галереи
export async function getGalleryItems() {
  try {
    const items = await prisma.galleryItem.findMany({
      include: {
        relatedImages: true
      },
      orderBy: { order: 'asc' }
    });
    
    return items.map(item => 
      mapGalleryItemToDto(item, item.relatedImages)
    );
  } catch (error) {
    console.error('Ошибка при получении элементов галереи:', error);
    throw new Error('Не удалось загрузить элементы галереи');
  }
}

// Получение одного элемента галереи
export async function getGalleryItem(id: string) {
  try {
    const item = await prisma.galleryItem.findUnique({
      where: { id },
      include: {
        relatedImages: true
      }
    });

    if (!item) {
      throw new Error('Элемент галереи не найден');
    }

    return mapGalleryItemToDto(item, item.relatedImages);
  } catch (error) {
    console.error('Ошибка при получении элемента галереи:', error);
    throw new Error('Не удалось загрузить элемент галереи');
  }
}

// Создание нового элемента галереи
export async function createGalleryItem(data: GalleryItemFormData) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    const result = galleryItemSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Ошибка валидации: ${result.error.errors.map(e => e.message).join(', ')}`);
    }

    const item = await prisma.galleryItem.create({
      data: result.data,
      include: {
        relatedImages: true
      }
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return mapGalleryItemToDto(item, item.relatedImages);
  } catch (error) {
    console.error('Ошибка при создании элемента галереи:', error);
    throw new Error('Не удалось создать элемент галереи');
  }
}

// Обновление элемента галереи
export async function updateGalleryItem(id: string, data: Partial<GalleryItemFormData>) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    const result = galleryItemSchema.partial().safeParse(data);
    if (!result.success) {
      throw new Error(`Ошибка валидации: ${result.error.errors.map(e => e.message).join(', ')}`);
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: result.data,
      include: {
        relatedImages: true
      }
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return mapGalleryItemToDto(item, item.relatedImages);
  } catch (error) {
    console.error('Ошибка при обновлении элемента галереи:', error);
    throw new Error('Не удалось обновить элемент галереи');
  }
}

// Удаление элемента галереи
export async function deleteGalleryItem(id: string) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    await prisma.galleryItem.delete({
      where: { id }
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении элемента галереи:', error);
    throw new Error('Не удалось удалить элемент галереи');
  }
}

// Обновление порядка элементов галереи
export async function updateGalleryItemsOrder(items: { id: string; order: number }[]) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    await prisma.$transaction(
      items.map(item =>
        prisma.galleryItem.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении порядка элементов галереи:', error);
    throw new Error('Не удалось обновить порядок элементов');
  }
}

// Переключение статуса активности элемента галереи
export async function toggleGalleryItemStatus(id: string) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    const currentItem = await prisma.galleryItem.findUnique({
      where: { id },
      select: { isActive: true }
    });

    if (!currentItem) {
      throw new Error('Элемент галереи не найден');
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: { isActive: !currentItem.isActive },
      include: {
        relatedImages: true
      }
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return mapGalleryItemToDto(item, item.relatedImages);
  } catch (error) {
    console.error('Ошибка при переключении статуса элемента галереи:', error);
    throw new Error('Не удалось изменить статус элемента');
  }
}

// Переключение статуса "New" элемента галереи
export async function toggleGalleryItemNew(id: string) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    const currentItem = await prisma.galleryItem.findUnique({
      where: { id },
      select: { isNew: true }
    });

    if (!currentItem) {
      throw new Error('Элемент галереи не найден');
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: { isNew: !currentItem.isNew },
      include: {
        relatedImages: true
      }
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return mapGalleryItemToDto(item, item.relatedImages);
  } catch (error) {
    console.error('Ошибка при переключении статуса New элемента галереи:', error);
    throw new Error('Не удалось изменить статус элемента');
  }
}

// Добавление связанного изображения
export async function addRelatedImage(galleryItemId: string, src: string, alt?: string) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    const relatedImage = await prisma.galleryRelatedImage.create({
      data: {
        galleryItemId,
        src,
        alt: alt || ''
      }
    });

    revalidatePath('/admin/gallery');
    
    return relatedImage;
  } catch (error) {
    console.error('Ошибка при добавлении связанного изображения:', error);
    throw new Error('Не удалось добавить изображение');
  }
}

// Удаление связанного изображения
export async function removeRelatedImage(id: string) {
  try {
    await getCurrentUser(); // Проверяем авторизацию

    await prisma.galleryRelatedImage.delete({
      where: { id }
    });

    revalidatePath('/admin/gallery');
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении связанного изображения:', error);
    throw new Error('Не удалось удалить изображение');
  }
}

// Получение элементов галереи для публичной страницы
export async function getPublicGalleryItems(category?: string) {
  try {
    const items = await prisma.galleryItem.findMany({
      where: {
        isActive: true,
        ...(category && { category })
      },
      include: {
        relatedImages: true
      },
      orderBy: { order: 'asc' }
    });
    
    return items.map(item => 
      mapGalleryItemToDto(item, item.relatedImages)
    );
  } catch (error) {
    console.error('Ошибка при получении публичных элементов галереи:', error);
    throw new Error('Не удалось загрузить галерею');
  }
} 