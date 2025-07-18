'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryImage, { GalleryImageType } from './GalleryImage';
import GalleryModal from './GalleryModal';

interface GalleryProps {
  galleryItems: GalleryImageType[];
}

const categories = [
  { id: 'all', name: 'Все работы' },
  { id: 'wedding', name: 'Свадебные' },
  { id: 'suits', name: 'Костюмы' },
  { id: 'evening', name: 'Вечерние' },
  { id: 'outerwear', name: 'Верхняя одежда' },
  { id: 'children', name: 'Детская одежда' },
  { id: 'business', name: 'Деловая одежда' },
  { id: 'casual', name: 'Повседневная' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Gallery = ({ galleryItems }: GalleryProps) => {
  const [galleryImages] = useState<GalleryImageType[]>(galleryItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);
  const [isLoading] = useState(false);
  
  // Get filtered images based on active category
  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const handleImageClick = (image: GalleryImageType) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (isLoading) {
    return (
      <section id="gallery" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Галерея наших работ</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Взгляните на наши недавние работы. Каждое изделие создано с любовью к деталям 
            и индивидуальным подходом к пожеланиям заказчика.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === category.id 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid with Layout Animation */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
        >
          <AnimatePresence>
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GalleryImage 
                  image={image} 
                  onImageClick={handleImageClick} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Работы в данной категории пока отсутствуют.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <a href="/contact" className="bg-black text-white py-3 px-8 rounded-md hover:bg-opacity-80 transition-all inline-block">
            Заказать индивидуальный пошив
          </a>
        </div>

        {/* Modal */}
        <GalleryModal 
          isOpen={modalOpen} 
          image={selectedImage} 
          onClose={closeModal} 
        />
      </div>
    </section>
  );
};

export default Gallery; 