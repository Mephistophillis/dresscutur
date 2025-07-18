'use server';

import { z } from 'zod';
import { prisma } from '~/app/lib/prisma';
import { revalidatePath } from 'next/cache';

// Схема валидации данных формы
const bookingFormSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').optional().nullable(),
  service: z.enum(['consultation', 'fitting', 'tailoring', 'repair']),
  date: z.string().datetime(),
  time: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
});

// Тип для данных формы
export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Функция для обработки отправки формы записи
export async function submitBookingForm(formData: FormData) {
  try {
    console.log('Booking form submission received');
    
    // Извлекаем данные из FormData
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string || null;
    const service = formData.get('service') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string || null;
    const message = formData.get('message') as string || null;
    
    console.log('Form data extracted:', { name, phone, email, service, date, time });

    // Валидируем данные
    const validatedData = bookingFormSchema.parse({
      name,
      phone,
      email,
      service,
      date,
      time,
      message,
    });
    
    console.log('Form data validated successfully');

    // Создаем объект даты из строковых значений
    const bookingDate = new Date(validatedData.date);
    
    // Если указано время, добавляем его к дате
    if (validatedData.time) {
      const [hours, minutes] = validatedData.time.split(':').map(Number);
      bookingDate.setHours(hours, minutes);
    }
    
    // Вычисляем дату окончания (по умолчанию +1 час)
    const endDate = new Date(bookingDate);
    endDate.setHours(endDate.getHours() + 1);
    
    console.log('Booking dates calculated:', { 
      start: bookingDate.toISOString(), 
      end: endDate.toISOString() 
    });

    // Преобразуем тип услуги в категорию события
    const categoryMap: Record<string, string> = {
      consultation: 'consultation',
      fitting: 'fitting',
      tailoring: 'production',
      repair: 'production',
    };
    
    const eventData = {
      title: `Запись: ${validatedData.name}`,
      description: validatedData.message || '',
      startDate: bookingDate,
      endDate: endDate,
      category: categoryMap[validatedData.service] || 'other',
      clientName: validatedData.name,
      clientContact: validatedData.phone,
      clientEmail: validatedData.email || null,
      status: 'pending',
      isAllDay: false,
      notes: `Телефон: ${validatedData.phone}\nEmail: ${validatedData.email || 'Не указан'}\nСообщение: ${validatedData.message || 'Нет сообщения'}`,
    };
    
    console.log('Creating event with data:', eventData);

    // Создаем событие в календаре
    const createdEvent = await prisma.event.create({
      data: eventData
    });

    if (!createdEvent) {
      throw new Error('Не удалось создать запись');
    }
    
    console.log('Event created successfully with ID:', createdEvent.id);

    // Отправляем уведомление администратору (в реальном приложении)
    // await sendAdminNotification(eventData);

    // Обновляем страницу календаря
    revalidatePath('/admin/calendar');
    revalidatePath('/booking');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Ваша заявка успешно отправлена. Мы свяжемся с вами для подтверждения.',
    };
  } catch (error) {
    console.error('Error submitting booking form:', error);
    
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        message: firstError.message || 'Пожалуйста, проверьте корректность введенных данных.',
      };
    }
    
    return {
      success: false,
      message: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.',
    };
  }
} 