'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getActiveTestimonials } from '~/app/actions/public/testimonials';
import { Testimonial } from '~/app/lib/definitions';

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? 'currentColor' : 'none'}
          className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};

function TestimonialsSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before showing dynamic content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch testimonials from database
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getActiveTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchTestimonials();
    }
  }, [mounted]);

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

  const testimonialVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'Все отзывы' },
    { value: 'individual', label: 'Индивидуальный пошив' },
    { value: 'repair', label: 'Ремонт и реставрация' },
    { value: 'home', label: 'Домашний текстиль' },
  ];

  // Filter testimonials based on active filter
  const filteredTestimonials = activeFilter === 'all' 
    ? testimonials 
    : testimonials.filter(testimonial => testimonial.category === activeFilter);

  // Navigation functions
  const [direction, setDirection] = useState(0);
  
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  // Reset current index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  // Format date for display (static for SSR)
  const formatDate = (dateString: string | null | undefined, createdAt: Date) => {
    if (!mounted) return ''; // Return empty string during SSR
    
    if (dateString) return dateString;
    return new Date(createdAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Show basic layout during SSR and initial load
  if (!mounted || loading) {
    return (
      <section id="testimonials" className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="section-title mx-auto mb-6">Отзывы наших клиентов</h2>
              <p className="text-center max-w-3xl mx-auto mb-16 text-lg">
                Мнения тех, кто уже оценил качество наших услуг и профессионализм мастеров
              </p>
              {mounted && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="section-title mx-auto mb-6">Отзывы наших клиентов</h2>
              <p className="text-center max-w-3xl mx-auto mb-16 text-lg">
                Мнения тех, кто уже оценил качество наших услуг и профессионализм мастеров
              </p>
              <p className="text-gray-600">Отзывы скоро появятся</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <h2 className="section-title text-center mx-auto mb-6">Отзывы наших клиентов</h2>
            <p className="text-center max-w-3xl mx-auto mb-16 text-lg">
              Мнения тех, кто уже оценил качество наших услуг и профессионализм мастеров
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            {filterOptions.map(option => (
              <button
                key={option.value}
                className={`px-5 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === option.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-dark hover:bg-gray-100'
                }`}
                onClick={() => setActiveFilter(option.value)}
                aria-pressed={activeFilter === option.value}
              >
                {option.label}
              </button>
            ))}
          </motion.div>

          {/* Testimonials */}
          <motion.div variants={itemVariants} className="relative">
            <div className="flex justify-center">
              <div className="relative w-full max-w-4xl overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  {filteredTestimonials.length > 0 && (
                    <motion.div
                      key={currentIndex}
                      custom={direction}
                      variants={testimonialVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      className="w-full"
                    >
                      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-full overflow-hidden mb-6 bg-gray-200">
                            {filteredTestimonials[currentIndex].avatar ? (
                              <Image
                                src={filteredTestimonials[currentIndex].avatar!}
                                alt={filteredTestimonials[currentIndex].name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                <span className="text-2xl font-semibold text-primary">
                                  {filteredTestimonials[currentIndex].name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <StarRating rating={filteredTestimonials[currentIndex].rating} />
                          
                          <blockquote className="text-lg md:text-xl text-gray-700 mt-6 mb-6 leading-relaxed">
                            &ldquo;{filteredTestimonials[currentIndex].text}&rdquo;
                          </blockquote>
                          
                          <div className="text-center">
                            <p className="font-semibold text-dark text-lg mb-1">
                              {filteredTestimonials[currentIndex].name}
                            </p>
                            {filteredTestimonials[currentIndex].position && (
                              <p className="text-gray-600 mb-2">
                                {filteredTestimonials[currentIndex].position}
                              </p>
                            )}
                            <p className="text-gray-500 text-sm">
                              {formatDate(filteredTestimonials[currentIndex].date, filteredTestimonials[currentIndex].createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation */}
            {filteredTestimonials.length > 1 && (
              <div className="flex justify-center items-center mt-8 gap-6">
                <button
                  onClick={prevTestimonial}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group"
                  aria-label="Previous testimonial"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors duration-200"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                <div className="flex items-center gap-2">
                  {filteredTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group"
                  aria-label="Next testimonial"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors duration-200"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection; 