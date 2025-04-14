import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { LoadingPage } from '../../components/ui/loading';
import { getGalleryItemById } from '~/app/actions/admin/gallery';

type Params = Promise<{   
  id: string;
}>

type GalleryEditPageProps = {
  params: Params;
};

async function GalleryEditForm({ id }: { id: string }) {
  // Если id === "new", это создание нового элемента
  const isNewItem = id === 'new';
  
  let galleryItem;
  
  if (!isNewItem) {
    // Получаем данные для редактирования
    galleryItem = await getGalleryItemById(id);
    
    if (!galleryItem) {
      notFound();
    }
  }

  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Название
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={galleryItem?.title || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="imageSrc" className="block text-sm font-medium text-gray-700 mb-1">
                URL Изображения
              </label>
              <input
                type="text"
                id="imageSrc"
                name="imageSrc"
                defaultValue={galleryItem?.imageSrc || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                id="category"
                name="category"
                defaultValue={galleryItem?.category || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Выберите категорию</option>
                <option value="wedding">Свадебная</option>
                <option value="evening">Вечерняя</option>
                <option value="business">Деловая</option>
                <option value="casual">Повседневная</option>
                <option value="other">Другое</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={galleryItem?.description || ''}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Теги (через запятую)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                defaultValue={galleryItem?.tags?.join(', ') || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                defaultChecked={galleryItem?.isFeatured || false}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700">
                Добавить в избранное
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={galleryItem?.isActive ?? true}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Активно
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                Порядок
              </label>
              <input
                type="number"
                id="order"
                name="order"
                defaultValue={galleryItem?.order || 0}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Детали
              </label>
              
              <div className="pl-4 border-l-2 border-gray-200 space-y-3">
                <div>
                  <label htmlFor="details.client" className="block text-sm font-medium text-gray-700 mb-1">
                    Информация о клиенте
                  </label>
                  <input
                    type="text"
                    id="details.client"
                    name="details.client"
                    defaultValue={galleryItem?.details?.client || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="details.completionDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Дата завершения
                  </label>
                  <input
                    type="date"
                    id="details.completionDate"
                    name="details.completionDate"
                    defaultValue={galleryItem?.details?.completionDate || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="details.serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                    Тип услуги
                  </label>
                  <input
                    type="text"
                    id="details.serviceType"
                    name="details.serviceType"
                    defaultValue={galleryItem?.details?.serviceType || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="details.fabric" className="block text-sm font-medium text-gray-700 mb-1">
                    Материал
                  </label>
                  <input
                    type="text"
                    id="details.fabric"
                    name="details.fabric"
                    defaultValue={galleryItem?.details?.fabric || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="details.additionalImages" className="block text-sm font-medium text-gray-700 mb-1">
                    Дополнительные изображения (URL через запятую)
                  </label>
                  <textarea
                    id="details.additionalImages"
                    name="details.additionalImages"
                    defaultValue={(galleryItem?.details?.additionalImages || []).join(',')}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link href="/admin/gallery">
            <Button variant="outline">Отмена</Button>
          </Link>
          <Button type="submit" variant="primary">
            {isNewItem ? 'Создать' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default async function GalleryEditPage({ params }: GalleryEditPageProps) {
  const { id } = await params;
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
        <GalleryEditForm id={id} />
      </Suspense>
    </div>
  );
} 