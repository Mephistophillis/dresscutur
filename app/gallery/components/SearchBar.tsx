'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDelayPassed, setIsDelayPassed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Отправляем событие поиска
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    // Создаем и диспатчим кастомное событие
    const event = new CustomEvent('search', { detail: value });
    document.dispatchEvent(event);
  };

  // Обработка ввода с debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // debounce в 300мс

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Для анимации фокуса
  useEffect(() => {
    if (isFocused) {
      const timeout = setTimeout(() => {
        setIsDelayPassed(true);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setIsDelayPassed(false);
    }
  }, [isFocused]);

  const handleReset = () => {
    setSearchTerm('');
    handleSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full md:w-auto">
      <div className={`flex items-center border rounded-full overflow-hidden transition-all duration-300 ${
        isFocused ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-gray-300'
      }`}>
        <div className="pl-4 pr-2 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <input
          type="text"
          className="py-2 px-2 w-full md:w-60 focus:outline-none placeholder-gray-500"
          placeholder="Поиск работ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          ref={inputRef}
        />
        
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              className="px-3 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={handleReset}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Suggestions (could be implemented in future) */}
      <AnimatePresence>
        {isFocused && isDelayPassed && searchTerm.length > 1 && (
          <motion.div
            className="absolute mt-2 w-full bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Placeholder for future search suggestions */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 