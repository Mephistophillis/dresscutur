/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Убираем output: 'standalone' чтобы Next.js сам обслуживал статические файлы
  experimental: {
    outputFileTracingRoot: __dirname,
    serverActions: {
      bodySizeLimit: '10mb', // Увеличиваем лимит с 1MB до 10MB для загрузки изображений
    },
  },
};

export default nextConfig;
