import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';

import { TableSkeleton } from '../components/ui/loading';
import { Alert } from '../components/ui/alert';
import { getGalleryItems } from '~/app/actions/admin/gallery-prisma';
import { GalleryTable } from './table';

export default async function GalleryPage() {
  const galleryItemsData = await getGalleryItems();
  
  // Преобразуем данные из базы к ожидаемому типу  
  const galleryItems = galleryItemsData.map((item) => ({
    ...item,
    imageSrc: (item as Record<string, unknown>).src as string || (item as Record<string, unknown>).imageSrc as string,
    tags: ((item as Record<string, unknown>).materials || []) as string[],
    details: {
      id: (item as Record<string, unknown>).id as string,
      galleryItemId: (item as Record<string, unknown>).id as string,
      client: ((item as Record<string, unknown>).client || '') as string,
      materials: ((item as Record<string, unknown>).materials || []) as string[],
      date: ((item as Record<string, unknown>).date || '') as string,
      process: ((item as Record<string, unknown>).process || '') as string,
      completionDate: ((item as Record<string, unknown>).date || '') as string,
      additionalImages: [] as string[],
      serviceType: (item as Record<string, unknown>).category as string,
      fabric: '' as string,
      notes: (item as Record<string, unknown>).description as string
    }
  })) as unknown as import('~/app/lib/definitions').GalleryItem[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление галереей</h1>
        <Link href="/admin/gallery/new">
          <Button variant="default">Добавить работу</Button>
        </Link>
      </div>

      <Alert variant="info" title="Совет">
        Для изменения порядка отображения работ используйте поле &quot;Порядок&quot;. Работы с меньшим значением отображаются первыми.
      </Alert>

      <Suspense fallback={<TableSkeleton rows={5} />}>
        <GalleryTable galleryItems={galleryItems} />
      </Suspense>
    </div>
  );
} 