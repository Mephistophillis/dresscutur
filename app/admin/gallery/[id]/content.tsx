'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { GalleryItem } from '~/app/actions/admin/gallery';
import ImageUpload from '~/app/admin/components/ui/image-upload';

export function GalleryEditForm({ item, isNewItem }: { item?: GalleryItem, isNewItem: boolean }) {

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
                defaultValue={item?.title || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <ImageUpload
                id="gallery-image"
                label="Изображение"
                initialImage={item?.imageSrc || ''}
                onImageUpload={(url) => {
                  const imageInput = document.createElement('input');
                  imageInput.type = 'hidden';
                  imageInput.name = 'imageSrc';
                  imageInput.value = url;
                  
                  const existingInput = document.querySelector('input[name="imageSrc"]') as HTMLInputElement;
                  if (existingInput) {
                    existingInput.value = url;
                  } else {
                    document.getElementById('gallery-form')?.appendChild(imageInput);
                  }
                }}
                category="gallery"
                maxSizeMB={5}
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                id="category"
                name="category"
                defaultValue={item?.category || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                defaultValue={item?.description || ''}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                defaultValue={item?.tags?.join(', ') || ''}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                defaultChecked={item?.isFeatured || false}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-blue-500"
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
                defaultChecked={item?.isActive ?? true}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-blue-500"
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
                defaultValue={item?.order || 0}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    defaultValue={item?.details?.client || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    defaultValue={item?.details?.completionDate || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    defaultValue={item?.details?.serviceType || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    defaultValue={item?.details?.fabric || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="details.additionalImages" className="block text-sm font-medium text-gray-700 mb-1">
                    Дополнительные изображения
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Здесь должен быть код для открытия файлового диалога и загрузки нескольких изображений
                        // Временно сохраним его как скрытое поле
                        const existingImagesInput = document.querySelector('textarea[name="details.additionalImages"]') as HTMLTextAreaElement;
                        if (existingImagesInput && existingImagesInput.value) {
                          // Оставляем текстовое поле пока не реализуем полную логику множественной загрузки
                        }
                      }}
                      className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Загрузить дополнительные изображения
                    </button>
                    <textarea
                      id="details.additionalImages"
                      name="details.additionalImages"
                      defaultValue={(item?.details?.additionalImages || []).join(',')}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Введите URL-адреса через запятую или используйте кнопку загрузки"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link href="/admin/gallery">
            <Button variant="outline">Отмена</Button>
          </Link>
          <Button type="submit" variant="default">
            {isNewItem ? 'Создать' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </div>
  );
}