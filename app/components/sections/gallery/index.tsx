import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryImage, { GalleryImageType } from './GalleryImage';
import GalleryModal from './GalleryModal';

// Sample gallery images with placeholder URLs
const galleryImages: GalleryImageType[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000',
    alt: 'Свадебное платье',
    category: 'wedding',
    description: 'Эксклюзивное свадебное платье ручной работы'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1593032465175-481ac7f401f0?q=80&w=1000',
    alt: 'Мужской костюм',
    category: 'suits',
    description: 'Классический мужской костюм из итальянской шерсти'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1566174053879-31528523f8c6?q=80&w=1000',
    alt: 'Вечернее платье',
    category: 'evening',
    description: 'Элегантное вечернее платье с ручной вышивкой'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000',
    alt: 'Женское пальто',
    category: 'outerwear',
    description: 'Стильное женское пальто из кашемира'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1519238360530-d5035e8c3260?q=80&w=1000',
    alt: 'Детское платье',
    category: 'children',
    description: 'Нарядное детское платье для особых случаев'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000',
    alt: 'Деловое платье',
    category: 'business',
    description: 'Деловое платье-футляр для современной женщины'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000',
    alt: 'Мужская рубашка',
    category: 'casual',
    description: 'Повседневная мужская рубашка из хлопка'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000',
    alt: 'Платье для выпускного',
    category: 'evening',
    description: 'Яркое платье для выпускного вечера'
  }
];

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

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);
  
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
          <button className="bg-black text-white py-3 px-8 rounded-md hover:bg-opacity-80 transition-all">
            Заказать индивидуальный пошив
          </button>
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