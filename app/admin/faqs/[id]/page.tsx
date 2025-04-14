'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { LoadingPage } from '../../components/ui/loading';

// Временные данные для демонстрации
const mockFaqs = [
  {
    id: '1',
    category: 'general',
    question: 'Как часто нужно приходить на примерки?',
    answer: 'Обычно требуется 2-3 примерки для базовых изделий и 3-4 для свадебных платьев. Точное количество зависит от сложности изделия и индивидуальных особенностей фигуры.',
    helpful: 24,
    notHelpful: 2,
    isActive: true,
    order: 1
  },
  {
    id: '2',
    category: 'workflow',
    question: 'Какие мерки мне нужно предоставить для заказа?',
    answer: 'Для начала работы нам потребуются основные мерки: обхват груди, талии, бедер. На консультации мы снимем полный комплект необходимых мерок для вашего изделия. Вы также можете отправить нам свои мерки заранее через форму на сайте.',
    helpful: 42,
    notHelpful: 1,
    isActive: true,
    order: 2
  },
  {
    id: '3',
    category: 'pricing',
    question: 'От чего зависит стоимость пошива?',
    answer: 'Стоимость пошива зависит от нескольких факторов: сложности модели, количества декоративных элементов, типа и качества выбранной ткани, сроков исполнения. Точную стоимость мы рассчитываем индивидуально после консультации.',
    helpful: 56,
    notHelpful: 3,
    isActive: true,
    order: 3
  },
  {
    id: '4',
    category: 'general',
    question: 'Можно ли сшить изделие по фотографии?',
    answer: 'Да, мы можем создать изделие на основе фотографии или эскиза. Однако важно понимать, что итоговый результат может отличаться от оригинала из-за различий в тканях, фурнитуре и индивидуальных особенностей фигуры.',
    helpful: 38,
    notHelpful: 0,
    isActive: true,
    order: 4
  }
];

// Функция для получения FAQ по ID
function getFaqById(id: string) {
  return mockFaqs.find(item => item.id === id) || null;
}

// Интерфейс для свойств компонента
interface FaqEditPageProps {
  params: {
    id: string;
  };
}

// Компонент формы редактирования FAQ
function FaqEditForm({ id }: { id: string }) {
  const isNewItem = id === 'new';
  
  let faq;
  
  if (!isNewItem) {
    faq = getFaqById(id);
    
    if (!faq) {
      notFound();
    }
  }

  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Вопрос
            </label>
            <input
              type="text"
              id="question"
              name="question"
              defaultValue={faq?.question || ''}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
              Ответ
            </label>
            <textarea
              id="answer"
              name="answer"
              defaultValue={faq?.answer || ''}
              rows={6}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              id="category"
              name="category"
              defaultValue={faq?.category || ''}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Выберите категорию</option>
              <option value="general">Общие вопросы</option>
              <option value="workflow">Процесс работы</option>
              <option value="pricing">Цены и оплата</option>
              <option value="delivery">Доставка и сроки</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
              Порядок отображения
            </label>
            <input
              type="number"
              id="order"
              name="order"
              min="1"
              defaultValue={faq?.order || 1}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-gray-500 mt-1">Меньшие значения отображаются первыми</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              defaultChecked={faq?.isActive ?? true}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Активен
            </label>
          </div>
          
          {!isNewItem && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Статистика полезности</h3>
              <div className="flex space-x-4">
                <div>
                  <span className="text-sm text-gray-500">Полезных оценок:</span>
                  <span className="ml-2 font-medium">{faq?.helpful || 0}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Неполезных оценок:</span>
                  <span className="ml-2 font-medium">{faq?.notHelpful || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link href="/admin/faqs">
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
export default function FaqEditPage({ params }: FaqEditPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Link href="/admin/faqs" className="text-primary hover:underline flex items-center text-sm">
          <span className="mr-1">←</span> Назад к FAQ
        </Link>
        <h1 className="text-2xl font-bold">
          {params.id === 'new' ? 'Добавить вопрос' : 'Редактировать вопрос'}
        </h1>
      </div>
      
      <Suspense fallback={<LoadingPage />}>
        <FaqEditForm id={params.id} />
      </Suspense>
    </div>
  );
} 