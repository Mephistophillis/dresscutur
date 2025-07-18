'use client';

import React, { useState } from 'react';
import { PublicCalendarWidget } from '~/app/components/calendar/public-calendar-widget';
import { BookingForm } from '~/app/components/calendar/booking-form';

export default function BookingClient() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  // Обработчик выбора даты и времени
  const handleDateTimeSelect = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">1. Выберите дату и время</h2>
        <PublicCalendarWidget onDateSelect={handleDateTimeSelect} />
      </div>
        
      <div>
        <h2 className="text-xl font-semibold mb-4">2. Заполните форму записи</h2>
        <BookingForm 
          selectedDate={selectedDate} 
          selectedTime={selectedTime} 
        />
      </div>
    </div>
  );
} 