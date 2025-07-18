import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Функция для хеширования пароля
async function hashPassword(password: string): Promise<string> {
  // Используем bcrypt для хеширования паролей
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log('Начинаем заполнение базы данных тестовыми данными...');
  
  // Очищаем базу данных перед заполнением
  await prisma.$transaction([
    prisma.galleryRelatedImage.deleteMany(),
    prisma.galleryItem.deleteMany(),
    prisma.fabricGallery.deleteMany(),
    prisma.fabricDetails.deleteMany(),
    prisma.fabric.deleteMany(),
    prisma.service.deleteMany(),
    prisma.fAQ.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.settings.deleteMany(),
    prisma.user.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.workshop.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.price.deleteMany(),
  ]);
  
  console.log('База данных очищена. Начинаем добавлять данные...');
  
  // Создаем администратора
  const adminPassword = await hashPassword('Cet337unip0@#');
  const admin = await prisma.user.create({
    data: {
      name: 'Главный администратор',
      email: 'dresscutur@mail.ru',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      lastLogin: new Date(),
    },
  });
  console.log('Создан администратор:', admin.email);
  
  // Создаем редактора
  const editorPassword = await hashPassword('editor123');
  const editor = await prisma.user.create({
    data: {
      name: 'Редактор',
      email: 'editor@dresscutur.ru',
      password: editorPassword,
      role: 'EDITOR',
      isActive: true,
      lastLogin: new Date(),
    },
  });
  console.log('Создан редактор:', editor.email);
  
  // Добавляем услуги
  const services = await Promise.all([
    prisma.service.create({
      data: {
        title: 'Индивидуальный пошив платья',
        description: 'Создание уникального платья по вашим меркам и предпочтениям',
        icon: 'Dress',
        image: '/services/dress-tailoring.jpg',
        isActive: true,
        order: 1,
        advantages: ['Индивидуальный подход', 'Премиальные ткани', 'Идеальная посадка'],
        timeline: {
          steps: [
            { name: 'Консультация', duration: '1 час' },
            { name: 'Снятие мерок', duration: '30 минут' },
            { name: 'Создание эскиза', duration: '3-5 дней' },
            { name: 'Первая примерка', duration: '1 час' },
            { name: 'Финальная примерка', duration: '1 час' },
          ]
        }
      },
    }),
    prisma.service.create({
      data: {
        title: 'Ремонт одежды',
        description: 'Профессиональный ремонт и подгонка любой одежды',
        icon: 'Scissors',
        image: '/services/clothing-repair.jpg',
        isActive: true,
        order: 2,
        advantages: ['Быстрое выполнение', 'Качественные материалы', 'Доступные цены'],
        timeline: {
          steps: [
            { name: 'Оценка объема работ', duration: '15-30 минут' },
            { name: 'Выполнение работы', duration: '1-3 дня' },
            { name: 'Примерка', duration: '30 минут' }
          ]
        }
      },
    }),
    prisma.service.create({
      data: {
        title: 'Пошив костюма',
        description: 'Создание элегантного костюма с учетом всех ваших пожеланий',
        icon: 'Suit',
        image: '/services/suit-tailoring.jpg',
        isActive: true,
        order: 3,
        advantages: ['Классический крой', 'Премиальные ткани', 'Индивидуальные детали'],
        timeline: {
          steps: [
            { name: 'Консультация', duration: '1 час' },
            { name: 'Снятие мерок', duration: '45 минут' },
            { name: 'Подбор ткани', duration: '30-60 минут' },
            { name: 'Первая примерка', duration: '1 час' },
            { name: 'Вторая примерка', duration: '1 час' },
            { name: 'Финальная примерка', duration: '45 минут' }
          ]
        }
      },
    }),
  ]);
  console.log('Добавлено услуг:', services.length);
  
  // Добавляем ткани
  const fabricSilk = await prisma.fabric.create({
    data: {
      name: 'Итальянский шелк',
      description: 'Премиальный шелк итальянского производства высокой плотности',
      category: 'silk',
      purpose: ['evening', 'dress', 'blouse'],
      colors: ['white', 'black', 'red', 'blue', 'green'],
      price: 5000,
      image: '/fabrics/italian-silk.jpg',
      properties: ['мягкость', 'блеск', 'легкость'],
      recommendations: ['вечерние платья', 'блузы', 'летние платья'],
      isActive: true,
      order: 1,
      details: {
        create: {
          composition: '100% шелк',
          width: 140,
          weight: 80,
          care: ['ручная стирка', 'химчистка', 'гладить при низкой температуре'],
          origin: 'Италия',
          description: 'Премиальный шелк из Италии, идеально подходит для вечерних нарядов и праздничной одежды',
        },
      },
    },
  });
  console.log('Добавлена ткань:', fabricSilk.name);
  
  const fabricWool = await prisma.fabric.create({
    data: {
      name: 'Английская шерсть',
      description: 'Плотная шерстяная ткань из Англии для демисезонной и зимней одежды',
      category: 'wool',
      purpose: ['suit', 'coat', 'jacket'],
      colors: ['grey', 'navy', 'black', 'brown'],
      price: 4500,
      image: '/fabrics/english-wool.jpg',
      properties: ['плотность', 'тепло', 'формоустойчивость'],
      recommendations: ['костюмы', 'пальто', 'жакеты'],
      isActive: true,
      order: 2,
      details: {
        create: {
          composition: '95% шерсть, 5% эластан',
          width: 150,
          weight: 350,
          care: ['химчистка', 'не стирать', 'гладить через влажную ткань'],
          origin: 'Англия',
          description: 'Классическая английская шерсть для пошива костюмов и верхней одежды высокого качества',
        },
      },
    },
  });
  console.log('Добавлена ткань:', fabricWool.name);
  
  // Добавляем галерею к тканям
  await prisma.fabricGallery.createMany({
    data: [
      {
        fabricId: fabricSilk.id,
        url: '/fabrics/italian-silk-1.jpg',
        alt: 'Итальянский шелк - детальное фото 1',
      },
      {
        fabricId: fabricSilk.id,
        url: '/fabrics/italian-silk-2.jpg',
        alt: 'Итальянский шелк - детальное фото 2',
      },
      {
        fabricId: fabricWool.id,
        url: '/fabrics/english-wool-1.jpg',
        alt: 'Английская шерсть - детальное фото 1',
      },
    ],
  });
  console.log('Добавлены фото к тканям');
  
  // Добавляем элементы галереи
  const galleryItem1 = await prisma.galleryItem.create({
    data: {
      src: '/gallery/evening-dress-1.jpg',
      alt: 'Вечернее платье "Элегантность"',
      category: 'evening',
      description: 'Эксклюзивное вечернее платье из натурального шелка',
      isNew: true,
      order: 1,
      isActive: true,
      client: 'Анна П.',
      materials: ['Натуральный шелк', 'Кружево'],
      date: 'Май 2023',
      process: 'Платье создано по индивидуальному заказу для торжественного мероприятия. Особенностью является ручная вышивка и декор кристаллами.'
    },
  });
  console.log('Добавлен элемент галереи:', galleryItem1.description);
  
  const galleryItem2 = await prisma.galleryItem.create({
    data: {
      src: '/gallery/suit-1.jpg',
      alt: 'Деловой костюм "Бизнес"',
      category: 'suits',
      description: 'Классический мужской костюм из английской шерсти',
      isNew: false,
      order: 2,
      isActive: true,
      client: 'Сергей М.',
      materials: ['Английская шерсть', 'Итальянская подкладка'],
      date: 'Март 2023',
      process: 'Костюм создан с учетом особенностей фигуры клиента. Отличительной чертой является ручная работа и особое внимание к деталям.'
    },
  });
  console.log('Добавлен элемент галереи:', galleryItem2.description);
  
  // Добавляем связанные изображения
  await prisma.galleryRelatedImage.createMany({
    data: [
      {
        galleryItemId: galleryItem1.id,
        src: '/gallery/evening-dress-1-detail1.jpg',
        alt: 'Вечернее платье - деталь 1',
      },
      {
        galleryItemId: galleryItem1.id,
        src: '/gallery/evening-dress-1-detail2.jpg',
        alt: 'Вечернее платье - деталь 2',
      },
      {
        galleryItemId: galleryItem2.id,
        src: '/gallery/suit-1-detail1.jpg',
        alt: 'Деловой костюм - деталь 1',
      },
    ],
  });
  
  // Добавляем FAQ
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        category: 'general',
        title: 'Общие вопросы',
        question: 'Как часто нужно приходить на примерки?',
        answer: 'Обычно требуется 2-3 примерки для базовых изделий и 3-4 для свадебных платьев. Точное количество зависит от сложности изделия и индивидуальных особенностей фигуры.',
        likes: 24,
        dislikes: 2,
        isActive: true,
        order: 1,
      },
    }),
    prisma.fAQ.create({
      data: {
        category: 'workflow',
        title: 'Рабочий процесс',
        question: 'Какие мерки мне нужно предоставить для заказа?',
        answer: 'Для начала работы нам потребуются основные мерки: обхват груди, талии, бедер. На консультации мы снимем полный комплект необходимых мерок для вашего изделия. Вы также можете отправить нам свои мерки заранее через форму на сайте.',
        likes: 42,
        dislikes: 1,
        isActive: true,
        order: 2,
      },
    }),
    prisma.fAQ.create({
      data: {
        category: 'materials',
        title: 'Материалы',
        question: 'Могу ли я принести свою ткань для пошива?',
        answer: 'Да, вы можете принести свою ткань. Мы проведем осмотр материала и определим его пригодность для выбранной модели. Обратите внимание, что мы не несем ответственности за качество и характеристики ткани, предоставленной клиентом.',
        likes: 18,
        dislikes: 0,
        isActive: true,
        order: 3,
      },
    }),
  ]);
  console.log('Добавлено FAQ:', faqs.length);
  
  // Добавляем контактные заявки
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'Мария Иванова',
        email: 'maria@example.com',
        phone: '+7 (999) 123-45-67',
        subject: 'Пошив свадебного платья',
        message: 'Здравствуйте! Интересует пошив свадебного платья на июль 2024 года. Когда можно записаться на консультацию?',
        status: 'NEW',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Александр Петров',
        email: 'alex@example.com',
        phone: '+7 (999) 987-65-43',
        subject: 'Индивидуальный пошив костюма',
        message: 'Добрый день! Хочу заказать деловой костюм. Нужна консультация по выбору ткани и снятие мерок.',
        status: 'IN_PROGRESS',
        assignedTo: admin.id,
        notes: 'Записан на консультацию на следующую неделю',
      },
    }),
  ]);
  console.log('Добавлено контактных заявок:', contacts.length);
  
  // Добавляем ателье
  const workshops = await Promise.all([
    prisma.workshop.create({
      data: {
        name: 'Ателье на Тверской',
        address: 'г. Москва, ул. Тверская, д. 15, офис 204',
        description: 'Основное ателье в центре Москвы, специализирующееся на пошиве эксклюзивной одежды. Здесь работают наши лучшие мастера и представлен самый большой выбор тканей.',
        directions: 'М. Тверская - 5 минут пешком, М. Пушкинская - 7 минут пешком, Автобусы: 15, 115 - остановка "Тверская улица". Платная парковка доступна на улице и в ближайших паркингах ТЦ.',
        coordinates: { lat: 55.765543, lng: 37.608803 },
        isActive: true,
        order: 1,
      },
    }),
    prisma.workshop.create({
      data: {
        name: 'Ателье на Арбате',
        address: 'г. Москва, ул. Арбат, д. 24, 2 этаж',
        description: 'Уютное ателье в историческом центре Москвы. Специализируется на индивидуальном пошиве платьев и ремонте одежды.',
        directions: 'М. Арбатская - 3 минуты пешком, М. Смоленская - 10 минут пешком, Автобусы: 39, 64 - остановка "Арбат". Возможна парковка на прилегающих улицах. Платная парковка в 300м.',
        coordinates: { lat: 55.749596, lng: 37.586758 },
        isActive: true,
        order: 2,
      },
    }),
  ]);
  console.log('Добавлено ателье:', workshops.length);
  
  // Добавляем членов команды
  const teamMembers = await Promise.all([
    prisma.teamMember.create({
      data: {
        name: 'Елена Смирнова',
        position: 'Ведущий дизайнер',
        bio: 'Елена - дизайнер с 15-летним опытом работы в индустрии моды. Выпускница Московского Института Дизайна и Технологии. Специализируется на создании вечерних и свадебных платьев.',
        photo: '/team/elena-smirnova.jpg',
        socialLinks: {
          instagram: '@elena.design',
          facebook: 'elena.smirnova.design',
          vk: 'elena_design'
        },
        location: 'Ателье на Тверской',
        isActive: true,
        order: 1,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: 'Михаил Ковалев',
        position: 'Мастер мужского костюма',
        bio: 'Михаил - опытный портной с более чем 20-летним стажем. Прошел обучение у ведущих мастеров Италии. Специализируется на пошиве классических мужских костюмов и пальто.',
        photo: '/team/mikhail-kovalev.jpg',
        socialLinks: {
          instagram: '@mikhail.tailor',
          facebook: 'mikhail.kovalev.tailor'
        },
        location: 'Ателье на Тверской',
        isActive: true,
        order: 2,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: 'Анна Петрова',
        position: 'Мастер по ремонту одежды',
        bio: 'Анна - профессионал в области ремонта и реставрации одежды. Более 10 лет опыта работы с разными типами тканей и сложными изделиями.',
        photo: '/team/anna-petrova.jpg',
        socialLinks: {
          instagram: '@anna.repair',
          vk: 'anna_repair_clothes'
        },
        location: 'Ателье на Арбате',
        isActive: true,
        order: 3,
      },
    }),
  ]);
  console.log('Добавлено членов команды:', teamMembers.length);
  
  // Добавляем отзывы
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Ольга Сидорова',
        position: 'Невеста',
        avatar: '/testimonials/olga-sidorova.jpg',
        text: 'Заказывала свадебное платье в этом ателье. Очень довольна результатом! Мастера помогли выбрать фасон, идеально подходящий к моей фигуре, и подобрали великолепные ткани. На примерках вносили все необходимые корректировки, учитывая все мои пожелания. В день свадьбы получила множество комплиментов!',
        rating: 5,
        date: 'Июнь 2023',
        category: 'wedding',
        isVerified: true,
        isActive: true,
        order: 1,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Игорь Кузнецов',
        position: 'Бизнесмен',
        avatar: '/testimonials/igor-kuznetsov.jpg',
        text: 'Обратился в ателье для пошива делового костюма. Результат превзошел ожидания! Костюм сидит идеально, качество пошива и материалов на высоте. Отдельное спасибо Михаилу за профессиональные советы и внимание к деталям.',
        rating: 5,
        date: 'Апрель 2023',
        category: 'business',
        isVerified: true,
        isActive: true,
        order: 2,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Наталья Волкова',
        position: 'Постоянный клиент',
        avatar: '/testimonials/natalia-volkova.jpg',
        text: 'Привезла на ремонт любимое платье, которое долго лежало в шкафу из-за сломанной молнии и растянутого материала. Мастер Анна сделала невозможное - восстановила изделие так, что оно выглядит как новое! Быстро, качественно и за разумную цену.',
        rating: 4,
        date: 'Май 2023',
        category: 'repair',
        isVerified: true,
        isActive: true,
        order: 3,
      },
    }),
  ]);
  console.log('Добавлено отзывов:', testimonials.length);
  
  // Добавляем цены на услуги
  const prices = await Promise.all([
    prisma.price.create({
      data: {
        service: 'Пошив платья',
        price: 'от 15 000 ₽',
        description: 'Стоимость зависит от сложности модели и выбранных материалов',
        category: 'dresses',
        isActive: true,
        order: 1,
      },
    }),
    prisma.price.create({
      data: {
        service: 'Пошив мужского костюма',
        price: 'от 25 000 ₽',
        description: 'Включает пиджак и брюки',
        category: 'suits',
        isActive: true,
        order: 2,
      },
    }),
    prisma.price.create({
      data: {
        service: 'Замена молнии',
        price: 'от 800 ₽',
        description: 'Стоимость зависит от сложности работы и типа изделия',
        category: 'repair',
        isActive: true,
        order: 3,
      },
    }),
    prisma.price.create({
      data: {
        service: 'Подгонка по фигуре',
        price: 'от 1 500 ₽',
        description: 'Стоимость за одно изделие',
        category: 'alterations',
        isActive: true,
        order: 4,
      },
    }),
  ]);
  console.log('Добавлено цен на услуги:', prices.length);
  
  // Добавляем настройки сайта
  const settings = await Promise.all([
    prisma.settings.create({
      data: {
        key: 'company_name',
        value: 'DressCutur',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'company_phone',
        value: '+7 (495) 123-45-67',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'company_email',
        value: 'info@dresscutur.ru',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'working_hours',
        value: 'Пн-Пт: 10:00 - 20:00, Сб: 11:00 - 18:00, Вс: выходной',
      },
    }),
  ]);
  console.log('Добавлено настроек сайта:', settings.length);
  
  console.log('✅ База данных успешно заполнена тестовыми данными');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Закрываем соединение с базой данных
    await prisma.$disconnect();
  }); 