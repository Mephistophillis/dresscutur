'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Form field type
type FormField = {
  value: string;
  error: string;
  touched: boolean;
};

// Form state type
type FormState = {
  name: FormField;
  email: FormField;
  phone: FormField;
  subject: FormField;
  message: FormField;
  newsletter: boolean;
  agreement: boolean;
  fileAttachment: File | null;
};

// Form initial state
const initialFormState: FormState = {
  name: { value: '', error: '', touched: false },
  email: { value: '', error: '', touched: false },
  phone: { value: '', error: '', touched: false },
  subject: { value: '', error: '', touched: false },
  message: { value: '', error: '', touched: false },
  newsletter: false,
  agreement: false,
  fileAttachment: null,
};

// Subject options
const subjectOptions = [
  { value: '', label: 'Выберите тему обращения' },
  { value: 'consultation', label: 'Консультация по пошиву' },
  { value: 'fabrics', label: 'Вопрос о тканях' },
  { value: 'repairs', label: 'Ремонт одежды' },
  { value: 'prices', label: 'Вопрос о ценах' },
  { value: 'other', label: 'Другое' },
];

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormState((prev) => ({
      ...prev,
      [name]: {
        value,
        error: '',
        touched: true,
      },
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormState((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    setFormState((prev) => ({
      ...prev,
      fileAttachment: file,
    }));
  };

  // Clear file
  const clearFile = () => {
    setFormState((prev) => ({
      ...prev,
      fileAttachment: null,
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newFormState = { ...formState };
    
    // Validate name
    if (!newFormState.name.value.trim()) {
      newFormState.name.error = 'Пожалуйста, введите ваше имя';
      newFormState.name.touched = true;
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newFormState.email.value.trim()) {
      newFormState.email.error = 'Пожалуйста, введите ваш email';
      newFormState.email.touched = true;
      isValid = false;
    } else if (!emailRegex.test(newFormState.email.value)) {
      newFormState.email.error = 'Пожалуйста, введите корректный email';
      newFormState.email.touched = true;
      isValid = false;
    }
    
    // Validate phone (optional, but if provided must be valid)
    if (newFormState.phone.value.trim()) {
      const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
      if (!phoneRegex.test(newFormState.phone.value)) {
        newFormState.phone.error = 'Пожалуйста, введите корректный номер телефона';
        newFormState.phone.touched = true;
        isValid = false;
      }
    }
    
    // Validate subject
    if (!newFormState.subject.value) {
      newFormState.subject.error = 'Пожалуйста, выберите тему обращения';
      newFormState.subject.touched = true;
      isValid = false;
    }
    
    // Validate message
    if (!newFormState.message.value.trim()) {
      newFormState.message.error = 'Пожалуйста, введите ваше сообщение';
      newFormState.message.touched = true;
      isValid = false;
    }
    
    // Validate agreement
    if (!newFormState.agreement) {
      isValid = false;
    }
    
    setFormState(newFormState);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real application, this would be an API call
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success!
      setSubmitSuccess(true);
      setFormState(initialFormState);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.log(error)
      setSubmitError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <section
      id="contact-form"
      ref={formRef}
      className="py-16 md:py-24 bg-secondary"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title mx-auto w-fit">Напишите нам</h2>
          <p className="max-w-2xl mx-auto text-dark/80 mt-6">
            Есть вопросы или предложения? Заполните форму ниже, и наша команда свяжется с вами в ближайшее время
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto"
        >
          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
            >
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-medium text-green-800 mb-2">Сообщение отправлено!</h3>
              <p className="text-green-700">Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.</p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md p-6 md:p-8"
              variants={containerVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className="block text-sm font-medium text-dark mb-1">
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name.value}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-colors ${
                      formState.name.error && formState.name.touched
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Введите ваше имя"
                    aria-required="true"
                    aria-invalid={!!formState.name.error}
                  />
                  {formState.name.error && formState.name.touched && (
                    <p className="mt-1 text-sm text-red-500">{formState.name.error}</p>
                  )}
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className="block text-sm font-medium text-dark mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email.value}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-colors ${
                      formState.email.error && formState.email.touched
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Введите ваш email"
                    aria-required="true"
                    aria-invalid={!!formState.email.error}
                  />
                  {formState.email.error && formState.email.touched && (
                    <p className="mt-1 text-sm text-red-500">{formState.email.error}</p>
                  )}
                </motion.div>

                {/* Phone Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="phone" className="block text-sm font-medium text-dark mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone.value}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-colors ${
                      formState.phone.error && formState.phone.touched
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="+7 (___) ___-__-__"
                    aria-invalid={!!formState.phone.error}
                  />
                  {formState.phone.error && formState.phone.touched && (
                    <p className="mt-1 text-sm text-red-500">{formState.phone.error}</p>
                  )}
                </motion.div>

                {/* Subject Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="subject" className="block text-sm font-medium text-dark mb-1">
                    Тема <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject.value}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-colors ${
                      formState.subject.error && formState.subject.touched
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    aria-required="true"
                    aria-invalid={!!formState.subject.error}
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formState.subject.error && formState.subject.touched && (
                    <p className="mt-1 text-sm text-red-500">{formState.subject.error}</p>
                  )}
                </motion.div>
              </div>

              {/* Message Field */}
              <motion.div className="mt-6" variants={itemVariants}>
                <label htmlFor="message" className="block text-sm font-medium text-dark mb-1">
                  Сообщение <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message.value}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-colors ${
                    formState.message.error && formState.message.touched
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Введите ваше сообщение"
                  aria-required="true"
                  aria-invalid={!!formState.message.error}
                ></textarea>
                {formState.message.error && formState.message.touched && (
                  <p className="mt-1 text-sm text-red-500">{formState.message.error}</p>
                )}
              </motion.div>

              {/* File Attachment */}
              <motion.div className="mt-6" variants={itemVariants}>
                <label htmlFor="file" className="block text-sm font-medium text-dark mb-1">
                  Прикрепить файл
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="file"
                    name="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-dark hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    Выбрать файл
                  </button>
                  {formState.fileAttachment && (
                    <div className="ml-3 flex items-center">
                      <span className="text-sm text-dark/80 truncate max-w-[200px]">
                        {formState.fileAttachment.name}
                      </span>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="ml-2 text-red-500 hover:text-red-700"
                        aria-label="Удалить файл"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-dark/60">
                  Поддерживаемые форматы: изображения, PDF, DOC. Максимальный размер: 5MB
                </p>
              </motion.div>

              {/* Newsletter & Agreement Checkboxes */}
              <motion.div className="mt-6 space-y-4" variants={itemVariants}>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formState.newsletter}
                    onChange={handleCheckboxChange}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="ml-2 block text-sm text-dark/80">
                    Я хочу получать новости и специальные предложения от ателье DressCutur
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreement"
                    name="agreement"
                    checked={formState.agreement}
                    onChange={handleCheckboxChange}
                    className={`mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
                      !formState.agreement ? 'border-red-500' : ''
                    }`}
                    required
                    aria-required="true"
                  />
                  <label htmlFor="agreement" className="ml-2 block text-sm text-dark/80">
                    Я согласен с{' '}
                    <a href="#" className="text-primary hover:underline">
                      политикой обработки персональных данных
                    </a>{' '}
                    <span className="text-red-500">*</span>
                  </label>
                </div>
              </motion.div>

              {/* Error Message */}
              {submitError && (
                <motion.div
                  className="mt-6 bg-red-50 border border-red-200 rounded-md p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-700">{submitError}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div className="mt-8 text-center" variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-primary text-white rounded-md shadow-sm transition-all ${
                    isSubmitting
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Отправка...
                    </span>
                  ) : (
                    'Отправить сообщение'
                  )}
                </button>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </section>
  );
} 