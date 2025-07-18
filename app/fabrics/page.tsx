import React, { Suspense } from 'react';

// Import components
import Hero from './components/Hero';
import FilterPanel from './components/FilterPanel';
import QualitySection from './components/QualitySection';
import OrderCTA from './components/OrderCTA';
import { getActiveFabrics } from '../actions/public/fabrics';

export default async function FabricsPage() {
  // Получаем все ткани, начальная загрузка без фильтров
  const fabrics = await getActiveFabrics();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Filter Panel и Fabric Grid с props для server action */}
      <Suspense fallback={<div className="flex justify-center items-center py-12">Загрузка...</div>}>
        <FilterPanel initialFabrics={fabrics} />
      </Suspense>
      
      {/* Quality Section */}
      <QualitySection />
      
      {/* Order CTA */}
      <OrderCTA />
    </main>
  );
} 