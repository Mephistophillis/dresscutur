'use client';

import Hero from './components/Hero';
import ContactInfo from './components/ContactInfo';
import Map from './components/Map';
import WorkingHours from './components/WorkingHours';
import FAQ from './components/FAQ';
import SocialLinks from './components/SocialLinks';

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero секция */}
      <Hero />
      
      {/* Контактная информация */}
      <ContactInfo />
      
      {/* Карта */}
      <Map />
      
      {/* Часы работы */}
      <WorkingHours />
      
      {/* FAQ секция */}
      <FAQ />
      
      {/* Социальные сети */}
      <SocialLinks />
    </main>
  );
} 