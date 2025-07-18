'use server';

import { prisma } from '~/app/lib/db';
import type { Prisma } from '@prisma/client';

export interface PublicFabric {
  id: string;
  name: string;
  description: string;
  category: string;
  colors: string[];
  properties: string[];
  image: string | null;
  price: number | null;
  isActive: boolean;
  order: number;
}

export interface FabricFilters {
  categories?: string[];
  colors?: string[];
  properties?: string[];
  search?: string;
}

/**
 * Получает все активные ткани
 */
export async function getActiveFabrics(): Promise<PublicFabric[]> {
  try {
    const fabrics = await prisma.fabric.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return fabrics as PublicFabric[];
  } catch (error) {
    console.error('Error fetching active fabrics:', error);
    return [];
  }
}

/**
 * Получает ткани с применением фильтров
 */
export async function getFilteredFabrics(filters: FabricFilters): Promise<PublicFabric[]> {
  try {
    const { categories, colors, properties, search } = filters;

    // Строим where условие на основе фильтров
    const whereCondition: Prisma.FabricWhereInput = {
      isActive: true,
    };

    // Категории
    if (categories && categories.length > 0) {
      whereCondition.category = {
        in: categories,
      };
    }

    // Цвета - используем ARRAY_CONTAINS для поиска по массиву
    if (colors && colors.length > 0) {
      whereCondition.colors = {
        hasSome: colors,
      };
    }

    // Свойства - используем ARRAY_CONTAINS для поиска по массиву
    if (properties && properties.length > 0) {
      whereCondition.properties = {
        hasSome: properties,
      };
    }

    // Поиск по тексту
    if (search && search.trim() !== '') {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const fabrics = await prisma.fabric.findMany({
      where: whereCondition,
      orderBy: {
        order: 'asc',
      },
    });

    return fabrics as PublicFabric[];
  } catch (error) {
    console.error('Error fetching filtered fabrics:', error);
    return [];
  }
}

/**
 * Получает все уникальные категории тканей
 */
export async function getFabricCategories(): Promise<string[]> {
  try {
    const fabrics = await prisma.fabric.findMany({
      where: {
        isActive: true,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return fabrics.map((fabric: { category: string }) => fabric.category);
  } catch (error) {
    console.error('Error fetching fabric categories:', error);
    return [];
  }
}

/**
 * Получает все уникальные цвета тканей
 */
export async function getFabricColors(): Promise<string[]> {
  try {
    const fabrics = await prisma.fabric.findMany({
      where: {
        isActive: true,
      },
      select: {
        colors: true,
      },
    });

    // Извлекаем все цвета из массивов и удаляем дубликаты
    const allColors = fabrics.flatMap((fabric: { colors: string[] }) => fabric.colors);
    const uniqueColors = [...new Set(allColors)];
    
    return uniqueColors;
  } catch (error) {
    console.error('Error fetching fabric colors:', error);
    return [];
  }
}

/**
 * Получает все уникальные свойства тканей
 */
export async function getFabricProperties(): Promise<string[]> {
  try {
    const fabrics = await prisma.fabric.findMany({
      where: {
        isActive: true,
      },
      select: {
        properties: true,
      },
    });

    // Извлекаем все свойства из массивов и удаляем дубликаты
    const allProperties = fabrics.flatMap((fabric: { properties: string[] }) => fabric.properties);
    const uniqueProperties = [...new Set(allProperties)];
    
    return uniqueProperties;
  } catch (error) {
    console.error('Error fetching fabric properties:', error);
    return [];
  }
} 