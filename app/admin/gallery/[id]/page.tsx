import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LoadingPage } from '../../components/ui/loading';
import { getGalleryItem } from '~/app/actions/admin/gallery-prisma';
import { GalleryEditForm } from './content';

type Params = Promise<{   
  id: string;
}>

type GalleryEditPageProps = {
  params: Params;
};

export default async function GalleryEditPage({ params }: GalleryEditPageProps) {
  const { id } = await params;

    // Если id === "new", это создание нового элемента
    const isNewItem = id === 'new';
  
    let galleryItem;
    
    if (!isNewItem) {
      // Получаем данные для редактирования
      try {
        galleryItem = await getGalleryItem(id);
      } catch (error) {
        console.error('Ошибка при получении элемента галереи:', error);
        notFound();
      }
    }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Link href="/admin/gallery" className="text-primary hover:underline flex items-center text-sm">
          <span className="mr-1">←</span> Назад к галерее
        </Link>
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Добавить работу' : 'Редактировать работу'}
        </h1>
      </div>
      
      <Suspense fallback={<LoadingPage />}>
          <GalleryEditForm item={galleryItem} isNewItem={isNewItem} />
      </Suspense>
    </div>
  );
} 