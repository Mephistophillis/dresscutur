'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import { type GalleryItem } from '~/app/lib/definitions';
import { deleteGalleryItem, toggleGalleryItemStatus, toggleGalleryItemNew } from '~/app/actions/admin/gallery-prisma';

// Компонент для загрузки и отображения галереи
export function GalleryTable({ galleryItems }: { galleryItems: GalleryItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>(galleryItems);
  const [error, setError] = useState<string | null>(null);
    
    if (!items || items.length === 0) {
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

    const handleView = (id: string) => {
      window.open(`/gallery/${id}`, '_blank');
    };

    const handleEdit = (id: string) => {
      router.push(`/admin/gallery/${id}`);
    };

    const handleDelete = async (id: string) => {
      if (confirm('Вы уверены, что хотите удалить эту работу?')) {
        try {
          await deleteGalleryItem(id);
          setItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (err) {
          console.error('Failed to delete gallery item:', err);
          setError('Ошибка при удалении элемента галереи');
        }
      }
    };

    const handleToggleActive = async (id: string, currentActive: boolean) => {
      try {
        await toggleGalleryItemStatus(id);
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === id ? { ...item, isActive: !currentActive } : item
          )
        );
      } catch (err) {
        console.error('Failed to toggle gallery item status:', err);
        setError('Ошибка при изменении статуса');
      }
    };

    const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
      try {
        await toggleGalleryItemNew(id);
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === id ? { ...item, isFeatured: !currentFeatured } : item
          )
        );
      } catch (err) {
        console.error('Failed to toggle gallery item featured status:', err);
        setError('Ошибка при изменении статуса');
      }
    };
  
    return (
      <div>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
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
            {items.map((item: GalleryItem) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image
                      src={item.src || item.imageSrc || ''}
                      alt={item.title || item.alt || ''}
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
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => handleToggleActive(item.id, item.isActive)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.isActive ? 'Активно' : 'Неактивно'}
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(item.id, item.isFeatured || false)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.isFeatured
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.isFeatured ? 'Избранное' : 'Обычное'}
                    </button>
                  </div>
                </TableCell>
                <TableCell>{item.order}</TableCell>
                <TableCell className="text-right">
                  <TableActions
                    onView={() => handleView(item.id)}
                    onEdit={() => handleEdit(item.id)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        <div className="mt-4">
          <TablePagination
            totalItems={items.length}
            currentPage={1}
            itemsPerPage={10}
            onPageChange={() => {}}
          />
        </div>
      </div>
    );
  }