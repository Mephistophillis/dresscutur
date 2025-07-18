# Технический контекст DressCutur

## Используемые технологии ⚡ **[АКТУАЛИЗИРОВАНО]**

### Frontend Stack
- **Next.js 15.3.1**: React-фреймворк с SSR/SSG, App Router, Turbopack для разработки
- **React 19**: Новейшая версия с Server Components, улучшенным concurrent режимом
- **TypeScript**: Строгая статическая типизация для надежности кода
- **Tailwind CSS**: Утилитарный CSS-фреймворк с кастомной конфигурацией
- **Framer Motion 12.6.3**: Современная библиотека анимаций с оптимизацией производительности
- **React Intersection Observer**: Отслеживание видимости элементов для анимаций

### Backend & Database ⚡ **[ОБНОВЛЕНО]**
- **PostgreSQL**: Продукционная база данных для надежности и масштабируемости
- **Prisma ORM**: Современный ORM с полной TypeScript интеграцией
- **Server Actions**: Next.js 15 серверные действия вместо API routes
- **bcryptjs**: Безопасное хеширование паролей для админ-панели
- **Zod**: Строгая валидация схем данных на всех уровнях

### UI & Forms
- **Lucide React**: Современные SVG иконки
- **React Hook Form**: Производительное управление формами
- **@hookform/resolvers**: Интеграция с Zod валидаторами
- **Sonner**: Элегантные toast-уведомления
- **React Day Picker**: Современный компонент выбора даты

### Calendar & Scheduling
- **FullCalendar**: Полнофункциональный календарный компонент
- **React Big Calendar**: Дополнительный календарь для специфических задач
- **date-fns**: Современная библиотека для работы с датами
- **date-fns-tz**: Поддержка временных зон
- **moment**: Дополнительная работа с временем (legacy support)

### Development Tools
- **ESLint**: Современный линтер с строгими правилами
- **Autoprefixer**: Автоматические CSS префиксы
- **PostCSS**: Продвинутая обработка CSS
- **tsx**: Быстрое выполнение TypeScript скриптов
- **Turbopack**: Быстрая сборка для разработки

### Utilities & Helpers
- **class-variance-authority**: Типобезопасные CSS классы
- **tailwind-merge**: Умное объединение Tailwind классов
- **uuid**: Генерация уникальных идентификаторов
- **@types/uuid**: TypeScript типы для UUID

## Архитектура проекта

### Структура директорий ✅ **[АКТУАЛЬНАЯ]**
```
app/
├── actions/              # Server Actions
│   ├── admin/           # Административные действия
│   │   ├── auth.ts      # Аутентификация
│   │   ├── calendar/    # Календарные операции
│   │   ├── contacts-prisma.ts # Контакты
│   │   ├── fabrics-prisma.ts  # Ткани
│   │   ├── gallery-prisma.ts  # Галерея
│   │   ├── services-prisma.ts # Услуги
│   │   └── upload.ts    # Загрузка файлов
│   ├── public/          # Публичные действия
│   │   ├── booking-actions.ts # Бронирование
│   │   ├── fabrics.ts   # Публичные ткани
│   │   ├── gallery.ts   # Публичная галерея
│   │   └── services.ts  # Публичные услуги
│   └── calendar/        # Календарные действия
├── admin/               # Административная панель
│   ├── auth/           # Аутентификация админа
│   ├── components/     # Админ компоненты
│   │   ├── ui/         # UI компоненты админки
│   │   ├── forms/      # Формы админки
│   │   └── layout/     # Макет админки
│   ├── calendar/       # Админ календарь
│   ├── contacts/       # Управление контактами
│   ├── fabrics/        # Управление тканями
│   ├── gallery/        # Управление галереей
│   ├── services/       # Управление услугами
│   └── team/           # Управление командой
├── components/          # React компоненты
│   ├── layout/         # Компоненты макета
│   │   ├── Header.tsx  # Шапка сайта
│   │   ├── Footer.tsx  # Подвал сайта
│   │   └── Layout.tsx  # Общий макет
│   ├── sections/       # Секции страниц
│   │   ├── hero/       # Главная секция
│   │   ├── services/   # Секция услуг
│   │   ├── fabrics/    # Секция тканей
│   │   ├── gallery/    # Секция галереи
│   │   └── contact/    # Секция контактов
│   ├── ui/            # Базовые UI компоненты
│   └── calendar/      # Календарные компоненты
├── lib/                # Утилиты и конфигурация
│   ├── prisma.ts      # Prisma клиент
│   ├── db.ts          # Подключение к БД
│   ├── types.ts       # Типы TypeScript
│   └── utils.ts       # Вспомогательные функции
├── constants/          # Константы приложения
└── (routes)/          # Страницы приложения
    ├── page.tsx       # Главная страница
    ├── about/         # О нас
    ├── services/      # Услуги
    ├── fabrics/       # Ткани
    ├── gallery/       # Галерея
    ├── contact/       # Контакты
    └── booking/       # Бронирование
```

### Паттерны архитектуры ✅ **[СТАБИЛЬНО]**

#### Server Components по умолчанию
- Большинство компонентов - Server Components для производительности
- Client Components только для интерактивности ('use client')
- Оптимизированная загрузка и рендеринг

#### Server Actions для всех мутаций
- Все серверные операции через Server Actions
- Типизированные действия с Zod валидацией
- Четкое разделение на admin и public действия
- Безопасная обработка форм и данных

#### Композиция компонентов
- Переиспользуемые UI компоненты в `/ui`
- Секционная архитектура для страниц
- Четкое разделение ответственности
- Модульность и тестируемость

## Настройка разработки

### Скрипты package.json ✅ **[АКТУАЛЬНЫЕ]**
```json
{
  "dev": "next dev --turbopack",     // Разработка с Turbopack
  "build": "next build",             // Сборка продакшн
  "start": "next start",             // Запуск продакшн
  "lint": "next lint",               // Проверка кода
  "prisma:generate": "prisma generate", // Генерация Prisma клиента
  "prisma:studio": "prisma studio",     // GUI для БД
  "db:migrate": "prisma migrate dev",   // Миграции БД
  "db:push": "prisma db push",          // Пуш схемы в БД
  "db:seed": "tsx prisma/seed.ts",      // Заполнение БД
  "update-passwords": "tsx scripts/update-passwords.ts" // Обновление паролей
}
```

### Конфигурационные файлы ✅ **[НАСТРОЕНО]**

#### next.config.ts
- Настройки Next.js 15 приложения
- Конфигурация изображений и оптимизация
- Настройки сборки и производительности
- Турбопак для разработки

#### tailwind.config.js
- Кастомная конфигурация Tailwind CSS
- Цветовая палитра проекта DressCutur
- Расширения утилит и компонентов
- Адаптивные breakpoints

#### tsconfig.json
- Строгие настройки TypeScript
- Алиасы путей (~/app/...)
- Настройки для Next.js 15
- Поддержка JSX и React 19

#### prisma/schema.prisma ⚡ **[ОБНОВЛЕНО]**
- **PostgreSQL** провайдер вместо SQLite
- Модели данных для всех сущностей
- Связи между таблицами
- Индексы для производительности

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(EDITOR)
  // ...
}

model Service {
  id          String   @id @default(cuid())
  title       String
  description String
  // ...
}

model Fabric {
  id          String   @id @default(cuid())
  name        String
  description String
  // ...
}

model GalleryItem {
  id          String   @id @default(cuid())
  title       String
  image       String
  category    String
  // ...
}
```

## Технические ограничения

### Производительность ⚡ **[ПРИОРИТЕТ]**
- Оптимизация изображений через next/image
- Lazy loading для тяжелых компонентов
- Code splitting на уровне страниц
- Минимизация bundle size (~400KB → цель <300KB)
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1

### SEO требования ⚡ **[ТРЕБУЕТ ВНИМАНИЯ]**
- Server-side rendering для всех страниц
- Метаданные через Next.js 15 Metadata API
- Структурированные данные Schema.org
- Sitemap.xml и robots.txt
- Open Graph и Twitter Cards

### Безопасность ✅ **[НАСТРОЕНО]**
- Валидация всех входных данных через Zod
- Хеширование паролей через bcryptjs
- CSRF защита через Server Actions
- Санитизация пользовательского контента
- Безопасная работа с PostgreSQL

### Доступность ⚡ **[УЛУЧШАТЬ]**
- Семантическая HTML разметка
- ARIA атрибуты для интерактивных элементов
- Поддержка клавиатурной навигации
- Контрастность цветов по WCAG AA
- Альтернативные тексты для изображений

## Инструменты разработки

### База данных ✅ **[POSTGRESQL]**
- **Prisma Studio**: Визуальное управление данными
- **Migrations**: Версионирование схемы БД
- **Seed scripts**: Заполнение тестовыми данными
- **Connection pooling**: Оптимизация подключений

### Отладка и мониторинг
- **Next.js DevTools**: Встроенные инструменты разработки
- **React Developer Tools**: Отладка компонентов
- **TypeScript**: Строгая проверка типов
- **ESLint**: Качество кода
- **Vercel Analytics**: Мониторинг производительности

### Деплой ⚡ **[НАСТРОИТЬ]**
- **Vercel**: Основная платформа деплоя
- **PostgreSQL**: Managed database (Vercel Postgres / Railway)
- **Environment variables**: Конфигурация окружения
- **Automatic deployments**: Автоматический деплой из Git
- **Preview deployments**: Превью для Pull Requests

## Зависимости проекта

### Производственные зависимости
```json
{
  "next": "15.3.1",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@prisma/client": "^6.6.0",
  "framer-motion": "^12.6.3",
  "tailwind-merge": "^3.2.0",
  "zod": "^3.24.2",
  "bcryptjs": "^3.0.2",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.488.0",
  "sonner": "^2.0.3"
}
```

### Развитие зависимостей
```json
{
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "eslint": "^8",
  "eslint-config-next": "15.3.1",
  "postcss": "^8",
  "tailwindcss": "^3.4.1",
  "typescript": "^5",
  "tsx": "^4.7.1",
  "prisma": "^6.6.0"
}
```

## Производственная готовность

### Текущий статус (~85%)
- ✅ **Архитектура**: Стабильная и масштабируемая
- ✅ **Функционал**: Полностью реализован
- ⚡ **Производительность**: Требует оптимизации
- ⚡ **SEO**: Требует завершения
- ✅ **Безопасность**: Настроена должным образом

### Критические задачи к запуску
1. **SEO оптимизация**: Метаданные, sitemap, robots.txt
2. **Производительность**: Lighthouse 90+, оптимизация изображений
3. **Деплой настройка**: Environment variables, PostgreSQL
4. **Мониторинг**: Error tracking, analytics
5. **Backup**: Автоматическое резервное копирование

### Планы технического развития
- **Кеширование**: Redis для статических данных
- **CDN**: Cloudflare для статических ресурсов
- **Мониторинг**: Sentry для отслеживания ошибок
- **Аналитика**: Google Analytics 4
- **Тестирование**: Jest + Testing Library
