#!/bin/bash

# PM2 Setup Script for DressCutur
# Этот скрипт настраивает PM2 для проекта DressCutur

set -e

echo "🚀 Настройка PM2 для DressCutur..."

# Проверка установки PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Установка PM2..."
    npm install -g pm2
else
    echo "✅ PM2 уже установлен"
fi

# Создание директории для логов
echo "📁 Создание директории для логов..."
mkdir -p logs

# Установка автозапуска PM2
echo "🔄 Настройка автозапуска PM2..."
pm2 startup

# Создание .env файла если не существует
if [ ! -f .env ]; then
    echo "📝 Создание .env файла..."
    cp .env.example .env
    echo "⚠️  Не забудьте настроить переменные окружения в .env"
fi

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

# Запуск PM2 с конфигурацией
echo "🚀 Запуск PM2..."
pm2 start ecosystem.config.js

# Сохранение конфигурации PM2
echo "💾 Сохранение конфигурации PM2..."
pm2 save

echo "✅ PM2 настроен успешно!"
echo ""
echo "📊 Полезные команды:"
echo "  pm2 status              - статус процессов"
echo "  pm2 logs                - просмотр логов"
echo "  pm2 monit               - мониторинг"
echo "  pm2 restart all         - перезапуск всех процессов"
echo "  pm2 stop all            - остановка всех процессов"
echo "  pm2 delete all          - удаление всех процессов"
echo ""
echo "🌐 Приложение доступно по адресу: http://localhost:3000" 