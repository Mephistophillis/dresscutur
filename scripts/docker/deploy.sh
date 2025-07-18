#!/bin/bash
set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфигурация
ENVIRONMENT=${1:-"development"}
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

echo -e "${GREEN}🚀 Развертывание DressCutur в среде: ${ENVIRONMENT}${NC}"

# Выбираем compose файл в зависимости от среды
case $ENVIRONMENT in
    "production"|"prod")
        COMPOSE_FILE="docker-compose.prod.yml"
        ENV_FILE=".env.production"
        ;;
    "staging")
        COMPOSE_FILE="docker-compose.staging.yml"
        ENV_FILE=".env.staging"
        ;;
    "development"|"dev")
        COMPOSE_FILE="docker-compose.yml"
        ENV_FILE=".env.development"
        ;;
    *)
        echo -e "${RED}❌ Неизвестная среда: ${ENVIRONMENT}${NC}"
        echo "Доступные среды: development, staging, production"
        exit 1
        ;;
esac

# Проверяем наличие compose файла
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Compose файл не найден: $COMPOSE_FILE${NC}"
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  .env файл не найден: $ENV_FILE${NC}"
    echo "Создаем из .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example "$ENV_FILE"
        echo -e "${YELLOW}📝 Пожалуйста, настройте переменные окружения в $ENV_FILE${NC}"
        read -p "Нажмите Enter, когда будете готовы продолжить..."
    else
        echo -e "${RED}❌ .env.example не найден${NC}"
        exit 1
    fi
fi

# Проверяем статус Docker
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker не запущен${NC}"
    exit 1
fi

# Функция для проверки здоровья сервисов
check_health() {
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}🏥 Проверяем здоровье сервисов...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps -q | xargs docker inspect --format='{{.State.Health.Status}}' | grep -q "healthy"; then
            echo -e "${GREEN}✅ Все сервисы здоровы!${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Попытка $attempt/$max_attempts - ожидаем готовности сервисов...${NC}"
        sleep 10
        ((attempt++))
    done
    
    echo -e "${RED}❌ Сервисы не готовы после $max_attempts попыток${NC}"
    return 1
}

# Останавливаем старые контейнеры
echo -e "${YELLOW}🛑 Останавливаем старые контейнеры...${NC}"
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down

# Очищаем старые образы (опционально)
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}🧹 Очищаем неиспользуемые образы...${NC}"
    docker system prune -f
fi

# Создаем директории для volumes
echo -e "${BLUE}📁 Создаем необходимые директории...${NC}"
mkdir -p ./backups ./logs/nginx ./nginx/ssl

# Запускаем сервисы
echo -e "${GREEN}🚀 Запускаем сервисы...${NC}"
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

# Проверяем здоровье сервисов
if check_health; then
    echo -e "${GREEN}✅ Развертывание завершено успешно!${NC}"
    
    # Показываем статус сервисов
    echo -e "${BLUE}📊 Статус сервисов:${NC}"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    
    # Показываем полезную информацию
    echo -e "${BLUE}📋 Полезная информация:${NC}"
    echo "• Логи: docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE logs -f"
    echo "• Остановить: docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE down"
    echo "• Перезапустить: docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE restart"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "• Приложение доступно по адресу: https://your-domain.com"
    else
        echo "• Приложение доступно по адресу: http://localhost:3000"
    fi
    
else
    echo -e "${RED}❌ Развертывание завершилось с ошибками${NC}"
    echo -e "${YELLOW}📋 Проверьте логи:${NC}"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs
    exit 1
fi 