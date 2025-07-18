'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FabricCard from './FabricCard';
import { PublicFabric } from '~/app/actions/public/fabrics';

interface FabricsProps {
  fabrics: PublicFabric[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Fabrics = ({ fabrics }: FabricsProps) => {
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <section id="fabrics" className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (fabrics.length === 0) {
    return null;
  }

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
          {fabrics.map((fabric) => (
            <FabricCard key={fabric.id} fabric={fabric} />
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Не нашли нужную ткань? У нас есть доступ к большому ассортименту тканей. 
            Свяжитесь с нами, и мы поможем подобрать идеальный вариант для вашего проекта.
          </p>
          <a href="/contact" className="bg-black text-white py-3 px-8 rounded-md hover:bg-opacity-80 transition-all inline-block">
            Связаться с нами
          </a>
        </div>
      </div>
    </section>
  );
};

export default Fabrics; 