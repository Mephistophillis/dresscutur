'use server';

import { prisma } from '~/app/lib/prisma';
import { Testimonial } from '~/app/lib/definitions';

/**
 * Получает активные отзывы клиентов, отсортированные по порядку
 */
export async function getActiveTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        {
          order: 'asc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });
    
    return testimonials;
  } catch (error) {
    console.error('Error fetching active testimonials:', error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

/**
 * Получает все отзывы клиентов
 */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [
        {
          order: 'asc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });
    
    return testimonials;
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

/**
 * Получает отзыв по ID
 */
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: {
        id
      }
    });
    
    return testimonial;
  } catch (error) {
    console.error(`Error fetching testimonial with ID ${id}:`, error);
    return null;
  }
} 