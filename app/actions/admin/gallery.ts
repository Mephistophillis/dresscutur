'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';

// Define the GalleryItem interface
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  details?: {
    client?: string;
    completionDate?: string;
    additionalImages?: string[];
    serviceType?: string;
    fabric?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for gallery
const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Вечернее платье "Элегантность"',
    description: 'Эксклюзивное вечернее платье из натурального шелка',
    category: 'evening',
    imageSrc: '/gallery/evening-dress-1.jpg',
    tags: ['вечернее', 'шелк', 'ручная работа'],
    isActive: true,
    isFeatured: true,
    order: 1,
    details: {
      client: 'Анна П.',
      completionDate: '2023-12-15',
      additionalImages: [
        '/gallery/evening-dress-1-detail1.jpg',
        '/gallery/evening-dress-1-detail2.jpg'
      ],
      serviceType: 'Индивидуальный пошив',
      fabric: 'Натуральный шелк'
    },
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '2',
    title: 'Свадебное платье "Нежность"',
    description: 'Свадебное платье с кружевными элементами и длинным шлейфом',
    category: 'wedding',
    imageSrc: '/gallery/wedding-dress-1.jpg',
    tags: ['свадебное', 'кружево', 'ручная вышивка'],
    isActive: true,
    isFeatured: true,
    order: 2,
    details: {
      client: 'Мария К.',
      completionDate: '2023-11-20',
      additionalImages: [
        '/gallery/wedding-dress-1-detail1.jpg',
        '/gallery/wedding-dress-1-detail2.jpg'
      ],
      serviceType: 'Свадебный пошив',
      fabric: 'Атлас и кружево'
    },
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2023-08-01')
  },
  {
    id: '3',
    title: 'Деловой костюм "Бизнес"',
    description: 'Женский деловой костюм из итальянской шерсти',
    category: 'business',
    imageSrc: '/gallery/business-suit-1.jpg',
    tags: ['деловой стиль', 'костюм', 'шерсть'],
    isActive: true,
    isFeatured: false,
    order: 3,
    details: {
      client: 'Елена В.',
      completionDate: '2023-10-05',
      additionalImages: [
        '/gallery/business-suit-1-detail1.jpg'
      ],
      serviceType: 'Индивидуальный пошив',
      fabric: 'Итальянская шерсть'
    },
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2023-07-01')
  }
];

// Get all gallery items
export async function getGalleryItems(): Promise<GalleryItem[]> {
  // In a real application, this would be a database query
  return mockGalleryItems.sort((a, b) => a.order - b.order);
}

// Get a gallery item by ID
export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  try {
    // In a real app, this would be a database query
    const item = mockGalleryItems.find(item => item.id === id);
    return item || null;
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    return null;
  }
}

// Get featured gallery items
export async function getFeaturedGalleryItems(): Promise<GalleryItem[]> {
  // In a real application, this would be a database query
  return mockGalleryItems.filter(item => item.isFeatured && item.isActive)
    .sort((a, b) => a.order - b.order);
}

// Get gallery items by category
export async function getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
  // In a real application, this would be a database query
  return mockGalleryItems.filter(item => item.category === category && item.isActive)
    .sort((a, b) => a.order - b.order);
}

interface GalleryFormData {
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  details?: {
    client?: string;
    completionDate?: string;
    additionalImages?: string[];
    serviceType?: string;
    fabric?: string;
  };
}

interface GalleryActionResult {
  success: boolean;
  item?: GalleryItem;
  error?: string;
}

// Create a new gallery item
export async function createGalleryItem(data: GalleryFormData): Promise<GalleryActionResult> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Не авторизован');
  }
  
  try {
    // Validate data
    if (!data.title.trim()) {
      return { success: false, error: 'Название обязательно' };
    }

    if (!data.description.trim()) {
      return { success: false, error: 'Описание обязательно' };
    }

    if (!data.imageSrc.trim()) {
      return { success: false, error: 'Изображение обязательно' };
    }

    // In a real application, this would be a database insertion
    // Generate a mock ID for demo
    const newId = Math.random().toString(36).substr(2, 9);
    
    const newItem: GalleryItem = {
      id: newId,
      title: data.title,
      description: data.description,
      category: data.category,
      imageSrc: data.imageSrc,
      tags: data.tags,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      order: data.order,
      details: data.details,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real application, this would save to the database
    // For demo, we push to our array
    mockGalleryItems.push(newItem);
    
    // Revalidate the paths to update the gallery pages
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return { success: true, item: newItem };
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при создании элемента галереи' 
    };
  }
}

// Update an existing gallery item
export async function updateGalleryItem(id: string, data: GalleryFormData): Promise<GalleryActionResult> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Не авторизован');
  }
  
  try {
    // Validate data
    if (!data.title.trim()) {
      return { success: false, error: 'Название обязательно' };
    }

    if (!data.description.trim()) {
      return { success: false, error: 'Описание обязательно' };
    }

    if (!data.imageSrc.trim()) {
      return { success: false, error: 'Изображение обязательно' };
    }

    // In a real application, this would be a database update
    const itemIndex = mockGalleryItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return { success: false, error: 'Элемент галереи не найден' };
    }
    
    const updatedItem: GalleryItem = {
      ...mockGalleryItems[itemIndex],
      title: data.title,
      description: data.description,
      category: data.category,
      imageSrc: data.imageSrc,
      tags: data.tags,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      order: data.order,
      details: data.details,
      updatedAt: new Date()
    };
    
    // In a real application, this would update the database
    // For demo, we update our array
    mockGalleryItems[itemIndex] = updatedItem;
    
    // Revalidate the paths to update the gallery pages
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return { success: true, item: updatedItem };
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при обновлении элемента галереи' 
    };
  }
}

// Delete a gallery item
export async function deleteGalleryItem(id: string): Promise<GalleryActionResult> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Не авторизован');
  }
  
  try {
    // In a real application, this would be a database deletion
    const itemIndex = mockGalleryItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return { success: false, error: 'Элемент галереи не найден' };
    }
    
    // In a real application, this would delete from the database
    // For demo, we remove from our array
    const deletedItem = mockGalleryItems[itemIndex];
    mockGalleryItems.splice(itemIndex, 1);
    
    // Revalidate the paths to update the gallery pages
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return { success: true, item: deletedItem };
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при удалении элемента галереи' 
    };
  }
}

// Update gallery item order
export async function updateGalleryItemOrder(id: string, newOrder: number): Promise<{ success: boolean, error?: string }> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Не авторизован');
  }
  
  try {
    // In a real application, this would be a database transaction
    const itemIndex = mockGalleryItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return { success: false, error: 'Элемент галереи не найден' };
    }
    
    const updatedItem = {
      ...mockGalleryItems[itemIndex],
      order: newOrder,
      updatedAt: new Date()
    };
    
    mockGalleryItems[itemIndex] = updatedItem;
    
    // Revalidate the paths to update the gallery pages
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating gallery item order:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при изменении порядка элементов галереи' 
    };
  }
}

// Update gallery item status
export async function toggleGalleryItemActive(id: string): Promise<{ success: boolean, error?: string }> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Не авторизован');
  }
  
  try {
    // In a real application, this would be a database update
    const itemIndex = mockGalleryItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return { success: false, error: 'Элемент галереи не найден' };
    }
    
    const updatedItem = {
      ...mockGalleryItems[itemIndex],
      isActive: !mockGalleryItems[itemIndex].isActive,
      updatedAt: new Date()
    };
    
    mockGalleryItems[itemIndex] = updatedItem;
    
    // Revalidate the paths to update the gallery pages
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling gallery item status:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при изменении статуса элемента галереи' 
    };
  }
} 