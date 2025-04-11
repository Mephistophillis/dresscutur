'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'Все работы' },
  { id: 'wedding', name: 'Свадебные наряды' },
  { id: 'evening', name: 'Вечерние платья' },
  { id: 'suits', name: 'Мужские костюмы' },
  { id: 'women', name: 'Женская одежда' },
  { id: 'outerwear', name: 'Верхняя одежда' },
  { id: 'children', name: 'Детская одежда' },
  { id: 'special', name: 'Особые проекты' },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // For mobile: toggle dropdown
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <div className="w-full md:w-auto">
      {/* Mobile view - dropdown */}
      <div className="md:hidden relative">
        <button
          onClick={toggleExpand}
          className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span>{categories.find(cat => cat.id === selectedCategory)?.name || 'Все работы'}</span>
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <motion.div 
            className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  setIsExpanded(false);
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selectedCategory === category.id ? 'bg-gray-100 font-medium' : ''
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Desktop view - horizontal buttons */}
      <div className="hidden md:flex flex-wrap gap-2">
        {categories.map(category => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              selectedCategory === category.id 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter; 