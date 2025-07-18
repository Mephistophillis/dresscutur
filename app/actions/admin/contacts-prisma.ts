'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '~/app/lib/prisma';
import { z } from 'zod';
import { getCurrentUser } from './auth';
import { ContactStatus } from '@prisma/client';

// Схема валидации для контактов
const contactSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  email: z.string().email('Некорректный email'),
  phone: z.string().nullable().optional(),
  subject: z.string().min(1, 'Тема обязательна'),
  message: z.string().min(1, 'Сообщение обязательно'),
  status: z.nativeEnum(ContactStatus).default(ContactStatus.NEW),
  assignedTo: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  fileAttachment: z.string().nullable().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Получение всех контактных заявок
export async function getContacts() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return contacts;
  } catch (error) {
    console.error('Ошибка при получении контактов:', error);
    return [];
  }
}

// Получение контактной заявки по ID
export async function getContactById(id: string) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id }
    });
    
    return contact;
  } catch (error) {
    console.error(`Ошибка при получении контакта с ID ${id}:`, error);
    return null;
  }
}

// Создание новой контактной заявки (для публичной части сайта)
export async function createContact(data: ContactFormData) {
  try {
    const result = contactSchema.safeParse(data);
    
    if (!result.success) {
      return { success: false, errors: result.error.format() };
    }

    const newContact = await prisma.contact.create({
      data: {
        ...result.data,
        status: ContactStatus.NEW
      }
    });

    // Отправка уведомления администратору (можно добавить позже)
    
    return { success: true, data: newContact };
  } catch (error) {
    console.error('Ошибка при создании контакта:', error);
    return { success: false, error: 'Ошибка при создании контакта' };
  }
}

// Обновление контактной заявки
export async function updateContact(id: string, data: Partial<ContactFormData>) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const updatedContact = await prisma.contact.update({
      where: { id },
      data
    });
    
    revalidatePath('/admin/contacts');
    
    return { success: true, data: updatedContact };
  } catch (error) {
    console.error(`Ошибка при обновлении контакта с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при обновлении контакта' };
  }
}

// Удаление контактной заявки
export async function deleteContact(id: string) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    await prisma.contact.delete({
      where: { id }
    });
    
    revalidatePath('/admin/contacts');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении контакта с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при удалении контакта' };
  }
}

// Обновление статуса контактной заявки
export async function updateContactStatus(id: string, status: ContactStatus) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath('/admin/contacts');
    
    return { success: true, data: updatedContact };
  } catch (error) {
    console.error(`Ошибка при обновлении статуса контакта с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при обновлении статуса' };
  }
}

// Получение количества новых заявок
export async function getNewContactsCount() {
  try {
    const count = await prisma.contact.count({
      where: { status: ContactStatus.NEW }
    });
    
    return count;
  } catch (error) {
    console.error('Ошибка при получении количества новых контактов:', error);
    return 0;
  }
}

// Добавление заметки к контакту
export async function addContactNote(id: string, notes: string) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { notes }
    });
    
    revalidatePath('/admin/contacts');
    
    return { success: true, data: updatedContact };
  } catch (error) {
    console.error(`Ошибка при добавлении заметки к контакту с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при добавлении заметки' };
  }
}

// Назначение контакта сотруднику
export async function assignContact(id: string, assignedTo: string | null) {
  try {
    // Проверка авторизации
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Не авторизован' };
    }
    
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { assignedTo }
    });
    
    revalidatePath('/admin/contacts');
    
    return { success: true, data: updatedContact };
  } catch (error) {
    console.error(`Ошибка при назначении контакта ID ${id}:`, error);
    return { success: false, error: 'Ошибка при назначении контакта' };
  }
} 