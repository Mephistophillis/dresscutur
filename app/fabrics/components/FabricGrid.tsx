'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FabricCard from './FabricCard';
import { Fabric } from '../../lib/types';
import { fabricsData } from './data/fabricsData';

interface FabricGridProps {
  filters: {
    category: string;
    purpose: string;
    color: string;
    search: string;
  };
}

const FabricGrid: React.FC<FabricGridProps> = ({ filters }) => {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [filteredFabrics, setFilteredFabrics] = useState<Fabric[]>(fabricsData);
  
  useEffect(() => {
    // Filter fabrics based on selected filters
    const filtered = fabricsData.filter((fabric) => {
      // Category filter
      if (filters.category !== 'all' && fabric.category !== filters.category) {
        return false;
      }
      
      // Purpose filter
      if (filters.purpose !== 'all' && fabric.purpose && !fabric.purpose.includes(filters.purpose)) {
        return false;
      }
      
      // Color filter
      if (filters.color !== 'all' && fabric.colors && !fabric.colors.includes(filters.color)) {
        return false;
      }
      
      // Search filter
      if (filters.search && !fabric.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !fabric.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    setFilteredFabrics(filtered);
  }, [filters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-16 bg-light" id="fabric-grid">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-serif font-semibold text-dark">Коллекция тканей</h2>
            <p className="text-gray-600 mt-2">Найдено {filteredFabrics.length} тканей</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <button
                className={`p-2 rounded ${displayMode === 'grid' ? 'bg-secondary' : 'bg-white border border-gray-300'}`}
                onClick={() => setDisplayMode('grid')}
                title="Отображение сеткой"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
              <button
                className={`p-2 rounded ${displayMode === 'list' ? 'bg-secondary' : 'bg-white border border-gray-300'}`}
                onClick={() => setDisplayMode('list')}
                title="Отображение списком"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {filteredFabrics.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600 mb-4">Ткани не найдены</h3>
            <p className="text-gray-500 mb-6">Попробуйте изменить параметры фильтрации</p>
            <button
              className="btn-outline"
              onClick={() => window.location.reload()}
            >
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          <motion.div 
            className={`${
              displayMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredFabrics.map((fabric) => (
                <motion.div
                  key={fabric.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <FabricCard fabric={fabric} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FabricGrid; 