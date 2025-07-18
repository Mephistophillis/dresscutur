'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Fabric } from '../../lib/types';

interface FabricDetailProps {
  fabric: Fabric;
  onClose: () => void;
}

const FabricDetail: React.FC<FabricDetailProps> = ({ fabric, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [imagesWithErrors, setImagesWithErrors] = useState<Record<number, boolean>>({});

  const images = fabric.gallery || [fabric.image];

  // Function to generate a background color based on fabric name
  const generateColor = (name: string): string => {
    const colors = [
      'bg-pink-100', 'bg-blue-100', 'bg-green-100', 
      'bg-yellow-100', 'bg-purple-100', 'bg-red-100', 
      'bg-indigo-100', 'bg-gray-100'
    ];
    
    // Use the sum of char codes to deterministically select a color
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageError = (index: number) => {
    setImagesWithErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const contentVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.1 } },
    exit: { y: 50, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row"
            variants={contentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Gallery */}
            <div className="w-full md:w-1/2 relative h-96 md:h-auto">
              <div className="relative h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {imagesWithErrors[currentImageIndex] ? (
                      // Placeholder for failed images
                      <div className={`w-full h-full flex items-center justify-center ${generateColor(fabric.name)}`}>
                        <div className="text-center p-4">
                          <div className="text-primary text-6xl mb-3 font-bold">{fabric.name.charAt(0)}</div>
                          <div className="text-lg text-gray-600">{fabric.name}</div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={images[currentImageIndex]}
                        alt={`${fabric.name} - изображение ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={() => handleImageError(currentImageIndex)}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                
                {images.length > 1 && (
                  <>
                    <button 
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                      onClick={prevImage}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                      onClick={nextImage}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-50 flex p-2 overflow-x-auto space-x-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        className={`relative h-16 w-16 flex-shrink-0 rounded overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        {imagesWithErrors[index] ? (
                          <div className={`w-full h-full flex items-center justify-center ${generateColor(fabric.name)}`}>
                            <span className="text-primary font-bold">{index + 1}</span>
                          </div>
                        ) : (
                          <Image
                            src={img}
                            alt={`Миниатюра ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                            onError={() => handleImageError(index)}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Details */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto">
              <button 
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                onClick={handleClose}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="text-3xl font-serif font-bold text-dark mb-2">{fabric.name}</h2>
              
              {fabric.price && (
                <p className="text-xl text-primary font-semibold mb-4">{fabric.price} ₽/м</p>
              )}
              
              <p className="text-gray-700 mb-6">{fabric.details?.description || fabric.description}</p>
              
              {/* Technical details */}
              <div className="bg-secondary p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-3">Технические характеристики</h3>
                <div className="space-y-2">
                  {fabric.details?.composition && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Состав:</span>
                      <span className="font-medium">{fabric.details.composition}</span>
                    </div>
                  )}
                  
                  {fabric.details?.width && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ширина:</span>
                      <span className="font-medium">{fabric.details.width} см</span>
                    </div>
                  )}
                  
                  {fabric.details?.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Плотность:</span>
                      <span className="font-medium">{fabric.details.weight} г/м²</span>
                    </div>
                  )}
                  
                  {fabric.details?.origin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Страна производства:</span>
                      <span className="font-medium">{fabric.details.origin}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Care instructions */}
              {fabric.details?.care && fabric.details.care.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Рекомендации по уходу</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {fabric.details.care.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Available colors */}
              {fabric.colors && fabric.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Доступные цвета</h3>
                  <div className="flex flex-wrap gap-3">
                    {fabric.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                        title={`Цвет ${index + 1}`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Order sample button */}
              <button className="w-full btn-primary py-4 text-center mt-6">
                Заказать образец
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FabricDetail; 