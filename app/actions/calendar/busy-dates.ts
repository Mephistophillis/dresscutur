'use server';

import { prisma } from '~/app/lib/prisma';

interface TimeSlot {
  start: string;
  end: string;
}

interface BusyDate {
  date: string;
  timeSlots?: TimeSlot[];
  isFullDay: boolean;
}

export async function getBusyDates(startDate: string, endDate: string): Promise<{ busyDates: BusyDate[] }> {
  try {
    // Преобразуем строки в даты
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Проверяем корректность дат
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      throw new Error('Invalid date format');
    }

    // Получаем события из базы данных за указанный период
    const events = await prisma.event.findMany({
      where: {
        startDate: {
          gte: startDateObj,
        },
        endDate: {
          lte: endDateObj,
        },
        status: {
          in: ['confirmed', 'pending'],
        },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        isAllDay: true,
      },
    });

    // Преобразуем события в формат занятых дат
    const busyDates = events.map(event => {
      const date = new Date(event.startDate);
      date.setHours(0, 0, 0, 0); // Сбрасываем время до начала дня
      
      return {
        date: date.toISOString().split('T')[0], // Только дата в формате YYYY-MM-DD
        timeSlots: !event.isAllDay ? [
          {
            start: new Date(event.startDate).toISOString(),
            end: new Date(event.endDate).toISOString(),
          }
        ] : undefined,
        isFullDay: event.isAllDay,
      };
    });

    // Группируем временные слоты для одной даты
    const groupedBusyDates = busyDates.reduce<BusyDate[]>((acc, curr) => {
      const existingDateIndex = acc.findIndex(item => item.date === curr.date);
      
      if (existingDateIndex >= 0) {
        // Дата уже есть в результатах
        const existing = acc[existingDateIndex];
        
        // Если текущее событие на весь день, отмечаем весь день как занятый
        if (curr.isFullDay) {
          acc[existingDateIndex] = { ...existing, isFullDay: true };
        } 
        // Иначе добавляем временной слот
        else if (curr.timeSlots && existing.timeSlots) {
          acc[existingDateIndex].timeSlots = [...existing.timeSlots, ...curr.timeSlots];
        }
      } else {
        // Добавляем новую дату
        acc.push(curr);
      }
      
      return acc;
    }, []);

    // Возвращаем результат
    return { busyDates: groupedBusyDates };
  } catch (error) {
    console.error('Error fetching busy dates:', error);
    throw new Error('Failed to fetch busy dates');
  }
} 