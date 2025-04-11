'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterPanelProps {
  filters: {
    category: string;
    purpose: string;
    color: string;
    search: string;
  };
  onFilterChange: (type: string, value: string) => void;
}

// Filter options
const categoryOptions = [
  { value: 'all', label: 'Все ткани' },
  { value: 'natural', label: 'Натуральные' },
  { value: 'synthetic', label: 'Синтетические' },
  { value: 'mixed', label: 'Смесовые' },
  { value: 'special', label: 'Специальные' },
];

const purposeOptions = [
  { value: 'all', label: 'Любое назначение' },
  { value: 'dress', label: 'Для платьев' },
  { value: 'suit', label: 'Для костюмов' },
  { value: 'outerwear', label: 'Для верхней одежды' },
  { value: 'lining', label: 'Подкладочные' },
];

const colorOptions = [
  { value: 'all', label: 'Все цвета' },
  { value: 'white', label: 'Белый' },
  { value: 'black', label: 'Черный' },
  { value: 'red', label: 'Красный' },
  { value: 'blue', label: 'Синий' },
  { value: 'green', label: 'Зеленый' },
  { value: 'beige', label: 'Бежевый' },
];

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('search', e.target.value);
  };

  const FilterButton = ({ type, value, label }: { type: string; value: string; label: string }) => (
    <button
      className={`px-4 py-2 text-sm md:text-base rounded-full transition-all ${
        filters[type as keyof typeof filters] === value
          ? 'bg-primary text-white'
          : 'bg-secondary text-dark hover:bg-opacity-80'
      }`}
      onClick={() => onFilterChange(type, value)}
    >
      {label}
    </button>
  );

  return (
    <section className="bg-light py-8 sticky top-[80px] z-20 shadow-md">
      <div className="container mx-auto px-4">
        {/* Mobile filter toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <span className="font-medium text-dark">Фильтры</span>
          <button
            className="bg-secondary text-dark px-4 py-2 rounded-full"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            {isMobileFilterOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
          </button>
        </div>

        {/* Mobile filters */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="space-y-4 pb-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Категория</h3>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((option) => (
                      <FilterButton
                        key={option.value}
                        type="category"
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Назначение</h3>
                  <div className="flex flex-wrap gap-2">
                    {purposeOptions.map((option) => (
                      <FilterButton
                        key={option.value}
                        type="purpose"
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Цвет</h3>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((option) => (
                      <FilterButton
                        key={option.value}
                        type="color"
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop filters */}
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Поиск тканей..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex gap-4 overflow-x-auto py-2">
              <div>
                <select
                  className="px-4 py-2 rounded-full bg-secondary text-dark border-none focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters.category}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  className="px-4 py-2 rounded-full bg-secondary text-dark border-none focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters.purpose}
                  onChange={(e) => onFilterChange('purpose', e.target.value)}
                >
                  {purposeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  className="px-4 py-2 rounded-full bg-secondary text-dark border-none focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters.color}
                  onChange={(e) => onFilterChange('color', e.target.value)}
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterPanel; 