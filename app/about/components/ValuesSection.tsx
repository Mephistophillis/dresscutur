'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function ValuesSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [activeTab, setActiveTab] = useState(0);

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

  const values = [
    {
      title: 'Качество без компромиссов',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.7273 14.7273C18.6063 15.0909 18.6063 15.4545 18.7273 15.8182L17.1818 18.5455C16.9394 18.4242 16.5758 18.4242 16.3333 18.5455L14.7879 17C14.4242 17.2424 14.0606 17.3636 13.697 17.3636V19.4545C13.4545 19.5758 13.2121 19.6971 12.9697 19.6971H10.9091C10.7879 19.5758 10.6667 19.4545 10.6667 19.3333V17.2424C10.303 17.1212 9.93939 17 9.57576 16.7576L8.03029 18.303C7.78788 18.4242 7.42424 18.4242 7.18182 18.303L5.63636 16.7576C5.51515 16.5152 5.51515 16.1515 5.63636 15.9091L7.18182 14.3636C6.93939 14 6.81818 13.6364 6.81818 13.2727H4.72727C4.48485 13.1515 4.36364 12.9091 4.36364 12.6667V10.6061C4.48485 10.4848 4.60606 10.3636 4.84847 10.3636H6.93939C7.06061 10 7.18182 9.63636 7.42424 9.27273L5.87879 7.72727C5.75758 7.48484 5.75758 7.12121 5.87879 6.87878L7.54544 5.33333C7.78788 5.21212 8.15151 5.21212 8.39393 5.33333L9.93939 6.87878C10.303 6.63636 10.6667 6.51515 11.0303 6.39393V4.30302C11.1515 4.18181 11.3939 4.06061 11.6364 4.06061H13.697C13.8183 4.18181 13.9394 4.30302 13.9394 4.5454V6.63636C14.303 6.75758 14.6667 6.87878 15.0303 7.12121L16.5758 5.57575C16.8182 5.45454 17.1818 5.45454 17.4242 5.57575L18.9697 7.12121C19.0909 7.36363 19.0909 7.72727 18.9697 7.96969L17.4242 9.51514C17.6667 9.87878 17.7879 10.2424 17.9091 10.6061H20C20.1212 10.7273 20.2424 10.9697 20.2424 11.2121V13.2727C20.1212 13.5152 19.8788 13.6364 19.6364 13.6364H17.5455C17.4242 14 17.3029 14.3636 17.0605 14.7273H18.7273Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Мы используем только высококачественные материалы и применяем проверенные технологии пошива, чтобы каждое изделие служило долго и безупречно выглядело. Мы не экономим на материалах и отказываемся от компромиссов, которые могут снизить качество.',
      example: 'Для каждого изделия мы индивидуально подбираем оптимальную технологию обработки швов и подкладок, чтобы гарантировать долговечность и идеальный внешний вид.',
      image: '/images/about/values-quality.jpg',
    },
    {
      title: 'Индивидуальный подход',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Мы верим, что каждый человек уникален, и создаем одежду, которая подчеркивает индивидуальность. Мы учитываем особенности фигуры, стиля жизни и личные предпочтения при создании каждого изделия.',
      example: 'Перед началом работы мы проводим детальную консультацию, где обсуждаем не только стиль и желаемый результат, но и особенности повседневной жизни клиента, чтобы создать действительно комфортную и функциональную одежду.',
      image: '/images/about/values-individual.jpg',
    },
    {
      title: 'Экологичность',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M18 8H19C20.0609 8 21.0783 8.42143 21.8284 9.17157C22.5786 9.92172 23 10.9391 23 12C23 13.0609 22.5786 14.0783 21.8284 14.8284C21.0783 15.5786 20.0609 16 19 16H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 8H18V17C18 18.0609 17.5786 19.0783 16.8284 19.8284C16.0783 20.5786 15.0609 21 14 21H6C4.93913 21 3.92172 20.5786 3.17157 19.8284C2.42143 19.0783 2 18.0609 2 17V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Мы заботимся о планете и стремимся минимизировать воздействие на окружающую среду. Мы используем экологически чистые материалы, осознанно подходим к использованию ресурсов и стремимся к безотходному производству.',
      example: 'Мы сотрудничаем с поставщиками тканей, которые используют ответственные методы производства, а также внедрили систему переработки обрезков и текстильных отходов для создания новых аксессуаров и деталей.',
      image: '/images/about/values-eco.jpg',
    },
    {
      title: 'Постоянное совершенствование',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M12 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Мы никогда не останавливаемся на достигнутом и постоянно совершенствуем свои навыки, изучаем новые техники и следим за тенденциями в мире моды. Наши специалисты регулярно проходят обучение и стажировки.',
      example: 'Два раза в год наши портные и дизайнеры проходят обучение у признанных мастеров кроя и пошива, а также посещают международные выставки тканей и моды для обмена опытом и вдохновения.',
      image: '/images/about/values-growth.jpg',
    },
  ];

  return (
    <section id="values" className="py-16 md:py-24 bg-light">
      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <h2 className="section-title text-center mx-auto mb-16">Наши ценности</h2>
          </motion.div>

          {/* Values grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className={`bg-white p-6 rounded-lg shadow-md hover-lift cursor-pointer ${activeTab === index ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <div className="mb-5">{value.icon}</div>
                <h3 className="text-xl font-serif font-semibold mb-3">{value.title}</h3>
                <p className="text-dark/80 mb-4 line-clamp-3">{value.description}</p>
                <div className="text-primary text-sm font-medium flex items-center">
                  Подробнее
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected value detailed view */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            layoutId="valueDetails"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <div className="mb-5">{values[activeTab].icon}</div>
                <h3 className="text-2xl font-serif font-semibold mb-5">{values[activeTab].title}</h3>
                <div className="prose prose-sm md:prose max-w-none">
                  <p className="mb-5">
                    {values[activeTab].description}
                  </p>
                  <h4 className="text-lg font-medium">Как мы это применяем:</h4>
                  <p>
                    {values[activeTab].example}
                  </p>
                </div>
              </div>
              <div className="relative h-60 md:h-auto">
                <Image
                  src={values[activeTab].image}
                  alt={values[activeTab].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 