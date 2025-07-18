'use client';

import React, { useState, useEffect } from 'react';
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
import { getFAQs, deleteFAQ, toggleFAQActive } from '~/app/actions/admin/faq-prisma';
import { useRouter } from 'next/navigation';
import { FAQ } from '~/app/lib/definitions';

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
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setIsLoading(true);
        const data = await getFAQs();
        setFaqs(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
        setError('Ошибка при загрузке FAQ');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFaqs();
  }, []);
  
  const filteredFaqs = category === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === category);
  
  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот FAQ?')) {
      try {
        const result = await deleteFAQ(id);
        if (result.success) {
          setFaqs(faqs.filter(faq => faq.id !== id));
        } else {
          setError(result.error || 'Ошибка при удалении FAQ');
        }
      } catch (err) {
        console.error('Failed to delete FAQ:', err);
        setError('Ошибка при удалении FAQ');
      }
    }
  };
  
  const handleEdit = (id: string) => {
    router.push(`/admin/faqs/${id}`);
  };
  
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const result = await toggleFAQActive(id);
      if (result.success) {
        setFaqs(prevFaqs => 
          prevFaqs.map(faq => 
            faq.id === id ? { ...faq, isActive: !currentActive } : faq
          )
        );
      } else {
        setError(result.error || 'Ошибка при изменении статуса');
      }
    } catch (err) {
      console.error('Failed to toggle FAQ status:', err);
      setError('Ошибка при изменении статуса');
    }
  };
  
  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
        {error}
      </div>
    );
  }
  
  if (!filteredFaqs || filteredFaqs.length === 0) {
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

  const getCategoryName = (categoryId: string) => {
    const category = faqCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

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
          {filteredFaqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{faq.question}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{faq.answer}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                  {getCategoryName(faq.category)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-3 text-sm">
                  <span className="flex items-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    {faq.likes}
                  </span>
                  <span className="flex items-center text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                    </svg>
                    {faq.dislikes}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleToggleActive(faq.id, faq.isActive)}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    faq.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {faq.isActive ? 'Активен' : 'Неактивен'}
                </button>
              </TableCell>
              <TableCell>{faq.order}</TableCell>
              <TableCell className="text-right">
                <TableActions 
                  onEdit={() => handleEdit(faq.id)}
                  onDelete={() => handleDelete(faq.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <TablePagination
          totalItems={filteredFaqs.length}
          currentPage={1}
          itemsPerPage={10}
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
          <p className="text-gray-500">Настройте часто задаваемые вопросы и ответы на сайте</p>
        </div>
        <Link href="/admin/faqs/new">
          <Button>Добавить FAQ</Button>
        </Link>
      </div>

      <Alert variant="info" title="Совет">
        Добавляйте часто задаваемые вопросы по категориям для удобной навигации. Вопросы с большим количеством полезных оценок будут отображаться в приоритете.
      </Alert>

      <FaqsTable />
    </div>
  );
} 