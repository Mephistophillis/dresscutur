import { PrismaClient } from '@prisma/client';

// Создаем единственный экземпляр PrismaClient
// и сохраняем его в глобальной переменной в режиме разработки
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Предотвращаем создание множества соединений с базой данных
// во время горячей перезагрузки в режиме разработки
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 