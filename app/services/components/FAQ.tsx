'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Данные FAQ, группированные по категориям
const faqData = [
  {
    category: 'Общие вопросы',
    questions: [
      {
        id: 1,
        question: 'Сколько времени занимает пошив одежды?',
        answer: 'Сроки изготовления зависят от сложности изделия и загруженности ателье. В среднем, пошив платья занимает 7-14 дней, костюма — 14-21 день, вечернего или свадебного платья — от 3 недель до 2 месяцев. При оформлении заказа мы всегда согласовываем точные сроки с учетом ваших пожеланий.'
      },
      {
        id: 2,
        question: 'Нужна ли предоплата при заказе?',
        answer: 'Да, для начала работы над изделием требуется предоплата в размере 50% от стоимости заказа. Она необходима для закупки материалов и начала работы над выкройкой. Остальная сумма вносится после примерки, перед финальной доработкой изделия.'
      },
      {
        id: 3,
        question: 'Можно ли заказать пошив одежды дистанционно?',
        answer: 'Мы предлагаем дистанционную работу для некоторых изделий, если у вас есть точные мерки и возможность отправить их нам. Однако для сложных изделий, таких как вечерние платья или костюмы, рекомендуется личное присутствие для снятия мерок и примерок. В индивидуальных случаях мы можем организовать выезд мастера.'
      }
    ]
  },
  {
    category: 'Процесс работы',
    questions: [
      {
        id: 4,
        question: 'Сколько примерок потребуется?',
        answer: 'Количество примерок зависит от сложности изделия. Для простых моделей обычно достаточно 1-2 примерок, для сложных (свадебные платья, костюмы) — 2-3 примерки. На первой примерке мы подгоняем основные линии и формы, на последующих — дорабатываем детали для идеальной посадки.'
      },
      {
        id: 5,
        question: 'Можно ли использовать свой материал?',
        answer: 'Да, вы можете предоставить свой материал для пошива. Мы рекомендуем предварительно проконсультироваться с нашими мастерами о количестве и качестве ткани для вашей модели. Если ткань не подойдет для выбранного фасона, мы обязательно подскажем альтернативные варианты.'
      },
      {
        id: 6,
        question: 'Как проходит процесс выбора модели?',
        answer: 'Процесс начинается с консультации, где мы обсуждаем ваши предпочтения, мероприятие, для которого создается одежда, и особенности вашей фигуры. Вы можете принести референсы или эскизы, либо мы поможем с выбором на основе нашего каталога и модных тенденций. После мы создаем эскиз будущего изделия для вашего утверждения.'
      }
    ]
  },
  {
    category: 'Оплата и гарантии',
    questions: [
      {
        id: 7,
        question: 'Какие способы оплаты вы принимаете?',
        answer: 'Мы принимаем наличные, банковские карты, а также переводы через банковские приложения. Для постоянных клиентов возможна оплата в рассрочку. Все платежи подтверждаются чеками и вносятся в договор.'
      },
      {
        id: 8,
        question: 'Предоставляете ли вы гарантию на изделия?',
        answer: 'Да, мы предоставляем гарантию на все наши изделия. В течение гарантийного срока (обычно 30 дней) мы бесплатно устраним любые недостатки, связанные с качеством пошива. Также мы предлагаем услуги по уходу за изделиями и их обновлению в течение более длительного срока.'
      },
      {
        id: 9,
        question: 'Что делать, если готовое изделие не подходит?',
        answer: 'Мы гарантируем идеальную посадку изделия, поэтому проводим необходимое количество примерок. Если после финальной примерки вы обнаружите какие-либо недостатки, мы оперативно внесем коррективы. В случае значительных расхождений с согласованным эскизом, мы переделаем изделие за наш счет.'
      }
    ]
  }
];

export default function FAQ() {
  // Состояние для отслеживания открытых вопросов
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);
  
  // Функция для переключения открытия/закрытия вопроса
  const toggleQuestion = (id: number) => {
    if (openQuestions.includes(id)) {
      setOpenQuestions(openQuestions.filter(q => q !== id));
    } else {
      setOpenQuestions([...openQuestions, id]);
    }
  };
  
  return (
    <section className="py-16 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-serif font-semibold mb-4">Часто задаваемые вопросы</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ответы на наиболее популярные вопросы о нашей работе.
            Если вы не нашли ответ на свой вопрос, свяжитесь с нами напрямую.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {faqData.map((category, index) => (
            <motion.div 
              key={category.category}
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-medium mb-6 text-primary">{category.category}</h3>
              
              <div className="space-y-4">
                {category.questions.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="flex justify-between items-center w-full p-5 text-left bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
                      onClick={() => toggleQuestion(item.id)}
                      aria-expanded={openQuestions.includes(item.id)}
                      aria-controls={`answer-${item.id}`}
                    >
                      <span className="font-medium text-gray-900">{item.question}</span>
                      <span className="ml-6 flex-shrink-0">
                        <svg 
                          className={`w-5 h-5 transform ${openQuestions.includes(item.id) ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {openQuestions.includes(item.id) && (
                        <motion.div
                          id={`answer-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 border-t border-gray-200">
                            <p className="text-gray-600">{item.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-600 mb-6">
            Остались вопросы? Мы с радостью на них ответим!
          </p>
          <button className="btn-primary">
            Задать свой вопрос
          </button>
        </motion.div>
      </div>
    </section>
  );
} 