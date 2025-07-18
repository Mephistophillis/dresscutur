'use server';

import { prisma } from '~/app/lib/prisma';
import { cache } from 'react';

export type PublicGalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  description: string;
  isNew: boolean;
  isActive: boolean;
  order: number;
};

export type PublicGalleryItemDetails = PublicGalleryItem & {
  details: {
    client?: string;
    materials?: string[];
    date?: string;
    process?: string;
  } | null;
  relatedImages: {
    id: string;
    src: string;
    alt?: string;
  }[];
};

// Кэшированная функция для получения активных элементов галереи
export const getActiveGalleryItems = cache(async (): Promise<PublicGalleryItem[]> => {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        src: true,
        alt: true,
        category: true,
        description: true,
        isNew: true,
        isActive: true,
        order: true
      }
    });
    
    return galleryItems;
  } catch (error) {
    console.error('Ошибка при получении элементов галереи:', error);
    return [];
  }
});

// Получение избранных новых элементов галереи для главной страницы
export const getNewGalleryItems = cache(async (limit: number = 6): Promise<PublicGalleryItem[]> => {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: { 
        isActive: true,
        isNew: true 
      },
      orderBy: { order: 'asc' },
      take: limit,
      select: {
        id: true,
        src: true,
        alt: true,
        category: true,
        description: true,
        isNew: true,
        isActive: true,
        order: true
      }
    });
    
    return galleryItems;
  } catch (error) {
    console.error('Ошибка при получении новых элементов галереи:', error);
    return [];
  }
});

// Получение детальной информации о галерейном элементе
export const getGalleryItemDetails = cache(async (id: string): Promise<PublicGalleryItemDetails | null> => {
  try {
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { 
        id,
        isActive: true
      },
      include: {
        relatedImages: true
      }
    });
    
    if (!galleryItem) {
      return null;
    }
    
    // Преобразуем данные в нужный формат
    return {
      id: galleryItem.id,
      src: galleryItem.src,
      alt: galleryItem.alt,
      category: galleryItem.category,
      description: galleryItem.description,
      isNew: galleryItem.isNew,
      isActive: galleryItem.isActive,
      order: galleryItem.order,
      details: {
        client: galleryItem.client || undefined,
        materials: galleryItem.materials || [],
        date: galleryItem.date || undefined,
        process: galleryItem.process || undefined
      },
      relatedImages: galleryItem.relatedImages.map(img => ({
        id: img.id,
        src: img.src,
        alt: img.alt || undefined
      }))
    };
  } catch (error) {
    console.error(`Ошибка при получении деталей галерейного элемента с ID ${id}:`, error);
    return null;
  }
}); 