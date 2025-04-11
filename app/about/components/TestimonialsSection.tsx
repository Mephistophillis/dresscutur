'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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

export default function TestimonialsSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

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

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Елена Смирнова',
      image: '/images/about/testimonial-1.jpg',
      text: 'Потрясающее ателье! Уже второй раз заказываю у них пошив вечернего платья и всегда в восторге от результата. Внимание к деталям и качество на высшем уровне. С DressCutur я всегда уверена, что буду выглядеть безупречно на любом мероприятии.',
      rating: 5,
      date: '15 марта 2023',
      category: 'individual',
    },
    {
      id: 2,
      name: 'Александр Петров',
      image: '/images/about/testimonial-2.jpg',
      text: 'Отличный сервис и профессиональный подход. Заказывал пошив костюма для свадьбы, и результат превзошел все ожидания. Особенно порадовала точность в снятии мерок и внимание к моим пожеланиям. Теперь я постоянный клиент.',
      rating: 5,
      date: '2 февраля 2023',
      category: 'individual',
    },
    {
      id: 3,
      name: 'Мария Иванова',
      image: '/images/about/testimonial-3.jpg',
      text: 'Обратилась в ателье для ремонта любимого пальто, которое казалось безнадежно испорченным. Мастера DressCutur сотворили настоящее чудо – пальто выглядит как новое! Спасибо за спасение моей любимой вещи.',
      rating: 5,
      date: '10 января 2023',
      category: 'repair',
    },
    {
      id: 4,
      name: 'Ирина Козлова',
      image: '/images/about/testimonial-4.jpg',
      text: 'Заказывала пошив комплекта штор для гостиной. Результат превзошел все ожидания! Идеальное исполнение, точное соответствие интерьеру и потрясающее качество ткани. Спасибо команде DressCutur за профессионализм!',
      rating: 5,
      date: '5 декабря 2022',
      category: 'home',
    },
    {
      id: 5,
      name: 'Дмитрий Соколов',
      image: '/images/about/testimonial-5.jpg',
      text: 'Впервые обратился в ателье для пошива рубашек, и теперь не представляю, как можно носить готовую одежду. Идеальная посадка, качественные ткани и внимание к мелочам делают каждую рубашку особенной. Всем рекомендую!',
      rating: 5,
      date: '20 ноября 2022',
      category: 'individual',
    },
  ];

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

          {/* Testimonials carousel */}
          <motion.div 
            variants={itemVariants}
            className="relative px-4 md:px-12 lg:px-24 mb-8"
          >
            <div className="relative w-full overflow-hidden min-h-[400px] md:min-h-[350px]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={testimonialVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute w-full"
                >
                  <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="w-24 h-24 relative rounded-full overflow-hidden shrink-0 mx-auto md:mx-0">
                        <Image
                          src={filteredTestimonials[currentIndex].image}
                          alt={filteredTestimonials[currentIndex].name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 96px, 96px"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">{filteredTestimonials[currentIndex].name}</h3>
                            <p className="text-gray-500 text-sm">{filteredTestimonials[currentIndex].date}</p>
                          </div>
                          <StarRating rating={filteredTestimonials[currentIndex].rating} />
                        </div>
                        <p className="text-gray-700 italic">"{filteredTestimonials[currentIndex].text}"</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <button
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center text-gray-600 hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={prevTestimonial}
              aria-label="Предыдущий отзыв"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center text-gray-600 hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={nextTestimonial}
              aria-label="Следующий отзыв"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

          {/* Dots navigation */}
          <motion.div variants={itemVariants} className="flex justify-center gap-2">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentIndex === index ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                aria-label={`Перейти к отзыву ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : 'false'}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 