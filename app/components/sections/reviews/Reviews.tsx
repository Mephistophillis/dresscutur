'use client';

import { useState, useEffect } from 'react';

type Review = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
};

const reviewsData: Review[] = [
  {
    id: 1,
    name: 'Анна М.',
    avatar: '/images/avatars/avatar1.jpg',
    rating: 5,
    text: 'Просто восхитительная работа! Заказывала пошив вечернего платья, и результат превзошел все ожидания. Ткань, крой, внимание к деталям - все на высшем уровне.',
    date: '15.03.2023'
  },
  {
    id: 2,
    name: 'Сергей К.',
    avatar: '/images/avatars/avatar2.jpg',
    rating: 5,
    text: 'Обращался для пошива костюма на свадьбу. Мастера учли все мои пожелания, костюм сидит идеально. Отдельное спасибо за советы по выбору ткани и фасона.',
    date: '02.05.2023'
  },
  {
    id: 3,
    name: 'Елена В.',
    avatar: '/images/avatars/avatar3.jpg',
    rating: 4,
    text: 'Отличное ателье! Заказывала ремонт любимого пальто - заменили подкладку и обновили фурнитуру. Качество работы превосходное, теперь пальто как новое.',
    date: '17.09.2023'
  },
  {
    id: 4,
    name: 'Дмитрий О.',
    avatar: '/images/avatars/avatar4.jpg',
    rating: 5,
    text: 'Регулярно обращаюсь в это ателье для пошива рубашек. Идеальная посадка, качественные материалы и внимательное отношение к клиенту. Рекомендую всем!',
    date: '30.11.2023'
  },
  {
    id: 5,
    name: 'Мария Д.',
    avatar: '/images/avatars/avatar5.jpg',
    rating: 5,
    text: 'Заказывала пошив платья для выпускного дочери. Работа выполнена безупречно! Дочь была в восторге, получила много комплиментов. Спасибо за ваш профессионализм!',
    date: '25.01.2024'
  }
];

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviewsData.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev + 1) % reviewsData.length);
  };

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
  };

  const handleDotClick = (index: number) => {
    setAutoplay(false);
    setActiveIndex(index);
  };

  // Функция для отображения звёздного рейтинга
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Отзывы наших клиентов</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-dark/80">
            Мы ценим доверие наших клиентов и постоянно стремимся превосходить их ожидания.
            Вот что говорят о нас те, кто уже воспользовался нашими услугами.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {reviewsData.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 relative overflow-hidden rounded-full mr-4 bg-gray-200 flex-shrink-0">
                        {/* Заглушка для аватаров, в реальном проекте здесь будет Image компонент */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                          {review.name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{review.name}</h3>
                        <div className="flex space-x-1 mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        {review.date}
                      </div>
                    </div>
                    <p className="text-dark/80 italic">&quot;{review.text}&quot;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Навигационные кнопки */}
          <button 
            onClick={handlePrev}
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center z-10 hover:bg-gray-100"
            aria-label="Предыдущий отзыв"
          >
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center z-10 hover:bg-gray-100"
            aria-label="Следующий отзыв"
          >
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Индикаторы */}
        <div className="flex justify-center mt-8 space-x-2">
          {reviewsData.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-3 h-3 rounded-full ${
                i === activeIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-label={`Отзыв ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 