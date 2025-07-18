# План реализации административной панели для сайта DressCutur

## 1. Общая структура и архитектура [✅]

### 1.1. Основная структура [✅]

```
app/
├── admin/ [✅]
│   ├── page.tsx                # Главная страница админки (дашборд) [✅]
│   ├── layout.tsx              # Общий лейаут админки [✅]
│   ├── auth/                   # Аутентификация [✅]
│   │   └── page.tsx            # Страница входа [✅]
│   ├── services/               # Управление услугами [✅]
│   │   ├── page.tsx            # Список услуг [✅]
│   │   └── [id]/page.tsx       # Редактирование услуги [✅]
│   ├── fabrics/                # Управление тканями [✅]
│   │   ├── page.tsx            # Список тканей [✅]
│   │   └── [id]/page.tsx       # Редактирование ткани [✅]
│   ├── gallery/                # Управление галереей [✅]
│   │   ├── page.tsx            # Список работ [✅]
│   │   └── [id]/page.tsx       # Редактирование работы [✅]
│   ├── testimonials/           # Управление отзывами [✅]
│   │   ├── page.tsx            # Список отзывов [✅]
│   │   └── [id]/page.tsx       # Редактирование отзыва [✅]
│   ├── prices/                 # Управление ценами [✅]
│   │   └── page.tsx            # Страница управления ценами [✅]
│   ├── faqs/                   # Управление FAQ
│   │   ├── page.tsx            # Список FAQ
│   │   └── [id]/page.tsx       # Редактирование FAQ
│   ├── contacts/               # Управление заявками
│   │   ├── page.tsx            # Список заявок
│   │   └── [id]/page.tsx       # Просмотр заявки
│   ├── settings/               # Общие настройки
│   │   └── page.tsx            # Настройки сайта
│   └── components/             # Компоненты админки [✅]
│       ├── ui/                 # UI компоненты [✅]
│       ├── forms/              # Формы для создания/редактирования [🔄]
│       └── layout/             # Компоненты лейаута [✅]
└── actions/                    # Server Actions [✅]
    └── admin/                  # Server Actions для админки [✅]
        ├── auth.ts             # Аутентификация [✅]
        ├── services.ts         # CRUD операции для услуг [✅]
        ├── fabrics.ts          # CRUD операции для тканей [✅]
        ├── gallery.ts          # CRUD операции для галереи [✅]
        ├── testimonials.ts     # CRUD операции для отзывов
        ├── prices.ts           # CRUD операции для цен
        ├── faqs.ts             # CRUD операции для FAQ
        └── contacts.ts         # CRUD операции для заявок
```

### 1.2. Технологии и библиотеки [✅]

- **Next.js 15** - основа приложения [✅]
- **React** - UI библиотека [✅]
- **Next Auth** - система аутентификации [✅]
- **Server Actions** - серверные функции для обработки данных [✅]
- **Prisma** - ORM для работы с базой данных [✅]
- **PostgreSQL** - база данных [✅]
- **Tailwind CSS** - стилизация [✅]
- **ShadcnUI** - готовые компоненты UI [✅]
- **React Hook Form** - управление формами [✅]
- **Zod** - валидация данных [✅]
- **useOptimistic** - оптимистичные обновления для улучшения UX [✅]
- **Uploadthing** - загрузка файлов [🔄]
- **Framer Motion** - анимации [🔄]

## 2. Сущности для управления (CRUD) [✅]

### 2.1. Услуги (Services) [✅]
- **Поля**: 
  - id: unique identifier
  - title: название услуги
  - description: описание услуги
  - icon: иконка услуги (SVG или URL)
  - image: изображение услуги
  - isActive: активна ли услуга
  - order: порядок отображения
  - createdAt: дата создания
  - updatedAt: дата обновления

### 2.2. Ткани (Fabrics) [✅]
- **Поля**:
  - id: unique identifier
  - name: название ткани
  - description: описание ткани
  - image: основное изображение
  - category: категория (natural, synthetic, mixed, lining)
  - purpose: назначение (массив: dress, blouse, suit и т.д.)
  - colors: доступные цвета (массив цветовых кодов)
  - price: цена за метр
  - properties: свойства (массив: мягкий, блестящий и т.д.)
  - details: детальная информация
    - composition: состав
    - width: ширина
    - weight: плотность
    - care: правила ухода (массив)
    - origin: страна происхождения
    - description: расширенное описание
  - gallery: галерея изображений (массив URL)
  - recommendations: рекомендации по использованию (массив)
  - isActive: активна ли ткань
  - order: порядок отображения
  - createdAt: дата создания
  - updatedAt: дата обновления

### 2.3. Галерея работ (Gallery) [✅]
- **Поля**:
  - id: unique identifier
  - src: URL изображения
  - alt: альтернативный текст
  - category: категория (wedding, suits, evening и т.д.)
  - description: описание работы
  - isNew: новая работа (для выделения)
  - details: детальная информация
    - client: информация о клиенте
    - materials: использованные материалы
    - date: дата создания работы
    - process: описание процесса
  - relatedImages: связанные изображения
  - order: порядок отображения
  - isActive: активна ли запись
  - createdAt: дата создания записи
  - updatedAt: дата обновления записи

### 2.4. Отзывы (Testimonials) [✅]
- **Поля**:
  - id: unique identifier
  - name: имя клиента
  - position: статус (постоянный клиент, невеста и т.д.)
  - avatar: фотография клиента
  - text: текст отзыва
  - rating: оценка (1-5)
  - date: дата отзыва
  - category: категория (individual, repair, home и т.д.)
  - isVerified: проверен ли отзыв
  - isActive: отображать ли отзыв
  - order: порядок отображения
  - createdAt: дата создания записи
  - updatedAt: дата обновления записи

### 2.5. Цены (Prices) [✅]
- **Поля**:
  - id: unique identifier
  - service: название услуги
  - price: стоимость (с указанием "от")
  - description: дополнительное описание
  - category: категория услуги
  - isActive: активна ли цена
  - order: порядок отображения
  - createdAt: дата создания
  - updatedAt: дата обновления

### 2.6. FAQ (Frequently Asked Questions) [✅]
- **Поля**:
  - id: unique identifier
  - category: категория (general, workflow, pricing и т.д.)
  - title: заголовок категории
  - question: вопрос
  - answer: ответ
  - helpful: количество "полезных" оценок
  - notHelpful: количество "неполезных" оценок
  - isActive: активен ли вопрос
  - order: порядок отображения
  - createdAt: дата создания
  - updatedAt: дата обновления

### 2.7. Контактные заявки (Contacts) [✅]
- **Поля**:
  - id: unique identifier
  - name: имя клиента
  - email: email клиента
  - phone: телефон клиента
  - subject: тема обращения
  - message: текст сообщения
  - status: статус обработки (new, inProgress, completed, canceled)
  - assignedTo: ответственный сотрудник
  - notes: внутренние заметки
  - fileAttachment: прикрепленный файл
  - createdAt: дата создания
  - updatedAt: дата обновления

### 2.8. Пользователи админки (Users) [✅]
- **Поля**:
  - id: unique identifier
  - name: имя пользователя
  - email: email пользователя
  - password: хешированный пароль
  - role: роль (admin, editor)
  - isActive: активен ли пользователь
  - lastLogin: дата последнего входа
  - createdAt: дата создания
  - updatedAt: дата обновления

## 3. Функциональность админ-панели с использованием Server Actions [🔄]

### 3.1. Аутентификация и авторизация [✅]
- Серверные функции для входа/выхода с использованием Next Auth [✅]
- Защита маршрутов от неавторизованного доступа через middleware [✅]
- Управление ролями (админ, редактор) [✅]
- Восстановление пароля через серверные функции [🔄]

### 3.2. Дашборд [✅]
- Серверный компонент для отображения статистики и активности [✅]
- Server Actions для получения данных для графиков и диаграмм [✅]
- Обновление данных в реальном времени с помощью streaming и Suspense [🔄]

### 3.3. Управление услугами [✅]
- Server Component для рендеринга списка услуг с начальными данными [✅]
- Server Actions для: [✅]
  - Создания новой услуги [✅]
  - Обновления существующей услуги [✅]
  - Изменения порядка отображения услуг [✅]
  - Активации/деактивации услуги [✅]
  - Удаления услуги [✅]
- Client Components для взаимодействия с формами и drag-n-drop [✅]
- Оптимистичные обновления с useOptimistic для мгновенной обратной связи [✅]

### 3.4. Управление тканями [✅]
- Server Component для отображения списка тканей с фильтрацией [✅]
- Server Actions для: [✅]
  - Создания новой ткани [✅]
  - Обновления существующей ткани [✅] 
  - Загрузки и управления изображениями ткани [✅]
  - Изменения порядка отображения тканей [✅]
  - Активации/деактивации ткани [✅]
  - Удаления ткани [✅]
- Client Components для интерактивных фильтров и предпросмотра изображений [✅]
- Оптимистичные обновления для улучшения пользовательского опыта [✅]

### 3.5. Управление галереей [✅]
- Server Component для рендеринга галереи с категориями [✅]
- Server Actions для: [✅]
  - Создания новой записи в галерее [✅]
  - Редактирования существующей записи [✅]
  - Загрузки и управления изображениями [✅]
  - Назначения категорий [✅]
  - Изменения порядка отображения работ [✅]
  - Активации/деактивации записи [✅]
  - Удаления записи [✅]
- Интерактивные компоненты для предпросмотра и кадрирования изображений [🔄]

### 3.6. Управление отзывами [✅]
- Server Component для рендеринга отзывов с фильтрацией [✅]
- Server Actions для:
  - Добавления нового отзыва [🔄]
  - Редактирования существующего отзыва [🔄]
  - Модерации отзывов (подтверждение/отклонение) [🔄]
  - Изменения порядка отображения отзывов [🔄]
  - Активации/деактивации отзыва [🔄]
  - Удаления отзыва [🔄]
- Client Components для фильтрации и сортировки [✅]

### 3.7. Управление ценами [✅]
- Server Component для списка цен [✅]
- Server Actions для:
  - Добавления новой цены [🔄]
  - Редактирования существующей цены [🔄]
  - Изменения порядка отображения цен [🔄]
  - Активации/деактивации цены [🔄]
  - Удаления цены [🔄]
- Оптимистичные обновления для мгновенного отражения изменений в UI [🔄]

### 3.8. Управление FAQ
- Server Component для рендеринга FAQ с группировкой по категориям
- Server Actions для:
  - Добавления нового вопроса/ответа
  - Редактирования существующего вопроса/ответа
  - Изменения порядка отображения вопросов
  - Активации/деактивации вопроса
  - Удаления вопроса
- Client Components для эффекта аккордеона и перетаскивания (drag-n-drop)

### 3.9. Управление контактными заявками
- Server Component для рендеринга списка заявок
- Server Actions для:
  - Получения детальной информации о заявке
  - Изменения статуса заявки
  - Добавления внутренних заметок
  - Назначения ответственного
  - Экспорта данных заявок
  - Архивирования заявок
- Реализация уведомлений о новых заявках

### 3.10. Настройки
- Server Component для отображения настроек
- Server Actions для:
  - Управления пользователями админки
  - Обновления общих настроек сайта
  - Настройки SEO (метатеги, OG-теги)
  - Управления бэкапами данных
- Формы с валидацией на стороне сервера

## 4. Дизайн и UI [🔄]

### 4.1. Лейаут админки [✅]
- Серверный компонент для рендеринга базового лейаута [✅]
- Динамические клиентские компоненты для интерактивных элементов [✅]
- Боковое меню с разделами и активным состоянием [✅]
- Верхняя панель с поиском, уведомлениями и профилем [✅]
- Хлебные крошки для навигации [🔄]
- Адаптивный дизайн для планшетов и мобильных устройств [✅]

### 4.2. Компоненты пользовательского интерфейса [🔄]
- Таблицы данных с серверной сортировкой и клиентской фильтрацией [✅]
- Формы с использованием React Hook Form и серверной валидацией через Zod [✅]
- Модальные окна для быстрых действий [✅]
- Индикаторы загрузки с использованием Suspense [✅]
- Уведомления о результатах операций [✅]
- Drag-n-drop интерфейс с клиентскими компонентами и серверными действиями [🔄]
- Предпросмотр загружаемых изображений [🔄]
- Компоненты для отображения статистики [✅]
- Компоненты для отображения пустого состояния [✅]

## 5. Server Actions и работа с данными [✅]

### 5.1. Server Actions вместо REST API [✅]
- Реализация Server Actions для каждой сущности (CRUD операции) [🔄]
- Типизация входных и выходных данных с использованием TypeScript [✅]
- Валидация входящих данных с помощью Zod [✅]
- Обработка ошибок с возвратом понятных сообщений [✅]

### 5.2. Безопасность [✅]
- Защита Server Actions с помощью серверной аутентификации и авторизации [✅]
- Защита от CSRF атак (встроенная в Server Actions) [✅]
- Защита от XSS атак [✅]
- Проверка прав доступа для всех действий [✅]

### 5.3. Оптимизация производительности [🔄]
- Использование Suspense для загрузки данных
- Оптимистичные обновления с useOptimistic
- Прогрессивное улучшение с постепенной загрузкой данных
- Параллельные маршруты для одновременной загрузки разных частей страницы

### 5.4. Загрузка файлов [🔄]
- Интеграция с сервисом загрузки файлов (Uploadthing)
- Server Actions для обработки загруженных файлов
- Оптимизация изображений на сервере
- Проверка типов файлов и ограничение размеров
- Загрузка нескольких файлов с предпросмотром

## 6. База данных [✅]

### 6.1. Схема данных [✅]
- Определение моделей данных с помощью Prisma [✅]
- Настройка связей между таблицами [✅]
- Индексы для оптимизации запросов [✅]
- Валидация данных на уровне схемы [✅]

### 6.2. Миграции [✅]
- Создание начальной схемы базы данных [✅]
- Управление миграциями при изменении схемы [✅]
- Сидинг тестовых данных [✅]

## 7. Поэтапный план разработки с учетом Server Actions [🔄]

### Этап 1: Настройка проекта и авторизация [✅]
1. Установка необходимых зависимостей [✅]
2. Настройка Prisma и подключение к базе данных [✅]
3. Создание базовых моделей данных [✅]
4. Реализация системы аутентификации с Next Auth и Server Actions [✅]
5. Создание базового лейаута админки с Server Components [✅]

### Этап 2: Реализация CRUD операций с Server Actions [🔄]
1. Разработка Server Actions для управления услугами [✅]
2. Разработка Server Actions для управления тканями [🔄]
3. Разработка Server Actions для управления галереей
4. Разработка Server Actions для управления отзывами
5. Разработка Server Actions для управления FAQ

### Этап 3: Разработка пользовательского интерфейса [🔄]
1. Создание клиентских компонентов для взаимодействия с формами [✅]
2. Реализация оптимистичных обновлений с useOptimistic [✅]
3. Разработка компонентов для фильтрации и сортировки [🔄]
4. Интеграция Drag-n-Drop для изменения порядка элементов [🔄]

### Этап 4: Дополнительная функциональность
1. Разработка Server Actions для управления контактными заявками
2. Разработка Server Actions для управления ценами
3. Реализация дашборда с использованием Suspense и streaming
4. Интеграция загрузки и управления файлами

### Этап 5: Оптимизация и тестирование
1. Оптимизация запросов к базе данных
2. Реализация кэширования данных с использованием fetch и Next.js кэширования
3. Тестирование всех функций администратора
4. Проверка безопасности и исправление уязвимостей

### Этап 6: Интеграция и запуск
1. Интеграция админки с фронтендом сайта
2. Настройка деплоя и окружения
3. Финальное тестирование
4. Создание документации для администраторов

## 8. Дополнительные возможности для будущего развития

### 8.1. Календарь событий [🔄]

#### Общее описание
Календарь событий в административной панели позволит управлять расписанием работы ателье, включая примерки, консультации, сроки выполнения заказов и другие важные даты.

#### Необходимые компоненты для реализации [🔄]
1. **Модель данных для событий**
   - id: уникальный идентификатор
   - title: название события
   - description: описание события
   - startDate: дата и время начала
   - endDate: дата и время окончания
   - category: категория события (примерка, консультация, крайний срок и т.д.)
   - clientId: связь с клиентом (если применимо)
   - assignedTo: ответственный сотрудник
   - location: место проведения
   - status: статус (запланировано, в процессе, завершено, отменено)
   - color: цвет события для отображения в календаре
   - isAllDay: флаг полнодневного события
   - recurrence: правила повторения (для регулярных событий)
   - reminders: напоминания (за сколько времени)
   - notes: дополнительные заметки
   - createdAt: дата создания
   - updatedAt: дата обновления

2. **UI компоненты**
   - Месячный вид календаря
   - Недельный вид календаря
   - Дневной вид календаря
   - Модальное окно для создания/редактирования события
   - Компонент для drag-n-drop перемещения событий
   - Компонент фильтрации событий по категории/статусу
   - Компонент для настройки повторяющихся событий
   - Виджет предстоящих событий для дашборда

3. **Server Actions для работы с календарем**
   - Получение событий за период
   - Создание нового события
   - Обновление существующего события
   - Перемещение события (изменение даты/времени)
   - Изменение продолжительности события
   - Удаление события
   - Настройка повторяющихся событий
   - Экспорт/импорт событий (iCal)

4. **Интеграции**
   - Синхронизация с Google Calendar/Outlook
   - Интеграция с системой уведомлений (email, SMS)
   - Связь с клиентской частью сайта (для отображения занятых дат)
   - Интеграция с CRM (если применимо)

#### Технологии и библиотеки
- React для UI компонентов
- @fullcalendar/react для основы календаря
- Prisma для работы с базой данных
- Server Actions для серверных операций
- React Hook Form для форм создания/редактирования событий
- Zod для валидации данных
- node-ical для работы с iCal форматом
- Next.js API Routes для интеграций с внешними календарями

#### Этапы реализации
1. **Этап 1: Основа календаря**
   - Создание модели данных в Prisma
   - Базовый UI календаря с месячным/недельным/дневным видом
   - Server Actions для CRUD операций с событиями

2. **Этап 2: Расширенная функциональность**
   - Drag-n-drop для перемещения событий
   - Изменение размера событий
   - Повторяющиеся события
   - Фильтрация и категоризация

3. **Этап 3: Интеграции и уведомления**
   - Синхронизация с внешними календарями
   - Система напоминаний и уведомлений
   - Экспорт/импорт в формате iCal

4. **Этап 4: Оптимизация и интеграция с сайтом**
   - Интеграция виджета календаря в дашборд
   - ✅ Отображение занятых дат на сайте
   - Оптимизация производительности

### 8.2. Другие возможности для будущего развития

1. **Аналитика и отчеты с использованием Server Components**
   - Рендеринг статистики на сервере для оптимальной производительности
   - Интерактивные дашборды с React Server Components
   - Экспорт данных с использованием Server Actions

2. **Многоязычность с Next.js i18n**
   - Управление контентом на разных языках через Server Actions
   - Серверная локализация с переключением языка интерфейса админки

3. **Расширенное управление медиа с Server Components**
   - Библиотека медиафайлов с серверной фильтрацией
   - Редактор изображений с Server Actions для сохранения изменений

4. **Маркетинговые инструменты с Server Actions**
   - Управление акциями и спецпредложениями
   - Server-side A/B тестирование элементов интерфейса

5. **Интеграция с внешними сервисами через Server Actions**
   - Безопасное взаимодействие с API внешних сервисов на сервере
   - Интеграция с системами аналитики (Google Analytics, Яндекс.Метрика)
   - Безопасная обработка платежей на сервере 