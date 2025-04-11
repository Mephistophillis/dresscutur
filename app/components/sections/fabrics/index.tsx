import React from 'react';
import { motion } from 'framer-motion';
import FabricCard from './FabricCard';

const fabricsData = [
  {
    id: 1,
    name: 'Шелк',
    description: 'Роскошная и гладкая ткань с характерным блеском, идеально подходит для вечерних платьев и блуз.',
    image: '/images/fabrics/silk.jpg',
    color: '#F3E5D8',
  },
  {
    id: 2,
    name: 'Хлопок',
    description: 'Мягкая и дышащая ткань, отлично подходит для повседневной одежды и летних нарядов.',
    image: '/images/fabrics/cotton.jpg',
    color: '#E5EFF3',
  },
  {
    id: 3,
    name: 'Шерсть',
    description: 'Теплая и прочная ткань, прекрасно сохраняет форму, идеальна для деловых костюмов и пальто.',
    image: '/images/fabrics/wool.jpg',
    color: '#F3E9E5',
  },
  {
    id: 4,
    name: 'Лен',
    description: 'Прочная дышащая ткань с характерной текстурой, отлично подходит для летней одежды.',
    image: '/images/fabrics/linen.jpg',
    color: '#E9F3E5',
  },
  {
    id: 5,
    name: 'Кашемир',
    description: 'Роскошная мягкая ткань, создающая ощущение тепла и комфорта, идеальна для премиум-изделий.',
    image: '/images/fabrics/cashmere.jpg',
    color: '#F3E5EC',
  },
  {
    id: 6,
    name: 'Твид',
    description: 'Фактурная шерстяная ткань с характерным узором, отлично подходит для пиджаков и верхней одежды.',
    image: '/images/fabrics/tweed.jpg',
    color: '#E5F3EC',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Fabrics = () => {
  return (
    <section id="fabrics" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши ткани</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Мы работаем только с высококачественными тканями от проверенных поставщиков. 
            Ниже представлены основные типы тканей, которые мы используем для создания эксклюзивных изделий.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {fabricsData.map((fabric) => (
            <FabricCard key={fabric.id} fabric={fabric} />
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Не нашли нужную ткань? У нас есть доступ к большому ассортименту тканей. 
            Свяжитесь с нами, и мы поможем подобрать идеальный вариант для вашего проекта.
          </p>
          <button className="bg-black text-white py-3 px-8 rounded-md hover:bg-opacity-80 transition-all">
            Связаться с нами
          </button>
        </div>
      </div>
    </section>
  );
};

export default Fabrics; 