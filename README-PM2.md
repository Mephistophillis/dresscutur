# PM2 Configuration для DressCutur

Это руководство по настройке и использованию PM2 для управления приложением DressCutur.

## Предварительные требования

- Node.js 18+
- NPM или Yarn
- PostgreSQL
- Redis (опционально)

## Установка PM2

```bash
# Глобальная установка PM2
npm install -g pm2

# Или с помощью yarn
yarn global add pm2
```

## Быстрый старт

### 1. Автоматическая настройка

```bash
# Запуск скрипта автоматической настройки
npm run pm2:setup
```

### 2. Ручная настройка

```bash
# Создание директории для логов
mkdir -p logs

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл под ваши нужды

# Сборка приложения
npm run build

# Запуск PM2
npm run pm2:start
```

## Управление приложением

### Основные команды

```bash
# Запуск
npm run pm2:start          # Production
npm run pm2:start:staging  # Staging
npm run pm2:start:dev      # Development

# Остановка
npm run pm2:stop

# Перезапуск
npm run pm2:restart

# Плавная перезагрузка (zero-downtime)
npm run pm2:reload

# Удаление процессов
npm run pm2:delete

# Статус процессов
npm run pm2:status

# Мониторинг
npm run pm2:monit
```

### Работа с логами

```bash
# Просмотр логов в реальном времени
npm run pm2:logs

# Управление логами
npm run pm2:logs:manage tail     # Просмотр в реальном времени
npm run pm2:logs:manage show     # Последние 100 строк
npm run pm2:logs:manage error    # Только ошибки
npm run pm2:logs:manage clear    # Очистка логов
npm run pm2:logs:manage backup   # Резервная копия
npm run pm2:logs:manage rotate   # Ротация логов
npm run pm2:logs:manage size     # Размер логов
```

## Конфигурация окружений

### Production (ecosystem.config.js)

```javascript
{
  name: 'dresscutur-prod',
  instances: 2,              // Cluster mode
  exec_mode: 'cluster',
  max_memory_restart: '1G',
  node_args: '--max-old-space-size=2048'
}
```

### Staging

```javascript
{
  name: 'dresscutur-staging',
  instances: 1,
  exec_mode: 'cluster',
  max_memory_restart: '512M',
  node_args: '--max-old-space-size=1024'
}
```

### Development

```javascript
{
  name: 'dresscutur-dev',
  instances: 1,
  exec_mode: 'fork',
  watch: true,               // Автоперезапуск при изменениях
  ignore_watch: ['node_modules', 'logs', '.next']
}
```

## Деплой

### Автоматический деплой

```bash
# Production деплой
npm run deploy

# Staging деплой
npm run deploy:staging
```

### Ручной деплой

```bash
# Обновление кода
git pull origin main

# Установка зависимостей
npm ci

# Сборка
npm run build

# Перезапуск PM2
npm run pm2:reload
```

## Мониторинг

### Health Check

Приложение предоставляет endpoint для проверки состояния:

```bash
curl http://localhost:3000/api/health
```

Ответ:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "memory": {
    "used": 128,
    "total": 256,
    "external": 64
  },
  "cpu": {
    "user": 1000000,
    "system": 500000
  },
  "environment": "production",
  "version": "1.0.0",
  "database": "connected"
}
```

### PM2 Monitoring

```bash
# Веб-интерфейс мониторинга
pm2 monit

# Информация о процессах
pm2 info dresscutur-prod

# Детальная информация
pm2 show dresscutur-prod
```

## Автозапуск

### Настройка автозапуска при перезагрузке системы

```bash
# Генерация startup скрипта
pm2 startup

# Сохранение текущей конфигурации
pm2 save

# Отключение автозапуска (если нужно)
pm2 unstartup
```

## Файлы конфигурации

### ecosystem.config.js
Основной конфигурационный файл PM2 с настройками для всех окружений.

### pm2.config.json
Альтернативная JSON конфигурация (упрощенная версия).

### .env.example
Шаблон переменных окружения.

## Структура логов

```
logs/
├── dresscutur-combined.log        # Все логи production
├── dresscutur-out.log             # Stdout production
├── dresscutur-error.log           # Stderr production
├── dresscutur-staging-combined.log # Staging логи
├── dresscutur-dev-combined.log    # Development логи
└── backup/                        # Резервные копии
    └── logs_20240101_120000/
```

## Рекомендации по производительности

### Системные требования

**Минимальные:**
- RAM: 1GB
- CPU: 1 Core
- Disk: 10GB свободного места

**Рекомендованные:**
- RAM: 4GB+
- CPU: 2+ Cores
- Disk: 50GB+ SSD

### Оптимизация

1. **Cluster Mode**: Используйте cluster mode для production
2. **Memory Limits**: Установите лимиты памяти
3. **Log Rotation**: Настройте ротацию логов
4. **Health Checks**: Регулярно проверяйте состояние
5. **Monitoring**: Используйте PM2 Plus для расширенного мониторинга

## Troubleshooting

### Частые проблемы

1. **Приложение не запускается**
   ```bash
   # Проверьте логи
   pm2 logs
   # Проверьте конфигурацию
   pm2 prettylist
   ```

2. **Высокое потребление памяти**
   ```bash
   # Проверьте использование памяти
   pm2 monit
   # Уменьшите лимит памяти
   pm2 reload ecosystem.config.js
   ```

3. **Процесс постоянно перезапускается**
   ```bash
   # Проверьте логи ошибок
   pm2 logs --err
   # Увеличьте min_uptime
   ```

### Команды отладки

```bash
# Подробная информация о процессе
pm2 describe dresscutur-prod

# Список всех процессов
pm2 list

# Очистка всех процессов
pm2 kill

# Перезапуск PM2 daemon
pm2 update
```

## Безопасность

### Рекомендации

1. **Переменные окружения**: Никогда не храните секретные данные в коде
2. **Файлы логов**: Ограничьте доступ к файлам логов
3. **Порты**: Используйте reverse proxy (nginx) для публичного доступа
4. **Обновления**: Регулярно обновляйте PM2 и зависимости

### Настройка nginx

```nginx
server {
    listen 80;
    server_name dresscutur.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Полезные ссылки

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Поддержка**: Если у вас возникли проблемы с настройкой PM2, создайте issue в репозитории проекта. 