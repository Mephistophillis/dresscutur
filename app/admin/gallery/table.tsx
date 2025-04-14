'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
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
import type { GalleryItem } from '~/app/actions/admin/gallery';


// Компонент для загрузки и отображения галереи
export function GalleryTable({ galleryItems }: { galleryItems: GalleryItem[] }) {
    
    if (!galleryItems || galleryItems.length === 0) {
      return (
        <EmptyState
          title="Галерея пуста"
          description="В галерее пока нет изображений. Добавьте новые работы."
          actionText="Добавить работу"
          actionHref="/admin/gallery/new"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
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
              <TableHead>Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Порядок</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleryItems.map((item: GalleryItem) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                  </div>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    item.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.isActive ? 'Активно' : 'Неактивно'}
                  </span>
                  {item.isFeatured && (
                    <span className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                      Избранное
                    </span>
                  )}
                </TableCell>
                <TableCell>{item.order}</TableCell>
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
            total={galleryItems.length}
            currentPage={1}
            pageSize={10}
            onPageChange={() => {}}
          />
        </div>
      </div>
    );
  }