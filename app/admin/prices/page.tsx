'use client';

import React, { Suspense } from 'react';
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
const mockPrices = [
  {
    id: '1',
    service: 'Индивидуальный пошив платья',
    price: 15000,
    description: 'Включает консультацию, снятие мерок, подбор ткани, 2-3 примерки',
    category: 'individual',
    isActive: true,
    order: 1
  },
  {
    id: '2',
    service: 'Пошив свадебного платья',
    price: 30000,
    description: 'Включает консультацию, снятие мерок, подбор ткани, 3-4 примерки, аксессуары',
    category: 'wedding',
    isActive: true,
    order: 2
  },
  {
    id: '3',
    service: 'Индивидуальный пошив костюма',
    price: 20000,
    description: 'Включает консультацию, снятие мерок, подбор ткани, 2-3 примерки',
    category: 'business',
    isActive: true,
    order: 3
  },
  {
    id: '4',
    service: 'Ремонт одежды',
    price: 1000,
    description: 'Базовая стоимость за простой ремонт. Итоговая цена зависит от сложности работы',
    category: 'repair',
    isActive: true,
    order: 4
  }
];

// Компонент таблицы цен
function PricesTable() {
  const prices = mockPrices;
  
  if (!prices || prices.length === 0) {
    return (
      <EmptyState
        title="Цены отсутствуют"
        description="В системе пока нет цен на услуги. Добавьте новую цену."
        actionText="Добавить цену"
        actionHref="#"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
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
            <TableHead>Услуга</TableHead>
            <TableHead>Цена (₽)</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Порядок</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prices.map((price) => (
            <TableRow key={price.id}>
              <TableCell>
                <div className="font-medium">{price.service}</div>
              </TableCell>
              <TableCell>
                от {price.price.toLocaleString('ru-RU')} ₽
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate">{price.description}</div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                  {price.category === 'wedding' && 'Свадебная одежда'}
                  {price.category === 'individual' && 'Индивидуальный пошив'}
                  {price.category === 'business' && 'Деловая одежда'}
                  {price.category === 'repair' && 'Ремонт одежды'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  price.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {price.isActive ? 'Активна' : 'Неактивна'}
                </span>
              </TableCell>
              <TableCell>{price.order}</TableCell>
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
          totalItems={prices.length}
          currentPage={1}
          itemsPerPage={10}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
}

// Компонент формы для добавления/редактирования цены
function PriceForm() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium mb-4">Добавить/редактировать цену</h2>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Услуга
          </label>
          <input
            type="text"
            id="service"
            name="service"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Цена (₽)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
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
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
            Порядок
          </label>
          <input
            type="number"
            id="order"
            name="order"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={true}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Активна
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="outline">
            Отмена
          </Button>
          <Button type="submit" variant="default">
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
}

// Основной компонент страницы
export default function PricesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Управление ценами</h1>
        <p className="text-gray-500 mt-1">Добавляйте и редактируйте цены на услуги</p>
      </div>

      <Alert variant="info" title="Совет">
        Используйте поле `&quot;Порядок`&quot; для изменения последовательности отображения цен на сайте. Меньшие значения показываются первыми.
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<TableSkeleton rows={5} />}>
            <PricesTable />
          </Suspense>
        </div>
        
        <div className="lg:col-span-1">
          <PriceForm />
        </div>
      </div>
    </div>
  );
} 