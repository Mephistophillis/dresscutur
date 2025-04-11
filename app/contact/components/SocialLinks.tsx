'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';

// Social media data
const socialMediaData = [
  {
    platform: 'instagram',
    name: 'Instagram',
    handle: '@dresscutur',
    url: 'https://www.instagram.com/dresscutur',
    followers: '15.4K',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    textColor: 'text-white',
    previewImages: [
      '/images/instagram-post1.jpg',
      '/images/instagram-post2.jpg',
      '/images/instagram-post3.jpg',
    ],
    placeholder: '/images/insta-placeholder.jpg',
  },
  {
    platform: 'facebook',
    name: 'Facebook',
    handle: 'DressCutur',
    url: 'https://www.facebook.com/dresscutur',
    followers: '8.2K',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
      </svg>
    ),
    color: 'bg-blue-600',
    textColor: 'text-white',
    previewImages: [
      '/images/facebook-post1.jpg',
      '/images/facebook-post2.jpg',
    ],
    placeholder: '/images/fb-placeholder.jpg',
  },
  {
    platform: 'youtube',
    name: 'YouTube',
    handle: 'DressCutur Channel',
    url: 'https://www.youtube.com/dresscutur',
    followers: '3.5K',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
      </svg>
    ),
    color: 'bg-red-600',
    textColor: 'text-white',
    previewImages: [
      '/images/youtube-post1.jpg',
    ],
    placeholder: '/images/yt-placeholder.jpg',
  },
  {
    platform: 'telegram',
    name: 'Telegram',
    handle: '@dresscutur',
    url: 'https://t.me/dresscutur',
    followers: '4.7K',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635z"/>
      </svg>
    ),
    color: 'bg-blue-500',
    textColor: 'text-white',
    previewImages: [],
    placeholder: '/images/tg-placeholder.jpg',
  },
];

export default function SocialLinks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section
      id="social-links"
      ref={ref}
      className="py-16 md:py-24 bg-light"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title mx-auto w-fit">Присоединяйтесь к нам</h2>
          <p className="max-w-2xl mx-auto text-dark/80 mt-6">
            Следите за нами в социальных сетях, чтобы быть в курсе последних новостей, акций и вдохновляющих идей
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {socialMediaData.map((social) => (
            <motion.div
              key={social.platform}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Platform Header */}
              <div className={`${social.color} ${social.textColor} p-6 flex items-center justify-between`}>
                <div className="flex items-center">
                  <div className="mr-4">{social.icon}</div>
                  <div>
                    <h3 className="text-xl font-medium">{social.name}</h3>
                    <p className="text-sm opacity-90">{social.handle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Подписчики</p>
                  <p className="text-xl font-medium">{social.followers}</p>
                </div>
              </div>
              
              {/* Preview Content */}
              <div className="p-6">
                {social.previewImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {social.previewImages.map((image, index) => (
                      <motion.div
                        key={index}
                        whileHover="hover"
                        className="relative aspect-square overflow-hidden rounded-md cursor-pointer"
                      >
                        <motion.div
                          variants={imageVariants}
                          className="w-full h-full"
                        >
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                              src={image}
                              alt={`${social.name} пост ${index + 1}`}
                              fill
                              style={{ objectFit: 'cover' }}
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8//9/PQAJewN9v3wfQQAAAABJRU5ErkJggg=="
                            />
                          </div>
                        </motion.div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-4 rounded-md overflow-hidden">
                    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                      <Image
                        src={social.placeholder}
                        alt={`${social.name} превью`}
                        fill
                        style={{ objectFit: 'cover' }}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8//9/PQAJewN9v3wfQQAAAABJRU5ErkJggg=="
                      />
                    </div>
                  </div>
                )}
                
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-3 px-4 rounded-md ${social.color} ${social.textColor} hover:opacity-90 transition-opacity`}
                >
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Подписаться
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Hashtags */}
        <motion.div
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <p className="text-dark/80 mb-4">Используйте наши хэштеги при публикации фото в ваших нарядах от DressCutur</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['#DressCutur', '#ДрессКутюр', '#ИндивидуальныйПошив', '#АтельеМосква'].map((hashtag, index) => (
              <span
                key={index}
                className="bg-secondary px-4 py-2 rounded-full text-primary text-sm"
              >
                {hashtag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 