# Системные паттерны DressCutur

## Архитектура системы

### Общая архитектура
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side    │    │    Database     │
│                 │    │                  │    │                 │
│ React Components│◄──►│ Server Actions   │◄──►│ Prisma + SQLite │
│ Framer Motion   │    │ Next.js App      │    │ Migrations      │
│ Tailwind CSS    │    │ TypeScript       │    │ Seed Data       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Ключевые архитектурные решения

#### 1. App Router Architecture (Next.js 15)
- Файловая система маршрутизации в `/app`
- Server Components по умолчанию
- Client Components только при необходимости
- Nested layouts для общих элементов

#### 2. Server Actions Pattern
```typescript
// Паттерн Server Action
'use server'

export async function createService(formData: FormData) {
  const validatedData = serviceSchema.parse({
    name: formData.get('name'),
    description: formData.get('description')
  });
  
  return await prisma.service.create({
    data: validatedData
  });
}
```

#### 3. Component Composition Pattern
```
components/
├── ui/              # Базовые UI компоненты
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── layout/          # Компоненты макета
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
└── sections/        # Секции страниц
    ├── hero/
    ├── services/
    └── gallery/
```

## Паттерны данных

### 1. Prisma Schema Pattern
```prisma
model Service {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. Type-Safe Data Flow
```typescript
// 1. Zod Schema для валидации
const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  price: z.number().positive().optional()
});

// 2. TypeScript типы из Prisma
type Service = Prisma.Service;

// 3. Server Action с валидацией
export async function updateService(id: string, data: unknown) {
  const validated = serviceSchema.parse(data);
  return await prisma.service.update({
    where: { id },
    data: validated
  });
}
```

### 3. Data Fetching Pattern
```typescript
// Server Component - прямое обращение к БД
export default async function ServicesPage() {
  const services = await getActiveServices();
  return <ServicesList services={services} />;
}

// Server Action для получения данных
export async function getActiveServices() {
  return await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
}
```

## UI/UX паттерны

### 1. Animation Pattern (Framer Motion)
```typescript
// Базовый паттерн анимации появления
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Использование в компонентах
<motion.div {...fadeInUp}>
  <ServiceCard />
</motion.div>
```

### 2. Responsive Design Pattern
```typescript
// Tailwind responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {services.map(service => (
    <ServiceCard key={service.id} service={service} />
  ))}
</div>
```

### 3. Form Handling Pattern
```typescript
// React Hook Form + Zod
const form = useForm<ServiceFormData>({
  resolver: zodResolver(serviceSchema),
  defaultValues: {
    name: '',
    description: '',
    price: undefined
  }
});

const onSubmit = async (data: ServiceFormData) => {
  const result = await createService(data);
  if (result.success) {
    toast.success('Услуга создана');
    form.reset();
  }
};
```

## Безопасность и валидация

### 1. Input Validation Pattern
```typescript
// Многоуровневая валидация
export async function createService(formData: FormData) {
  // 1. Парсинг FormData
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description')
  };
  
  // 2. Zod валидация
  const validatedData = serviceSchema.parse(rawData);
  
  // 3. Дополнительная бизнес-логика валидация
  if (await serviceExists(validatedData.name)) {
    throw new Error('Услуга уже существует');
  }
  
  // 4. Сохранение в БД
  return await prisma.service.create({
    data: validatedData
  });
}
```

### 2. Authentication Pattern
```typescript
// Простая аутентификация для админ-панели
export async function authenticate(credentials: LoginCredentials) {
  const hashedPassword = await bcrypt.hash(credentials.password, 10);
  
  if (credentials.username === ADMIN_USERNAME && 
      await bcrypt.compare(credentials.password, ADMIN_PASSWORD_HASH)) {
    return { success: true };
  }
  
  return { success: false, error: 'Неверные данные' };
}
```

## Производительность

### 1. Image Optimization Pattern
```typescript
// Next.js Image с оптимизацией
<Image
  src={service.imageUrl}
  alt={service.name}
  width={400}
  height={300}
  className="object-cover rounded-lg"
  priority={index < 3} // Приоритет для первых изображений
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 2. Code Splitting Pattern
```typescript
// Динамический импорт для тяжелых компонентов
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### 3. Caching Strategy
```typescript
// Кеширование на уровне Server Actions
export async function getServices() {
  return unstable_cache(
    async () => {
      return await prisma.service.findMany({
        where: { isActive: true }
      });
    },
    ['active-services'],
    { revalidate: 3600 } // 1 час
  )();
}
```

## Обработка ошибок

### 1. Error Boundary Pattern
```typescript
// Глобальная обработка ошибок
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error-container">
      <h2>Что-то пошло не так!</h2>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  );
}
```

### 2. Server Action Error Handling
```typescript
export async function createService(formData: FormData) {
  try {
    const validatedData = serviceSchema.parse(formData);
    const service = await prisma.service.create({
      data: validatedData
    });
    
    return { success: true, data: service };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Ошибка валидации',
        details: error.errors 
      };
    }
    
    return { 
      success: false, 
      error: 'Внутренняя ошибка сервера' 
    };
  }
}
```

## Тестирование

### 1. Component Testing Pattern
```typescript
// Тестирование компонентов
describe('ServiceCard', () => {
  it('отображает информацию об услуге', () => {
    const service = {
      id: '1',
      name: 'Пошив платья',
      description: 'Индивидуальный пошив',
      price: 5000
    };
    
    render(<ServiceCard service={service} />);
    
    expect(screen.getByText('Пошив платья')).toBeInTheDocument();
    expect(screen.getByText('5000 ₽')).toBeInTheDocument();
  });
});
```

### 2. Integration Testing Pattern
```typescript
// Тестирование Server Actions
describe('Service Actions', () => {
  it('создает новую услугу', async () => {
    const formData = new FormData();
    formData.append('name', 'Тестовая услуга');
    formData.append('description', 'Описание тестовой услуги');
    
    const result = await createService(formData);
    
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Тестовая услуга');
  });
});
