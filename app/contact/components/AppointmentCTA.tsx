'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Types
type AppointmentType = 'consultation' | 'fitting' | 'measurement';
type Designer = 'any' | 'designer1' | 'designer2' | 'designer3';

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

type FormState = {
  type: AppointmentType;
  date: string;
  timeSlot: string;
  designer: Designer;
  name: string;
  phone: string;
  comment: string;
};

// Generate some available dates (next 14 days)
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Sundays and Saturdays
    if (date.getDay() !== 0) { // 0 = Sunday
      const formattedDate = date.toISOString().split('T')[0];
      dates.push({
        value: formattedDate,
        label: new Date(formattedDate).toLocaleDateString('ru-RU', {
          weekday: 'short',
          day: 'numeric',
          month: 'long',
        }),
      });
    }
  }
  
  return dates;
};

// Generate time slots
const generateTimeSlots = (selectedDate: string): TimeSlot[] => {
  const date = new Date(selectedDate);
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  const slots: TimeSlot[] = [];
  
  // Starting hour depends on day of week
  let startHour = 10; // Default opening time (10:00)
  let endHour = 21;   // Default closing time (21:00)
  
  if (day === 6) { // Saturday
    startHour = 10;
    endHour = 19;
  } else if (day === 0) { // Sunday
    startHour = 11;
    endHour = 18;
  }
  
  // Generate slots every 30 minutes
  for (let hour = startHour; hour <= endHour; hour++) {
    for (const minute of [0, 30]) {
      // Skip the last slot if it's the closing hour and minutes are 30
      if (hour === endHour && minute === 30) continue;
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const id = `slot-${hour}-${minute}`;
      
      // Randomly mark some slots as unavailable for demo purposes
      const available = Math.random() > 0.3; // 30% chance of being unavailable
      
      slots.push({ id, time: timeString, available });
    }
  }
  
  return slots;
};

// Available designers
const designers = [
  { value: 'any', label: 'Любой доступный мастер' },
  { value: 'designer1', label: 'Анна Петрова - Дизайнер одежды' },
  { value: 'designer2', label: 'Мария Иванова - Конструктор' },
  { value: 'designer3', label: 'Сергей Смирнов - Портной' },
];

// Appointment types
const appointmentTypes = [
  { value: 'consultation', label: 'Консультация по пошиву' },
  { value: 'fitting', label: 'Примерка' },
  { value: 'measurement', label: 'Снятие мерок' },
];

// Initial form state
const initialFormState: FormState = {
  type: 'consultation',
  date: '',
  timeSlot: '',
  designer: 'any',
  name: '',
  phone: '',
  comment: '',
};

export default function AppointmentCTA() {
  const [availableDates] = useState(generateAvailableDates());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name as keyof FormState]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormState];
        return newErrors;
      });
    }
    
    // If date changed, update time slots
    if (name === 'date' && value) {
      setTimeSlots(generateTimeSlots(value));
      setFormState((prev) => ({ ...prev, timeSlot: '' })); // Reset time slot selection
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string) => {
    setFormState((prev) => ({
      ...prev,
      timeSlot: slotId,
    }));
    
    // Clear error for this field if it exists
    if (formErrors.timeSlot) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.timeSlot;
        return newErrors;
      });
    }
  };

  // Form validation
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    let isValid = true;
    
    if (currentStep === 1) {
      if (!formState.type) {
        newErrors.type = 'Пожалуйста, выберите тип консультации';
        isValid = false;
      }
      
      if (!formState.date) {
        newErrors.date = 'Пожалуйста, выберите дату';
        isValid = false;
      }
      
      if (!formState.timeSlot) {
        newErrors.timeSlot = 'Пожалуйста, выберите время';
        isValid = false;
      }
      
      if (!formState.designer) {
        newErrors.designer = 'Пожалуйста, выберите консультанта';
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!formState.name.trim()) {
        newErrors.name = 'Пожалуйста, введите ваше имя';
        isValid = false;
      }
      
      if (!formState.phone.trim()) {
        newErrors.phone = 'Пожалуйста, введите ваш телефон';
        isValid = false;
      } else {
        // Simple phone validation
        const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        if (!phoneRegex.test(formState.phone)) {
          newErrors.phone = 'Пожалуйста, введите корректный номер телефона';
          isValid = false;
        }
      }
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  // Move to next step
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  // Go back to previous step
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success!
      setIsSuccess(true);
    } catch (error) {
      // Handle error
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormState(initialFormState);
    setStep(1);
    setIsSuccess(false);
    setFormErrors({});
    setTimeSlots([]);
  };

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

  // Format time slot for display
  const getTimeSlotLabel = (slotId: string): string => {
    const slot = timeSlots.find((s) => s.id === slotId);
    return slot ? slot.time : '';
  };
  
  // Get appointment type label
  const getAppointmentTypeLabel = (type: AppointmentType): string => {
    const appointmentType = appointmentTypes.find((t) => t.value === type);
    return appointmentType ? appointmentType.label : '';
  };
  
  // Get designer label
  const getDesignerLabel = (designerId: Designer): string => {
    const designer = designers.find((d) => d.value === designerId);
    return designer ? designer.label : '';
  };

  return (
    <section
      id="appointment"
      ref={ref}
      className="py-16 md:py-24 bg-secondary"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title mx-auto w-fit">Запись на консультацию</h2>
          <p className="max-w-2xl mx-auto text-dark/80 mt-6">
            Запишитесь на персональную консультацию с нашими дизайнерами и мастерами для обсуждения вашего проекта
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto"
        >
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
            >
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-medium text-green-800 mb-4">Ваша запись подтверждена!</h3>
              
              <div className="bg-white rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                <h4 className="font-medium mb-3">Детали записи:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Тип консультации:</span>
                    <span className="font-medium">{getAppointmentTypeLabel(formState.type)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Дата:</span>
                    <span className="font-medium">{formState.date}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Время:</span>
                    <span className="font-medium">{getTimeSlotLabel(formState.timeSlot)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Дизайнер:</span>
                    <span className="font-medium">{getDesignerLabel(formState.designer)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Имя:</span>
                    <span className="font-medium">{formState.name}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Телефон:</span>
                    <span className="font-medium">{formState.phone}</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-green-700 mb-4">
                Мы отправили подтверждение на указанный телефон. Наш специалист свяжется с вами для уточнения деталей.
              </p>
              
              <button 
                onClick={handleReset}
                className="btn-primary"
              >
                Записаться снова
              </button>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-center justify-center border-b p-4">
                <div className="w-full max-w-xs flex justify-between items-center">
                  <button 
                    onClick={() => {
                      if (step > 1) setStep(1);
                    }}
                    type="button"
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      step === 1 
                        ? 'bg-primary text-white' 
                        : 'bg-white text-primary border-2 border-primary cursor-pointer'
                    }`}
                    disabled={isSubmitting}
                  >
                    1
                  </button>
                  <div className={`h-1 flex-grow mx-2 ${step > 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <button 
                    onClick={() => {
                      if (step === 1) {
                        const isValid = validateStep(1);
                        if (isValid) setStep(2);
                      }
                    }}
                    type="button"
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      step === 2 
                        ? 'bg-primary text-white' 
                        : 'bg-white text-primary border-2 border-primary cursor-pointer'
                    }`}
                    disabled={isSubmitting}
                  >
                    2
                  </button>
                </div>
              </div>
                
              <div className="p-6">
                {Object.keys(formErrors).length > 0 && (
                  <div className="mb-6 p-3 border border-red-300 bg-red-50 text-red-700 rounded-md">
                    <ul className="list-disc list-inside">
                      {Object.values(formErrors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-xl font-medium mb-6">Выберите дату и время</h3>
                    
                    <div className="mb-6">
                      <label className="block text-dark mb-2">Тип консультации</label>
                      <select
                        name="type"
                        value={formState.type}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      >
                        {appointmentTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-dark mb-2">Дизайнер</label>
                      <select
                        name="designer"
                        value={formState.designer}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      >
                        {designers.map((designer) => (
                          <option key={designer.value} value={designer.value}>{designer.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-dark mb-2">Дата консультации</label>
                      <select
                        name="date"
                        value={formState.date}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      >
                        <option value="">Выберите дату</option>
                        {availableDates.map((date) => (
                          <option key={date.value} value={date.value}>{date.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {formState.date && (
                      <div className="mb-6">
                        <label className="block text-dark mb-2">Время консультации</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {timeSlots.map((slot) => (
                            <button
                              type="button"
                              key={slot.id}
                              onClick={() => handleTimeSlotSelect(slot.id)}
                              disabled={!slot.available}
                              className={`p-2 border rounded-md text-sm text-center transition-colors ${
                                formState.timeSlot === slot.id
                                  ? 'bg-primary text-white border-primary'
                                  : slot.available
                                    ? 'border-gray-300 hover:border-primary'
                                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-8">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!formState.type || !formState.date || !formState.timeSlot || !formState.designer}
                        className={`btn-primary ${(!formState.type || !formState.date || !formState.timeSlot || !formState.designer) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Далее
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-6 p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-3">Выбранное время:</h4>
                      <ul className="space-y-1">
                        <li className="flex justify-between">
                          <span className="text-gray-500">Тип:</span>
                          <span>{getAppointmentTypeLabel(formState.type)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Дата:</span>
                          <span>{formState.date}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Время:</span>
                          <span>{getTimeSlotLabel(formState.timeSlot)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Дизайнер:</span>
                          <span>{getDesignerLabel(formState.designer)}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <h3 className="text-xl font-medium mb-6">Ваши данные</h3>
                    
                    <div className="mb-6">
                      <label htmlFor="name" className="block text-dark mb-2">Ваше имя</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="Иван Иванов"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="phone" className="block text-dark mb-2">Телефон</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleInputChange}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">Мы отправим подтверждение на указанный номер</p>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="comment" className="block text-dark mb-2">Комментарий (опционально)</label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={formState.comment}
                        onChange={handleInputChange}
                        placeholder="Укажите детали вашего запроса или особые пожелания"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                      ></textarea>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 justify-between mt-8">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="btn-outline"
                        disabled={isSubmitting}
                      >
                        Назад
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formState.name || !formState.phone}
                        className={`btn-primary ${
                          isSubmitting || !formState.name || !formState.phone ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Отправка...
                          </>
                        ) : (
                          'Подтвердить запись'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
} 