'use server';

import { prisma } from '~/app/lib/prisma';
import { cache } from 'react';

export type PublicService = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  image: string | null;
  order: number;
  advantages: string[];
  timeline: {
    consultation: string;
    execution: string;
  };
};

// Кэшированная функция для получения активных сервисов
export const getActiveServices = cache(async (): Promise<PublicService[]> => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        image: true,
        order: true,
        advantages: true,
        timeline: true
      }
    });
    
    return services.map(service => ({
      ...service,
      advantages: service.advantages || ['Профессиональный подход', 'Качественные материалы', 'Внимание к деталям'],
      timeline: (service.timeline as { consultation: string; execution: string }) || {
        consultation: '30-60 минут',
        execution: '3-14 дней'
      }
    }));
  } catch (error) {
    console.error('Ошибка при получении сервисов:', error);
    return [];
  }
}); 