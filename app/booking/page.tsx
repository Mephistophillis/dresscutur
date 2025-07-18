import React from 'react';
import Link from 'next/link';
import BookingClient from './booking-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Запись на прием | DressCutur',
  description: 'Запишитесь на консультацию или примерку онлайн. Мы поможем вам создать индивидуальный образ.',
};

export default function BookingPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link 
          href="/" 
          className="text-primary hover:underline inline-flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Вернуться на главную
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Запись на прием</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">О записи</h2>
        <p className="mb-3">
          Вы можете записаться на консультацию, примерку или обсуждение пошива одежды онлайн.
          Выберите удобную для вас дату и время, заполните форму, и мы свяжемся с вами для подтверждения записи.
        </p>
        <p className="mb-3">
          Если у вас есть особые пожелания или вопросы, пожалуйста, укажите их в поле &ldquo;Сообщение&rdquo;.
        </p>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-blue-800 text-sm">
          <h3 className="font-medium text-blue-900 mb-1">Полезная информация:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Продолжительность консультации — 1 час</li>
            <li>Для примерки рекомендуем взять с собой нужную обувь и аксессуары</li>
            <li>При изменении планов, пожалуйста, сообщите нам об этом заранее</li>
          </ul>
        </div>
      </div>

      <BookingClient />
    </main>
  );
} 