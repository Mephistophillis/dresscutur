'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-xl">
              {/* Заменить на реальное изображение ателье */}
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">Изображение ателье</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary rounded-lg shadow-lg flex flex-col items-center justify-center text-white p-4">
              <span className="text-4xl font-bold">10+</span>
              <span className="text-sm uppercase tracking-wider text-center">лет опыта</span>
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">О нашем ателье</h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <p className="text-lg text-dark/80 mb-6">
                Добро пожаловать в ателье DressCutur — место, где каждая деталь имеет значение. 
                Мы специализируемся на создании эксклюзивной одежды, которая подчеркивает индивидуальность 
                и отражает ваш личный стиль.
              </p>
              <p className="text-lg text-dark/80 mb-6">
                Наша команда опытных мастеров обладает многолетним опытом работы в индустрии моды. 
                Мы используем только высококачественные материалы и современное оборудование, 
                чтобы гарантировать безупречный результат каждого проекта.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-light p-4 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">✓</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Качество материалов</h3>
                <p className="text-dark/70">
                  Используем только лучшие ткани и фурнитуру от проверенных поставщиков
                </p>
              </div>
              
              <div className="bg-light p-4 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">✓</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Индивидуальный подход</h3>
                <p className="text-dark/70">
                  Каждый проект создается с учетом всех ваших пожеланий и особенностей
                </p>
              </div>
            </div>
            
            <Link 
              href="#services" 
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Наши услуги
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 