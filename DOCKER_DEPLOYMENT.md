# Docker Deployment Guide - DressCutur

## 📋 Обзор

Данное руководство описывает процесс развертывания приложения DressCutur в Docker контейнерах для продакшена.

## 🏗️ Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Client      │───▶│     Nginx       │───▶│   Next.js App   │
│   (Browser)     │    │ (Reverse Proxy) │    │   (Container)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐              │
                       │     Redis       │◀─────────────┤
                       │   (Cache)       │              │
                       └─────────────────┘              │
                                                        │
                       ┌─────────────────┐              │
                       │  PostgreSQL     │◀─────────────┘
                       │  (Database)     │
                       └─────────────────┘
```

## 🚀 Быстрый старт

### 1. Подготовка среды

```bash
# Клонируем репозиторий
git clone <repository-url>
cd dresscutur

# Создаем переменные окружения
cp .env.example .env.production
# Настройте переменные в .env.production
```

### 2. Локальное развертывание

```bash
# Сборка и запуск для разработки
./scripts/docker/deploy.sh development

# Приложение будет доступно по адресу: http://localhost:3000
```

### 3. Продакшен развертывание

```bash
# Сборка образа
./scripts/docker/build.sh v1.0.0

# Развертывание в продакшене
./scripts/docker/deploy.sh production
```

## 📦 Структура файлов

```
dresscutur/
├── Dockerfile                 # Основной Dockerfile
├── .dockerignore             # Исключения для Docker
├── docker-compose.yml        # Конфигурация для разработки
├── docker-compose.prod.yml   # Конфигурация для продакшена
├── nginx.conf                # Nginx конфигурация (dev)
├── nginx/
│   └── nginx.prod.conf       # Nginx конфигурация (prod)
├── scripts/
│   ├── docker/
│   │   ├── build.sh         # Скрипт сборки образа
│   │   └── deploy.sh        # Скрипт развертывания
│   └── backup.sh            # Скрипт резервного копирования
└── .env.example             # Шаблон переменных окружения
```

## ⚙️ Конфигурация

### Переменные окружения

#### Основные переменные

```bash
# База данных
DATABASE_URL="postgresql://user:password@postgres:5432/dresscutur"
POSTGRES_DB="dresscutur"
POSTGRES_USER="dresscutur"
POSTGRES_PASSWORD="secure_password"

# Аутентификация
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"
ADMIN_SESSION_SECRET="admin-session-secret"

# Redis
REDIS_PASSWORD="redis_password"

# Прочие
NODE_ENV="production"
```

#### Опциональные переменные

```bash
# Email (если используется)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-password"

# Внешние сервисы
GOOGLE_MAPS_API_KEY="your-api-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

### SSL сертификаты

Для продакшена разместите SSL сертификаты в директории `nginx/ssl/`:

```bash
nginx/ssl/
├── cert.pem      # Сертификат
└── key.pem       # Приватный ключ
```

## 🔧 Команды управления

### Сборка образа

```bash
# Сборка с тегом latest
./scripts/docker/build.sh

# Сборка с конкретным тегом
./scripts/docker/build.sh v1.0.0

# Сборка с кастомным Dockerfile
./scripts/docker/build.sh v1.0.0 Dockerfile.custom
```

### Развертывание

```bash
# Разработка
./scripts/docker/deploy.sh development

# Продакшен
./scripts/docker/deploy.sh production

# Staging
./scripts/docker/deploy.sh staging
```

### Управление контейнерами

```bash
# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Остановка сервисов
docker-compose -f docker-compose.prod.yml down

# Перезапуск сервисов
docker-compose -f docker-compose.prod.yml restart

# Просмотр статуса
docker-compose -f docker-compose.prod.yml ps
```

### Резервное копирование

```bash
# Создание бекапа
./scripts/backup.sh backup

# Восстановление из бекапа
./scripts/backup.sh restore /backups/dresscutur_backup_20231201_120000.sql.gz

# Список бекапов
./scripts/backup.sh list
```

## 🚀 Миграции базы данных

### Первичное развертывание

```bash
# Войти в контейнер приложения
docker exec -it dresscutur_app_prod bash

# Выполнить миграции
npx prisma migrate deploy

# Заполнить базу данных
npm run db:seed
```

### Обновление схемы

```bash
# Создать миграцию (в разработке)
npx prisma migrate dev --name add_new_field

# Применить в продакшене
npx prisma migrate deploy
```

## 📊 Мониторинг

### Health Checks

Приложение предоставляет endpoint для проверки здоровья:

```bash
# Проверка приложения
curl -f http://localhost:3000/api/health

# Проверка Nginx
curl -f http://localhost/health
```

### Логи

```bash
# Логи приложения
docker-compose -f docker-compose.prod.yml logs -f app

# Логи базы данных
docker-compose -f docker-compose.prod.yml logs -f postgres

# Логи Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx
```

## 🔒 Безопасность

### Настройки безопасности

1. **Пользователи контейнеров**: Приложение запускается от непривилегированного пользователя `nextjs`
2. **Сетевая изоляция**: База данных и Redis изолированы в приватной сети
3. **Rate limiting**: Nginx настроен с ограничениями скорости запросов
4. **SSL**: Принудительное перенаправление на HTTPS в продакшене
5. **Security headers**: Добавлены заголовки безопасности

### Рекомендации

1. Регулярно обновляйте базовые образы
2. Используйте сканеры безопасности для образов
3. Настройте автоматическое обновление сертификатов
4. Ограничьте доступ к админ-панели по IP
5. Регулярно создавайте резервные копии

## 🚦 Troubleshooting

### Проблемы с Prisma

**Проблема**: Ошибка "Failed to fetch sha256 checksum" при сборке
```bash
# Быстрое решение
./scripts/docker/fix-prisma.sh

# Или диагностика
./scripts/docker/fix-prisma.sh diagnose

# Или показать решения
./scripts/docker/fix-prisma.sh solutions
```

**Проблема**: Prisma не может скачать engines
```bash
# Сборка с альтернативным Dockerfile
./scripts/docker/build.sh v1.0.0 Dockerfile.offline

# Или с Debian вместо Alpine
./scripts/docker/build.sh v1.0.0 Dockerfile.debian

# Или с переменными окружения
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
export PRISMA_SKIP_POSTINSTALL_GENERATE=1
./scripts/docker/build.sh v1.0.0
```

**Проблема**: Корпоративный proxy блокирует доступ
```bash
# Настройка proxy
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1

# Сборка с proxy
./scripts/docker/build.sh v1.0.0
```

### Общие проблемы

**Проблема**: Контейнер не запускается
```bash
# Проверить логи
docker-compose -f docker-compose.prod.yml logs app

# Проверить health check
docker-compose -f docker-compose.prod.yml ps
```

**Проблема**: База данных недоступна
```bash
# Проверить подключение
docker exec -it dresscutur_postgres_prod psql -U dresscutur -d dresscutur -c "SELECT 1;"
```

**Проблема**: Nginx не может подключиться к приложению
```bash
# Проверить сети
docker network ls
docker network inspect dresscutur_network
```

### Полезные команды

```bash
# Очистка Docker системы
docker system prune -a

# Просмотр использования ресурсов
docker stats

# Вход в контейнер
docker exec -it dresscutur_app_prod bash

# Перестройка конкретного сервиса
docker-compose -f docker-compose.prod.yml up -d --build app
```

## 📈 Оптимизация производительности

### Настройки ресурсов

В `docker-compose.prod.yml` настроены лимиты ресурсов:

```yaml
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '1'
    reservations:
      memory: 512M
      cpus: '0.5'
```

### Кеширование

1. **Redis**: Кеширование сессий и данных
2. **Nginx**: Кеширование статических файлов
3. **Next.js**: Оптимизация сборки и статической генерации

### Масштабирование

```bash
# Увеличить количество реплик приложения
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

## 🔄 CI/CD Integration

### GitHub Actions пример

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and Deploy
        run: |
          ./scripts/docker/build.sh ${{ github.sha }}
          ./scripts/docker/deploy.sh production
```

---

**Поддержка**: Для получения помощи обращайтесь к документации или создавайте issue в репозитории проекта. 