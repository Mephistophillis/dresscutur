'use client';

import React from 'react';
import { motion } from 'framer-motion';

const QualitySection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    }
  };

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h2 className="text-4xl font-serif font-semibold text-dark mb-6">Качество нашего выбора</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Мы сотрудничаем только с проверенными поставщиками и фабриками, 
            которые разделяют наше внимание к деталям и стремление к совершенству. 
            Каждая ткань проходит тщательный отбор и контроль качества.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sourcing Card */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { 
                  duration: 0.6,
                  delay: 0.1,
                  ease: "easeOut"
                } 
              }
            }}
          >
            <div className="relative h-48 bg-gradient-to-r from-secondary to-light overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-dark mb-3">Лучшие источники</h3>
              <p className="text-gray-700">
                Наши ткани поступают из Италии, Франции, Японии, Индии и других стран с богатыми 
                текстильными традициями. Мы выбираем только те фабрики, которые имеют 
                безупречную репутацию и долгую историю.
              </p>
            </div>
          </motion.div>

          {/* Quality Control Card */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { 
                  duration: 0.6,
                  delay: 0.2,
                  ease: "easeOut"
                } 
              }
            }}
          >
            <div className="relative h-48 bg-gradient-to-r from-light to-secondary overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-dark mb-3">Строгий контроль качества</h3>
              <p className="text-gray-700">
                Каждая партия тканей проходит многоступенчатый контроль: проверка состава, 
                плотности, окраски, стойкости к истиранию и другим воздействиям. 
                Мы отбираем только ткани, соответствующие нашим высоким стандартам.
              </p>
            </div>
          </motion.div>

          {/* Certification Card */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { 
                  duration: 0.6,
                  delay: 0.3,
                  ease: "easeOut"
                } 
              }
            }}
          >
            <div className="relative h-48 bg-gradient-to-r from-secondary to-light overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-dark mb-3">Сертификация и экология</h3>
              <p className="text-gray-700">
                Мы отдаем предпочтение экологически чистым материалам и поставщикам, имеющим 
                сертификаты OEKO-TEX®, GOTS и другие знаки качества. Таким образом, 
                мы заботимся как о вашем комфорте, так и об окружающей среде.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          className="mt-16 bg-white rounded-xl shadow-md overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-dark mb-6 text-center">География наших тканей</h3>
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-[#E8F4F8]">
              {/* World map background with CSS */}
              <div className="absolute inset-0 bg-[#D4EAF3] overflow-hidden">
                {/* Europe shape */}
                <div className="absolute top-[22%] left-[45%] w-[10%] h-[8%] bg-[#BFE1EE] rounded-lg"></div>
                {/* Asia shape */}
                <div className="absolute top-[20%] left-[60%] w-[20%] h-[15%] bg-[#BFE1EE] rounded-lg"></div>
                {/* Africa shape */}
                <div className="absolute top-[35%] left-[45%] w-[12%] h-[16%] bg-[#BFE1EE] rounded-lg"></div>
                {/* North America shape */}
                <div className="absolute top-[20%] left-[15%] w-[15%] h-[12%] bg-[#BFE1EE] rounded-lg"></div>
                {/* South America shape */}
                <div className="absolute top-[40%] left-[25%] w-[8%] h-[14%] bg-[#BFE1EE] rounded-lg"></div>
                {/* Australia shape */}
                <div className="absolute top-[55%] left-[75%] w-[8%] h-[6%] bg-[#BFE1EE] rounded-lg"></div>
              </div>
              
              {/* Map Points */}
              <div className="absolute top-[30%] left-[48%] w-4 h-4 bg-primary rounded-full animate-pulse" title="Италия"></div>
              <div className="absolute top-[28%] left-[44%] w-4 h-4 bg-primary rounded-full animate-pulse" title="Франция"></div>
              <div className="absolute top-[22%] left-[80%] w-4 h-4 bg-primary rounded-full animate-pulse" title="Япония"></div>
              <div className="absolute top-[40%] left-[70%] w-4 h-4 bg-primary rounded-full animate-pulse" title="Индия"></div>
              <div className="absolute top-[18%] left-[40%] w-4 h-4 bg-primary rounded-full animate-pulse" title="Шотландия"></div>
              <div className="absolute top-[60%] left-[85%] w-4 h-4 bg-primary rounded-full animate-pulse" title="Австралия"></div>
              
              {/* Country labels */}
              <div className="absolute top-[30%] left-[48%] mt-5 font-medium text-dark bg-white px-2 py-1 rounded-md text-xs shadow-sm">Италия</div>
              <div className="absolute top-[28%] left-[44%] mt-5 font-medium text-dark bg-white px-2 py-1 rounded-md text-xs shadow-sm">Франция</div>
              <div className="absolute top-[22%] left-[80%] mt-5 font-medium text-dark bg-white px-2 py-1 rounded-md text-xs shadow-sm">Япония</div>
              <div className="absolute top-[40%] left-[70%] mt-5 font-medium text-dark bg-white px-2 py-1 rounded-md text-xs shadow-sm">Индия</div>
              <div className="absolute top-[18%] left-[40%] mt-5 font-medium text-dark bg-white px-2 py-1 rounded-md text-xs shadow-sm">Шотландия</div>
              <div className="absolute top-[60%] left-[85%] mt-5 font-medium text-dark bg-white px-2 py-1 rounded-md text-xs shadow-sm">Австралия</div>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="px-3 py-2 bg-light rounded-full">
                <span className="font-medium text-dark">Италия</span>
              </div>
              <div className="px-3 py-2 bg-light rounded-full">
                <span className="font-medium text-dark">Франция</span>
              </div>
              <div className="px-3 py-2 bg-light rounded-full">
                <span className="font-medium text-dark">Япония</span>
              </div>
              <div className="px-3 py-2 bg-light rounded-full">
                <span className="font-medium text-dark">Индия</span>
              </div>
              <div className="px-3 py-2 bg-light rounded-full">
                <span className="font-medium text-dark">Шотландия</span>
              </div>
              <div className="px-3 py-2 bg-light rounded-full">
                <span className="font-medium text-dark">Австралия</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QualitySection; 