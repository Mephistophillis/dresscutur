'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from '~/app/components/ui/calendar';
import { Button } from '~/app/components/ui/button';
// Select компоненты удалены, так как не используются
import { format, addMonths, isBefore, isToday, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Loader2, Clock, Calendar as CalendarIcon, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBusyDates } from '~/app/actions/calendar/busy-dates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '~/app/components/ui/card';
import { cn } from '~/app/lib/utils';

// Стилизация календаря для правильного отображения
import './public-calendar.css';

// Типы данных
interface BusyDate {
  date: string;
  isFullDay: boolean;
  timeSlots?: TimeSlot[];
}

interface TimeSlot {
  start: string;
  end: string;
}

interface PublicCalendarWidgetProps {
  onDateSelect?: (date: Date, timeSlot?: string) => void;
  className?: string;
}

export function PublicCalendarWidget({ onDateSelect, className }: PublicCalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [busyDates, setBusyDates] = useState<BusyDate[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'date' | 'time'>('date');
  const [month, setMonth] = useState<Date>(new Date());

  // Минимальная и максимальная даты для выбора
  const today = new Date();
  const maxDate = addMonths(today, 2); // Макс. дата - сегодня + 2 месяца

  // Получение занятых дат с сервера
  const fetchBusyDates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const startDate = format(today, 'yyyy-MM-dd');
      const endDate = format(maxDate, 'yyyy-MM-dd');
      
      // Используем Server Action вместо fetch API
      const data = await getBusyDates(startDate, endDate);
      setBusyDates(data.busyDates || []);
    } catch (err) {
      console.error('Error fetching busy dates:', err);
      setError('Произошла ошибка при загрузке календаря. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // fetchBusyDates();
  }, []);

  // Функция для определения, полностью ли занят день
  const isDayFullyBooked = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const busyDate = busyDates.find(bd => bd.date === dateStr);
    return busyDate ? busyDate.isFullDay : false;
  };

  // Функция для проверки, является ли день доступным для выбора
  const isDateDisabled = (date: Date): boolean => {
    // День в прошлом или сегодня после рабочих часов
    if (isBefore(date, today) && !isToday(date)) {
      return true;
    }
    
    // Воскресенье - выходной
    if (date.getDay() === 0) {
      return true;
    }
    
    // Полностью забронированный день
    if (isDayFullyBooked(date)) {
      return true;
    }
    
    return false;
  };

  // Функция для навигации по месяцам
  const changeMonth = (increment: number) => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setMonth(newMonth);
  };

  // Обработчик выбора даты
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    
    if (date) {
      // Генерируем доступные временные слоты для выбранной даты
      generateAvailableTimeSlots(date);
      setCurrentStep('time');
    } else {
      setAvailableTimeSlots([]);
      setCurrentStep('date');
    }
  };

  // Генерация доступных временных слотов
  const generateAvailableTimeSlots = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const busyDate = busyDates.find(bd => bd.date === dateStr);
    
    // Начальное и конечное время рабочего дня
    const workStart = 10; // 10:00
    const workEnd = 19;   // 19:00
    
    // Размер временного слота в часах
    const slotSize = 1;
    
    // Создаем массив всех временных слотов в рабочем дне
    const allTimeSlots: string[] = [];
    for (let hour = workStart; hour < workEnd; hour += slotSize) {
      allTimeSlots.push(`${hour}:00`);
    }
    
    // Если есть занятые слоты, удаляем их из доступных
    if (busyDate && busyDate.timeSlots && !busyDate.isFullDay) {
      const unavailableSlots = busyDate.timeSlots.map(slot => {
        const startDate = new Date(slot.start);
        return `${startDate.getHours()}:00`;
      });
      
      const availableSlots = allTimeSlots.filter(
        slot => !unavailableSlots.includes(slot)
      );
      
      setAvailableTimeSlots(availableSlots);
    } else {
      setAvailableTimeSlots(allTimeSlots);
    }
  };

  // Обработчик выбора времени
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    // Если задан обработчик выбора даты и времени, вызываем его
    if (onDateSelect && selectedDate) {
      onDateSelect(selectedDate, time);
    }
  };

  // Форматирование даты для отображения пользователю
  const formatDateForDisplay = (date: Date): string => {
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  // Форматирование времени с красивым отображением
  const formatTimeForDisplay = (time: string): string => {
    try {
      // Преобразуем строку времени (например, "14:00") в объект Date для форматирования
      const timeDate = parse(time, 'H:mm', new Date());
      return format(timeDate, 'HH:mm');
    } catch {
      return time;
    }
  };

  // Обработчик для возврата к выбору даты
  const handleBackToDateSelection = () => {
    setCurrentStep('date');
    setSelectedTime(undefined);
  };

  // Окончательный выбор даты и времени
  const handleConfirm = () => {
    if (selectedDate && selectedTime && onDateSelect) {
      onDateSelect(selectedDate, selectedTime);
    }
  };

  // Кастомные компоненты для календаря
  const CustomNavigation = () => (
    <div className="public-calendar-navigation">
      <Button
        variant="ghost"
        size="icon"
        className="navigation-prev"
        onClick={() => changeMonth(-1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="navigation-next"
        onClick={() => changeMonth(1)}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );

  return (
    <div className={cn("space-y-4 max-w-md mx-auto", className)}>
      <Card className="border-none shadow-md">
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="flex items-center text-primary">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Запись на консультацию
          </CardTitle>
          <CardDescription>
            {currentStep === 'date' 
              ? 'Выберите удобную дату для посещения' 
              : 'Выберите удобное время для посещения'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-3 pt-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Загрузка календаря...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4 text-center">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={fetchBusyDates}
              >
                Попробовать снова
              </Button>
            </div>
          ) : (
            <>
              {currentStep === 'date' && (
                <div className="flex flex-col items-center w-[max-content] mx-auto">
                  <div className="public-calendar-container">
                    <CustomNavigation />
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={isDateDisabled}
                      locale={ru}
                      fromDate={today}
                      toDate={maxDate}
                      className="rounded-md border calendar-with-weekends"
                      month={month}
                      onMonthChange={setMonth}
                      classNames={{
                        day_disabled: "text-gray-300 bg-gray-50/50 line-through decoration-gray-400 hover:bg-gray-50",
                        day_today: "bg-primary/10 text-primary font-semibold",
                        day_selected: "bg-primary text-primary-foreground font-semibold",
                        head_cell: "text-center text-xs px-0 py-1 text-gray-500 font-medium",
                        cell: "relative p-0 text-center focus-within:relative text-sm",
                        nav: "hidden",
                        caption: "flex justify-center pt-1 pb-2 relative text-sm font-medium",
                        table: "w-full border-collapse",
                      }}
                    />
                  </div>
                  
                  {selectedDate && (
                    <Button 
                      className="mt-3 w-full text-white"
                      onClick={() => setCurrentStep('time')}
                    >
                      Выбрать время <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              
              {currentStep === 'time' && selectedDate && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleBackToDateSelection}
                    >
                      &larr; Выбрать другую дату
                    </Button>
                    
                    <div className="text-sm font-medium text-primary">
                      {formatDateForDisplay(selectedDate)}
                    </div>
                  </div>
                  
                  {availableTimeSlots.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableTimeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => handleTimeSelect(time)}
                            className={cn(
                              "justify-center py-2 h-auto",
                              selectedTime === time && "relative"
                            )}
                          >
                            <Clock className="h-3 w-3 mr-1 opacity-70" />
                            {formatTimeForDisplay(time)}
                            {selectedTime === time && (
                              <CheckCircle2 className="h-3 w-3 absolute -top-1 -right-1 text-white bg-green-500 rounded-full" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-amber-600 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      На выбранную дату нет доступных слотов времени. Пожалуйста, выберите другую дату.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
        
        {selectedDate && selectedTime && (
          <CardFooter className="bg-green-50 border-t p-3 flex flex-col items-start">
            <div className="w-full">
              <div className="text-green-800 font-medium mb-2 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                Выбранное время
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                    {formatDateForDisplay(selectedDate)}
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                    {formatTimeForDisplay(selectedTime)}
                  </div>
                </div>
                
                <Button 
                  className="ml-auto text-white"
                  onClick={handleConfirm}
                >
                  Подтвердить
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
      
      <Card className="bg-white/50 border-none shadow-sm">
        <CardContent className="pt-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Информация о бронировании:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Вы можете забронировать время не ранее текущего дня</li>
              <li>Временной слот бронируется на 1 час</li>
              <li>Воскресенье - выходной день</li>
              <li>Плановые записи осуществляются не более чем на 2 месяца вперед</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 