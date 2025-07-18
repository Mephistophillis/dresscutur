'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CONTACTS } from '~/app/constants/contacts';

// FAQ data with categories
const faqData = [
  {
    category: 'services',
    title: 'Услуги',
    questions: [
      {
        id: 'q1',
        question: 'Какие виды пошива вы предлагаете?',
        answer: 'Мы предлагаем широкий спектр услуг, включая пошив повседневной и деловой одежды, вечерних нарядов, верхней одежды, а также реставрацию и подгонку готовых изделий по фигуре. Наши мастера могут создать одежду по вашим эскизам или помочь с разработкой индивидуального дизайна.',
        helpful: 0,
        notHelpful: 0,
      },
      {
        id: 'q2',
        question: 'Сколько времени занимает пошив одежды?',
        answer: 'Сроки выполнения заказа зависят от сложности изделия, загруженности ателье и срочности заказа. В среднем, пошив платья или костюма занимает от 7 до 14 дней, включая примерки. Для срочных заказов предусмотрены услуги экспресс-пошива с наценкой 30-50% от стоимости.',
        helpful: 0,
        notHelpful: 0,
      },
      {
        id: 'q3',
        question: 'Что такое индивидуальный пошив и чем он отличается от массового производства?',
        answer: 'Индивидуальный пошив предполагает создание одежды специально для вас, с учетом всех особенностей фигуры и личных предпочтений. В отличие от массового производства, где одежда шьется по стандартным лекалам, индивидуальный пошив обеспечивает идеальную посадку, высокое качество исполнения и уникальность изделия.',
        helpful: 0,
        notHelpful: 0,
      },
    ],
  },
  {
    category: 'fabric',
    title: 'Ткани',
    questions: [
      {
        id: 'q4',
        question: 'Какие ткани вы предлагаете для пошива?',
        answer: 'Мы работаем с широким ассортиментом тканей высокого качества от европейских производителей. В нашей коллекции представлены натуральные ткани (шелк, хлопок, лен, шерсть), смесовые материалы и эксклюзивные ткани для особых случаев. Вы можете выбрать ткань из нашего каталога или принести свою.',
        helpful: 0,
        notHelpful: 0,
      },
      {
        id: 'q5',
        question: 'Могу ли я заказать образцы ткани перед покупкой?',
        answer: 'Да, вы можете заказать образцы тканей перед оформлением заказа. Мы предлагаем услугу доставки образцов (до 5 образцов) с возможностью возврата стоимости при оформлении заказа на пошив. Также вы можете посетить наше ателье и ознакомиться с полным ассортиментом тканей лично.',
        helpful: 0,
        notHelpful: 0,
      },
    ],
  },
  {
    category: 'pricing',
    title: 'Цены и оплата',
    questions: [
      {
        id: 'q6',
        question: 'Сколько стоит пошив одежды?',
        answer: 'Стоимость пошива зависит от сложности модели, выбранных материалов и фурнитуры. Ориентировочная стоимость пошива: блузы от 5000₽, платья от 7000₽, брюки от 5500₽, пиджаки от 12000₽. Точную стоимость вы можете узнать на консультации после обсуждения всех деталей заказа.',
        helpful: 0,
        notHelpful: 0,
      },
      {
        id: 'q7',
        question: 'Какие способы оплаты вы принимаете?',
        answer: 'Мы принимаем оплату наличными, банковскими картами (Visa, MasterCard, МИР) и банковским переводом. Также возможна оплата через мобильные приложения (Apple Pay, Google Pay). При оформлении заказа вносится предоплата в размере 50% от стоимости работы.',
        helpful: 0,
        notHelpful: 0,
      },
      {
        id: 'q8',
        question: 'Есть ли у вас система скидок для постоянных клиентов?',
        answer: 'Да, мы ценим наших постоянных клиентов и предлагаем накопительную систему скидок: после 3-х заказов - скидка 5%, после 5-ти заказов - 10%, после 10-ти заказов - 15%. Также действуют сезонные акции и специальные предложения, о которых вы можете узнать из наших рассылок или социальных сетей.',
        helpful: 0,
        notHelpful: 0,
      },
    ],
  },
  {
    category: 'process',
    title: 'Процесс работы',
    questions: [
      {
        id: 'q9',
        question: 'Как происходит процесс пошива одежды на заказ?',
        answer: 'Процесс включает несколько этапов: 1) Консультация и обсуждение модели; 2) Снятие мерок и выбор ткани; 3) Создание выкройки и макета; 4) Первая примерка и внесение корректировок; 5) Пошив изделия; 6) Финальная примерка и внесение последних штрихов; 7) Готовое изделие. Количество примерок зависит от сложности модели.',
        helpful: 0,
        notHelpful: 0,
      },
      {
        id: 'q10',
        question: 'Нужно ли записываться на прием заранее?',
        answer: 'Да, для консультации и снятия мерок рекомендуется записаться заранее, чтобы мы могли выделить достаточно времени для вашего заказа. Вы можете сделать это по телефону, через форму на сайте или в нашем мобильном приложении. В среднем, консультация занимает 30-60 минут.',
        helpful: 0,
        notHelpful: 0,
      },
    ],
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(faqData[0].category);
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(faqData);
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Toggle question open/closed
  const toggleQuestion = (questionId: string) => {
    setOpenQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  // Handle helpful/not helpful feedback
  const handleFeedback = (questionId: string, isHelpful: boolean) => {
    if (!helpfulFeedback[questionId]) {
      setHelpfulFeedback((prev) => ({
        ...prev,
        [questionId]: isHelpful ? 'helpful' : 'not-helpful',
      }));
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredData(faqData);
      return;
    }

    const filtered = faqData.map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query)
      ),
    })).filter((category) => category.questions.length > 0);

    setFilteredData(filtered);
    
    // If we have filtered results, automatically open the matching questions
    const matchingQuestionIds = filtered.flatMap(category => 
      category.questions.map(q => q.id)
    );
    
    if (matchingQuestionIds.length > 0) {
      setOpenQuestions(matchingQuestionIds);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredData(faqData);
  };

  // Get the questions for the active category or search results
  const getQuestionsToDisplay = () => {
    if (searchQuery.trim()) {
      return filteredData.flatMap((category) => category.questions);
    }
    
    const activeData = filteredData.find((category) => category.category === activeCategory);
    return activeData ? activeData.questions : [];
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
      id="faq"
      ref={ref}
      className="py-16 md:py-24 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title mx-auto w-fit">Часто задаваемые вопросы</h2>
          <p className="max-w-2xl mx-auto text-dark/80 mt-6">
            Найдите ответы на популярные вопросы о нашем ателье, услугах и процессе работы
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto"
        >
          {/* Search Bar */}
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Поиск по вопросам..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-colors bg-white pr-10"
              />
              {searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Очистить поиск"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              )}
            </div>
          </motion.div>

          {!searchQuery.trim() && (
            /* Category Tabs */
            <motion.div className="mb-8 flex flex-wrap gap-2" variants={itemVariants}>
              {faqData.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setActiveCategory(category.category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category.category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-dark hover:bg-gray-200'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </motion.div>
          )}

          {/* Questions */}
          <motion.div className="space-y-4" variants={containerVariants}>
            {getQuestionsToDisplay().length > 0 ? (
              getQuestionsToDisplay().map((question) => (
                <motion.div
                  key={question.id}
                  variants={itemVariants}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-inset"
                  >
                    <span className="font-medium pr-8">{question.question}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-primary transition-transform ${
                        openQuestions.includes(question.id) ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {openQuestions.includes(question.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-dark/80 mb-4">{question.answer}</p>
                          
                          {/* Feedback buttons */}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <div className="text-sm text-dark/60">Был ли этот ответ полезен?</div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleFeedback(question.id, true)}
                                disabled={helpfulFeedback[question.id] !== undefined}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                  helpfulFeedback[question.id] === 'helpful'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
                                }`}
                              >
                                {helpfulFeedback[question.id] === 'helpful' ? 'Полезно ✓' : 'Да, полезно'}
                              </button>
                              <button
                                onClick={() => handleFeedback(question.id, false)}
                                disabled={helpfulFeedback[question.id] !== undefined}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                  helpfulFeedback[question.id] === 'not-helpful'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
                                }`}
                              >
                                {helpfulFeedback[question.id] === 'not-helpful' ? 'Не полезно ✓' : 'Нет, не полезно'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : searchQuery.trim() ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-dark mb-2">По вашему запросу ничего не найдено</h3>
                <p className="text-dark/70 mb-4">Попробуйте изменить запрос или задайте вопрос напрямую</p>
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Сбросить поиск
                </button>
              </motion.div>
            ) : null}
          </motion.div>
          
          {/* Ask Your Question */}
          <motion.div
            variants={itemVariants}
            className="mt-12 bg-secondary rounded-lg p-6 text-center"
          >
            <h3 className="text-xl font-medium mb-3">Не нашли ответ на свой вопрос?</h3>
            <p className="text-dark/80 mb-4">
              Свяжитесь с нами, и мы с радостью ответим на все ваши вопросы
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#contact-form"
                className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Задать вопрос через форму
              </a>
              <a
                href={CONTACTS.links.phone}
                className="px-5 py-2 bg-white border border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
              >
                Позвонить нам
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 