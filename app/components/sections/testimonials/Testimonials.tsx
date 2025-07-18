'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Testimonial as TestimonialType } from '~/app/lib/definitions';

interface TestimonialsProps {
  testimonials: TestimonialType[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [isLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    
    if (isAutoplay && isInView && testimonials.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setActiveIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    
    return () => {
      resetTimeout();
    };
  }, [activeIndex, isAutoplay, isInView, testimonials.length]);

  useEffect(() => {
    const ref = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.disconnect();
      }
    };
  }, []);

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setIsAutoplay(false);
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setIsAutoplay(false);
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    setIsAutoplay(false);
    setActiveIndex(index);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.svg 
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </motion.svg>
      );
    }
    
    return stars;
  };

  const quoteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6
      }
    }
  };

  // Отображение заглушки при загрузке
  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto mb-4"></div>
              <div className="h-1 bg-primary w-20 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-2/3 mx-auto"></div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-light rounded-2xl shadow-lg p-8 md:p-12 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-32 mb-4"></div>
                <div className="flex space-x-1 mb-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-5 h-5 rounded-full bg-gray-200"></div>
                  ))}
                </div>
                <div className="space-y-2 w-full max-w-2xl">
                  <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Проверка на отсутствие отзывов
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Отзывы клиентов</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-dark/80">
            Мнение наших клиентов - лучшее подтверждение качества нашей работы.
            Вот что говорят те, кто уже воспользовался нашими услугами.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative bg-light rounded-2xl shadow-lg p-8 md:p-12">
            {/* Кавычки */}
            <motion.div 
              className="absolute top-6 left-8 text-primary/20"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.811-.55-.128-1.07-.213-1.559-.255-.51-.043-1.02-.043-1.53 0h-.51c-.1 0-.15 0-.15-.102a.76.76 0 0 1 0-.11c.238-.936.734-1.858 1.49-2.77.754-.91 1.69-1.52 2.808-1.828.42-.116.79-.365 1.098-.747.308-.38.462-.839.462-1.37 0-.53-.133-.935-.4-1.215-.267-.28-.699-.42-1.297-.42-.53 0-1.035.175-1.516.525-.482.35-.822.875-1.02 1.575-.198.7-.296 1.5-.296 2.4 0 1.03.148 1.97.444 2.83.296.86.69 1.575 1.186 2.145.495.57.975.855 1.44.855.384 0 .69-.073.92-.22.23-.147.384-.33.46-.548.077-.22.12-.483.13-.793.01-.31-.004-.635-.04-.973h1.997zm10.088 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.695-1.327-.83-.51-.17-1.07-.277-1.67-.322-.59-.046-1.154-.033-1.69.04h-.35c-.1 0-.15 0-.15-.102a.5.5 0 0 1 0-.092c.18-.936.629-1.86 1.35-2.771.72-.912 1.67-1.523 2.85-1.834.47-.116.84-.365 1.1-.746.26-.381.39-.837.39-1.37 0-.53-.12-.937-.375-1.22-.255-.285-.676-.425-1.262-.425-.54 0-1.055.175-1.546.525-.49.35-.84.875-1.05 1.575-.21.7-.315 1.5-.315 2.4 0 1.03.148 1.97.444 2.83.296.86.69 1.575 1.186 2.145.495.57.975.855 1.44.855.396 0 .708-.073.935-.22.227-.147.374-.33.44-.548.066-.22.117-.483.153-.793.035-.31.023-.635-.04-.973h1.997z"></path>
              </svg>
            </motion.div>

            <div className="relative">
              <AnimatePresence mode="wait">
                {testimonials.map((testimonial, index) => (
                  index === activeIndex && (
                    <motion.div
                      key={testimonial.id}
                      variants={quoteVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                    >
                      <div className="flex flex-col items-center">
                        <motion.div 
                          className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {testimonial.avatar ? (
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name} 
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs">Фото</span>
                            </div>
                          )}
                        </motion.div>
                        
                        <div className="text-center">
                          <motion.h3 
                            className="text-xl font-medium text-dark"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                          >
                            {testimonial.name}
                          </motion.h3>
                          {testimonial.position && (
                            <motion.p 
                              className="text-primary text-sm mb-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.4 }}
                            >
                              {testimonial.position}
                            </motion.p>
                          )}
                          
                          <div className="flex justify-center mb-6">
                            {renderStars(testimonial.rating)}
                          </div>
                          
                          <motion.p 
                            className="text-dark/80 text-lg italic max-w-2xl mx-auto mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                          >
                            &quot;{testimonial.text}&quot;
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Элементы управления */}
            <div className="flex justify-between items-center mt-8">
              <button 
                onClick={handlePrev}
                className="p-2 rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition-colors"
                aria-label="Предыдущий отзыв"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Перейти к отзыву ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={handleNext}
                className="p-2 rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition-colors"
                aria-label="Следующий отзыв"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 