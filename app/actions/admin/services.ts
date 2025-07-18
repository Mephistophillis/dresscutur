'use server';

import { revalidatePath } from 'next/cache';

// Define the Service interface
interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | null;
  duration: string | null;
  image: string;
  features: string[];
  isActive: boolean;
  order: number;
  details?: {
    process: string[];
    materials: string[];
    recommendations: string[];
  };
}

// Mock data for services
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Индивидуальный пошив платья',
    description: 'Создание уникального платья по вашим меркам и предпочтениям',
    category: 'tailoring',
    price: 15000,
    duration: '14-21 день',
    image: '/services/dress-tailoring.jpg',
    features: ['индивидуальные мерки', 'выбор ткани', '3 примерки'],
    isActive: true,
    order: 1,
    details: {
      process: [
        'Консультация и снятие мерок',
        'Создание лекал',
        'Подбор ткани',
        'Первая примерка',
        'Вторая примерка',
        'Финальная примерка и отделка'
      ],
      materials: ['натуральные ткани', 'качественная фурнитура'],
      recommendations: ['предварительная запись за 1-2 недели']
    }
  },
  {
    id: '2',
    name: 'Ремонт одежды',
    description: 'Профессиональный ремонт и подгонка любой одежды',
    category: 'repair',
    price: 1500,
    duration: '1-5 дней',
    image: '/services/clothing-repair.jpg',
    features: ['быстрое выполнение', 'качественные материалы'],
    isActive: true,
    order: 2,
    details: {
      process: [
        'Оценка изделия',
        'Согласование работ',
        'Выполнение ремонта',
        'Финальная проверка качества'
      ],
      materials: ['нитки высокого качества', 'фурнитура'],
      recommendations: ['принести изделие в чистом виде']
    }
  },
  {
    id: '3',
    name: 'Пошив корпоративной одежды',
    description: 'Создание единого стиля для вашей компании',
    category: 'corporate',
    price: null,
    duration: 'от 30 дней',
    image: '/services/corporate-clothing.jpg',
    features: ['разработка дизайна', 'крупные партии', 'брендирование'],
    isActive: true,
    order: 3,
    details: {
      process: [
        'Обсуждение требований',
        'Разработка концепции',
        'Создание образцов',
        'Утверждение',
        'Производство партии'
      ],
      materials: ['различные виды тканей', 'логотипы и элементы брендирования'],
      recommendations: ['предварительная консультация', 'заказ от 10 единиц']
    }
  }
];

// Get all services
export async function getServices(): Promise<Service[]> {
  // In a real application, this would be a database query
  return mockServices.sort((a, b) => a.order - b.order);
}

// Get a service by ID
export async function getServiceById(id: string): Promise<Service | null> {
  // In a real application, this would be a database query
  const service = mockServices.find(service => service.id === id);
  return service || null;
}

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  price: number | null;
  duration: string | null;
  image: string;
  features: string[];
  isActive: boolean;
  order: number;
  details?: {
    process: string[];
    materials: string[];
    recommendations: string[];
  };
}

interface ServiceActionResult {
  success: boolean;
  service?: Service;
  error?: string;
}

// Create a new service
export async function createService(data: ServiceFormData): Promise<ServiceActionResult> {
  try {
    // Validate data
    if (!data.name.trim()) {
      return { success: false, error: 'Название услуги обязательно' };
    }

    if (!data.description.trim()) {
      return { success: false, error: 'Описание услуги обязательно' };
    }

    if (!data.features.length) {
      return { success: false, error: 'Укажите хотя бы одну особенность услуги' };
    }

    // In a real application, this would be a database insertion
    // Generate a mock ID for demo
    const newId = Math.random().toString(36).substr(2, 9);
    
    const newService: Service = {
      id: newId,
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      duration: data.duration,
      image: data.image,
      features: data.features,
      isActive: data.isActive,
      order: data.order,
      details: data.details
    };
    
    // In a real application, this would save to the database
    // For demo, we push to our array
    mockServices.push(newService);
    
    // Revalidate the path to update the services page
    revalidatePath('/admin/services');
    
    return { success: true, service: newService };
  } catch (error) {
    console.error('Error creating service:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при создании услуги' 
    };
  }
}

// Update an existing service
export async function updateService(id: string, data: ServiceFormData): Promise<ServiceActionResult> {
  try {
    // Validate data
    if (!data.name.trim()) {
      return { success: false, error: 'Название услуги обязательно' };
    }

    if (!data.description.trim()) {
      return { success: false, error: 'Описание услуги обязательно' };
    }

    if (!data.features.length) {
      return { success: false, error: 'Укажите хотя бы одну особенность услуги' };
    }

    // In a real application, this would be a database update
    const serviceIndex = mockServices.findIndex(service => service.id === id);
    
    if (serviceIndex === -1) {
      return { success: false, error: 'Услуга не найдена' };
    }
    
    const updatedService: Service = {
      ...mockServices[serviceIndex],
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      duration: data.duration,
      image: data.image,
      features: data.features,
      isActive: data.isActive,
      order: data.order,
      details: data.details
    };
    
    // In a real application, this would update the database
    // For demo, we update our array
    mockServices[serviceIndex] = updatedService;
    
    // Revalidate the path to update the services page
    revalidatePath('/admin/services');
    
    return { success: true, service: updatedService };
  } catch (error) {
    console.error('Error updating service:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при обновлении услуги' 
    };
  }
}

// Delete a service
export async function deleteService(id: string): Promise<ServiceActionResult> {
  try {
    // In a real application, this would be a database deletion
    const serviceIndex = mockServices.findIndex(service => service.id === id);
    
    if (serviceIndex === -1) {
      return { success: false, error: 'Услуга не найдена' };
    }
    
    // In a real application, this would delete from the database
    // For demo, we remove from our array
    const deletedService = mockServices[serviceIndex];
    mockServices.splice(serviceIndex, 1);
    
    // Revalidate the path to update the services page
    revalidatePath('/admin/services');
    
    return { success: true, service: deletedService };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при удалении услуги' 
    };
  }
}

// Обновление порядка услуг
export async function updateServiceOrder(items: { id: string, order: number }[]): Promise<{ success: boolean, error?: string }> {
  try {
    // В реальном приложении здесь будет запрос к базе данных
    for (const item of items) {
      const service = mockServices.find(s => s.id === item.id);
      if (service) {
        service.order = item.order;
      }
    }
    
    // Revalidate the path to update the services page
    revalidatePath('/admin/services');
    revalidatePath('/services');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating service order:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при изменении порядка услуг' 
    };
  }
} 