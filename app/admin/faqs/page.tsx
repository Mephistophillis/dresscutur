'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell, 
  TablePagination 
} from '../components/ui/table';
import { TableActions } from '../components/ui/table-actions';
import { EmptyState } from '../components/ui/empty-state';
import { TableSkeleton } from '../components/ui/loading';
import { Alert } from '../components/ui/alert';

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

// Категории FAQ
const faqCategories = [
  { id: 'all', name: 'Все категории' },
  { id: 'general', name: 'Общие вопросы' },
  { id: 'workflow', name: 'Процесс работы' },
  { id: 'pricing', name: 'Цены и оплата' },
  { id: 'delivery', name: 'Доставка и сроки' }
];

// Компонент таблицы FAQ
function FaqsTable() {
  const [category, setCategory] = useState('all');
  
  const faqs = category === 'all' 
    ? mockFaqs 
    : mockFaqs.filter(faq => faq.category === category);
  
  if (!faqs || faqs.length === 0) {
    return (
      <EmptyState
        title="FAQ отсутствуют"
        description="В системе пока нет вопросов и ответов. Добавьте новый FAQ."
        actionText="Добавить FAQ"
        actionHref="/admin/faqs/new"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {faqCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
              category === cat.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Вопрос</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Статистика</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Порядок</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{faq.question}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{faq.answer}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                  {faq.category === 'general' && 'Общие вопросы'}
                  {faq.category === 'workflow' && 'Процесс работы'}
                  {faq.category === 'pricing' && 'Цены и оплата'}
                  {faq.category === 'delivery' && 'Доставка и сроки'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-3 text-sm">
                  <span className="flex items-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    {faq.helpful}
                  </span>
                  <span className="flex items-center text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                    </svg>
                    {faq.notHelpful}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  faq.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {faq.isActive ? 'Активен' : 'Неактивен'}
                </span>
              </TableCell>
              <TableCell>{faq.order}</TableCell>
              <TableCell className="text-right">
                <TableActions 
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <TablePagination
          total={faqs.length}
          currentPage={1}
          pageSize={10}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
}

// Основной компонент страницы
export default function FaqsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Управление FAQ</h1>
          <p className="text-gray-500 mt-1">Добавляйте и редактируйте часто задаваемые вопросы</p>
        </div>
        <Link href="/admin/faqs/new">
          <Button variant="primary">Добавить FAQ</Button>
        </Link>
      </div>

      <Alert variant="info" title="Совет">
        Используйте категории для группировки вопросов. Наиболее полезные вопросы рекомендуется размещать в начале списка.
      </Alert>
      
      <Suspense fallback={<TableSkeleton rows={5} />}>
        <FaqsTable />
      </Suspense>
    </div>
  );
} 