'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItemType } from './GalleryItem';

interface GalleryModalProps {
  isOpen: boolean;
  item: GalleryItemType | null;
  onClose: () => void;
}

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3, 
      delay: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, item, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Reset current image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsZoomed(false);
    }
  }, [isOpen, item]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Navigate with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !item) return;
      
      if (e.key === 'ArrowLeft') {
        navigatePrevious();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, item, currentImageIndex]);

  // Get all images (main + related)
  const getAllImages = useCallback(() => {
    if (!item) return [];
    
    const images = [{ src: item.src, alt: item.alt }];
    if (item.relatedImages && item.relatedImages.length > 0) {
      images.push(...item.relatedImages);
    }
    
    return images;
  }, [item]);

  // Navigation functions
  const navigateNext = useCallback(() => {
    const images = getAllImages();
    if (images.length <= 1) return;
    
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  }, [getAllImages]);

  const navigatePrevious = useCallback(() => {
    const images = getAllImages();
    if (images.length <= 1) return;
    
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  }, [getAllImages]);

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      navigateNext();
    }
    
    if (isRightSwipe) {
      navigatePrevious();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Toggle zoom
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Share on social media
  const shareOnSocial = (platform: 'facebook' | 'twitter' | 'pinterest') => {
    if (!item) return;
    
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${item.alt} - ${item.description}`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (!item) return null;

  const images = getAllImages();
  const currentImage = images[currentImageIndex];

  // Format category names for display
  const getCategoryName = (categoryId: string) => {
    const categoryMap: Record<string, string> = {
      'wedding': 'Свадебные наряды',
      'evening': 'Вечерние платья',
      'suits': 'Мужские костюмы',
      'women': 'Женская одежда',
      'outerwear': 'Верхняя одежда',
      'children': 'Детская одежда',
      'special': 'Особые проекты'
    };
    
    return categoryMap[categoryId] || categoryId;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main content */}
          <motion.div 
            className="relative w-full max-w-6xl max-h-[90vh] mx-4 bg-white rounded-lg overflow-hidden flex flex-col md:flex-row"
            variants={contentVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
              onClick={onClose}
              aria-label="Закрыть"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Left/right navigation buttons */}
            {images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePrevious();
                  }}
                  aria-label="Предыдущее изображение"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateNext();
                  }}
                  aria-label="Следующее изображение"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image container */}
            <div 
              className={`relative w-full md:w-3/5 h-[40vh] md:h-[70vh] bg-gray-100 cursor-pointer ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={toggleZoom}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  className="relative w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image 
                    src={currentImage.src} 
                    alt={currentImage.alt}
                    fill
                    className={`${isZoomed ? 'object-contain scale-150 cursor-zoom-out' : 'object-contain'} transition-transform duration-300`}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Image indicators for multiple images */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-gray-400'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                        setIsZoomed(false);
                      }}
                      aria-label={`Изображение ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Details panel */}
            <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">{item.alt}</h2>
              <p className="text-gray-700 mb-4">{item.description}</p>
              
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                  {getCategoryName(item.category)}
                </span>
                {item.isNew && (
                  <span className="inline-block ml-2 px-3 py-1 bg-accent text-dark text-sm font-medium rounded-full">
                    Новинка
                  </span>
                )}
              </div>
              
              {/* Details section */}
              {item.details && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Детали проекта</h3>
                  <div className="space-y-3">
                    {item.details.client && (
                      <div>
                        <span className="text-sm text-gray-500">Клиент:</span>
                        <p className="text-gray-900">{item.details.client}</p>
                      </div>
                    )}
                    
                    {item.details.date && (
                      <div>
                        <span className="text-sm text-gray-500">Дата изготовления:</span>
                        <p className="text-gray-900">
                          {new Date(item.details.date).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </p>
                      </div>
                    )}
                    
                    {item.details.materials && item.details.materials.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">Материалы:</span>
                        <ul className="text-gray-900 ml-4 mt-1 list-disc">
                          {item.details.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.details.process && (
                      <div>
                        <span className="text-sm text-gray-500">Процесс изготовления:</span>
                        <p className="text-gray-900">{item.details.process}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Call to action */}
              <div className="mb-6">
                <button className="w-full py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all">
                  Заказать похожее
                </button>
              </div>
              
              {/* Social share */}
              <div className="flex gap-3">
                <button 
                  onClick={() => shareOnSocial('facebook')}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="Поделиться в Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </button>
                <button 
                  onClick={() => shareOnSocial('twitter')}
                  className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
                  aria-label="Поделиться в Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </button>
                <button 
                  onClick={() => shareOnSocial('pinterest')}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  aria-label="Поделиться в Pinterest"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.04 21.54c.96.29 1.93.46 2.96.46a10 10 0 0 0 10-10A10 10 0 0 0 12 2 10 10 0 0 0 2 12c0 4.25 2.67 7.9 6.44 9.34-.04-.38-.12-1.1-.06-1.58l1.06-4.49s-.27-.54-.27-1.33c0-1.24.72-2.16 1.62-2.16.76 0 1.13.57 1.13 1.26 0 .77-.49 1.92-.74 2.98-.21.9.45 1.63 1.32 1.63 1.59 0 2.8-1.67 2.8-4.1 0-2.14-1.54-3.64-3.74-3.64-2.54 0-4.02 1.92-4.02 3.9 0 .77.29 1.6.67 2.05a.27.27 0 0 1 .06.26c-.07.27-.2.8-.23.89-.04.16-.12.19-.28.12-1.05-.51-1.7-2.1-1.7-3.37 0-2.76 2.01-5.3 5.78-5.3 3.04 0 5.4 2.17 5.4 5.07 0 3.02-1.9 5.46-4.54 5.46-.89 0-1.72-.47-2.01-1.02l-.54 2.07c-.2.78-.74 1.78-1.1 2.38z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal; 