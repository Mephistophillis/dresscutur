'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient instead of image */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary to-dark">
        <div className="absolute inset-0 bg-[url('/images/fabrics/pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-white"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Наши ткани</h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            Мы тщательно отбираем лучшие ткани со всего мира, 
            чтобы создавать для вас идеальные изделия. Каждая ткань проходит 
            строгий контроль качества и соответствует высоким стандартам.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-8 py-4"
            onClick={() => {
              document.getElementById('fabric-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Смотреть коллекцию
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 