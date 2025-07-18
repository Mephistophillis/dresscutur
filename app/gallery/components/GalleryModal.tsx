'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItemType } from './GalleryItem';
import SocialShare from './SocialShare';
import { getGalleryItemDetails, PublicGalleryItemDetails } from '~/app/actions/public/gallery';

interface GalleryModalProps {
  isOpen: boolean;
  item: GalleryItemType | null;
  onClose: () => void;
}

interface ImageItem {
  id: string;
  src: string;
  alt: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, item, onClose }) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'details'>('photos');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [itemDetails, setItemDetails] = useState<PublicGalleryItemDetails | null>(null);
  
  // Загружаем подробности элемента при открытии модального окна
  useEffect(() => {
    if (isOpen && item) {
      const loadDetails = async () => {
        setIsLoading(true);
        try {
          const details = await getGalleryItemDetails(item.id);
          if (details) {
            setItemDetails(details);
          }
        } catch (error) {
          console.error('Ошибка при загрузке деталей:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadDetails();
    } else {
      // Сбрасываем состояние при закрытии
      setItemDetails(null);
      setSelectedImageIndex(0);
      setActiveTab('photos');
    }
  }, [isOpen, item]);
  
  // Закрытие модального окна при нажатии Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Обработчик следующей/предыдущей фотографии
  const handleNext = () => {
    if (!itemDetails || !itemDetails.relatedImages.length) return;
    
    if (selectedImageIndex === itemDetails.relatedImages.length) {
      // Если мы на основном изображении и нажали "следующее" - переходим к первой фотографии
      setSelectedImageIndex(0);
    } else {
      setSelectedImageIndex((prev) => (prev + 1) % (itemDetails.relatedImages.length + 1));
    }
  };
  
  const handlePrev = () => {
    if (!itemDetails || !itemDetails.relatedImages.length) return;
    
    if (selectedImageIndex === 0) {
      // Если мы на первой фотографии и нажали "предыдущее" - переходим к основному изображению
      setSelectedImageIndex(itemDetails.relatedImages.length);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + (itemDetails.relatedImages.length + 1)) % (itemDetails.relatedImages.length + 1));
    }
  };
  
  // Convert category ID to display name (такой же как в GalleryItem)
  const categoryDisplayNames: Record<string, string> = {
    'wedding': 'Свадебные наряды',
    'evening': 'Вечерние платья',
    'suits': 'Мужские костюмы',
    'women': 'Женская одежда',
    'outerwear': 'Верхняя одежда',
    'children': 'Детская одежда',
    'special': 'Особые проекты',
    'business': 'Деловая одежда',
    'casual': 'Повседневная'
  };
  
  if (!isOpen || !item) return null;
  
  // Массив всех фотографий для слайдера (основное изображение + связанные)
  const allImages: ImageItem[] = itemDetails ? 
    [{ id: 'main', src: itemDetails.src, alt: itemDetails.alt }].concat(
      itemDetails.relatedImages.map(img => ({
        id: img.id,
        src: img.src,
        alt: img.alt || img.src.split('/').pop() || 'Изображение галереи'
      }))
    ) : 
    [{ id: 'main', src: item.src, alt: item.alt }];
  
  // Текущее изображение для отображения
  const currentImage = allImages[selectedImageIndex] || allImages[0];
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Модальное окно */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-6xl mx-auto bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Кнопка закрытия */}
          <button
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full transition-colors hover:bg-white"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Содержимое модального окна */}
          <div className="md:flex">
            {/* Левая часть - фотография */}
            <div className="md:w-3/5 relative bg-gray-100">
              {/* Loading spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Основное изображение */}
              <div className="relative aspect-[4/3] md:aspect-auto md:h-[80vh]">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || ''}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Навигация по изображениям */}
              {itemDetails && itemDetails.relatedImages && itemDetails.relatedImages.length > 0 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    aria-label="Предыдущее изображение"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    aria-label="Следующее изображение"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Thumbnails */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                    {allImages.map((img, index) => (
                      <button
                        key={img.id}
                        className={`w-12 h-12 relative rounded overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index 
                            ? 'border-primary' 
                            : 'border-white/50 hover:border-white'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(index);
                        }}
                      >
                        <Image 
                          src={img.src} 
                          alt={img.alt || ''} 
                          fill 
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Правая часть - информация */}
            <div className="md:w-2/5 p-6 md:p-8 md:overflow-y-auto md:max-h-[80vh]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-gray-900">
                    {item.alt}
                  </h2>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block px-3 py-1 text-xs text-white bg-primary rounded-full">
                      {categoryDisplayNames[item.category] || item.category}
                    </span>
                    
                    {item.isNew && (
                      <span className="inline-block px-3 py-1 text-xs bg-accent text-dark rounded-full">
                        Новое
                      </span>
                    )}
                  </div>
                </div>
                
                <SocialShare 
                  url={`${window.location.origin}/gallery?item=${item.id}`} 
                  title={`Проект "${item.alt}" от Dress Cutur`}
                />
              </div>
              
              {/* Описание */}
              <div className="mt-6">
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
              
              {/* Табы */}
              <div className="mt-8 border-b border-gray-200">
                <div className="flex space-x-8">
                  <button
                    className={`pb-4 font-medium text-sm transition-colors relative ${
                      activeTab === 'photos' 
                        ? 'text-primary' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('photos')}
                  >
                    Фотографии
                    {activeTab === 'photos' && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                        layoutId="activeTab"
                      />
                    )}
                  </button>
                  
                  <button
                    className={`pb-4 font-medium text-sm transition-colors relative ${
                      activeTab === 'details' 
                        ? 'text-primary' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    Детали проекта
                    {activeTab === 'details' && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                        layoutId="activeTab"
                      />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Содержимое табов */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'photos' ? (
                    <motion.div
                      key="photos"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {allImages.map((img, index) => (
                          <div 
                            key={img.id}
                            className="relative aspect-[3/4] cursor-pointer rounded-lg overflow-hidden"
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <Image 
                              src={img.src}
                              alt={img.alt || ''} 
                              fill
                              className="object-cover transition-transform hover:scale-105 duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isLoading ? (
                        <div className="flex justify-center py-12">
                          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Если детали есть, выводим их */}
                          {(itemDetails?.details || item.details) && (
                            <>
                              {/* Клиент */}
                              {(itemDetails?.details?.client || item.details?.client) && (
                                <div>
                                  <h3 className="text-sm text-gray-500">Клиент:</h3>
                                  <p className="font-medium">{itemDetails?.details?.client || item.details?.client}</p>
                                </div>
                              )}
                              
                              {/* Дата */}
                              {(itemDetails?.details?.date || item.details?.date) && (
                                <div>
                                  <h3 className="text-sm text-gray-500">Дата создания:</h3>
                                  <p className="font-medium">{itemDetails?.details?.date || item.details?.date}</p>
                                </div>
                              )}
                              
                              {/* Материалы */}
                              {(itemDetails?.details?.materials?.length || item.details?.materials?.length) && (
                                <div>
                                  <h3 className="text-sm text-gray-500">Материалы:</h3>
                                  <ul className="list-disc list-inside space-y-1 mt-1">
                                    {(itemDetails?.details?.materials || item.details?.materials || []).map((material, idx) => (
                                      <li key={idx} className="font-medium">{material}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Процесс */}
                              {(itemDetails?.details?.process || item.details?.process) && (
                                <div>
                                  <h3 className="text-sm text-gray-500">Процесс изготовления:</h3>
                                  <p className="font-medium">{itemDetails?.details?.process || item.details?.process}</p>
                                </div>
                              )}
                            </>
                          )}
                          
                          {/* Если деталей нет */}
                          {!itemDetails?.details && !item.details && (
                            <p className="text-gray-500 italic">Детали проекта не указаны</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Кнопка консультации */}
              <div className="mt-8">
                <a 
                  href="/contact?subject=Консультация"
                  className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-3 px-6 rounded-lg transition-colors"
                >
                  Получить консультацию
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GalleryModal; 