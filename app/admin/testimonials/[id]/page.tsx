import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { LoadingPage } from '../../components/ui/loading';

// Временные данные для демонстрации
const mockTestimonials = [
  {
    id: '1',
    name: 'Анна Петрова',
    position: 'Невеста',
    avatar: '/testimonials/avatar1.jpg',
    text: 'Спасибо большое за прекрасное свадебное платье! Я выглядела как принцесса и получила множество комплиментов.',
    rating: 5,
    date: '2023-10-15',
    category: 'wedding',
    isVerified: true,
    isActive: true,
    order: 1
  },
  {
    id: '2',
    name: 'Елена Иванова',
    position: 'Постоянный клиент',
    avatar: '/testimonials/avatar2.jpg',
    text: 'Уже третий год заказываю здесь одежду. Качество на высоте, а сервис всегда приятно удивляет.',
    rating: 5,
    date: '2023-09-22',
    category: 'individual',
    isVerified: true,
    isActive: true,
    order: 2
  },
  {
    id: '3',
    name: 'Мария Сидорова',
    position: 'Деловая женщина',
    avatar: '/testimonials/avatar3.jpg',
    text: 'Пошив делового костюма превзошел мои ожидания. Идеальная посадка и комфорт.',
    rating: 4,
    date: '2023-08-05',
    category: 'business',
    isVerified: true,
    isActive: true,
    order: 3
  }
];

// Функция для получения отзыва по ID
function getTestimonialById(id: string) {
  return mockTestimonials.find(item => item.id === id) || null;
}

// Интерфейс для свойств компонента
interface TestimonialEditPageProps {
  params: {
    id: string;
  };
}

// Компонент формы редактирования отзыва
function TestimonialEditForm({ id }: { id: string }) {
  const isNewItem = id === 'new';
  
  let testimonial;
  
  if (!isNewItem) {
    testimonial = getTestimonialById(id);
    
    if (!testimonial) {
      notFound();
    }
  }

  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Имя клиента
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={testimonial?.name || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Статус клиента
              </label>
              <input
                type="text"
                id="position"
                name="position"
                defaultValue={testimonial?.position || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                URL аватара
              </label>
              <input
                type="text"
                id="avatar"
                name="avatar"
                defaultValue={testimonial?.avatar || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                id="category"
                name="category"
                defaultValue={testimonial?.category || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Выберите категорию</option>
                <option value="wedding">Свадебная одежда</option>
                <option value="individual">Индивидуальный пошив</option>
                <option value="business">Деловая одежда</option>
                <option value="repair">Ремонт одежды</option>
                <option value="other">Другое</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Дата отзыва
              </label>
              <input
                type="date"
                id="date"
                name="date"
                defaultValue={testimonial?.date ? new Date(testimonial.date).toISOString().split('T')[0] : ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                Порядок
              </label>
              <input
                type="number"
                id="order"
                name="order"
                defaultValue={testimonial?.order || 0}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                Текст отзыва
              </label>
              <textarea
                id="text"
                name="text"
                defaultValue={testimonial?.text || ''}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                Рейтинг (1-5)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="5"
                defaultValue={testimonial?.rating || 5}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="isVerified"
                name="isVerified"
                defaultChecked={testimonial?.isVerified ?? true}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isVerified" className="text-sm text-gray-700">
                Проверенный отзыв
              </label>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={testimonial?.isActive ?? true}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Активен
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link href="/admin/testimonials">
            <Button variant="outline">Отмена</Button>
          </Link>
          <Button type="submit" variant="primary">
            {isNewItem ? 'Создать' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Основной компонент страницы
export default function TestimonialEditPage({ params }: TestimonialEditPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Link href="/admin/testimonials" className="text-primary hover:underline flex items-center text-sm">
          <span className="mr-1">←</span> Назад к отзывам
        </Link>
        <h1 className="text-2xl font-bold">
          {params.id === 'new' ? 'Добавить отзыв' : 'Редактировать отзыв'}
        </h1>
      </div>
      
      <Suspense fallback={<LoadingPage />}>
        <TestimonialEditForm id={params.id} />
      </Suspense>
    </div>
  );
} 