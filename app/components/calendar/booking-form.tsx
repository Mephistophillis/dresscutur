'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/app/components/ui/button';
import { submitBookingForm } from '~/app/actions/public/booking-actions';
import { formatDate } from '~/app/lib/utils';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface FormInputs {
  name: string;
  phone: string;
  email?: string;
  service: 'consultation' | 'fitting' | 'tailoring' | 'repair';
  date: string;
  time?: string;
  message?: string;
}

interface BookingFormProps {
  selectedDate?: Date;
  selectedTime?: string;
}

export function BookingForm({ selectedDate, selectedTime }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: 'consultation',
      date: selectedDate ? selectedDate.toISOString() : '',
      time: selectedTime || '',
      message: '',
    }
  });

  // Устанавливаем значения даты и времени, если они переданы как пропсы
  React.useEffect(() => {
    if (selectedDate) {
      setValue('date', selectedDate.toISOString());
    }
    if (selectedTime) {
      setValue('time', selectedTime);
    }
  }, [selectedDate, selectedTime, setValue]);

  // Обработчик отправки формы
  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Создаем объект FormData для отправки через серверный action
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('email', data.email || '');
      formData.append('service', data.service);
      formData.append('date', data.date);
      formData.append('time', data.time || '');
      formData.append('message', data.message || '');

      // Отправляем данные на сервер
      const result = await submitBookingForm(formData);
      
      setSubmitResult(result);

      // Если успешно, сбрасываем форму
      if (result.success) {
        reset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitResult({
        success: false,
        message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {submitResult && (
        <div 
          className={`mb-6 p-4 rounded-md ${
            submitResult.success 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              {submitResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {submitResult.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Имя */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Имя *
          </label>
          <input
            id="name"
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
            }`}
            placeholder="Иван Иванов"
            {...register('name', { required: 'Имя обязательно для заполнения' })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Телефон */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Телефон *
          </label>
          <input
            id="phone"
            type="tel"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
            }`}
            placeholder="+7 (___) ___-__-__"
            {...register('phone', { 
              required: 'Телефон обязателен для заполнения',
              minLength: { value: 10, message: 'Введите корректный номер телефона' } 
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
            }`}
            placeholder="example@email.com"
            {...register('email', { 
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Введите корректный email' 
              } 
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Тип услуги */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Тип услуги *
          </label>
          <select
            id="service"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.service ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
            }`}
            {...register('service', { required: 'Выберите тип услуги' })}
          >
            <option value="consultation">Консультация</option>
            <option value="fitting">Примерка</option>
            <option value="tailoring">Индивидуальный пошив</option>
            <option value="repair">Ремонт одежды</option>
          </select>
          {errors.service && (
            <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
          )}
        </div>

        {/* Скрытые поля для даты и времени */}
        <input type="hidden" {...register('date')} />
        <input type="hidden" {...register('time')} />

        {/* Отображение выбранной даты и времени */}
        {selectedDate && (
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-700">
              Выбранная дата: {formatDate(selectedDate)}
              {selectedTime && `, ${selectedTime}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Если необходимо изменить дату или время, воспользуйтесь календарем слева
            </p>
          </div>
        )}

        {/* Сообщение */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Дополнительная информация
          </label>
          <textarea
            id="message"
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
            }`}
            placeholder="Опишите ваши пожелания или вопросы..."
            {...register('message')}
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {/* Кнопка отправки */}
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || !selectedDate || !selectedTime}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Отправка...
            </>
          ) : (
            'Записаться'
          )}
        </Button>
        
        {(!selectedDate || !selectedTime) && (
          <p className="text-sm text-amber-600 text-center">
            Пожалуйста, выберите дату и время для записи
          </p>
        )}
      </form>
    </div>
  );
} 