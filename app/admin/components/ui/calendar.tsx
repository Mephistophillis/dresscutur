"use client"

import React, { useState } from 'react';
import { cn } from "../../../../lib/utils";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

export function Calendar({
  selected,
  onSelect,
  className
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  
  // Первый день месяца
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  // День недели первого дня месяца (0 - воскресенье, 1 - понедельник и т.д.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  // Количество дней в месяце
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  
  // Названия дней недели
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Названия месяцев
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  // Предыдущий месяц
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Следующий месяц
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Проверяем, является ли дата выбранной
  const isSelected = (date: Date) => {
    if (!selected) return false;
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };
  
  // Проверяем, является ли дата сегодняшней
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Обработчик клика на дату
  const handleDateClick = (date: Date) => {
    if (onSelect) {
      onSelect(date);
    }
  };
  
  // Получаем массив дней для отображения в календаре
  const getDaysArray = () => {
    const days = [];
    
    // Получаем смещение для первого дня месяца (корректируем, т.к. в JS воскресенье - 0)
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Добавляем пустые ячейки для смещения
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    // Добавляем дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }
    
    return days;
  };
  
  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevMonth}
          className="h-7 w-7 bg-transparent p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">
          {`${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="h-7 w-7 bg-transparent p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Дни недели */}
        {weekDays.map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {/* Дни месяца */}
        {getDaysArray().map((date, index) => (
          <div key={index} className="p-0 relative">
            {date ? (
              <button
                type="button"
                onClick={() => handleDateClick(date)}
                className={cn(
                  "h-9 w-9 p-0 font-normal",
                  "hover:bg-gray-100 rounded-md",
                  isSelected(date) && "bg-primary text-white hover:bg-primary",
                  isToday(date) && !isSelected(date) && "border border-primary"
                )}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="h-9 w-9"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export type { CalendarProps }; 