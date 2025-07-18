'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '~/app/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { TeamMember as PrismaTeamMember } from '@prisma/client';

// Типы для членов команды удалены, используются типы из Prisma

// Схема для валидации данных
const teamMemberSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  position: z.string().min(1, 'Должность обязательна'),
  bio: z.string().min(1, 'Описание обязательно'),
  location: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    vk: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
  }).nullable().optional(),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

// Получение всех членов команды
export async function getTeamMembers(): Promise<ActionResult> {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
        position: true,
        bio: true,
        photo: true,
        location: true,
        isActive: true,
        order: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    // Преобразование JSON полей в правильный формат
    const formattedMembers = members.map((member: PrismaTeamMember) => ({
      ...member,
      socialLinks: member.socialLinks || {}
    }));
    
    return {
      success: true,
      data: formattedMembers,
    };
  } catch (error) {
    console.error('Ошибка при получении членов команды:', error);
    return {
      success: false,
      message: 'Не удалось загрузить список членов команды',
    };
  }
}

// Получение активных членов команды (для фронтенда)
export async function getActiveTeamMembers(): Promise<ActionResult> {
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
        position: true,
        bio: true,
        photo: true,
        location: true,
        isActive: true,
        order: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    // Преобразование JSON полей в правильный формат
    const formattedMembers = members.map((member: PrismaTeamMember) => ({
      ...member,
      socialLinks: member.socialLinks || {}
    }));
    
    return {
      success: true,
      data: formattedMembers,
    };
  } catch (error) {
    console.error('Ошибка при получении активных членов команды:', error);
    return {
      success: false,
      message: 'Не удалось загрузить список активных членов команды',
    };
  }
}

// Получение члена команды по ID
export async function getTeamMemberById(id: string): Promise<ActionResult> {
  try {
    const member = await prisma.teamMember.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        position: true,
        bio: true,
        photo: true,
        location: true,
        isActive: true,
        order: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!member) {
      return {
        success: false,
        message: 'Член команды не найден',
      };
    }
    
    // Преобразуем JSON поле
    const formattedMember = {
      ...member,
      socialLinks: member.socialLinks || {}
    };
    
    return {
      success: true,
      data: formattedMember,
    };
  } catch (error) {
    console.error('Ошибка при получении члена команды:', error);
    return {
      success: false,
      message: 'Не удалось загрузить информацию о члене команды',
    };
  }
}

// Сохранение загруженного файла на сервере
async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Получаем расширение файла
  const originalFilename = file.name;
  const ext = originalFilename.split('.').pop() || 'jpg';
  
  // Создаем уникальное имя файла
  const filename = `${uuidv4()}.${ext}`;
  const publicUploadDir = 'public/uploads/team';
  
  // Путь для сохранения файла
  const path = join(process.cwd(), publicUploadDir, filename);
  
  // Сохраняем файл
  await writeFile(path, buffer);
  
  // Возвращаем путь относительно public
  return `/uploads/team/${filename}`;
}

// Создание нового члена команды
export async function createTeamMember(
  formData: FormData
): Promise<ActionResult> {
  try {
    // Получаем данные из формы
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const bio = formData.get('bio') as string;
    const location = formData.get('location') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const isActive = formData.get('isActive') === 'true';
    
    // Социальные сети
    const instagram = formData.get('instagram') as string;
    const facebook = formData.get('facebook') as string;
    const vk = formData.get('vk') as string;
    const linkedin = formData.get('linkedin') as string;
    const website = formData.get('website') as string;
    
    // Фото
    const photoFile = formData.get('photo') as File;
    
    if (!photoFile || photoFile.size === 0) {
      return {
        success: false,
        message: 'Фото является обязательным',
      };
    }
    
    // Валидация данных
    const validateResult = teamMemberSchema.safeParse({
      name,
      position,
      bio,
      location,
      order,
      isActive,
      socialLinks: {
        instagram,
        facebook,
        vk,
        linkedin,
        website,
      },
    });
    
    if (!validateResult.success) {
      return {
        success: false,
        message: validateResult.error.errors[0]?.message || 'Ошибка валидации данных',
      };
    }
    
    // Загружаем фото
    const photoPath = await saveFile(photoFile);
    
    // Создаем члена команды в базе данных
    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        position,
        bio,
        photo: photoPath,
        location,
        order,
        isActive,
        socialLinks: {
          instagram,
          facebook,
          vk,
          linkedin,
          website,
        },
      },
    });
    
    // Обновляем кеш страниц
    revalidatePath('/admin/team');
    revalidatePath('/about');
    
    return {
      success: true,
      data: teamMember,
      message: 'Член команды успешно добавлен',
    };
  } catch (error) {
    console.error('Ошибка при создании члена команды:', error);
    return {
      success: false,
      message: 'Не удалось создать члена команды',
    };
  }
}

// Обновление члена команды
export async function updateTeamMember(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Получаем данные из формы
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const bio = formData.get('bio') as string;
    const location = formData.get('location') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const isActive = formData.get('isActive') === 'true';
    
    // Социальные сети
    const instagram = formData.get('instagram') as string;
    const facebook = formData.get('facebook') as string;
    const vk = formData.get('vk') as string;
    const linkedin = formData.get('linkedin') as string;
    const website = formData.get('website') as string;
    
    // Фото
    const photoFile = formData.get('photo') as File;
    
    // Валидация данных
    const validateResult = teamMemberSchema.safeParse({
      name,
      position,
      bio,
      location,
      order,
      isActive,
      socialLinks: {
        instagram,
        facebook,
        vk,
        linkedin,
        website,
      },
    });
    
    if (!validateResult.success) {
      return {
        success: false,
        message: validateResult.error.errors[0]?.message || 'Ошибка валидации данных',
      };
    }
    
    // Получаем текущую информацию о члене команды
    const currentMember = await prisma.teamMember.findUnique({
      where: { id },
    });
    
    if (!currentMember) {
      return {
        success: false,
        message: 'Член команды не найден',
      };
    }
    
    // Определяем путь к фото
    let photoPath;
    if (photoFile && photoFile.size > 0) {
      photoPath = await saveFile(photoFile);
    }
    
    // Обновляем информацию о члене команды
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        position,
        bio,
        ...(photoPath ? { photo: photoPath } : {}),
        location,
        order,
        isActive,
        socialLinks: {
          instagram,
          facebook,
          vk,
          linkedin,
          website,
        },
      },
    });
    
    // Обновляем кеш страниц
    revalidatePath('/admin/team');
    revalidatePath('/about');
    
    return {
      success: true,
      data: teamMember,
      message: 'Информация о члене команды успешно обновлена',
    };
  } catch (error) {
    console.error('Ошибка при обновлении члена команды:', error);
    return {
      success: false,
      message: 'Не удалось обновить информацию о члене команды',
    };
  }
}

// Удаление члена команды
export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    // Ищем члена команды
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        id,
      },
    });
    
    if (!teamMember) {
      return {
        success: false,
        message: 'Член команды не найден',
      };
    }
    
    // Удаляем его из базы данных
    await prisma.teamMember.delete({
      where: {
        id,
      },
    });
    
    // Обновляем кеш страниц
    revalidatePath('/admin/team');
    revalidatePath('/about');
    
    return {
      success: true,
      message: 'Член команды успешно удален',
    };
  } catch (error) {
    console.error('Ошибка при удалении члена команды:', error);
    return {
      success: false,
      message: 'Не удалось удалить члена команды',
    };
  }
}

// Изменение статуса активности члена команды
export async function toggleTeamMemberActive(id: string): Promise<ActionResult> {
  try {
    // Получаем текущее состояние
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        id,
      },
    });
    
    if (!teamMember) {
      return {
        success: false,
        message: 'Член команды не найден',
      };
    }
    
    // Инвертируем состояние
    const updatedMember = await prisma.teamMember.update({
      where: {
        id,
      },
      data: {
        isActive: !teamMember.isActive,
      },
    });
    
    // Обновляем кеш страниц
    revalidatePath('/admin/team');
    revalidatePath('/about');
    
    return {
      success: true,
      data: updatedMember,
      message: `Член команды ${updatedMember.isActive ? 'активирован' : 'деактивирован'}`,
    };
  } catch (error) {
    console.error('Ошибка при изменении статуса активности:', error);
    return {
      success: false,
      message: 'Не удалось изменить статус активности',
    };
  }
} 