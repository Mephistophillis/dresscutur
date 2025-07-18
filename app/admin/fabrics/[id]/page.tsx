'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFabricById, createFabric, updateFabric } from '~/app/actions/admin/fabrics-prisma';
import ImageUpload from '~/app/admin/components/ui/image-upload';

interface FabricFormData {
  name: string;
  description: string;
  category: 'natural' | 'synthetic' | 'mixed' | 'lining' | 'silk' | 'wool' | 'linen';
  purpose: string[];
  colors: string[];
  price: number | null;
  image: string | null;
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
  } | null;
}

export default function FabricEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Начальное состояние формы
  const [formData, setFormData] = useState<FabricFormData>({
    name: '',
    description: '',
    category: 'natural',
    purpose: [],
    colors: [],
    price: null,
    image: null,
    properties: [],
    recommendations: [],
    isActive: true,
    order: 0,
    details: {
      composition: null,
      width: null,
      weight: null,
      care: [],
      origin: null,
      description: null,
    }
  });

  useEffect(() => {
    async function loadFabric() {
      if (isNew) {
        setIsLoading(false);
        return;
      }

      try {
        const fabric = await getFabricById(id);
        if (fabric) {
          setFormData({
            name: fabric.name,
            description: fabric.description,
            category: fabric.category as FabricFormData['category'],
            purpose: fabric.purpose,
            colors: fabric.colors,
            price: fabric.price,
            image: fabric.image || null,
            properties: fabric.properties,
            recommendations: fabric.recommendations,
            isActive: fabric.isActive,
            order: fabric.order,
            details: fabric.details || {
              composition: null,
              width: null,
              weight: null,
              care: [],
              origin: null,
              description: null,
            }
          });
        } else {
          setError('Ткань не найдена');
        }
      } catch (err) {
        console.error('Failed to load fabric:', err);
        setError('Не удалось загрузить данные ткани');
      } finally {
        setIsLoading(false);
      }
    }

    loadFabric();
  }, [id, isNew]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value.trim() === '' ? null : parseFloat(value);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleArrayInput = (field: keyof FabricFormData, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name.replace('details.', '');
    
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details!,
        [fieldName]: value
      }
    }));
  };

  const handleDetailsNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name.replace('details.', '');
    const numValue = value.trim() === '' ? null : parseFloat(value);
    
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details!,
        [fieldName]: numValue
      }
    }));
  };

  const handleDetailsArrayInput = (field: string, value: string) => {
    const fieldName = field.replace('details.', '');
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details!,
        [fieldName]: items
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = isNew
        ? await createFabric(formData)
        : await updateFabric(id, formData);

      if (result.success) {
        setSuccessMessage(isNew ? 'Ткань успешно создана' : 'Ткань успешно обновлена');
        if (isNew && result.data) {
          // Перенаправление на страницу редактирования созданной ткани
          router.push(`/admin/fabrics/${result.data.id}`);
        }
      } else {
        setError(result.error || 'Произошла ошибка при сохранении');
      }
    } catch (err) {
      console.error('Failed to save fabric:', err);
      setError('Не удалось сохранить ткань');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image: url
    }));
  };

  // Список категорий
  const categories = [
    { id: 'natural', name: 'Натуральная' },
    { id: 'synthetic', name: 'Синтетическая' },
    { id: 'mixed', name: 'Смешанная' },
    { id: 'lining', name: 'Подкладочная' }
  ];

  // Примеры назначений
  const purposeOptions = [
    'dress', 'blouse', 'shirt', 'pants', 'suit', 'coat', 'scarf', 'lining'
  ];

  // Примеры цветов
  const colorOptions = [
    'white', 'black', 'red', 'blue', 'green', 'yellow', 'navy', 'beige', 'brown', 'gray'
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !successMessage) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
        {error}
        <div className="mt-4">
          <Link href="/admin/fabrics" className="text-blue-600 hover:text-blue-800">
            Вернуться к списку тканей
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{isNew ? 'Добавить новую ткань' : 'Редактировать ткань'}</h1>
        <Link href="/admin/fabrics" className="text-blue-600 hover:text-blue-800">
          Вернуться к списку
        </Link>
      </div>

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Основная информация */}
          <div className="space-y-6 md:col-span-2">
            <h2 className="text-xl font-semibold border-b pb-2">Основная информация</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Название *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Категория *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Описание *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Цена (₽/м)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price === null ? '' : formData.price}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                  Порядок сортировки
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <ImageUpload
                id="fabric-image"
                label="Изображение ткани"
                initialImage={formData.image}
                onImageUpload={handleImageUpload}
                category="fabrics"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Активна (отображается на сайте)
              </label>
            </div>
          </div>

          {/* Применение и свойства */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold border-b pb-2">Применение и свойства</h2>
            
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Назначение * (через запятую)
              </label>
              <div className="mb-1 flex flex-wrap gap-1">
                {purposeOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    onClick={() => {
                      if (!formData.purpose.includes(option)) {
                        setFormData({...formData, purpose: [...formData.purpose, option]});
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <input
                type="text"
                id="purpose"
                value={formData.purpose.join(', ')}
                onChange={(e) => handleArrayInput('purpose', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="colors" className="block text-sm font-medium text-gray-700 mb-1">
                Цвета * (через запятую)
              </label>
              <div className="mb-1 flex flex-wrap gap-1">
                {colorOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    onClick={() => {
                      if (!formData.colors.includes(option)) {
                        setFormData({...formData, colors: [...formData.colors, option]});
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <input
                type="text"
                id="colors"
                value={formData.colors.join(', ')}
                onChange={(e) => handleArrayInput('colors', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="properties" className="block text-sm font-medium text-gray-700 mb-1">
                Свойства (через запятую)
              </label>
              <input
                type="text"
                id="properties"
                value={formData.properties.join(', ')}
                onChange={(e) => handleArrayInput('properties', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="recommendations" className="block text-sm font-medium text-gray-700 mb-1">
                Рекомендации (через запятую)
              </label>
              <input
                type="text"
                id="recommendations"
                value={formData.recommendations.join(', ')}
                onChange={(e) => handleArrayInput('recommendations', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Детальная информация */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold border-b pb-2">Детальная информация</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="details.composition" className="block text-sm font-medium text-gray-700 mb-1">
                  Состав
                </label>
                <input
                  type="text"
                  id="details.composition"
                  name="details.composition"
                  value={formData.details?.composition || ''}
                  onChange={handleDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="details.origin" className="block text-sm font-medium text-gray-700 mb-1">
                  Происхождение
                </label>
                <input
                  type="text"
                  id="details.origin"
                  name="details.origin"
                  value={formData.details?.origin || ''}
                  onChange={handleDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="details.width" className="block text-sm font-medium text-gray-700 mb-1">
                  Ширина (см)
                </label>
                <input
                  type="number"
                  id="details.width"
                  name="details.width"
                  min="0"
                  value={formData.details?.width === null ? '' : formData.details?.width}
                  onChange={handleDetailsNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="details.weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Вес (г/м²)
                </label>
                <input
                  type="number"
                  id="details.weight"
                  name="details.weight"
                  min="0"
                  value={formData.details?.weight === null ? '' : formData.details?.weight}
                  onChange={handleDetailsNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="details.care" className="block text-sm font-medium text-gray-700 mb-1">
                Уход (через запятую)
              </label>
              <input
                type="text"
                id="details.care"
                value={formData.details?.care.join(', ') || ''}
                onChange={(e) => handleDetailsArrayInput('details.care', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="details.description" className="block text-sm font-medium text-gray-700 mb-1">
                Детальное описание
              </label>
              <textarea
                id="details.description"
                name="details.description"
                rows={4}
                value={formData.details?.description || ''}
                onChange={handleDetailsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/admin/fabrics"
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Отмена
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 ${
              isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
} 