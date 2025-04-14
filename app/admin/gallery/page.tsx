import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';

import { TableSkeleton } from '../components/ui/loading';
import { Alert } from '../components/ui/alert';
import { getGalleryItems } from '~/app/actions/admin/gallery';
import { GalleryTable } from './table';

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление галереей</h1>
        <Link href="/admin/gallery/new">
          <Button variant="primary">Добавить работу</Button>
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