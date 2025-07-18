'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getServiceById, createService, updateService } from '~/app/actions/admin/services-prisma';
import ImageUpload from '~/app/admin/components/ui/image-upload';

interface ServiceFormData {
  title: string;
  description: string;
  icon?: string | null;
  image?: string | null;
  isActive: boolean;
  order: number;
  advantages: string[];
  timeline: {
    consultation: string;
    execution: string;
  };
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
    icon: null,
    image: null,
    isActive: true,
    order: 0,
    advantages: ['Профессиональный подход', 'Качественные материалы', 'Внимание к деталям'],
    timeline: {
      consultation: '30-60 минут',
      execution: '3-14 дней'
    }
  });

  console.log({
    formData,
  })

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
        
        // Используем server action для получения данных
        const service = await getServiceById(id);
        
        if (service) {
          // Маппим данные из модели БД в формат для формы
          setFormData({
            title: service.name,
            description: service.description,
            icon: service.icon || null, 
            image: service.image || null,
            isActive: service.isActive,
            order: service.order,
            advantages: service.advantages || ['Профессиональный подход', 'Качественные материалы', 'Внимание к деталям'],
            timeline: {
              consultation: ((service.timeline as unknown) as { consultation?: string })?.consultation || '30-60 минут',
              execution: ((service.timeline as unknown) as { execution?: string })?.execution || '3-14 дней'
            }
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

  // Обработчик изменения изображения
  const handleImageChange = (url: string, field: 'icon' | 'image') => {
    setFormData((prev) => ({
      ...prev,
      [field]: url,
    }));
  };

  // Обработчик переключения активности
  const handleToggleActive = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  // Обработчик изменения массива преимуществ
  const handleAdvantageChange = (index: number, value: string) => {
    setFormData(prev => {
      const newAdvantages = [...prev.advantages];
      newAdvantages[index] = value;
      return {
        ...prev,
        advantages: newAdvantages
      };
    });
  };

  // Обработчик добавления нового преимущества
  const handleAddAdvantage = () => {
    setFormData(prev => ({
      ...prev,
      advantages: [...prev.advantages, '']
    }));
  };

  // Обработчик удаления преимущества
  const handleRemoveAdvantage = (index: number) => {
    setFormData(prev => {
      const newAdvantages = [...prev.advantages];
      newAdvantages.splice(index, 1);
      return {
        ...prev,
        advantages: newAdvantages
      };
    });
  };

  // Обработчик изменения сроков
  const handleTimelineChange = (field: 'consultation' | 'execution', value: string) => {
    setFormData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        [field]: value
      }
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setError(null);
      setIsSaving(true);
      
      const result = isNew 
        ? await createService(formData)
        : await updateService(id, formData);
        
      if (result.success) {
        // Перенаправление на список услуг
        router.push('/admin/services');
        router.refresh();
      } else if (result.error) {
        setError(result.error);
        setIsSaving(false);
      } else if (result.errors) {
        setError('Пожалуйста, проверьте правильность заполнения формы');
        setIsSaving(false);
      }
    } catch (err) {
      console.error('Failed to save service:', err);
      setError('Не удалось сохранить услугу');
      setIsSaving(false);
    }
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

            <ImageUpload
              id="service-image"
              label="Изображение услуги"
              initialImage={formData.image}
              onImageUpload={(url) => handleImageChange(url, 'image')}
              category="services"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

            <div className="flex items-center h-full pt-5">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleToggleActive}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Активна</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Преимущества</h3>
            <div className="space-y-2">
              {formData.advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={advantage}
                    onChange={(e) => handleAdvantageChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите преимущество"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAdvantage(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddAdvantage}
                className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Добавить преимущество
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Сроки выполнения</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="consultation" className="block text-sm font-medium text-gray-700 mb-1">
                  Консультация
                </label>
                <input
                  type="text"
                  id="consultation"
                  value={formData.timeline.consultation}
                  onChange={(e) => handleTimelineChange('consultation', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: 30-60 минут"
                />
              </div>
              <div>
                <label htmlFor="execution" className="block text-sm font-medium text-gray-700 mb-1">
                  Срок выполнения
                </label>
                <input
                  type="text"
                  id="execution"
                  value={formData.timeline.execution}
                  onChange={(e) => handleTimelineChange('execution', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: 3-14 дней"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/services"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Отмена
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Сохранение...' : isNew ? 'Создать' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 