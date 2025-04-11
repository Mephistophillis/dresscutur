'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function WorkspaceSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // State for the virtual tour
  const [activeSpot, setActiveSpot] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Workspace spots data
  const workspaceSpots = [
    {
      id: 1,
      title: 'Зона приема и консультаций',
      description: 'Уютное пространство для встречи клиентов, обсуждения проектов и проведения первичных консультаций. Здесь происходит знакомство, выбор моделей и тканей, а также снятие мерок.',
      positionX: '20%',
      positionY: '30%',
      image: '/images/about/workspace-reception.jpg',
    },
    {
      id: 2,
      title: 'Зона раскроя',
      description: 'Просторная зона с большими столами для раскроя материалов. Здесь наши мастера подготавливают ткань и выкройки перед началом пошива.',
      positionX: '45%',
      positionY: '60%',
      image: '/images/about/workspace-cutting.jpg',
    },
    {
      id: 3,
      title: 'Швейная мастерская',
      description: 'Сердце нашего ателье. Здесь установлено современное оборудование, на котором наши мастера создают каждое изделие с непревзойденной точностью.',
      positionX: '70%',
      positionY: '45%',
      image: '/images/about/workspace-sewing.jpg',
    },
    {
      id: 4,
      title: 'Склад тканей',
      description: 'Коллекция эксклюзивных тканей от лучших европейских производителей. Широкий выбор материалов позволяет воплотить в жизнь любые идеи наших клиентов.',
      positionX: '80%',
      positionY: '25%',
      image: '/images/about/workspace-fabrics.jpg',
    },
    {
      id: 5,
      title: 'Примерочные',
      description: 'Комфортные и просторные примерочные с хорошим освещением. Здесь проводятся примерки и финальные корректировки изделий.',
      positionX: '30%',
      positionY: '75%',
      image: '/images/about/workspace-fitting.jpg',
    },
  ];

  // Gallery images
  const galleryImages = [
    { id: 1, src: '/images/about/workspace-gallery-1.jpg', alt: 'Общий вид ателье' },
    { id: 2, src: '/images/about/workspace-gallery-2.jpg', alt: 'Рабочее место портного' },
    { id: 3, src: '/images/about/workspace-gallery-3.jpg', alt: 'Зона консультаций' },
    { id: 4, src: '/images/about/workspace-gallery-4.jpg', alt: 'Коллекция тканей' },
    { id: 5, src: '/images/about/workspace-gallery-5.jpg', alt: 'Примерочная' },
    { id: 6, src: '/images/about/workspace-gallery-6.jpg', alt: 'Детали интерьера' },
  ];

  // Handle closing fullscreen view on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="workspace" className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <h2 className="section-title text-center mx-auto mb-6">Наше рабочее пространство</h2>
            <p className="text-center max-w-3xl mx-auto mb-16 text-lg">
              Современное, хорошо оборудованное пространство, в котором созданы
              идеальные условия для творчества и мастерства
            </p>
          </motion.div>

          {/* Virtual Tour */}
          <motion.div 
            variants={itemVariants}
            className="relative w-full mb-16 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="/images/about/workspace-main.jpg"
                alt="Панорама ателье DressCutur"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              
              {/* Interactive spots */}
              {workspaceSpots.map((spot) => (
                <button
                  key={spot.id}
                  className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary bg-opacity-70 hover:bg-opacity-90 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-2 border-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
                  style={{ left: spot.positionX, top: spot.positionY }}
                  onClick={() => setActiveSpot(spot.id)}
                  aria-label={`Показать ${spot.title}`}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              ))}
              
              {/* Info popup */}
              <AnimatePresence>
                {activeSpot && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:bottom-8 md:w-96 md:-translate-x-1/2 bg-white p-4 md:p-6 rounded-lg shadow-lg z-20"
                  >
                    <button 
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setActiveSpot(null)}
                      aria-label="Закрыть"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative w-full md:w-1/3 aspect-square">
                        <Image
                          src={workspaceSpots.find(spot => spot.id === activeSpot)?.image || ''}
                          alt={workspaceSpots.find(spot => spot.id === activeSpot)?.title || ''}
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {workspaceSpots.find(spot => spot.id === activeSpot)?.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {workspaceSpots.find(spot => spot.id === activeSpot)?.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Gallery */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-serif text-center mb-8">Галерея нашего ателье</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <motion.div
                  key={image.id}
                  className="relative aspect-square cursor-pointer rounded-lg overflow-hidden hover-lift"
                  onClick={() => {
                    setActiveImage(image.id);
                    setIsFullscreen(true);
                  }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={() => setIsFullscreen(false)}
              aria-label="Закрыть просмотр"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div 
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[80vh]">
                <Image
                  src={galleryImages.find(img => img.id === activeImage)?.src || ''}
                  alt={galleryImages.find(img => img.id === activeImage)?.alt || ''}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {galleryImages.map((image) => (
                  <button
                    key={image.id}
                    className={`w-3 h-3 rounded-full ${activeImage === image.id ? 'bg-primary' : 'bg-white bg-opacity-50 hover:bg-opacity-70'}`}
                    onClick={() => setActiveImage(image.id)}
                    aria-label={`Просмотреть ${image.alt}`}
                  />
                ))}
              </div>
              
              <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 w-10 h-10 rounded-full flex items-center justify-center text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(prev => prev === 1 ? galleryImages.length : (prev || 0) - 1);
                }}
                aria-label="Предыдущее изображение"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 w-10 h-10 rounded-full flex items-center justify-center text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(prev => prev === galleryImages.length ? 1 : (prev || 0) + 1);
                }}
                aria-label="Следующее изображение"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 