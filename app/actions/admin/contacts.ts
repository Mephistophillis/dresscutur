'use server';

import { prisma } from '~/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ContactStatus } from '@prisma/client';

// Получение всех контактных заявок с возможностью фильтрации по статусу
export async function getContacts(status?: string) {
  try {
    // Определяем условие фильтрации с правильным использованием enum
    let where = {};
    if (status && status !== 'all') {
      // Преобразуем строку в enum
      const statusEnum = status.toUpperCase() as keyof typeof ContactStatus;
      if (statusEnum in ContactStatus) {
        where = { status: ContactStatus[statusEnum] };
      }
    }
    
    // Запрос к базе данных через Prisma  
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' }
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

// Обновление статуса контактной заявки
export async function updateContactStatus(id: string, status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED') {
  try {
    await prisma.contact.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath('/admin/contacts');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при обновлении статуса контакта с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при обновлении статуса' };
  }
}

// Добавление примечания к заявке
export async function addContactNote(id: string, note: string) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      select: { notes: true }
    });
    
    const currentNotes = contact?.notes || '';
    const updatedNotes = currentNotes 
      ? `${currentNotes}\n\n${new Date().toLocaleString()}: ${note}`
      : `${new Date().toLocaleString()}: ${note}`;
    
    await prisma.contact.update({
      where: { id },
      data: { notes: updatedNotes }
    });
    
    revalidatePath('/admin/contacts');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при добавлении примечания к контакту с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при добавлении примечания' };
  }
}

// Назначение заявки пользователю
export async function assignContact(id: string, userId: string) {
  try {
    await prisma.contact.update({
      where: { id },
      data: { 
        assignedTo: userId,
        status: 'IN_PROGRESS' 
      }
    });
    
    revalidatePath('/admin/contacts');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при назначении контакта с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при назначении заявки' };
  }
}

// Удаление контактной заявки
export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id }
    });
    
    revalidatePath('/admin/contacts');
    
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении контакта с ID ${id}:`, error);
    return { success: false, error: 'Ошибка при удалении заявки' };
  }
} 