import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { TableSkeleton } from '../components/ui/loading';
import { Alert } from '../components/ui/alert';
import { getAllTestimonials } from '~/app/actions/public/testimonials';
import { TestimonialsTable } from './components/testimonials-table';

// Серверный компонент для получения данных
async function TestimonialsData() {
  const testimonials = await getAllTestimonials();
  return <TestimonialsTable testimonials={testimonials} />;
}

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление отзывами</h1>
        <Link href="/admin/testimonials/new">
          <Button variant="default">Добавить отзыв</Button>
        </Link>
      </div>

      <Alert variant="info" title="Совет">
        Отзывы со статусом &quot;Проверен&quot; показываются на сайте. Для изменения порядка отображения используйте поле &quot;Порядок&quot;.
      </Alert>
      
      <Suspense fallback={<TableSkeleton rows={5} />}>
        <TestimonialsData />
      </Suspense>
    </div>
  );
} 