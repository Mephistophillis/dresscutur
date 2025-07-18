'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GalleryItemType } from './GalleryItem';

interface ProjectDetailsProps {
  item: GalleryItemType;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ item }) => {
  const [activeTab, setActiveTab] = useState('description');
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64 sm:h-80 md:h-96">
        <Image 
          src={item.src} 
          alt={item.alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">{item.alt}</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
            {item.category}
          </span>
          {item.isNew && (
            <span className="inline-block px-3 py-1 bg-accent text-dark text-sm font-medium rounded-full">
              Новинка
            </span>
          )}
        </div>
        
        {/* Tabs navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 border-b-2 -mb-px ${
              activeTab === 'description' 
                ? 'border-primary text-primary font-medium' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Описание
          </button>
          <button
            className={`py-2 px-4 border-b-2 -mb-px ${
              activeTab === 'details' 
                ? 'border-primary text-primary font-medium' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Детали
          </button>
          <button
            className={`py-2 px-4 border-b-2 -mb-px ${
              activeTab === 'timeline' 
                ? 'border-primary text-primary font-medium' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('timeline')}
          >
            Процесс
          </button>
        </div>
        
        {/* Tab content */}
        <div className="min-h-[200px]">
          {/* Description tab */}
          {activeTab === 'description' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-700">{item.description}</p>
              
              {/* Additional images if available */}
              {item.relatedImages && item.relatedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Дополнительные фотографии</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {item.relatedImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                        <Image 
                          src={image.src} 
                          alt={image.alt}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Details tab */}
          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {item.details ? (
                <div className="space-y-4">
                  {item.details.client && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Клиент</h3>
                      <p className="text-gray-900">{item.details.client}</p>
                    </div>
                  )}
                  
                  {item.details.date && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Дата изготовления</h3>
                      <p className="text-gray-900">
                        {new Date(item.details.date).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  
                  {item.details.materials && item.details.materials.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Материалы</h3>
                      <ul className="list-disc pl-5 mt-2 text-gray-900">
                        {item.details.materials.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">Подробная информация отсутствует</p>
              )}
            </motion.div>
          )}
          
          {/* Timeline tab */}
          {activeTab === 'timeline' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {item.details && item.details.process ? (
                <>
                  <p className="text-gray-700 mb-6">{item.details.process}</p>
                  
                  {/* Example timeline */}
                  <div className="relative border-l-2 border-primary pl-6 pb-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">1</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Консультация и замеры</h3>
                      <p className="text-gray-600 mt-1">Обсуждение пожеланий клиента и снятие мерок для индивидуального пошива</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">2</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Создание выкройки</h3>
                      <p className="text-gray-600 mt-1">Разработка индивидуальной выкройки с учетом особенностей фигуры</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">3</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Пошив и примерки</h3>
                      <p className="text-gray-600 mt-1">Поэтапное изготовление изделия с промежуточными примерками</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">4</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Финальное изделие</h3>
                      <p className="text-gray-600 mt-1">Готовая работа после всех корректировок и финальных штрихов</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">Информация о процессе создания отсутствует</p>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Call to action */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-all">
            Заказать похожее
          </button>
          <button className="flex-1 border border-primary text-primary py-3 px-6 rounded-md hover:bg-primary hover:text-white transition-all">
            Связаться с ателье
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 