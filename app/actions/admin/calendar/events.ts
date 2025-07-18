'use server';

import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

interface Event {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Функция для создания даты (удалена, так как не используется)

// Временное хранилище для событий (в реальном приложении - база данных)
let events: Event[] = [
  {
    id: '1',
    title: 'Встреча с клиентом',
    description: 'Обсуждение заказа свадебного платья',
    start: new Date(2023, 8, 15, 10, 0).toISOString(),
    end: new Date(2023, 8, 15, 11, 0).toISOString(),
    type: 'appointment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Примерка',
    description: 'Первая примерка вечернего платья',
    start: new Date(2023, 8, 16, 14, 30).toISOString(),
    end: new Date(2023, 8, 16, 15, 30).toISOString(),
    type: 'appointment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Поставка тканей',
    description: 'Ожидается поставка новых тканей',
    start: new Date(2023, 8, 17, 9, 0).toISOString(),
    end: new Date(2023, 8, 17, 10, 0).toISOString(),
    type: 'task',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Получение всех событий
export async function getEvents(): Promise<Event[]> {
  // Добавим небольшую задержку для симуляции сетевого запроса
  await new Promise((resolve) => setTimeout(resolve, 500));
  return events;
}

// Получение событий за определенный период
export async function getEventsByDateRange(startDate: string, endDate: string) {
  // В реальном приложении - запрос к базе данных с фильтрацией по дате
  return events.filter(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);
    
    return (eventStart >= rangeStart && eventStart <= rangeEnd) || 
           (eventEnd >= rangeStart && eventEnd <= rangeEnd) ||
           (eventStart <= rangeStart && eventEnd >= rangeEnd);
  });
}

// Получение события по ID
export async function getEventById(id: string): Promise<Event | null> {
  // В реальном приложении здесь будет обращение к базе данных
  await new Promise(resolve => setTimeout(resolve, 300)); // Имитация задержки сети
  return events.find(event => event.id === id) || null;
}

// Создание нового события
export async function createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
  const newEvent: Event = {
    ...event,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  events.push(newEvent);
  
  // Обновляем кеш страницы
  revalidatePath('/admin/calendar');
  
  return newEvent;
}

// Обновление существующего события
export async function updateEvent(event: Event): Promise<Event> {
  events = events.map((e) => (e.id === event.id ? { ...event, updatedAt: new Date().toISOString() } : e));
  
  // Обновляем кеш страницы
  revalidatePath('/admin/calendar');
  
  return { ...event, updatedAt: new Date().toISOString() };
}

// Удаление события
export async function deleteEvent(id: string): Promise<void> {
  events = events.filter((e) => e.id !== id);
  
  // Обновляем кеш страницы
  revalidatePath('/admin/calendar');
} 