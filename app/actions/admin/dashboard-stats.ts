'use server';

import { prisma } from '~/app/lib/prisma';
import { ContactStatus } from '@prisma/client';

// Получение общей статистики для дашборда
export async function getDashboardStats() {
  try {
    const [
      totalContacts,
      newContacts,
      inProgressContacts,
      totalEvents,
      pendingEvents,
      confirmedEvents,
      completedEvents,
      totalGalleryItems,
      activeGalleryItems,
      totalServices,
      activeServices,
      totalTestimonials,
      activeTestimonials
    ] = await Promise.all([
      // Статистика заявок
      prisma.contact.count(),
      prisma.contact.count({ where: { status: ContactStatus.NEW } }),
      prisma.contact.count({ where: { status: ContactStatus.IN_PROGRESS } }),
      
      // Статистика событий
      prisma.event.count(),
      prisma.event.count({ where: { status: 'pending' } }),
      prisma.event.count({ where: { status: 'confirmed' } }),
      prisma.event.count({ where: { status: 'completed' } }),
      
      // Статистика галереи
      prisma.galleryItem.count(),
      prisma.galleryItem.count({ where: { isActive: true } }),
      
      // Статистика услуг
      prisma.service.count(),
      prisma.service.count({ where: { isActive: true } }),
      
      // Статистика отзывов
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { isActive: true } })
    ]);

    return {
      contacts: {
        total: totalContacts,
        new: newContacts,
        inProgress: inProgressContacts,
        change: newContacts - inProgressContacts // простое вычисление изменения
      },
      events: {
        total: totalEvents,
        pending: pendingEvents,
        confirmed: confirmedEvents,
        completed: completedEvents
      },
      gallery: {
        total: totalGalleryItems,
        active: activeGalleryItems
      },
      services: {
        total: totalServices,
        active: activeServices
      },
      testimonials: {
        total: totalTestimonials,
        active: activeTestimonials
      }
    };
  } catch (error) {
    console.error('Ошибка при получении статистики дашборда:', error);
    return {
      contacts: { total: 0, new: 0, inProgress: 0, change: 0 },
      events: { total: 0, pending: 0, confirmed: 0, completed: 0 },
      gallery: { total: 0, active: 0 },
      services: { total: 0, active: 0 },
      testimonials: { total: 0, active: 0 }
    };
  }
}

// Получение недавних заявок для дашборда
export async function getRecentContacts(limit: number = 5) {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true
      }
    });

    return contacts;
  } catch (error) {
    console.error('Ошибка при получении недавних заявок:', error);
    return [];
  }
}

// Получение недавних событий для дашборда
export async function getRecentEvents(limit: number = 5) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        clientName: true,
        status: true,
        startDate: true,
        createdAt: true
      }
    });

    return events;
  } catch (error) {
    console.error('Ошибка при получении недавних событий:', error);
    return [];
  }
}

// Получение еженедельной статистики заявок
export async function getWeeklyContactsStats() {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [thisWeek, lastWeek] = await Promise.all([
      prisma.contact.count({
        where: {
          createdAt: {
            gte: weekAgo
          }
        }
      }),
      prisma.contact.count({
        where: {
          createdAt: {
            gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
            lt: weekAgo
          }
        }
      })
    ]);

    return {
      thisWeek,
      lastWeek,
      change: thisWeek - lastWeek,
      changePercent: lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0
    };
  } catch (error) {
    console.error('Ошибка при получении еженедельной статистики:', error);
    return {
      thisWeek: 0,
      lastWeek: 0,
      change: 0,
      changePercent: 0
    };
  }
} 