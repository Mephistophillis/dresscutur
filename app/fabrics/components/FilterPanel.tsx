'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FabricGrid from './FabricGrid';
import { PublicFabric, getFilteredFabrics, FabricFilters, getActiveFabrics } from '~/app/actions/public/fabrics';
import { useSearchParams } from 'next/navigation';

interface FilterPanelProps {
  initialFabrics: PublicFabric[];
}

// Filter options
const categoryOptions = [
  { value: 'all', label: 'Все ткани' },
  { value: 'natural', label: 'Натуральные' },
  { value: 'synthetic', label: 'Синтетические' },
  { value: 'mixed', label: 'Смесовые' },
  { value: 'lining', label: 'Подкладочные' },
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

// Создаем расширенный интерфейс для локальных фильтров
interface ExtendedFilters extends FabricFilters {
  category?: string;
  purpose?: string;
  color?: string;
  search?: string;
}

// Начальные значения фильтров
const initialFiltersState: ExtendedFilters = {
  categories: [],
  colors: [],
  properties: [],
  search: '',
  category: 'all',
  purpose: 'all',
  color: 'all',
};

const FilterPanel: React.FC<FilterPanelProps> = ({ initialFabrics }) => {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ExtendedFilters>({
    categories: [],
    colors: [],
    properties: [],
    search: searchParams.get('search') || '',
    // Локальные фильтры для UI
    category: searchParams.get('category') || 'all',
    purpose: searchParams.get('purpose') || 'all',
    color: searchParams.get('color') || 'all',
  });

  const [fabrics, setFabrics] = useState<PublicFabric[]>(initialFabrics);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Обновление URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') {
      params.set('category', filters.category);
    }
    if (filters.purpose && filters.purpose !== 'all') {
      params.set('purpose', filters.purpose);
    }
    if (filters.color && filters.color !== 'all') {
      params.set('color', filters.color);
    }
    if (filters.search && filters.search.trim() !== '') {
      params.set('search', filters.search);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  }, [filters]);

  // Преобразуем UI-фильтры в формат для API
  const prepareApiFilters = (currentFilters: ExtendedFilters): FabricFilters => {
    const apiFilters: FabricFilters = {
      search: currentFilters.search,
    };

    // Добавляем категорию, если выбрана
    if (currentFilters.category && currentFilters.category !== 'all') {
      apiFilters.categories = [currentFilters.category];
    }

    // Добавляем свойство, если выбрано назначение
    if (currentFilters.purpose && currentFilters.purpose !== 'all') {
      apiFilters.properties = [currentFilters.purpose];
    }

    // Добавляем цвет, если выбран
    if (currentFilters.color && currentFilters.color !== 'all') {
      apiFilters.colors = [currentFilters.color];
    }

    return apiFilters;
  };

  // Сброс всех фильтров и запрос всех тканей
  const handleResetFilters = async () => {
    setIsLoading(true);
    try {
      // Сбрасываем фильтры к начальным значениям
      setFilters(initialFiltersState);
      // Запрашиваем все активные ткани
      const allFabrics = await getActiveFabrics();
      setFabrics(allFabrics);
      // Обновляем URL
      window.history.pushState({}, '', window.location.pathname);
    } catch (error) {
      console.error('Error resetting filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка тканей при изменении фильтров с использованием серверного экшена
  useEffect(() => {
    const loadFilteredFabrics = async () => {
      setIsLoading(true);
      try {
        // Преобразуем фильтры перед отправкой на сервер
        const apiFilters = prepareApiFilters(filters);
        const filtered = await getFilteredFabrics(apiFilters);
        setFabrics(filtered);
      } catch (error) {
        console.error('Error filtering fabrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Не делаем запрос при первой загрузке, используем initialFabrics
    if (
      filters.category !== 'all' ||
      filters.purpose !== 'all' ||
      filters.color !== 'all' ||
      filters.search !== ''
    ) {
      loadFilteredFabrics();
    }
  }, [filters]);

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('search', e.target.value);
  };

  const FilterButton = ({ type, value, label }: { type: string; value: string; label: string }) => (
    <button
      className={`px-4 py-2 text-sm md:text-base rounded-full transition-all ${
        filters[type as keyof typeof filters] === value
          ? 'bg-primary text-white'
          : 'bg-secondary text-dark hover:bg-opacity-80'
      }`}
      onClick={() => handleFilterChange(type, value)}
    >
      {label}
    </button>
  );

  return (
    <>
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
                  
                  <div className="mt-6">
                    <button
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-full transition-colors"
                      onClick={handleResetFilters}
                    >
                      Сбросить все фильтры
                    </button>
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
                <div className="relative">
                  <select
                    className="appearance-none px-4 py-2 pr-8 rounded-full bg-secondary text-dark border-none focus:outline-none focus:ring-2 focus:ring-primary"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    className="appearance-none px-4 py-2 pr-8 rounded-full bg-secondary text-dark border-none focus:outline-none focus:ring-2 focus:ring-primary"
                    value={filters.purpose}
                    onChange={(e) => handleFilterChange('purpose', e.target.value)}
                  >
                    {purposeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    className="appearance-none px-4 py-2 pr-8 rounded-full bg-secondary text-dark border-none focus:outline-none focus:ring-2 focus:ring-primary"
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                
                <button
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
                  onClick={handleResetFilters}
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Отображаем FabricGrid здесь вместо отдельного компонента на уровне страницы */}
      <FabricGrid 
        fabrics={fabrics} 
        isLoading={isLoading} 
        onResetFilters={handleResetFilters} 
      />
    </>
  );
};

export default FilterPanel; 