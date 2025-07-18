#!/bin/bash
set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Конфигурация
PROJECT_NAME="dresscutur"
DOCKER_REGISTRY="your-registry.com"
VERSION=${1:-"latest"}
DOCKERFILE=${2:-"Dockerfile"}

echo -e "${GREEN}🏗️  Начинаем сборку Docker образа для ${PROJECT_NAME}...${NC}"

# Проверяем наличие Dockerfile
if [ ! -f "$DOCKERFILE" ]; then
    echo -e "${RED}❌ Dockerfile не найден: $DOCKERFILE${NC}"
    exit 1
fi

# Создаем тег для образа
IMAGE_TAG="${DOCKER_REGISTRY}/${PROJECT_NAME}:${VERSION}"

echo -e "${YELLOW}📦 Сборка образа: ${IMAGE_TAG}${NC}"

# Сборка образа
docker build \
    --platform linux/amd64 \
    --build-arg NODE_ENV=production \
    --build-arg NEXT_TELEMETRY_DISABLED=1 \
    -t "${IMAGE_TAG}" \
    -f "${DOCKERFILE}" \
    .

# Проверяем успешность сборки
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Образ успешно собран: ${IMAGE_TAG}${NC}"
    
    # Показываем информацию об образе
    echo -e "${YELLOW}📊 Информация об образе:${NC}"
    docker images "${IMAGE_TAG}"
    
    # Показываем размер образа
    IMAGE_SIZE=$(docker images "${IMAGE_TAG}" --format "{{.Size}}")
    echo -e "${YELLOW}📏 Размер образа: ${IMAGE_SIZE}${NC}"
    
    # Тегируем как latest, если это не latest
    if [ "$VERSION" != "latest" ]; then
        LATEST_TAG="${DOCKER_REGISTRY}/${PROJECT_NAME}:latest"
        docker tag "${IMAGE_TAG}" "${LATEST_TAG}"
        echo -e "${GREEN}✅ Образ также помечен как: ${LATEST_TAG}${NC}"
    fi
    
    echo -e "${GREEN}🎉 Сборка завершена успешно!${NC}"
else
    echo -e "${RED}❌ Ошибка при сборке образа${NC}"
    exit 1
fi

# Опционально: пуш в реестр
read -p "Хотите загрузить образ в реестр? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🚀 Загружаем образ в реестр...${NC}"
    docker push "${IMAGE_TAG}"
    
    if [ "$VERSION" != "latest" ]; then
        docker push "${LATEST_TAG}"
    fi
    
    echo -e "${GREEN}✅ Образ успешно загружен в реестр!${NC}"
fi 