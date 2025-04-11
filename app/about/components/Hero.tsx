'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Hero() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const heroVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Backdrop Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/about/hero-bg.jpg" 
          alt="Ателье DressCutur" 
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark bg-opacity-60"></div>
      </div>

      {/* Content */}
      <motion.div
        ref={ref}
        className="container relative z-10 py-16 md:py-24"
        variants={heroVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white text-center mb-6"
          variants={itemVariants}
        >
          О нас
        </motion.h1>
        
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          variants={itemVariants}
        >
          <p className="text-xl md:text-2xl text-white font-light mb-8">
            Создаем индивидуальные шедевры с 2006 года и превращаем ваши идеи в элегантные наряды
          </p>
        </motion.div>

        <motion.div 
          className="flex justify-center"
          variants={itemVariants}
        >
          <button 
            onClick={() => {
              const storySection = document.getElementById('story');
              if (storySection) {
                storySection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-primary flex items-center gap-2"
            aria-label="Узнать нашу историю"
          >
            Узнать больше
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4.16669V15.8334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.8332 10L9.99984 15.8333L4.1665 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
} 