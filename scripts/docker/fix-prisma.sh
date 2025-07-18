#!/bin/bash
set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Диагностика и исправление проблем с Prisma${NC}"

# Функция для проверки доступности URL
check_url() {
    local url=$1
    echo -e "${YELLOW}Проверяем доступность: $url${NC}"
    
    if curl -s --head --fail "$url" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Доступен${NC}"
        return 0
    else
        echo -e "${RED}❌ Недоступен${NC}"
        return 1
    fi
}

# Функция для создания .env файла для Docker
create_docker_env() {
    echo -e "${BLUE}📝 Создаем .env файл для Docker сборки${NC}"
    
    cat > .env.docker << EOF
# Prisma configuration for Docker build
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
PRISMA_SKIP_POSTINSTALL_GENERATE=1
PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x
PRISMA_ENGINES_MIRROR=https://github.com/prisma/prisma-engines/releases/download/

# Build configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOF
    
    echo -e "${GREEN}✅ Файл .env.docker создан${NC}"
}

# Функция для попытки исправления через разные подходы
try_build_approaches() {
    echo -e "${BLUE}🔄 Пробуем разные подходы к сборке${NC}"
    
    # Подход 1: Основной Dockerfile с переменными окружения
    echo -e "${YELLOW}📦 Подход 1: Основной Dockerfile с переменными окружения${NC}"
    if docker build \
        --platform linux/amd64 \
        --build-arg NODE_ENV=production \
        --build-arg NEXT_TELEMETRY_DISABLED=1 \
        --build-arg PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 \
        --build-arg PRISMA_SKIP_POSTINSTALL_GENERATE=1 \
        --network=host \
        -t dresscutur:test-approach-1 \
        -f Dockerfile \
        . 2>&1 | tee build-approach-1.log; then
        echo -e "${GREEN}✅ Подход 1 успешен!${NC}"
        return 0
    fi
    
    # Подход 2: Offline Dockerfile
    echo -e "${YELLOW}📦 Подход 2: Offline Dockerfile${NC}"
    if docker build \
        --platform linux/amd64 \
        --network=host \
        -t dresscutur:test-approach-2 \
        -f Dockerfile.offline \
        . 2>&1 | tee build-approach-2.log; then
        echo -e "${GREEN}✅ Подход 2 успешен!${NC}"
        return 0
    fi
    
    # Подход 3: Без Alpine (используем стандартный Node.js)
    echo -e "${YELLOW}📦 Подход 3: Создаем Dockerfile без Alpine${NC}"
    create_debian_dockerfile
    if docker build \
        --platform linux/amd64 \
        --build-arg PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 \
        --network=host \
        -t dresscutur:test-approach-3 \
        -f Dockerfile.debian \
        . 2>&1 | tee build-approach-3.log; then
        echo -e "${GREEN}✅ Подход 3 успешен!${NC}"
        return 0
    fi
    
    echo -e "${RED}❌ Все подходы не сработали${NC}"
    return 1
}

# Функция для создания Dockerfile на основе Debian
create_debian_dockerfile() {
    cat > Dockerfile.debian << 'EOF'
FROM node:18-slim AS base

FROM base AS deps
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json* ./
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
ENV PRISMA_CLI_BINARY_TARGETS=linux-openssl-3.0.x

RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

RUN mkdir -p public/uploads && chown nextjs:nodejs public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
EOF
}

# Функция для диагностики сети
diagnose_network() {
    echo -e "${BLUE}🌐 Диагностика сетевых проблем${NC}"
    
    # Проверяем основные URL Prisma
    local urls=(
        "https://binaries.prisma.sh"
        "https://github.com/prisma/prisma-engines"
        "https://registry.npmjs.org/prisma"
        "https://registry.npmjs.org/@prisma/client"
    )
    
    for url in "${urls[@]}"; do
        check_url "$url"
    done
    
    # Проверяем DNS
    echo -e "${YELLOW}🔍 Проверяем DNS резолюцию${NC}"
    if nslookup binaries.prisma.sh >/dev/null 2>&1; then
        echo -e "${GREEN}✅ DNS работает${NC}"
    else
        echo -e "${RED}❌ Проблемы с DNS${NC}"
    fi
    
    # Проверяем HTTP_PROXY настройки
    if [[ -n "$HTTP_PROXY" || -n "$HTTPS_PROXY" ]]; then
        echo -e "${YELLOW}🔍 Обнаружены proxy настройки:${NC}"
        echo "HTTP_PROXY: $HTTP_PROXY"
        echo "HTTPS_PROXY: $HTTPS_PROXY"
    fi
}

# Функция для отображения решений
show_solutions() {
    echo -e "${BLUE}💡 Возможные решения:${NC}"
    echo
    echo -e "${YELLOW}1. Использовать переменные окружения:${NC}"
    echo "   export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1"
    echo "   export PRISMA_SKIP_POSTINSTALL_GENERATE=1"
    echo
    echo -e "${YELLOW}2. Сборка с альтернативным Dockerfile:${NC}"
    echo "   ./scripts/docker/build.sh v1.0.0 Dockerfile.offline"
    echo
    echo -e "${YELLOW}3. Сборка с Debian вместо Alpine:${NC}"
    echo "   ./scripts/docker/build.sh v1.0.0 Dockerfile.debian"
    echo
    echo -e "${YELLOW}4. Локальная генерация Prisma:${NC}"
    echo "   npm run prisma:generate"
    echo "   docker build --no-cache ..."
    echo
    echo -e "${YELLOW}5. Настройка корпоративного proxy:${NC}"
    echo "   export HTTP_PROXY=http://proxy.company.com:8080"
    echo "   export HTTPS_PROXY=http://proxy.company.com:8080"
    echo
}

# Главная функция
main() {
    echo -e "${GREEN}🚀 Начинаем диагностику проблем с Prisma${NC}"
    
    # Диагностика сети
    diagnose_network
    
    # Создаем .env файл для Docker
    create_docker_env
    
    # Показываем решения
    show_solutions
    
    # Спрашиваем, хотим ли мы попробовать исправить
    read -p "Хотите попробовать автоматические исправления? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        try_build_approaches
    fi
    
    echo -e "${GREEN}✅ Диагностика завершена${NC}"
}

# Обработка аргументов
case "${1:-main}" in
    "diagnose")
        diagnose_network
        ;;
    "fix")
        try_build_approaches
        ;;
    "solutions")
        show_solutions
        ;;
    *)
        main
        ;;
esac 