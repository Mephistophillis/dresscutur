'use client';

import Hero from './components/Hero';
import GalleryGrid from './components/GalleryGrid';
import { useState } from 'react';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import GalleryModal from './components/GalleryModal';
import { GalleryItemType } from './components/GalleryItem';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItemType | null>(null);

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

  return (
    <main className="min-h-screen">
      <Hero />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onCategoryChange={handleCategoryChange} 
            />
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <GalleryGrid 
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onItemClick={handleItemClick}
          />
        </div>
      </section>

      <GalleryModal 
        isOpen={modalOpen}
        item={selectedItem}
        onClose={closeModal}
      />
    </main>
  );
}