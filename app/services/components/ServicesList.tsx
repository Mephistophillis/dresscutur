'use client';

import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard';

// Данные о сервисах
const services = [
  {
    id: 1,
    title: 'Индивидуальный пошив женской одежды',
    description: 'Создание уникальных моделей платьев, костюмов, блузок и юбок с учетом всех особенностей фигуры и ваших пожеланий.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    href: '/services/womens-clothing',
    imageSrc: '/images/services/womens-clothing.jpg'
  },
  {
    id: 2,
    title: 'Индивидуальный пошив мужской одежды',
    description: 'Пошив мужских костюмов, рубашек и брюк по индивидуальным меркам с высочайшим качеством исполнения.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    href: '/services/mens-clothing',
    imageSrc: '/images/services/mens-clothing.jpg'
  },
  {
    id: 3,
    title: 'Пошив вечерних нарядов',
    description: 'Создание эксклюзивных вечерних и коктейльных платьев для особых случаев, которые подчеркнут вашу индивидуальность.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    href: '/services/evening-dresses',
    imageSrc: '/images/services/evening-dresses.jpg'
  },
  {
    id: 4,
    title: 'Свадебные платья',
    description: 'Пошив свадебных платьев любой сложности, от классических до авангардных моделей, которые сделают ваш день особенным.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    href: '/services/wedding-dresses',
    imageSrc: '/images/services/wedding-dresses.jpg'
  },
  {
    id: 5,
    title: 'Пошив верхней одежды',
    description: 'Изготовление пальто, курток и плащей из высококачественных материалов с безупречной посадкой по фигуре.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    href: '/services/outerwear',
    imageSrc: '/images/services/outerwear.jpg'
  },
  {
    id: 6,
    title: 'Ремонт и реставрация',
    description: 'Профессиональный ремонт и реставрация любимых вещей, от простой подгонки по фигуре до сложных работ с винтажными изделиями.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
    href: '/services/repairs',
    imageSrc: '/images/services/repairs.jpg'
  },
];

export default function ServicesList() {
  return (
    <section className="py-16 bg-gray-50" id="services-list">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-serif font-semibold mb-4">Наши услуги</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            В нашем ателье мы предлагаем широкий спектр услуг по индивидуальному пошиву и ремонту одежды.
            Каждое изделие создается с особым вниманием к деталям и качеству исполнения.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              href={service.href}
              imageSrc={service.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 