'use client';

import { motion } from 'framer-motion';

// Шаги процесса работы
const processSteps = [
  {
    id: 1,
    title: 'Консультация',
    description: 'Первая встреча с дизайнером, обсуждение идей, выбор фасона и материалов. Определение бюджета и сроков исполнения.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Замеры',
    description: 'Снятие точных мерок для создания индивидуальной выкройки. Учитываются все особенности фигуры для идеальной посадки.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Создание выкройки',
    description: 'Разработка индивидуальной выкройки с учетом всех мерок и особенностей фигуры. Подготовка к раскрою материалов.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Раскрой и пошив',
    description: 'Тщательный раскрой материалов и начало пошива изделия. Высокая точность исполнения каждого шва и детали.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"></path>
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Примерка',
    description: 'Первая примерка готовящегося изделия, внесение корректировок для идеальной посадки и комфорта. Обсуждение деталей.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Финальная отделка',
    description: 'Окончательная доработка изделия, обработка швов, пришивание фурнитуры, глажка и подготовка к выдаче клиенту.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
    ),
  },
];

export default function Process() {
  return (
    <section className="py-16 bg-gray-50" id="work-process">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-serif font-semibold mb-4">Как мы работаем</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Процесс создания вашего идеального изделия состоит из нескольких этапов.
            Каждый шаг важен для достижения безупречного результата.
          </p>
        </motion.div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Центральная линия для десктопа */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 md:space-y-0">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Круг с номером шага на линии (только для десктопа) */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary text-white justify-center items-center font-bold shadow-md">
                    {step.id}
                  </div>
                  
                  {/* Содержимое шага */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      {/* Номер шага (только для мобильных) */}
                      <div className="md:hidden flex items-center mb-4">
                        <div className="flex w-10 h-10 rounded-full bg-primary text-white justify-center items-center font-bold mr-4">
                          {step.id}
                        </div>
                        <h3 className="text-xl font-medium">{step.title}</h3>
                      </div>
                      
                      {/* Заголовок (только для десктопа) */}
                      <h3 className="hidden md:block text-xl font-medium mb-4">{step.title}</h3>
                      
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  {/* Пустой div для выравнивания в сетке */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 