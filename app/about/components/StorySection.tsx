'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function StorySection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
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
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const timelineEvents = [
    {
      year: '2006',
      title: 'Основание ателье',
      description: 'Открытие небольшой мастерской в Москве с командой из трех талантливых портных.'
    },
    {
      year: '2010',
      title: 'Расширение услуг',
      description: 'Добавление новых услуг по индивидуальному дизайну и начало работы с эксклюзивными тканями из Европы.'
    },
    {
      year: '2015',
      title: 'Новое пространство',
      description: 'Переезд в современное просторное помещение с отдельной зоной для консультаций и примерок.'
    },
    {
      year: '2019',
      title: 'Признание в индустрии',
      description: 'Получение профессиональной награды за качество и инновационный подход к пошиву одежды.'
    },
    {
      year: '2023',
      title: 'Современность',
      description: 'Внедрение новых технологий и продолжение традиций качественного индивидуального пошива.'
    },
  ];

  return (
    <section id="story" className="py-16 md:py-24 bg-light">
      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <h2 className="section-title text-center mx-auto mb-16">Наша история</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16">
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg md:text-xl mb-6">
                  Ателье DressCutur начало свою историю в 2006 году как небольшая мастерская, созданная группой единомышленников, объединенных страстью к качественному пошиву и индивидуальному подходу.
                </p>
                <p className="mb-6">
                  С самого начала мы стремились не просто шить одежду, а создавать настоящие произведения портновского искусства. Наша философия — идеальная посадка, исключительное качество материалов и внимание к каждой детали.
                </p>
                <p>
                  За годы работы мы развивались, совершенствовали мастерство и технологии, но неизменным оставалось одно — наше стремление к совершенству и индивидуальный подход к каждому клиенту.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 md:order-2 relative">
              <div className="relative h-[400px] md:h-full rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/about/workshop-vintage.jpg"
                  alt="Ателье DressCutur в начале пути"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto pt-16">
            <h3 className="text-2xl md:text-3xl font-serif text-center mb-12">Ключевые моменты нашего пути</h3>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-px bg-primary"></div>
              
              {/* Timeline items */}
              <div className="space-y-12 md:space-y-24 relative">
                {timelineEvents.map((event, index) => (
                  <div key={event.year} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-start`}>
                    <div className="flex-1 md:w-1/2 mb-4 md:mb-0">
                      <div className={`relative md:px-8 ${index % 2 === 0 ? 'md:pl-16 md:pr-0' : 'md:pr-16 md:pl-0'}`}>
                        <div className="bg-white p-6 rounded-lg shadow-md hover-lift">
                          <div className="text-primary font-serif text-2xl mb-2">{event.year}</div>
                          <h4 className="text-xl font-semibold mb-3">{event.title}</h4>
                          <p>{event.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-1 left-0 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white shadow-md"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div variants={itemVariants} className="mt-24 text-center max-w-4xl mx-auto px-4">
            <blockquote className="text-xl md:text-2xl font-serif text-dark italic mb-4">
              "Наша миссия — не просто шить одежду, а помогать людям выражать свою индивидуальность через безупречный стиль, созданный специально для них."
            </blockquote>
            <cite className="text-base md:text-lg text-gray-600 not-italic">— Основатель ателье DressCutur</cite>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 