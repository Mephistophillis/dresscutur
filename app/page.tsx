'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/sections/hero/Hero';
import Services from './components/sections/services/Services';
import Testimonials from './components/sections/testimonials/Testimonials';
import Fabrics from './components/sections/fabrics';
import Gallery from './components/sections/gallery';
import Contact from './components/sections/contact';

export default function Home() {
  return (
    <>
      {/* Hero секция */}
      <Hero />
      
      {/* Секция услуг */}
      <Services />
      
      {/* Секция тканей */}
      <Fabrics />
      
      {/* Секция галереи */}
      <Gallery />
      
      {/* Секция отзывов */}
      <Testimonials />
      
      {/* Секция контактов */}
      <Contact />
    </>
  );
}
