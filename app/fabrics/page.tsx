'use client';

import { NextPage } from 'next';
import { useState } from 'react';

// Import components
import Hero from './components/Hero';
import FabricGrid from './components/FabricGrid';
import FilterPanel from './components/FilterPanel';
import QualitySection from './components/QualitySection';
import OrderCTA from './components/OrderCTA';

const FabricsPage: NextPage = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    purpose: 'all',
    color: 'all',
    search: '',
  });

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Filter Panel */}
      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
      
      {/* Fabric Grid */}
      <FabricGrid filters={filters} />
      
      {/* Quality Section */}
      <QualitySection />
      
      {/* Order CTA */}
      <OrderCTA />
    </main>
  );
};

export default FabricsPage; 