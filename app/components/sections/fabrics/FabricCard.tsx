import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PublicFabric } from '~/app/actions/public/fabrics';

interface FabricProps {
  fabric: PublicFabric;
}

const itemVariants = {
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

// Функция для получения случайного цвета фона на основе категории ткани
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'silk': '#F3E5D8',
    'cotton': '#E5EFF3',
    'wool': '#F3E9E5',
    'linen': '#E9F3E5',
    'cashmere': '#F3E5EC',
    'tweed': '#E5F3EC',
    'default': '#F0F0F0'
  };
  
  const normalizedCategory = category.toLowerCase();
  return colorMap[normalizedCategory] || colorMap.default;
};

const FabricCard: React.FC<FabricProps> = ({ fabric }) => {
  const bgColor = getCategoryColor(fabric.category);
  
  return (
    <motion.div 
      className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{ backgroundColor: bgColor }}
      variants={itemVariants}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
    >
      <div className="h-64 relative overflow-hidden">
        {fabric.image ? (
          <>
            <div className="absolute inset-0 bg-gray-300 animate-pulse">
              {/* Placeholder for image loading */}
            </div>
            <Image
              src={fabric.image}
              alt={fabric.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
            Изображение отсутствует
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{fabric.name}</h3>
        <p className="text-gray-700">{fabric.description}</p>
      </div>
    </motion.div>
  );
};

export default FabricCard; 