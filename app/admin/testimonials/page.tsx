'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

// Компонент таблицы отзывов
function TestimonialsTable() {
  const testimonials = mockTestimonials;
  
  if (!testimonials || testimonials.length === 0) {
    return (
      <EmptyState
        title="Отзывы отсутствуют"
        description="В системе пока нет отзывов. Добавьте новый отзыв."
        actionText="Добавить отзыв"
        actionHref="/admin/testimonials/new"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        }
      />
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Клиент</TableHead>
            <TableHead>Отзыв</TableHead>
            <TableHead>Рейтинг</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Порядок</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {testimonial.avatar && (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.position}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate">{testimonial.text}</div>
                <div className="text-xs text-gray-500">{new Date(testimonial.date).toLocaleDateString()}</div>
              </TableCell>
              <TableCell>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg 
                      key={index} 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill={index < testimonial.rating ? "currentColor" : "none"} 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className={index < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                  {testimonial.category === 'wedding' && 'Свадебные'}
                  {testimonial.category === 'individual' && 'Индивидуальный пошив'}
                  {testimonial.category === 'business' && 'Деловая одежда'}
                  {testimonial.category === 'repair' && 'Ремонт одежды'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    testimonial.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {testimonial.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                  {testimonial.isVerified && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">
                      Проверен
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{testimonial.order}</TableCell>
              <TableCell className="text-right">
                <TableActions 
                  onView={() => {}}
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
          total={testimonials.length}
          currentPage={1}
          pageSize={10}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление отзывами</h1>
        <Link href="/admin/testimonials/new">
          <Button variant="primary">Добавить отзыв</Button>
        </Link>
      </div>

      <Alert variant="info" title="Совет">
        Отзывы со статусом "Проверен" показываются на сайте. Для изменения порядка отображения используйте поле "Порядок".
      </Alert>
      
      <Suspense fallback={<TableSkeleton rows={5} cols={7} />}>
        <TestimonialsTable />
      </Suspense>
    </div>
  );
} 