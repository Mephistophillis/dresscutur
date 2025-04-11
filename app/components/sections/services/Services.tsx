'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
};

const servicesData: Service[] = [
  {
    id: 1,
    title: 'Индивидуальный пошив',
    description: 'Создание уникальной одежды по вашим меркам и пожеланиям. Мы работаем с разнообразными тканями и учитываем все особенности вашей фигуры для достижения идеальной посадки.',
    icon: '/images/icons/tailoring.svg',
    image: '/images/services/tailoring.jpg'
  },
  {
    id: 2,
    title: 'Ремонт и реставрация',
    description: 'Профессиональный ремонт любимых вещей: замена молний, подгонка по фигуре, устранение дефектов, реставрация винтажной одежды и многое другое.',
    icon: '/images/icons/repair.svg',
    image: '/images/services/repair.jpg'
  },
  {
    id: 3,
    title: 'Пошив штор и текстиля',
    description: 'Изготовление штор, покрывал, подушек и другого домашнего текстиля по индивидуальным размерам. Поможем подобрать ткани и создать гармоничный интерьер.',
    icon: '/images/icons/curtains.svg',
    image: '/images/services/curtains.jpg'
  },
  {
    id: 4,
    title: 'Свадебная и вечерняя мода',
    description: 'Создание эксклюзивных свадебных и вечерних нарядов с учетом последних тенденций моды и ваших индивидуальных предпочтений.',
    icon: '/images/icons/wedding.svg',
    image: '/images/services/wedding.jpg'
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState<number>(1);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 bg-light" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={ isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Наши услуги</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-dark/80">
            Мы предлагаем широкий спектр услуг по пошиву и ремонту одежды,
            а также изготовлению текстиля для дома. Каждая работа выполняется
            с особым вниманием к деталям и высоким качеством.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Левая колонка с кнопками услуг */}
          <motion.div 
            className="md:col-span-1 order-2 md:order-1"
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            <div className="space-y-3">
              {servicesData.map((service) => (
                <motion.button
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`w-full text-left p-5 rounded-lg transition-all duration-300 flex items-start ${
                    activeService === service.id
                      ? 'bg-white shadow-lg border-l-4 border-primary'
                      : 'bg-white/50 hover:bg-white hover:shadow-md'
                  }`}
                  variants={item}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mr-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        activeService === service.id 
                          ? 'bg-primary text-white' 
                          : 'bg-light text-primary'
                      }`}
                      animate={{
                        scale: [1, 1.1, 1],
                        transition: { duration: 0.3 }
                      }}
                    >
                      {/* Заглушка для иконок услуг */}
                      <span className="text-xl font-bold">{service.id}</span>
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{service.title}</h3>
                    <p className="text-dark/70 text-sm line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Правая колонка с детальной информацией */}
          <div className="md:col-span-2 order-1 md:order-2 mb-8 md:mb-0">
            <AnimatePresence mode="wait">
              {servicesData.map((service) => (
                service.id === activeService && (
                  <motion.div 
                    key={service.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="aspect-video relative bg-gray-200">
                      {/* Заглушка для изображения, в реальном проекте здесь будет Image компонент */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        Фото услуги "{service.title}"
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                      <motion.h3 
                        className="text-2xl font-serif font-bold mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        {service.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-dark/80 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        {service.description}
                      </motion.p>
                      
                      <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        <motion.div 
                          className="bg-light p-4 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          <h4 className="font-medium mb-2">Преимущества</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center">
                              <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                              Профессиональный подход
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                              Качественные материалы
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                              Внимание к деталям
                            </li>
                          </ul>
                        </motion.div>
                        <motion.div 
                          className="bg-light p-4 rounded-lg"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          <h4 className="font-medium mb-2">Сроки</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center">
                              <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                              </svg>
                              Консультация: 30-60 минут
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                              </svg>
                              Срок выполнения: 3-14 дней
                            </li>
                          </ul>
                        </motion.div>
                      </div>
                      
                      <motion.button 
                        className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/services'}
                      >
                        Подробнее об услугах
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
} 