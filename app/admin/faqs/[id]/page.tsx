
import React, { Suspense } from 'react';
import Link from 'next/link';
import { LoadingPage } from '../../components/ui/loading';
import { FaqEditForm } from './content';

// Интерфейс для свойств компонента
type Params = Promise<{
    id: string;
  }>
type FaqEditPageProps = {
    params: Params;
};

// Основной компонент страницы
export default async function FaqEditPage({ params }: FaqEditPageProps) {
    const { id } = await params;
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <Link href="/admin/faqs" className="text-primary hover:underline flex items-center text-sm">
            <span className="mr-1">←</span> Назад к FAQ
          </Link>
          <h1 className="text-2xl font-bold">
            {id === 'new' ? 'Добавить вопрос' : 'Редактировать вопрос'}
          </h1>
        </div>
        
        <Suspense fallback={<LoadingPage />}>
          <FaqEditForm id={id} />
        </Suspense>
      </div>
    );
  } 