'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import GalleryItem, { GalleryItemType } from './GalleryItem';

interface GalleryGridProps {
  selectedCategory: string;
  searchQuery: string;
  onItemClick: (item: GalleryItemType) => void;
}

// Sample gallery items with placeholder images
const galleryItems: GalleryItemType[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000',
    alt: 'Свадебное платье',
    category: 'wedding',
    description: 'Эксклюзивное свадебное платье ручной работы',
    isNew: true,
    details: {
      client: 'Анна М.',
      materials: ['Итальянский шелк', 'Французское кружево'],
      date: '2023-06-15',
      process: 'Создано по индивидуальным меркам с тремя примерками',
    },
    relatedImages: [
      { src: 'https://images.unsplash.com/photo-1494578379344-d6c710782a3d?q=80&w=1000', alt: 'Деталь свадебного платья' },
      { src: 'https://images.unsplash.com/photo-1550103685-da83caf1f0c8?q=80&w=1000', alt: 'Вид сзади' },
    ]
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
    description: 'Элегантное вечернее платье с ручной вышивкой',
    isNew: true
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
    category: 'suits',
    description: 'Мужская рубашка из египетского хлопка'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000',
    alt: 'Платье для выпускного',
    category: 'evening',
    description: 'Яркое платье для выпускного вечера'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
    alt: 'Зимнее пальто',
    category: 'outerwear',
    description: 'Теплое зимнее пальто с меховым воротником',
    isNew: true
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1000',
    alt: 'Свадебный костюм',
    category: 'wedding',
    description: 'Элегантный мужской костюм для свадьбы'
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=1000',
    alt: 'Детский костюм',
    category: 'children',
    description: 'Праздничный костюм для маленького джентльмена'
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000',
    alt: 'Женский костюм',
    category: 'women',
    description: 'Стильный женский костюм из льна'
  },
];

const GalleryGrid: React.FC<GalleryGridProps> = ({ selectedCategory, searchQuery, onItemClick }) => {
  const [filteredItems, setFilteredItems] = useState<GalleryItemType[]>([]);
  
  useEffect(() => {
    // Apply both category and search filters
    let items = galleryItems;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        item => 
          item.alt.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(items);
  }, [selectedCategory, searchQuery]);

  // Organize items into columns for masonry layout
  const getColumnItems = (columnIndex: number, columnCount: number) => {
    return filteredItems.filter((_, index) => index % columnCount === columnIndex);
  };
  
  return (
    <div>
      <LayoutGroup>
        {/* Masonry layout with responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {/* Column 1 */}
          <div className="space-y-5 md:space-y-6">
            <AnimatePresence>
              {getColumnItems(0, 4).map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GalleryItem 
                    item={item} 
                    onItemClick={onItemClick} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Column 2 */}
          <div className="space-y-5 md:space-y-6">
            <AnimatePresence>
              {getColumnItems(1, 4).map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GalleryItem 
                    item={item} 
                    onItemClick={onItemClick} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Column 3 - Show on large screens */}
          <div className="hidden lg:block space-y-5 md:space-y-6">
            <AnimatePresence>
              {getColumnItems(2, 4).map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GalleryItem 
                    item={item} 
                    onItemClick={onItemClick} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Column 4 - Show on extra large screens */}
          <div className="hidden xl:block space-y-5 md:space-y-6">
            <AnimatePresence>
              {getColumnItems(3, 4).map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GalleryItem 
                    item={item} 
                    onItemClick={onItemClick} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
      
      {/* Empty state */}
      {filteredItems.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-500 text-lg">По вашему запросу ничего не найдено.</p>
          <p className="text-gray-400 mt-2">Попробуйте изменить параметры поиска или выбрать другую категорию.</p>
        </motion.div>
      )}
      
      {/* Display count of found items */}
      {filteredItems.length > 0 && (
        <div className="mt-6 text-right text-sm text-gray-500">
          Найдено работ: {filteredItems.length}
        </div>
      )}
    </div>
  );
};

export default GalleryGrid; 