# Используем Node.js Alpine для меньшего размера
FROM node:18-alpine AS base

# Устанавливаем зависимости только при необходимости
FROM base AS deps
# Проверяем наличие libc6-compat для совместимости
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./
RUN npm ci

# Этап сборки
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерируем Prisma client
RUN npx prisma generate

# Сборка Next.js приложения
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Производственный образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы
COPY --from=builder /app/public ./public

# Устанавливаем правильные права доступа
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Копируем сборку Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Копируем Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Создаем директории для uploads
RUN mkdir -p public/uploads && chown nextjs:nodejs public/uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Устанавливаем curl для health check
USER root
RUN apk add --no-cache curl
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Запуск приложения
CMD ["node", "server.js"] 