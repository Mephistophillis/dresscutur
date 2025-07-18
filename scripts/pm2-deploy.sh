#!/bin/bash

# PM2 Deploy Script for DressCutur
# Скрипт для деплоя проекта с помощью PM2

set -e

APP_NAME="dresscutur"
NODE_ENV="${NODE_ENV:-production}"
BRANCH="${BRANCH:-main}"

echo "🚀 Деплой DressCutur с PM2..."
echo "Окружение: $NODE_ENV"
echo "Ветка: $BRANCH"

# Обновление кода
echo "📥 Обновление кода..."
git fetch origin
git reset --hard origin/$BRANCH

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm ci --production=false

# Генерация Prisma клиента
echo "🔄 Генерация Prisma клиента..."
npx prisma generate

# Запуск миграций
echo "🗄️ Запуск миграций базы данных..."
npx prisma migrate deploy

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

# Перезапуск PM2
echo "🔄 Перезапуск PM2..."
if pm2 list | grep -q "$APP_NAME-$NODE_ENV"; then
    pm2 reload ecosystem.config.js --env $NODE_ENV
else
    pm2 start ecosystem.config.js --env $NODE_ENV
fi

# Проверка статуса
echo "📊 Проверка статуса..."
pm2 status

# Health check
echo "🏥 Проверка работоспособности..."
sleep 5
curl -f http://localhost:3000/api/health || echo "⚠️ Health check failed"

echo "✅ Деплой завершен успешно!" 