'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function AchievementsSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Counter animation refs
  const yearsCounterRef = useRef<HTMLSpanElement>(null);
  const clientsCounterRef = useRef<HTMLSpanElement>(null);
  const ordersCounterRef = useRef<HTMLSpanElement>(null);
  
  // Track if counters have been animated
  const [countersAnimated, setCountersAnimated] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Animate counters if they haven't been animated yet
      if (!countersAnimated) {
        animateCounter(yearsCounterRef.current, 0, 18, 2000); // 18 years
        animateCounter(clientsCounterRef.current, 0, 5000, 2500); // 5000 clients
        animateCounter(ordersCounterRef.current, 0, 15000, 3000); // 15000 orders
        setCountersAnimated(true);
      }
    }
  }, [controls, inView, countersAnimated]);

  // Function to animate counters
  const animateCounter = (
    element: HTMLSpanElement | null, 
    start: number, 
    end: number, 
    duration: number
  ) => {
    if (!element) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      
      // Format with commas for thousands
      element.textContent = currentCount.toLocaleString();
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  };

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

  // Achievement data
  const statistics = [
    {
      value: 18,
      label: 'Лет опыта',
      ref: yearsCounterRef,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.05 11.5C3.05 16.7467 7.30333 21 12.55 21C17.7967 21 22.05 16.7467 22.05 11.5C22.05 6.25333 17.7967 2 12.55 2C7.30333 2 3.05 6.25333 3.05 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      value: 5000,
      label: 'Постоянных клиентов',
      ref: clientsCounterRef,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      value: 15000,
      label: 'Выполненных заказов',
      ref: ordersCounterRef,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  const awards = [
    {
      year: 2019,
      title: 'Лучшее ателье года',
      organization: 'Ассоциация модной индустрии России',
      description: 'Награда за высокое качество индивидуального пошива и вклад в развитие отрасли.',
      image: '/images/about/award-1.jpg',
    },
    {
      year: 2021,
      title: 'Знак качества',
      organization: 'Московская торгово-промышленная палата',
      description: 'Признание выдающегося качества услуг и соответствия высоким стандартам отрасли.',
      image: '/images/about/award-2.jpg',
    },
  ];

  const pressFeatures = [
    {
      title: 'Секреты идеального пошива от DressCutur',
      publication: 'Vogue Россия',
      date: 'Март 2022',
      link: '#',
      logo: '/images/about/press-1.jpg',
    },
    {
      title: 'Ателье с характером: интервью с основателем DressCutur',
      publication: 'Elle Россия',
      date: 'Ноябрь 2021',
      link: '#',
      logo: '/images/about/press-2.jpg',
    },
    {
      title: 'Как создаются уникальные вещи: репортаж из мастерской DressCutur',
      publication: 'РБК Стиль',
      date: 'Август 2020',
      link: '#',
      logo: '/images/about/press-3.jpg',
    },
  ];

  return (
    <section id="achievements" className="py-16 md:py-24 bg-light">
      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <h2 className="section-title text-center mx-auto mb-16">Наши достижения</h2>
          </motion.div>

          {/* Statistics */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            {statistics.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-lg shadow-md text-center hover-lift flex flex-col items-center"
              >
                <div className="mb-4">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-baseline">
                  <span ref={stat.ref}>0</span>
                  {stat.value >= 1000 && <span className="text-2xl ml-1">+</span>}
                </div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Awards */}
          <motion.div variants={itemVariants} className="mb-20">
            <h3 className="text-2xl font-serif text-center mb-10">Награды и признание</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {awards.map((award, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover-lift flex flex-col md:flex-row"
                >
                  <div className="relative w-full md:w-1/3 h-60 md:h-auto">
                    <Image
                      src={award.image}
                      alt={award.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="text-primary font-bold mb-1">{award.year}</div>
                    <h4 className="text-xl font-semibold mb-2">{award.title}</h4>
                    <div className="text-sm text-gray-500 mb-3">{award.organization}</div>
                    <p className="text-gray-600">{award.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Press */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-serif text-center mb-10">Публикации в прессе</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {pressFeatures.map((item, index) => (
                <a 
                  key={index} 
                  href={item.link}
                  className="bg-white p-6 rounded-lg shadow-md hover-lift group transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative w-full h-32 mb-4 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={item.logo}
                      alt={item.publication}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{item.title}</h4>
                  <div className="text-sm text-gray-500">{item.publication}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.date}</div>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 