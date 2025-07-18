#!/bin/bash

# PM2 Logs Management Script for DressCutur

APP_NAME="dresscutur"
LOGS_DIR="./logs"
BACKUP_DIR="./logs/backup"

case "$1" in
    "tail")
        echo "📜 Просмотр логов в реальном времени..."
        pm2 logs --lines 50
        ;;
    "show")
        echo "📋 Показать последние 100 строк логов..."
        pm2 logs --lines 100 --nostream
        ;;
    "error")
        echo "🔥 Показать только ошибки..."
        pm2 logs --err --lines 50
        ;;
    "clear")
        echo "🧹 Очистка логов..."
        pm2 flush
        ;;
    "backup")
        echo "💾 Создание резервной копии логов..."
        mkdir -p $BACKUP_DIR
        timestamp=$(date +%Y%m%d_%H%M%S)
        cp -r $LOGS_DIR/*.log $BACKUP_DIR/logs_$timestamp/ 2>/dev/null || true
        echo "Резервная копия создана: $BACKUP_DIR/logs_$timestamp/"
        ;;
    "rotate")
        echo "🔄 Ротация логов..."
        # Создаем резервную копию
        $0 backup
        # Очищаем текущие логи
        pm2 flush
        echo "Ротация логов завершена"
        ;;
    "size")
        echo "📏 Размер логов:"
        du -sh $LOGS_DIR 2>/dev/null || echo "Директория логов не найдена"
        ;;
    *)
        echo "🔧 Управление логами PM2 для DressCutur"
        echo ""
        echo "Использование: $0 {tail|show|error|clear|backup|rotate|size}"
        echo ""
        echo "Команды:"
        echo "  tail     - просмотр логов в реальном времени"
        echo "  show     - показать последние 100 строк"
        echo "  error    - показать только ошибки"
        echo "  clear    - очистить все логи"
        echo "  backup   - создать резервную копию логов"
        echo "  rotate   - ротация логов (backup + clear)"
        echo "  size     - показать размер логов"
        echo ""
        echo "Примеры:"
        echo "  $0 tail"
        echo "  $0 error"
        echo "  $0 backup"
        ;;
esac 