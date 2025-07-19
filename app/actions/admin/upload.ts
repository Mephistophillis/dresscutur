'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from './auth';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Загружает изображение на сервер
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  console.log('=== uploadImage started ===');
  try {
    // Проверка авторизации
    console.log('Checking authorization...');
    const user = await getCurrentUser();
    console.log('User check result:', { hasUser: !!user, userId: user?.id });
    if (!user) {
      return { success: false, error: 'Не авторизован' };
    }

    console.log('Getting file and category from formData...');
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';
    console.log('File info:', { 
      hasFile: !!file, 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type,
      category 
    });

    if (!file) {
      return { success: false, error: 'Файл не найден' };
    }

    // Проверка типа файла
    console.log('Validating file type...');
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Файл должен быть изображением' };
    }

    // Получение расширения файла
    console.log('Getting file extension...');
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    console.log('File extension:', fileExtension);

    if (!allowedExtensions.includes(fileExtension)) {
      return { success: false, error: 'Недопустимый формат файла' };
    }

    // Создание уникального имени файла
    console.log('Creating unique filename...');
    const fileName = `${uuidv4()}.${fileExtension}`;
    console.log('Generated filename:', fileName);
    
    // Создание директории, если она не существует
    console.log('Creating upload directory...');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
    console.log('Upload directory:', uploadDir);
    await fs.mkdir(uploadDir, { recursive: true });

    // Преобразование файла в буфер для сохранения
    console.log('Converting file to buffer...');
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('Buffer size:', buffer.length);
    
    // Сохранение файла
    console.log('Saving file...');
    const filePath = path.join(uploadDir, fileName);
    console.log('File path:', filePath);
    await fs.writeFile(filePath, buffer);

    // Возвращение URL-адреса файла относительно public
    console.log('Creating file URL...');
    const fileUrl = `/uploads/${category}/${fileName}`;
    console.log('File URL:', fileUrl);
    console.log('=== uploadImage completed successfully ===');

    return {
      success: true,
      url: fileUrl
    };
  } catch (error) {
    console.error('=== uploadImage ERROR ===');
    console.error('Ошибка при загрузке изображения:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : String(error));
    return {
      success: false,
      error: 'Не удалось загрузить изображение'
    };
  }
}

/**
 * Удаляет изображение с сервера
 */
export async function deleteImage(imageUrl: string): Promise<UploadResult> {
  try {
    // Проверка авторизации
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Не авторизован' };
    }

    // Проверка параметров
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return { success: false, error: 'Недопустимый URL изображения' };
    }

    // Получение пути к файлу относительно папки public
    const filePath = path.join(process.cwd(), 'public', imageUrl);

    // Проверка существования файла
    try {
      await fs.access(filePath);
    } catch {
      // Файл не существует, возвращаем успех
      return { success: true };
    }

    // Удаление файла
    await fs.unlink(filePath);

    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    return {
      success: false,
      error: 'Не удалось удалить изображение'
    };
  }
}

/**
 * Загружает несколько изображений на сервер
 */
export async function uploadMultipleImages(formData: FormData): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    // Проверка авторизации
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Не авторизован' };
    }

    const files = formData.getAll('files') as File[];
    const category = formData.get('category') as string || 'general';

    if (!files || files.length === 0) {
      return { success: false, error: 'Файлы не найдены' };
    }

    const urls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
    await fs.mkdir(uploadDir, { recursive: true });

    // Загрузка каждого файла
    for (const file of files) {
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Получение расширения файла
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

      if (!allowedExtensions.includes(fileExtension)) {
        continue;
      }

      // Создание уникального имени файла
      const fileName = `${uuidv4()}.${fileExtension}`;
      
      // Преобразование файла в буфер для сохранения
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Сохранение файла
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      // Добавление URL-адреса файла в массив
      const fileUrl = `/uploads/${category}/${fileName}`;
      urls.push(fileUrl);
    }

    if (urls.length === 0) {
      return { success: false, error: 'Не удалось загрузить ни одного файла' };
    }

    return {
      success: true,
      urls
    };
  } catch (error) {
    console.error('Ошибка при загрузке изображений:', error);
    return {
      success: false,
      error: 'Не удалось загрузить изображения'
    };
  }
} 