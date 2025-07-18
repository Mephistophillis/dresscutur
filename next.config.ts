/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: __dirname,
  },
};

export default nextConfig;
