'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

export default function Hero() {
  const [heroRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    },
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-secondary"
    >
      {/* Background gradient with texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary z-0"></div>
      <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-10 mix-blend-overlay z-0"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block mb-3 text-primary font-medium">
              DressCutur
            </span>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-dark mb-6"
            variants={itemVariants}
          >
            Свяжитесь с нами
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-dark/80 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Мы ценим каждого клиента и готовы ответить на любые вопросы, помочь с выбором ткани или записать вас на консультацию
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link 
              href="#appointment" 
              className="btn-primary mr-4"
            >
              Записаться на консультацию
            </Link>
            <Link 
              href="#contact-form" 
              className="btn-outline"
            >
              Задать вопрос
            </Link>
          </motion.div>
          <motion.div 
            className="mt-12 animate-bounce"
            variants={itemVariants}
          >
            <Link 
              href="#contact-info" 
              aria-label="Прокрутить вниз"
              className="inline-block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 