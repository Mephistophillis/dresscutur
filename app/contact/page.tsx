'use client';

import { motion } from 'framer-motion';
import Hero from './components/Hero';
import ContactInfo from './components/ContactInfo';
import Map from './components/Map';
import ContactForm from './components/ContactForm';
import WorkingHours from './components/WorkingHours';
import FAQ from './components/FAQ';
import SocialLinks from './components/SocialLinks';
import AppointmentCTA from './components/AppointmentCTA';

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero секция */}
      <Hero />
      
      {/* Контактная информация */}
      <ContactInfo />
      
      {/* Карта */}
      <Map />
      
      {/* Форма обратной связи */}
      <ContactForm />
      
      {/* Часы работы */}
      <WorkingHours />
      
      {/* Запись на консультацию */}
      <AppointmentCTA />
      
      {/* FAQ секция */}
      <FAQ />
      
      {/* Социальные сети */}
      <SocialLinks />
    </main>
  );
} 