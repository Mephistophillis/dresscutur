'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ServiceFormData {
  title: string;
  description: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export default function ServiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    icon: '',
    image: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    // Если это новая услуга, нет необходимости загружать данные
    if (isNew) {
      setIsLoading(false);
      return;
    }

    // Функция для загрузки данных о услуге
    const fetchService = async () => {
      try {
        setError(null);
        setIsLoading(true);
        
        // В реальном приложении здесь будет запрос к серверу
        // const response = await fetch(`/api/services/${id}`);
        // const data = await response.json();
        
        // Для демонстрации используем мок-данные
        const mockService = getMockService(id);
        
        if (mockService) {
          setFormData({
            title: mockService.title,
            description: mockService.description,
            icon: mockService.icon || '',
            image: mockService.image || '',
            isActive: mockService.isActive,
            order: mockService.order,
          });
        } else {
          setError('Услуга не найдена');
        }
      } catch (err) {
        console.error('Failed to fetch service:', err);
        setError('Не удалось загрузить данные услуги');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id, isNew]);

  // Обработчик изменения формы
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'order' 
          ? parseInt(value, 10) || 0 
          : value,
    }));
  };

  // Обработчик переключения активности
  const handleToggleActive = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setError(null);
      setIsSaving(true);
      
      // В реальном приложении здесь будет отправка данных на сервер
      // const response = await fetch(`/api/services/${isNew ? '' : id}`, {
      //   method: isNew ? 'POST' : 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      
      // Имитация успешного сохранения
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перенаправление на список услуг
      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      console.error('Failed to save service:', err);
      setError('Не удалось сохранить услугу');
      setIsSaving(false);
    }
  };

  // Вспомогательная функция для получения мок-данных
  const getMockService = (id: string) => {
    const services = [
      {
        id: '1',
        title: 'Индивидуальный пошив',
        description: 'Создание уникальной одежды по вашим меркам и пожеланиям.',
        icon: '/images/icons/tailoring.svg',
        image: '/images/services/tailoring.jpg',
        isActive: true,
        order: 1,
      },
      {
        id: '2',
        title: 'Ремонт и реставрация',
        description: 'Профессиональный ремонт любимых вещей: замена молний, подгонка по фигуре, устранение дефектов.',
        icon: '/images/icons/repair.svg',
        image: '/images/services/repair.jpg',
        isActive: true,
        order: 2,
      },
      {
        id: '3',
        title: 'Пошив штор и текстиля',
        description: 'Изготовление штор, покрывал, подушек и другого домашнего текстиля по индивидуальным размерам.',
        icon: '/images/icons/curtains.svg',
        image: '/images/services/curtains.jpg',
        isActive: false,
        order: 3,
      },
      {
        id: '4',
        title: 'Свадебная и вечерняя мода',
        description: 'Создание эксклюзивных свадебных и вечерних нарядов с учетом последних тенденций моды.',
        icon: '/images/icons/wedding.svg',
        image: '/images/services/wedding.jpg',
        isActive: true,
        order: 4,
      },
    ];
    
    return services.find(service => service.id === id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNew ? 'Создание новой услуги' : 'Редактирование услуги'}
        </h1>
        <Link
          href="/admin/services"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
        >
          Вернуться к списку
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Название *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Описание *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                Иконка (URL)
              </label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Изображение (URL)
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                Порядок отображения
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min={0}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center h-full pt-6">
              <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleToggleActive}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2">Активная услуга</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Link
              href="/admin/services"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
            >
              Отмена
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 rounded-md text-white ${
                isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSaving ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 