'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Sample images for hero slider
const heroImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000',
    alt: 'Свадебное платье',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1593032465175-481ac7f401f0?q=80&w=1000',
    alt: 'Мужской костюм',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1566174053879-31528523f8c6?q=80&w=1000',
    alt: 'Вечернее платье',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000',
    alt: 'Женское пальто',
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[80vh] overflow-hidden bg-dark">
      {/* Background slider */}
      {heroImages.map((image, index) => (
        <motion.div
          key={image.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentSlide === index ? 0.8 : 0,
            scale: currentSlide === index ? 1 : 1.1,
          }}
          transition={{ 
            opacity: { duration: 1.5 },
            scale: { duration: 8 }
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-dark bg-opacity-40" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Наши работы
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Каждое изделие — воплощение вашей индивидуальности и нашего мастерства.
          Взгляните на коллекцию наших эксклюзивных работ
        </motion.p>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.8 },
            y: { repeat: Infinity, duration: 1.5, repeatType: "reverse" }
          }}
          onClick={() => {
            window.scrollTo({ 
              top: window.innerHeight, 
              behavior: "smooth" 
            });
          }}
        >
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 5V19M12 19L5 12M12 19L19 12" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 