#!/bin/bash
set -e

# Настройки
BACKUP_DIR="/backups"
POSTGRES_DB=${POSTGRES_DB:-"dresscutur"}
POSTGRES_USER=${POSTGRES_USER:-"dresscutur"}
POSTGRES_HOST=${POSTGRES_HOST:-"postgres"}
POSTGRES_PORT=${POSTGRES_PORT:-"5432"}
RETENTION_DAYS=${RETENTION_DAYS:-7}

# Создаем директорию для бекапов
mkdir -p "$BACKUP_DIR"

# Функция для создания бекапа
create_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/${POSTGRES_DB}_backup_${timestamp}.sql"
    
    echo "$(date): Создаем бекап базы данных $POSTGRES_DB..."
    
    # Создаем бекап
    pg_dump -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
        --no-password --clean --if-exists --create > "$backup_file"
    
    if [ $? -eq 0 ]; then
        echo "$(date): Бекап успешно создан: $backup_file"
        
        # Сжимаем бекап
        gzip "$backup_file"
        echo "$(date): Бекап сжат: ${backup_file}.gz"
        
        # Удаляем старые бекапы
        find "$BACKUP_DIR" -name "${POSTGRES_DB}_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
        echo "$(date): Старые бекапы (старше $RETENTION_DAYS дней) удалены"
        
        # Показываем размер бекапа
        local size=$(du -h "${backup_file}.gz" | cut -f1)
        echo "$(date): Размер бекапа: $size"
        
    else
        echo "$(date): Ошибка при создании бекапа"
        exit 1
    fi
}

# Функция для восстановления из бекапа
restore_backup() {
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        echo "$(date): Файл бекапа не найден: $backup_file"
        exit 1
    fi
    
    echo "$(date): Восстанавливаем базу данных из: $backup_file"
    
    # Распаковываем, если файл сжат
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB"
    else
        psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$backup_file"
    fi
    
    if [ $? -eq 0 ]; then
        echo "$(date): База данных успешно восстановлена"
    else
        echo "$(date): Ошибка при восстановлении базы данных"
        exit 1
    fi
}

# Функция для показа доступных бекапов
list_backups() {
    echo "Доступные бекапы:"
    ls -la "$BACKUP_DIR"/${POSTGRES_DB}_backup_*.sql.gz 2>/dev/null || echo "Бекапы не найдены"
}

# Обработка аргументов
case "${1:-backup}" in
    "backup")
        create_backup
        ;;
    "restore")
        if [ -z "$2" ]; then
            echo "Укажите файл бекапа для восстановления"
            echo "Использование: $0 restore <backup_file>"
            list_backups
            exit 1
        fi
        restore_backup "$2"
        ;;
    "list")
        list_backups
        ;;
    *)
        echo "Использование: $0 {backup|restore|list}"
        echo "  backup          - создать бекап"
        echo "  restore <file>  - восстановить из бекапа"
        echo "  list            - показать доступные бекапы"
        exit 1
        ;;
esac 