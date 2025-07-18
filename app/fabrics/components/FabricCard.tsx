'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicFabric } from '~/app/actions/public/fabrics';

interface FabricCardProps {
  fabric: PublicFabric;
}

const FabricCard: React.FC<FabricCardProps> = ({ fabric }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

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

  return (
    <>
      <motion.div 
        className="h-full"
        variants={cardVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div 
          className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-48 overflow-hidden">
            {fabric.image && !imageError ? (
              <Image
                src={fabric.image}
                alt={fabric.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500"
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${generateColor(fabric.name)}`}>
                <span className="text-3xl font-light text-gray-700">{fabric.name.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <span className="inline-block px-2 py-1 text-xs text-white bg-primary rounded-full">
                {fabric.category}
              </span>
            </div>
          </div>
          
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="font-medium text-lg mb-2 line-clamp-1">{fabric.name}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{fabric.description}</p>
            
            <div className="mt-auto">
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {fabric.colors && fabric.colors.slice(0, 3).map((color, index) => (
                    <div 
                      key={index} 
                      className="w-4 h-4 rounded-full border border-gray-300" 
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                  {fabric.colors && fabric.colors.length > 3 && (
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px] text-gray-600">
                      +{fabric.colors.length - 3}
                    </div>
                  )}
                </div>
                
                {fabric.price && (
                  <span className="text-sm font-medium">
                    {fabric.price} ₽/м
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button 
              className="w-full text-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              Подробнее
            </button>
          </div>
        </div>
      </motion.div>

      {/* Модальное окно с подробной информацией */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full bg-white/80 z-10"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="md:flex">
                  {/* Изображение ткани */}
                  <div className="md:w-1/2 relative">
                    <div className="aspect-square bg-gray-100">
                      {fabric.image && !imageError ? (
                        <Image
                          src={fabric.image}
                          alt={fabric.name}
                          fill
                          className="object-cover"
                          quality={90}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${generateColor(fabric.name)}`}>
                          <span className="text-6xl font-light text-gray-700">{fabric.name.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Информация о ткани */}
                  <div className="md:w-1/2 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{fabric.name}</h2>
                    
                    <div className="flex items-center mb-4">
                      <span className="inline-block bg-primary px-3 py-1 text-xs text-white rounded-full">
                        {fabric.category}
                      </span>
                      {fabric.price && (
                        <span className="ml-auto text-xl font-semibold text-primary">
                          {fabric.price} ₽/м
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed">{fabric.description}</p>
                    </div>
                    
                    {/* Характеристики ткани */}
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <h3 className="text-lg font-semibold mb-2">Характеристики</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                        <div>
                          <span className="text-sm text-gray-500">Категория:</span>
                          <p className="font-medium">{fabric.category}</p>
                        </div>
                      
                        {fabric.properties && fabric.properties.length > 0 && (
                          <div>
                            <span className="text-sm text-gray-500">Свойства:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {fabric.properties.map((property, index) => (
                                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {property}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Цвета */}
                    {fabric.colors && fabric.colors.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Доступные цвета</h3>
                        <div className="flex flex-wrap gap-2">
                          {fabric.colors.map((color, index) => (
                            <div 
                              key={index} 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" 
                              style={{ backgroundColor: color.toLowerCase() }}
                            >
                              <span className="sr-only">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Кнопка заказа */}
                    <div className="mt-6">
                      <button 
                        className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg transition-colors"
                        onClick={() => {
                          setIsModalOpen(false);
                          // Здесь можно добавить логику оформления заказа
                        }}
                      >
                        Заказать ткань
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FabricCard; 