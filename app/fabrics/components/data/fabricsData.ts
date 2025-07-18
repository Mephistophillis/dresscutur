import { Fabric } from '../../../lib/types';

export const fabricsData: Fabric[] = [
  {
    id: 1,
    name: 'Шелк натуральный',
    description: 'Роскошная и гладкая ткань с характерным блеском, идеально подходит для вечерних платьев и блуз.',
    image: '/images/fabrics/silk.jpg',
    category: 'natural',
    purpose: ['dress', 'blouse'],
    colors: ['#F3E5D8', '#E5D8F3', '#D8E5F3', '#F3D8E5'],
    price: 3800,
    properties: ['Мягкий', 'Блестящий', 'Легкий'],
    details: {
      composition: '100% шелк',
      width: 140,
      weight: 80,
      care: [
        'Ручная стирка при температуре 30°C',
        'Сушить в расправленном виде',
        'Гладить при низкой температуре'
      ],
      origin: 'Италия',
      description: 'Натуральный шелк высшего качества с характерным мягким блеском. Идеально драпируется, создавая изысканные складки и формы. Прекрасно подходит для вечерних и праздничных нарядов.'
    },
    gallery: [
      '/images/fabrics/silk.jpg',
      '/images/fabrics/silk_detail_1.jpg',
      '/images/fabrics/silk_detail_2.jpg'
    ],
    recommendations: [
      'Вечерние платья',
      'Блузы',
      'Праздничные наряды'
    ]
  },
  {
    id: 2,
    name: 'Хлопок премиум',
    description: 'Мягкая и дышащая ткань, отлично подходит для повседневной одежды и летних нарядов.',
    image: '/images/fabrics/cotton.jpg',
    category: 'natural',
    purpose: ['dress', 'shirt', 'casual'],
    colors: ['#E5EFF3', '#F3F3E5', '#ECE5F3', '#F3ECE5', '#E5F3EC'],
    price: 1200,
    properties: ['Дышащий', 'Натуральный', 'Комфортный'],
    details: {
      composition: '100% хлопок',
      width: 150,
      weight: 180,
      care: [
        'Машинная стирка при температуре 40°C',
        'Можно сушить в машине',
        'Гладить при средней температуре'
      ],
      origin: 'Египет',
      description: 'Премиальный египетский хлопок с длинным волокном, обеспечивающим исключительную мягкость и долговечность. Идеально подходит для создания комфортной повседневной одежды.'
    },
    gallery: [
      '/images/fabrics/cotton.jpg',
      '/images/fabrics/cotton_detail_1.jpg',
      '/images/fabrics/cotton_detail_2.jpg'
    ],
    recommendations: [
      'Летние платья',
      'Рубашки',
      'Блузы',
      'Детская одежда'
    ]
  },
  {
    id: 3,
    name: 'Шерсть меринос',
    description: 'Теплая и прочная ткань, прекрасно сохраняет форму, идеальна для деловых костюмов и пальто.',
    image: '/images/fabrics/wool.jpg',
    category: 'natural',
    purpose: ['suit', 'outerwear'],
    colors: ['#F3E9E5', '#E5E9F3', '#E9E5F3', '#F3E5E9'],
    price: 2800,
    properties: ['Теплый', 'Эластичный', 'Прочный'],
    details: {
      composition: '100% шерсть мериноса',
      width: 150,
      weight: 300,
      care: [
        'Только сухая чистка',
        'Не стирать в воде',
        'Гладить через влажную ткань'
      ],
      origin: 'Австралия',
      description: 'Высококачественная шерсть мериноса, известная своей исключительной мягкостью и теплоизоляционными свойствами. Идеально подходит для создания элегантных костюмов и пальто.'
    },
    gallery: [
      '/images/fabrics/wool.jpg',
      '/images/fabrics/wool_detail_1.jpg',
      '/images/fabrics/wool_detail_2.jpg'
    ],
    recommendations: [
      'Деловые костюмы',
      'Пальто',
      'Жакеты',
      'Брюки'
    ]
  },
  {
    id: 4,
    name: 'Лен премиум',
    description: 'Прочная дышащая ткань с характерной текстурой, отлично подходит для летней одежды.',
    image: '/images/fabrics/linen.jpg',
    category: 'natural',
    purpose: ['dress', 'casual', 'shirt'],
    colors: ['#E9F3E5', '#F3F3E5', '#E5F3F3', '#F3E5E5'],
    price: 1800,
    properties: ['Дышащий', 'Прохладный', 'Экологичный'],
    details: {
      composition: '100% лен',
      width: 145,
      weight: 200,
      care: [
        'Машинная стирка при температуре 40°C',
        'Не отбеливать',
        'Гладить при высокой температуре'
      ],
      origin: 'Ирландия',
      description: 'Высококачественный ирландский лен с характерной текстурой и натуральными свойствами. Идеально подходит для создания летней одежды, обеспечивая комфорт даже в жаркую погоду.'
    },
    gallery: [
      '/images/fabrics/linen.jpg',
      '/images/fabrics/linen_detail_1.jpg',
      '/images/fabrics/linen_detail_2.jpg'
    ],
    recommendations: [
      'Летние платья',
      'Рубашки',
      'Брюки',
      'Сарафаны'
    ]
  },
  {
    id: 5,
    name: 'Кашемир',
    description: 'Роскошная мягкая ткань, создающая ощущение тепла и комфорта, идеальна для премиум-изделий.',
    image: '/images/fabrics/cashmere.jpg',
    category: 'natural',
    purpose: ['outerwear', 'suit'],
    colors: ['#F3E5EC', '#E5ECF3', '#ECF3E5', '#F3ECE5'],
    price: 4800,
    properties: ['Ультрамягкий', 'Теплый', 'Роскошный'],
    details: {
      composition: '100% кашемир',
      width: 150,
      weight: 250,
      care: [
        'Только ручная стирка',
        'Сушить в горизонтальном положении',
        'Гладить при минимальной температуре'
      ],
      origin: 'Монголия',
      description: 'Исключительно мягкий и теплый кашемир премиум-класса. Изделия из этой ткани отличаются непревзойденным комфортом и элегантностью.'
    },
    gallery: [
      '/images/fabrics/cashmere.jpg',
      '/images/fabrics/cashmere_detail_1.jpg',
      '/images/fabrics/cashmere_detail_2.jpg'
    ],
    recommendations: [
      'Шарфы',
      'Кардиганы',
      'Премиум пальто',
      'Джемперы'
    ]
  },
  {
    id: 6,
    name: 'Твид',
    description: 'Фактурная шерстяная ткань с характерным узором, отлично подходит для пиджаков и верхней одежды.',
    image: '/images/fabrics/tweed.jpg',
    category: 'natural',
    purpose: ['suit', 'outerwear'],
    colors: ['#E5F3EC', '#F3E5E5', '#E5E5F3', '#F3F3E5'],
    price: 3200,
    properties: ['Фактурный', 'Износостойкий', 'Классический'],
    details: {
      composition: '90% шерсть, 10% полиамид',
      width: 150,
      weight: 350,
      care: [
        'Только сухая чистка',
        'Не стирать',
        'Гладить через влажную ткань'
      ],
      origin: 'Шотландия',
      description: 'Аутентичный шотландский твид с характерным фактурным переплетением. Идеален для создания классических пиджаков и пальто, отличается высокой износостойкостью и теплоизоляцией.'
    },
    gallery: [
      '/images/fabrics/tweed.jpg',
      '/images/fabrics/tweed_detail_1.jpg',
      '/images/fabrics/tweed_detail_2.jpg'
    ],
    recommendations: [
      'Пиджаки',
      'Жакеты',
      'Пальто',
      'Костюмы'
    ]
  },
  {
    id: 7,
    name: 'Вискоза',
    description: 'Мягкая и струящаяся ткань, по своим свойствам напоминающая натуральный шелк.',
    image: '/images/fabrics/viscose.jpg',
    category: 'synthetic',
    purpose: ['dress', 'blouse'],
    colors: ['#E5F3F3', '#F3E5F3', '#F3F3E5', '#E5E5F3'],
    price: 980,
    properties: ['Струящийся', 'Легкий', 'Блестящий'],
    details: {
      composition: '100% вискоза',
      width: 145,
      weight: 120,
      care: [
        'Ручная стирка при температуре 30°C',
        'Не отжимать',
        'Сушить в расправленном виде'
      ],
      origin: 'Индия',
      description: 'Мягкая и элегантная вискоза с шелковистым блеском. Отлично драпируется, обеспечивая красивый силуэт. Идеально подходит для летних платьев и блуз.'
    },
    gallery: [
      '/images/fabrics/viscose.jpg',
      '/images/fabrics/viscose_detail_1.jpg',
      '/images/fabrics/viscose_detail_2.jpg'
    ],
    recommendations: [
      'Летние платья',
      'Блузы',
      'Сарафаны',
      'Юбки'
    ]
  },
  {
    id: 8,
    name: 'Хлопок с эластаном',
    description: 'Комфортная ткань с добавлением эластана для лучшей посадки по фигуре.',
    image: '/images/fabrics/cotton_elastane.jpg',
    category: 'mixed',
    purpose: ['dress', 'casual', 'suit'],
    colors: ['#F3F3E5', '#E5F3F3', '#F3E5F3', '#E5F3E5'],
    price: 1500,
    properties: ['Эластичный', 'Комфортный', 'Практичный'],
    details: {
      composition: '97% хлопок, 3% эластан',
      width: 150,
      weight: 200,
      care: [
        'Машинная стирка при температуре 40°C',
        'Не отбеливать',
        'Гладить при средней температуре'
      ],
      origin: 'Турция',
      description: 'Высококачественный хлопок с добавлением эластана для идеальной посадки по фигуре. Сохраняет все преимущества натурального хлопка, при этом обеспечивая дополнительную эластичность.'
    },
    gallery: [
      '/images/fabrics/cotton_elastane.jpg',
      '/images/fabrics/cotton_elastane_detail_1.jpg',
      '/images/fabrics/cotton_elastane_detail_2.jpg'
    ],
    recommendations: [
      'Брюки',
      'Юбки-карандаш',
      'Платья по фигуре',
      'Джинсы'
    ]
  },
  {
    id: 9,
    name: 'Кружево',
    description: 'Изысканная ажурная ткань для создания романтичных и нарядных изделий.',
    image: '/images/fabrics/lace.jpg',
    category: 'special',
    purpose: ['dress', 'blouse'],
    colors: ['#FFFFFF', '#F3E5E5', '#E5E5F3', '#E5F3E5'],
    price: 3500,
    properties: ['Ажурный', 'Романтичный', 'Нарядный'],
    details: {
      composition: '70% хлопок, 30% полиамид',
      width: 140,
      weight: 90,
      care: [
        'Только ручная стирка',
        'Не отжимать',
        'Сушить в расправленном виде'
      ],
      origin: 'Франция',
      description: 'Изысканное французское кружево с тонким ажурным узором. Идеально подходит для создания романтичных и нарядных элементов одежды.'
    },
    gallery: [
      '/images/fabrics/lace.jpg',
      '/images/fabrics/lace_detail_1.jpg',
      '/images/fabrics/lace_detail_2.jpg'
    ],
    recommendations: [
      'Вечерние платья',
      'Свадебные платья',
      'Блузы',
      'Декоративные элементы'
    ]
  },
  {
    id: 10,
    name: 'Бархат',
    description: 'Роскошная ткань с мягким коротким ворсом, создающая эффект глубины и богатства.',
    image: '/images/fabrics/velvet.jpg',
    category: 'special',
    purpose: ['dress', 'outerwear'],
    colors: ['#2A2A2A', '#7D2C3B', '#2C4B7D', '#2C7D4B'],
    price: 2800,
    properties: ['Роскошный', 'Мягкий', 'Теплый'],
    details: {
      composition: '80% вискоза, 20% шелк',
      width: 140,
      weight: 300,
      care: [
        'Только сухая чистка',
        'Не стирать',
        'Не гладить'
      ],
      origin: 'Италия',
      description: 'Роскошный итальянский бархат с глубоким насыщенным цветом и мягким ворсом. Придает изделиям изысканный и дорогой вид.'
    },
    gallery: [
      '/images/fabrics/velvet.jpg',
      '/images/fabrics/velvet_detail_1.jpg',
      '/images/fabrics/velvet_detail_2.jpg'
    ],
    recommendations: [
      'Вечерние платья',
      'Жакеты',
      'Аксессуары',
      'Декоративные элементы'
    ]
  },
  {
    id: 11,
    name: 'Подкладочная ткань',
    description: 'Гладкая и прочная ткань для внутренней отделки изделий.',
    image: '/images/fabrics/lining.jpg',
    category: 'lining',
    purpose: ['lining'],
    colors: ['#E5E5E5', '#2A2A2A', '#7D2C3B', '#2C4B7D', '#2C7D4B'],
    price: 650,
    properties: ['Гладкий', 'Прочный', 'Скользящий'],
    details: {
      composition: '100% полиэстер',
      width: 150,
      weight: 80,
      care: [
        'Машинная стирка при температуре 30°C',
        'Не отбеливать',
        'Гладить при низкой температуре'
      ],
      origin: 'Китай',
      description: 'Качественная подкладочная ткань с гладкой поверхностью. Обеспечивает комфорт при носке и продлевает срок службы основного изделия.'
    },
    gallery: [
      '/images/fabrics/lining.jpg',
      '/images/fabrics/lining_detail_1.jpg',
      '/images/fabrics/lining_detail_2.jpg'
    ],
    recommendations: [
      'Подкладка для платьев',
      'Подкладка для костюмов',
      'Подкладка для верхней одежды'
    ]
  },
  {
    id: 12,
    name: 'Шифон',
    description: 'Легкая полупрозрачная ткань с мягким драпированием для воздушных изделий.',
    image: '/images/fabrics/chiffon.jpg',
    category: 'synthetic',
    purpose: ['dress', 'blouse'],
    colors: ['#FFFFFF', '#F3E5E5', '#E5E5F3', '#E5F3E5', '#F3F3E5'],
    price: 1200,
    properties: ['Прозрачный', 'Легкий', 'Струящийся'],
    details: {
      composition: '100% полиэстер',
      width: 145,
      weight: 50,
      care: [
        'Ручная стирка при температуре 30°C',
        'Не отжимать',
        'Гладить при низкой температуре'
      ],
      origin: 'Япония',
      description: 'Невесомый полупрозрачный шифон с мягким драпированием. Идеален для создания воздушных и романтичных образов.'
    },
    gallery: [
      '/images/fabrics/chiffon.jpg',
      '/images/fabrics/chiffon_detail_1.jpg',
      '/images/fabrics/chiffon_detail_2.jpg'
    ],
    recommendations: [
      'Вечерние платья',
      'Блузы',
      'Шарфы',
      'Декоративные элементы'
    ]
  }
]; 