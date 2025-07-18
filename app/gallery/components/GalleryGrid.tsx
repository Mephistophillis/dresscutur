'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import GalleryItem, { GalleryItemType } from './GalleryItem';
import { PublicGalleryItem } from '~/app/actions/public/gallery';
import GalleryModal from './GalleryModal';

interface GalleryGridProps {
  initialItems: PublicGalleryItem[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ initialItems }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<GalleryItemType[]>(initialItems as GalleryItemType[]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItemType | null>(null);
  
  // Обработка событий
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleItemClick = (item: GalleryItemType) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  
  useEffect(() => {
    // Слушаем события от SearchBar и CategoryFilter
    const handleCategoryChangeEvent = (e: CustomEvent) => {
      handleCategoryChange(e.detail);
    };
    
    const handleSearchEvent = (e: CustomEvent) => {
      handleSearch(e.detail);
    };
    
    document.addEventListener('categoryChange', handleCategoryChangeEvent as EventListener);
    document.addEventListener('search', handleSearchEvent as EventListener);
    
    return () => {
      document.removeEventListener('categoryChange', handleCategoryChangeEvent as EventListener);
      document.removeEventListener('search', handleSearchEvent as EventListener);
    };
  }, []);
  
  useEffect(() => {
    // Apply both category and search filters
    let items = initialItems as GalleryItemType[];
    
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
  }, [selectedCategory, searchQuery, initialItems]);

  // Organize items into columns for masonry layout
  const getColumnItems = (columnIndex: number, columnCount: number) => {
    return filteredItems.filter((_, index) => index % columnCount === columnIndex);
  };
  
  return (
    <>
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
                      onItemClick={handleItemClick} 
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
                      onItemClick={handleItemClick} 
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
                      onItemClick={handleItemClick} 
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
                      onItemClick={handleItemClick} 
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
      
      <GalleryModal 
        isOpen={modalOpen}
        item={selectedItem}
        onClose={closeModal}
      />
    </>
  );
};

export default GalleryGrid; 