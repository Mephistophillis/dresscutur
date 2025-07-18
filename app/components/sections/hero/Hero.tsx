'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="py-20 sm:py-24 md:py-28 bg-gradient-to-b from-secondary to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-dark mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Ателье индивидуального <motion.span 
                className="text-primary relative inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                пошива
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                />
              </motion.span> и ремонта одежды
            </motion.h1>
            <motion.p 
              className="text-lg text-dark/80 mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Профессиональное создание одежды с учетом ваших индивидуальных особенностей и предпочтений
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.a 
                href="#services" 
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Наши услуги
              </motion.a>
              <motion.a 
                href="#contact" 
                className="btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Связаться с нами
              </motion.a>
            </motion.div>
          </motion.div>
          <motion.div 
            className="relative w-[100%] lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="relative">
              <motion.div 
                className="absolute -top-6 -left-6 w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent/20 z-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              />
              <motion.div 
                className="absolute -bottom-8 -right-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 z-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              />
              <div className="relative z-10 bg-white rounded-lg shadow-xl overflow-hidden aspect-[4/3] w-full max-w-xl">
                <img 
                  src="/images/hero/atelier-main.jpg" 
                  alt="Ателье DressCutur - рабочее пространство"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 