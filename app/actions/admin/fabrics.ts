'use server';

import { revalidatePath } from 'next/cache';

// Define the Fabric interface
interface Fabric {
  id: string;
  name: string;
  description: string;
  category: string;
  purpose: string[];
  colors: string[];
  price: number | null;
  image: string;
  properties: string[];
  recommendations: string[];
  isActive: boolean;
  order: number;
  details?: {
    composition: string | null;
    width: number | null;
    weight: number | null;
    care: string[];
    origin: string | null;
    description: string | null;
  };
}

// Mock data for fabrics
const mockFabrics: Fabric[] = [
  {
    id: '1',
    name: 'Итальянский шелк',
    description: 'Премиальный шелк итальянского производства высокой плотности',
    category: 'silk',
    purpose: ['evening', 'dress', 'blouse'],
    colors: ['white', 'black', 'red', 'blue', 'green'],
    price: 5000,
    image: '/fabrics/italian-silk.jpg',
    properties: ['мягкость', 'блеск', 'легкость'],
    recommendations: ['вечерние платья', 'блузы', 'летние платья'],
    isActive: true,
    order: 1,
    details: {
      composition: '100% шелк',
      width: 140,
      weight: 80,
      care: ['ручная стирка', 'химчистка', 'гладить при низкой температуре'],
      origin: 'Италия',
      description: 'Премиальный шелк из Италии, идеально подходит для вечерних нарядов и праздничной одежды'
    }
  },
  {
    id: '2',
    name: 'Английская шерсть',
    description: 'Плотная шерстяная ткань из Англии для демисезонной и зимней одежды',
    category: 'wool',
    purpose: ['suit', 'coat', 'jacket'],
    colors: ['grey', 'navy', 'black', 'brown'],
    price: 4500,
    image: '/fabrics/english-wool.jpg',
    properties: ['плотность', 'тепло', 'формоустойчивость'],
    recommendations: ['костюмы', 'пальто', 'жакеты'],
    isActive: true,
    order: 2,
    details: {
      composition: '95% шерсть, 5% эластан',
      width: 150,
      weight: 350,
      care: ['химчистка', 'не стирать', 'гладить через влажную ткань'],
      origin: 'Англия',
      description: 'Классическая английская шерсть для пошива костюмов и верхней одежды высокого качества'
    }
  },
  {
    id: '3',
    name: 'Французский лен',
    description: 'Натуральный льняной материал из Франции для летней одежды',
    category: 'linen',
    purpose: ['summer', 'dress', 'shirt'],
    colors: ['white', 'beige', 'blue', 'gray'],
    price: 3000,
    image: '/fabrics/french-linen.jpg',
    properties: ['воздухопроницаемость', 'прохлада', 'натуральность'],
    recommendations: ['летние платья', 'рубашки', 'брюки'],
    isActive: true,
    order: 3,
    details: {
      composition: '100% лен',
      width: 145,
      weight: 180,
      care: ['стирка при 30°C', 'гладить при высокой температуре', 'не отбеливать'],
      origin: 'Франция',
      description: 'Высококачественный французский лен для пошива летней одежды, прекрасно дышит и охлаждает'
    }
  }
];

// Получить все ткани
export async function getFabrics(): Promise<Fabric[]> {
  // В реальном приложении здесь будет запрос к базе данных
  return mockFabrics.sort((a, b) => a.order - b.order);
}

// Получить одну ткань по ID
export async function getFabricById(id: string): Promise<Fabric | null> {
  // В реальном приложении здесь будет запрос к базе данных
  const fabric = mockFabrics.find(fabric => fabric.id === id);
  return fabric || null;
}

// Получить ткани по категории
export async function getFabricsByCategory(category: string): Promise<Fabric[]> {
  // В реальном приложении здесь будет запрос к базе данных
  return mockFabrics.filter(fabric => fabric.category === category && fabric.isActive)
    .sort((a, b) => a.order - b.order);
}

interface FabricFormData {
  name: string;
  description: string;
  category: string;
  purpose: string[];
  colors: string[];
  price: number | null;
  image: string;
  properties: string[];
  recommendations: string[];
  isActive: boolean;
  order: number;
  details?: {
    composition: string | null;
    width: number | null;
    weight: number | null;
    care: string[];
    origin: string | null;
    description: string | null;
  };
}

interface FabricActionResult {
  success: boolean;
  fabric?: Fabric;
  error?: string;
}

// Создать новую ткань
export async function createFabric(data: FabricFormData): Promise<FabricActionResult> {
  try {
    // Валидация данных
    if (!data.name.trim()) {
      return { success: false, error: 'Название ткани обязательно' };
    }

    if (!data.description.trim()) {
      return { success: false, error: 'Описание ткани обязательно' };
    }

    if (!data.image.trim()) {
      return { success: false, error: 'Изображение обязательно' };
    }

    if (!data.properties.length) {
      return { success: false, error: 'Укажите хотя бы одно свойство ткани' };
    }

    // В реальном приложении здесь будет запрос к базе данных для создания ткани
    // Генерируем моковый ID для демо
    const newId = Math.random().toString(36).substr(2, 9);
    
    const newFabric: Fabric = {
      id: newId,
      name: data.name,
      description: data.description,
      category: data.category,
      purpose: data.purpose,
      colors: data.colors,
      price: data.price,
      image: data.image,
      properties: data.properties,
      recommendations: data.recommendations,
      isActive: data.isActive,
      order: data.order,
      details: data.details
    };
    
    // В реальном приложении здесь будет сохранение в БД
    // Для демо добавляем в наш массив
    mockFabrics.push(newFabric);
    
    // Перевалидируем путь, чтобы обновить данные на странице тканей
    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true, fabric: newFabric };
  } catch (error) {
    console.error('Error creating fabric:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при создании ткани' 
    };
  }
}

// Обновить существующую ткань
export async function updateFabric(id: string, data: FabricFormData): Promise<FabricActionResult> {
  try {
    // Валидация данных
    if (!data.name.trim()) {
      return { success: false, error: 'Название ткани обязательно' };
    }

    if (!data.description.trim()) {
      return { success: false, error: 'Описание ткани обязательно' };
    }

    if (!data.image.trim()) {
      return { success: false, error: 'Изображение обязательно' };
    }

    if (!data.properties.length) {
      return { success: false, error: 'Укажите хотя бы одно свойство ткани' };
    }

    // В реальном приложении здесь будет запрос к базе данных для обновления ткани
    const fabricIndex = mockFabrics.findIndex(fabric => fabric.id === id);
    
    if (fabricIndex === -1) {
      return { success: false, error: 'Ткань не найдена' };
    }
    
    const updatedFabric: Fabric = {
      ...mockFabrics[fabricIndex],
      name: data.name,
      description: data.description,
      category: data.category,
      purpose: data.purpose,
      colors: data.colors,
      price: data.price,
      image: data.image,
      properties: data.properties,
      recommendations: data.recommendations,
      isActive: data.isActive,
      order: data.order,
      details: data.details
    };
    
    // В реальном приложении здесь будет обновление в БД
    // Для демо обновляем в нашем массиве
    mockFabrics[fabricIndex] = updatedFabric;
    
    // Перевалидируем путь, чтобы обновить данные на странице тканей
    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true, fabric: updatedFabric };
  } catch (error) {
    console.error('Error updating fabric:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при обновлении ткани' 
    };
  }
}

// Удалить ткань
export async function deleteFabric(id: string): Promise<FabricActionResult> {
  try {
    // В реальном приложении здесь будет запрос к базе данных для удаления ткани
    const fabricIndex = mockFabrics.findIndex(fabric => fabric.id === id);
    
    if (fabricIndex === -1) {
      return { success: false, error: 'Ткань не найдена' };
    }
    
    // В реальном приложении здесь будет удаление из БД
    // Для демо удаляем из нашего массива
    const deletedFabric = mockFabrics[fabricIndex];
    mockFabrics.splice(fabricIndex, 1);
    
    // Перевалидируем путь, чтобы обновить данные на странице тканей
    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true, fabric: deletedFabric };
  } catch (error) {
    console.error('Error deleting fabric:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при удалении ткани' 
    };
  }
}

// Обновление порядка тканей
export async function updateFabricOrder(items: { id: string, order: number }[]): Promise<{ success: boolean, error?: string }> {
  try {
    // В реальном приложении здесь будет запрос к базе данных
    for (const item of items) {
      const fabric = mockFabrics.find(f => f.id === item.id);
      if (fabric) {
        fabric.order = item.order;
      }
    }
    
    // Перевалидируем путь, чтобы обновить данные на странице тканей
    revalidatePath('/admin/fabrics');
    revalidatePath('/fabrics');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating fabric order:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при изменении порядка тканей' 
    };
  }
} 