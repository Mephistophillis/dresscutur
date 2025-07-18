#!/bin/bash

# Quick Start PM2 для DressCutur
# Простой скрипт для быстрого запуска PM2

echo "🚀 Быстрый запуск PM2 для DressCutur"
echo "======================================"

# Проверка установки PM2
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 не установлен. Устанавливаю..."
    npm install -g pm2
    echo "✅ PM2 установлен"
fi

# Создание директории для логов
mkdir -p logs

# Проверка .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Создаю из примера..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Файл .env создан. Отредактируйте переменные окружения!"
    else
        echo "❌ Файл .env.example не найден"
        exit 1
    fi
fi

# Проверка сборки
if [ ! -d ".next" ]; then
    echo "🔨 Проект не собран. Собираю..."
    npm run build
fi

# Запуск PM2
echo "🚀 Запуск PM2..."
pm2 start ecosystem.config.js --env production

# Показать статус
echo "📊 Статус PM2:"
pm2 status

echo ""
echo "✅ PM2 запущен успешно!"
echo "📊 Команды для управления:"
echo "   pm2 status  - статус процессов"
echo "   pm2 logs    - просмотр логов"
echo "   pm2 monit   - мониторинг"
echo "   pm2 stop all - остановка всех процессов"
echo ""
echo "🌐 Приложение доступно по адресу: http://localhost:3000"
echo "🏥 Health check: http://localhost:3000/api/health" 