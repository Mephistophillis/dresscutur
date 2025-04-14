'use client';

import React, { Suspense, useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell, 
  TablePagination 
} from '../components/ui/table';
import { TableSkeleton } from '../components/ui/loading';
import { EmptyState } from '../components/ui/empty-state';
import { TableActions } from '../components/ui/table-actions';
import { Badge, BadgeProps } from '../components/ui/badge';
import { Alert } from '../components/ui/alert';

// Временные данные для демонстрации
const mockContacts = [
  {
    id: '1',
    name: 'Екатерина Смирнова',
    email: 'kate@example.com',
    phone: '+7 (999) 123-45-67',
    message: 'Здравствуйте! Хотела бы заказать пошив свадебного платья. Когда я могу прийти на консультацию?',
    date: '2023-10-15T14:30:00Z',
    status: 'new',
  },
  {
    id: '2',
    name: 'Александр Иванов',
    email: 'alex@example.com',
    phone: '+7 (999) 987-65-43',
    message: 'Интересует пошив костюма для важного мероприятия. Нужно успеть за 2 недели, это возможно?',
    date: '2023-10-14T10:15:00Z',
    status: 'in_progress',
  },
  {
    id: '3',
    name: 'Мария Петрова',
    email: 'maria@example.com',
    phone: '+7 (999) 555-44-33',
    message: 'Хочу заказать пошив вечернего платья для выпускного дочери. Какие у вас есть варианты тканей?',
    date: '2023-10-10T17:20:00Z',
    status: 'completed',
  },
  {
    id: '4',
    name: 'Дмитрий Козлов',
    email: 'dmitry@example.com',
    phone: '+7 (999) 222-33-44',
    message: 'Нужен ремонт пиджака. Порвался шов на рукаве. Сколько это будет стоить и как скоро можно сделать?',
    date: '2023-10-08T09:45:00Z',
    status: 'completed',
  },
  {
    id: '5',
    name: 'Ольга Новикова',
    email: 'olga@example.com',
    phone: '+7 (999) 777-88-99',
    message: 'Здравствуйте! Можно ли у вас заказать пошив штор для гостиной? Интересуют ткани и примерная стоимость.',
    date: '2023-10-05T12:10:00Z',
    status: 'archived',
  }
];

// Статусы заявок
const statuses = [
  { id: 'all', name: 'Все заявки' },
  { id: 'new', name: 'Новые' },
  { id: 'in_progress', name: 'В обработке' },
  { id: 'completed', name: 'Завершенные' },
  { id: 'archived', name: 'В архиве' }
];

// Компонент таблицы заявок
function ContactsTable() {
  const [status, setStatus] = useState('all');
  
  const contacts = status === 'all' 
    ? mockContacts 
    : mockContacts.filter(contact => contact.status === status);
  
  // Функция форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Функция получения цвета и текста для статуса
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return { color: 'blue', text: 'Новая' };
      case 'in_progress':
        return { color: 'yellow', text: 'В обработке' };
      case 'completed':
        return { color: 'green', text: 'Завершена' };
      case 'archived':
        return { color: 'gray', text: 'В архиве' };
      default:
        return { color: 'gray', text: 'Неизвестно' };
    }
  };

  if (!contacts || contacts.length === 0) {
    return (
      <EmptyState
        title="Заявки отсутствуют"
        description="В системе пока нет заявок от клиентов для этого статуса."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {statuses.map(stat => (
          <button
            key={stat.id}
            onClick={() => setStatus(stat.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
              status === stat.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {stat.name}
          </button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Клиент</TableHead>
            <TableHead>Сообщение</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => {
            const statusInfo = getStatusBadge(contact.status);
            
            return (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    <div className="text-sm text-gray-500">{contact.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <p className="line-clamp-2 text-sm text-gray-700">{contact.message}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{formatDate(contact.date)}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.color as BadgeProps['variant']}>
                    {statusInfo.text}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <TableActions 
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={contact.status !== 'archived' ? () => {} : undefined}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-4">
        <TablePagination
          total={contacts.length}
          currentPage={1}
          pageSize={10}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
}

// Основной компонент страницы
export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Заявки клиентов</h1>
        <p className="text-gray-500 mt-1">Управление заявками и обращениями клиентов</p>
      </div>

      <Alert variant="info" title="Информация">
        Новые заявки требуют рассмотрения. Не забудьте ответить клиенту в течение 24 часов.
      </Alert>
      
      <Suspense fallback={<TableSkeleton rows={5} />}>
        <ContactsTable />
      </Suspense>
    </div>
  );
} 