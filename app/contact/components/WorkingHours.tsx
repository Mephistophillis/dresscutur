'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Working hours data (24-hour format)
const workingHoursData = {
  weekdays: {
    opening: 10, // 10:00
    closing: 22, // 22:00
    daysLabel: 'Понедельник - Пятница',
  },
  saturday: {
    opening: 10, // 10:00
    closing: 20, // 20:00
    daysLabel: 'Суббота',
  },
  sunday: {
    opening: 11, // 11:00
    closing: 19, // 19:00
    daysLabel: 'Воскресенье',
  },
  holidays: {
    description: '1 января, 9 мая, 7 ноября - выходные дни',
  },
};

// Special working hours (holidays, etc.)
const specialDates = [
  { date: '01-01', closed: true, title: 'Новый год' },
  { date: '05-09', closed: true, title: 'День Победы' },
  { date: '11-07', closed: true, title: 'День Революции' },
  { date: '12-31', opening: 10, closing: 18, title: 'Канун Нового года' },
];

export default function WorkingHours() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [nextChangeTime, setNextChangeTime] = useState<string>('');
  const [specialStatus, setSpecialStatus] = useState<string | null>(null);
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Set up the current time and update it every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Format for checking against special dates
      const monthDay = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      // Check if today is a special date
      const todaySpecial = specialDates.find(date => date.date === monthDay);
      if (todaySpecial) {
        setSpecialStatus(todaySpecial.title);
        if (todaySpecial.closed) {
          setIsOpen(false);
          setNextChangeTime('Завтра');
          return;
        } else {
          // Special opening hours for today
          const hour = now.getHours();
          const isWithinHours = hour >= todaySpecial.opening! && hour < todaySpecial.closing!;
          setIsOpen(isWithinHours);
          
          if (isWithinHours) {
            setNextChangeTime(`${todaySpecial.closing}:00`);
          } else if (hour < todaySpecial.opening!) {
            setNextChangeTime(`${todaySpecial.opening}:00`);
          } else {
            setNextChangeTime('Завтра');
          }
          return;
        }
      }
      
      // Get current day of the week (0 = Sunday, 1 = Monday, etc.)
      const day = now.getDay();
      const hour = now.getHours();
      
      // Determine if we're currently open
      if (day === 0) {
        // Sunday
        const isWithinHours = hour >= workingHoursData.sunday.opening && hour < workingHoursData.sunday.closing;
        setIsOpen(isWithinHours);
        
        if (isWithinHours) {
          setNextChangeTime(`${workingHoursData.sunday.closing}:00`);
        } else if (hour < workingHoursData.sunday.opening) {
          setNextChangeTime(`${workingHoursData.sunday.opening}:00`);
        } else {
          setNextChangeTime(`Завтра в ${workingHoursData.weekdays.opening}:00`);
        }
      } else if (day === 6) {
        // Saturday
        const isWithinHours = hour >= workingHoursData.saturday.opening && hour < workingHoursData.saturday.closing;
        setIsOpen(isWithinHours);
        
        if (isWithinHours) {
          setNextChangeTime(`${workingHoursData.saturday.closing}:00`);
        } else if (hour < workingHoursData.saturday.opening) {
          setNextChangeTime(`${workingHoursData.saturday.opening}:00`);
        } else {
          setNextChangeTime(`Завтра в ${workingHoursData.sunday.opening}:00`);
        }
      } else {
        // Weekdays (Monday to Friday)
        const isWithinHours = hour >= workingHoursData.weekdays.opening && hour < workingHoursData.weekdays.closing;
        setIsOpen(isWithinHours);
        
        if (isWithinHours) {
          setNextChangeTime(`${workingHoursData.weekdays.closing}:00`);
        } else if (hour < workingHoursData.weekdays.opening) {
          setNextChangeTime(`${workingHoursData.weekdays.opening}:00`);
        } else {
          if (day === 5) { // Friday
            setNextChangeTime(`Завтра в ${workingHoursData.saturday.opening}:00`);
          } else {
            setNextChangeTime(`Завтра в ${workingHoursData.weekdays.opening}:00`);
          }
        }
      }
    };
    
    // Initial update
    updateTime();
    
    // Set up interval to update every minute
    const intervalId = setInterval(updateTime, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Format the display time
  const formatDisplayTime = (hours: number) => {
    return `${hours}:00`;
  };

  return (
    <section
      id="working-hours"
      ref={ref}
      className="py-16 md:py-24 bg-light"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title mx-auto w-fit">Часы работы</h2>
          <p className="max-w-2xl mx-auto text-dark/80 mt-6">
            Мы работаем каждый день, чтобы вам было удобно посетить наше ателье в любое время
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto"
        >
          {/* Current Status Indicator */}
          <motion.div
            variants={itemVariants}
            className={`mb-10 p-6 rounded-lg text-center ${
              isOpen ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              ></span>
              <h3 className={`text-xl font-medium ${isOpen ? 'text-green-800' : 'text-red-800'}`}>
                {isOpen ? 'Сейчас открыто' : 'Сейчас закрыто'}
              </h3>
            </div>
            
            <p className={isOpen ? 'text-green-700' : 'text-red-700'}>
              {isOpen 
                ? `Работаем до ${nextChangeTime}` 
                : `Откроемся в ${nextChangeTime}`}
              {specialStatus && ` • ${specialStatus}`}
            </p>
            
            {currentTime && (
              <p className="text-sm mt-2 text-gray-500">
                Текущее время: {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </motion.div>
          
          {/* Regular Working Hours */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weekdays */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg shadow-md p-6 hover-lift"
            >
              <h3 className="text-lg font-medium mb-3">{workingHoursData.weekdays.daysLabel}</h3>
              <div className="flex items-center text-dark/80 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDisplayTime(workingHoursData.weekdays.opening)} - {formatDisplayTime(workingHoursData.weekdays.closing)}</span>
              </div>
            </motion.div>

            {/* Saturday */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg shadow-md p-6 hover-lift"
            >
              <h3 className="text-lg font-medium mb-3">{workingHoursData.saturday.daysLabel}</h3>
              <div className="flex items-center text-dark/80 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDisplayTime(workingHoursData.saturday.opening)} - {formatDisplayTime(workingHoursData.saturday.closing)}</span>
              </div>
            </motion.div>

            {/* Sunday */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg shadow-md p-6 hover-lift"
            >
              <h3 className="text-lg font-medium mb-3">{workingHoursData.sunday.daysLabel}</h3>
              <div className="flex items-center text-dark/80 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDisplayTime(workingHoursData.sunday.opening)} - {formatDisplayTime(workingHoursData.sunday.closing)}</span>
              </div>
            </motion.div>
          </div>
          
          {/* Holiday Notice */}
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800"
          >
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Особый режим работы в праздничные дни</p>
                <p className="mt-1 text-blue-700">{workingHoursData.holidays.description}</p>
              </div>
            </div>
          </motion.div>
          
          {/* After-hours Notice */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-center text-dark/70"
          >
            <p>Вы можете записаться на консультацию в нерабочие часы, связавшись с нами по телефону или через форму на сайте</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 