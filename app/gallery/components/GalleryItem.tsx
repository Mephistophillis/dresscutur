'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface GalleryItemType {
  id: number;
  src: string;
  alt: string;
  category: string;
  description: string;
  isNew?: boolean;
  details?: {
    client?: string;
    materials?: string[];
    date?: string;
    process?: string;
  };
  relatedImages?: { src: string; alt: string }[];
}

interface GalleryItemProps {
  item: GalleryItemType;
  onItemClick: (item: GalleryItemType) => void;
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
    }
  }
};

const GalleryItem: React.FC<GalleryItemProps> = ({ item, onItemClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Convert category ID to display name
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

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg cursor-pointer group"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onItemClick(item)}
      layout
    >
      <div className="relative aspect-[3/4] bg-gray-300">
        {/* Loading placeholder */}
        <div className={`absolute inset-0 bg-gray-300 ${isLoaded ? 'opacity-0' : 'animate-pulse'} transition-opacity duration-300`} />
        
        {/* Main image */}
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className={`object-cover transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Hover overlay with info */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-white">
            <h3 className="font-serif text-xl font-medium">{item.alt}</h3>
            <p className="text-sm opacity-90 mt-1">{item.description}</p>
            <span className="text-xs bg-primary px-2 py-1 rounded-full inline-block mt-2">
              {categoryDisplayNames[item.category] || item.category}
            </span>
          </div>
        </motion.div>
        
        {/* "New" tag for recent works */}
        {item.isNew && (
          <div className="absolute top-3 right-3 bg-accent text-dark text-xs font-medium py-1 px-2 rounded z-10">
            Новое
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GalleryItem; 