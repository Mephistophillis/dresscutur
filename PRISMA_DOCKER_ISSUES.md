# Решение проблем с Prisma в Docker

## 🚨 Ваша ошибка

```
ERROR [builder 4/5] RUN npx prisma generate
Error: Failed to fetch sha256 checksum at https://binaries.prisma.sh/all_commits/f676762280b54cd07c770017ed3711ddde35f37a/linux-musl-openssl-3.0.x/schema-engine.gz.sha256 - 403 Forbidden
```

## ✅ Решение

### 1. Быстрое решение (рекомендуется)

Я уже исправил Dockerfile. Попробуйте:

```bash
./scripts/docker/build.sh v1.0.0
```

### 2. Если первое не помогает

Используйте offline версию:

```bash
./scripts/docker/build.sh v1.0.0 Dockerfile.offline
```

### 3. Диагностика проблемы

```bash
./scripts/docker/fix-prisma.sh
```

### 4. Для корпоративных сетей

```bash
export HTTP_PROXY=http://your-proxy:8080
export HTTPS_PROXY=http://your-proxy:8080
export NO_PROXY=localhost,127.0.0.1
./scripts/docker/build.sh v1.0.0
```

## 🔧 Что было исправлено

### В основном Dockerfile:

1. **Добавлены переменные окружения**:
   ```dockerfile
   ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
   ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
   ```

2. **Исправлен формат ENV переменных**:
   ```dockerfile
   # Было: ENV NODE_ENV production
   # Стало: ENV NODE_ENV=production
   ```

3. **Добавлены build-args в скрипт сборки**:
   ```bash
   --build-arg PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
   --build-arg PRISMA_SKIP_POSTINSTALL_GENERATE=1
   --network=host
   ```

### Создан Dockerfile.offline:

- Использует fallback стратегии для Prisma
- Трехуровневая система попыток генерации
- Дополнительные переменные окружения

### Создан Dockerfile.debian:

- Использует Node.js slim вместо Alpine
- Более стабильная работа с Prisma engines
- Правильные binary targets для Debian

## 📋 Дополнительные файлы

1. **`scripts/docker/fix-prisma.sh`** - Автоматическая диагностика и исправление
2. **`Dockerfile.offline`** - Для сборки без интернета
3. **`Dockerfile.debian`** - Альтернатива на Debian
4. **`.env.docker`** - Переменные окружения для Docker

## 🚀 Быстрый тест

Проверьте, что проблема решена:

```bash
# Тест основного Dockerfile
docker build --platform linux/amd64 -t test-build .

# Если не работает, попробуйте offline версию
docker build --platform linux/amd64 -t test-build -f Dockerfile.offline .
```

## 🔍 Причины проблемы

1. **403 Forbidden** - Prisma binaries сервер блокирует доступ
2. **Корпоративный proxy** - Фаерволл блокирует binaries.prisma.sh
3. **Alpine Linux** - Проблемы с musl библиотеками
4. **Checksum validation** - Строгая проверка целостности файлов

## 🛠️ Альтернативные решения

### Локальная генерация Prisma:

```bash
# Сгенерировать локально
npm run prisma:generate

# Собрать с готовым client
docker build --no-cache -t dresscutur:v1.0.0 .
```

### Кеширование engines:

```bash
# Скачать engines заранее
npx prisma version
npx prisma generate

# Использовать в Docker
COPY node_modules/.prisma ./node_modules/.prisma
```

## 📞 Если ничего не помогает

1. Проверьте подключение к интернету
2. Убедитесь, что Docker имеет доступ к сети
3. Проверьте настройки корпоративного proxy
4. Используйте `scripts/docker/fix-prisma.sh diagnose`

## 🎯 Результат

После исправления сборка должна пройти успешно, и вы получите:

```
✅ Образ успешно собран: your-registry.com/dresscutur:v1.0.0
📏 Размер образа: ~200MB
🎉 Сборка завершена успешно!
```

---

**Если проблема все еще не решена, запустите диагностику:**

```bash
./scripts/docker/fix-prisma.sh
``` 