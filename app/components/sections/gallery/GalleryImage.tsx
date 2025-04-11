import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface GalleryImageType {
  id: number;
  src: string;
  alt: string;
  category: string;
  description: string;
}

interface GalleryImageProps {
  image: GalleryImageType;
  onImageClick: (image: GalleryImageType) => void;
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const GalleryImage: React.FC<GalleryImageProps> = ({ image, onImageClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-300"
      variants={imageVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      onClick={() => onImageClick(image)}
      layout
    >
      <div className="aspect-square relative">
        <div className={`absolute inset-0 bg-gray-300 ${isLoaded ? 'animate-none' : 'animate-pulse'}`}>
          {/* Placeholder for image loading */}
        </div>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className={`object-cover transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onLoad={() => setIsLoaded(true)}
        />
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-4 transition-opacity"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-white">
            <h3 className="text-lg font-semibold">{image.alt}</h3>
            <p className="text-sm opacity-90">{image.description}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GalleryImage; 