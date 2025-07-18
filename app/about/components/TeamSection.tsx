'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import TeamMember from './TeamMember';
import { getActiveTeamMembers } from '~/app/actions/admin/team-members';

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface TeamMemberData {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  location?: string | null;
  socialLinks?: Record<string, string>;
  category?: string;
}

export default function TeamSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных о членах команды
  useEffect(() => {
    async function loadTeamMembers() {
      try {
        const result = await getActiveTeamMembers();
        if (result.success && result.data) {
          setTeamMembers(result.data as TeamMemberData[]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке членов команды:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeamMembers();
  }, []);

  // Создание списка уникальных локаций для фильтров
  const locations = teamMembers.length > 0 
    ? ['all', ...new Set(teamMembers.map(member => member.location).filter(Boolean) as string[])]
    : ['all'];

  // Фильтрация членов команды по активному фильтру
  const filteredMembers = activeFilter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.location === activeFilter);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Функция для преобразования socialLinks
  const formatSocialLinks = (member: TeamMemberData): SocialLink[] => {
    if (!member.socialLinks) return [];
    
    const links: SocialLink[] = [];
    const socialData = typeof member.socialLinks === 'string' 
      ? JSON.parse(member.socialLinks) 
      : member.socialLinks;
    
    if (socialData.instagram) {
      links.push({
        platform: 'Instagram',
        url: socialData.instagram,
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
      });
    }
    
    if (socialData.facebook) {
      links.push({
        platform: 'Facebook',
        url: socialData.facebook,
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
      });
    }
    
    if (socialData.vk) {
      links.push({
        platform: 'VK',
        url: socialData.vk,
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23c-1.43 2.78-2.264 2.782-2.541 2.654-1.362-.6-.728-4.32-.728-4.32s.045-.911-.199-1.17c-.431-.437-1.214-.147-2.956-.156-.977-.006-2.01.096-2.586.699-.358.37-.195 1.411.431 1.457 1.369.1 1.696 2.486.566 2.985-1.213 1.087-4.118-3.773-5.38-5.703-.305-.473-.345-.672-.857-.617l-3.192.085C.75 6.547.455 6.824.586 7.293c1.877 6.7 9.469 12.574 18.301 11.618 1.026-.111 1.465-.665 1.465-.665s.651-.66.605-1.919c-.043-1.169-.893-1.291-.893-1.291l-3.383-.018s-.193-.051-.357.047c-.164.098-.263.345-.263.345s-.522 1.062-1.372 2.057c-1.207 1.422-1.649 1.087-1.649 1.087-.346-.359-.247-1.699-.247-1.699l.018-4.823s.135-1.29-.438-1.653c-.336-.21-1.475-.135-3.134-.126-2.331.013-3.156.984-3.156.984s.437.645.693.812c.383.25.723.372.723 1.375-.012 1.667-.19 3.544-1.603 4.23-1.048.506-2.781-.869-5.171-5.092-.608-.972-.994-1.734-.994-1.734l-.102-.183A.683.683 0 0 0 3.74 6.42s-3.133-.013-3.3-.008c-.3.009-.518.11-.518.11Z"/></svg>
      });
    }
    
    if (socialData.linkedin) {
      links.push({
        platform: 'LinkedIn',
        url: socialData.linkedin,
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
      });
    }
    
    if (socialData.website) {
      links.push({
        platform: 'Website',
        url: socialData.website,
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073a42.153 42.153 0 00-.767-1.68c2.31-1 4.165-2.358 5.548-4.082a9.863 9.863 0 012.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68a46.287 46.287 0 00-3.488-5.438A9.955 9.955 0 0112 2.069c2.555 0 4.905.958 6.688 2.54a9.798 9.798 0 01-.645.55zm-8.56-2.483c1.083 1.317 2.379 3.1 3.884 5.354-2.656.698-5.717 1.078-9.124 1.154a10.063 10.063 0 014.521-6.498c.19-.103.385-.196.62-.283.043.091.088.183.133.274l-.034-.001zm-9.423 8.413c0-.144.014-.285.025-.426 3.875-.056 7.373-.474 10.422-1.27.22.438.431.879.629 1.322-3.827 1.209-6.746 3.229-8.749 6.221a9.855 9.855 0 01-2.327-5.847zm2.899 7.21c1.789-2.835 4.43-4.697 7.923-5.8 1.23 3.195 2.106 6.82 2.633 10.878A9.941 9.941 0 0112 22c-2.883 0-5.51-1.08-7.505-2.853.015-.04.03-.08.046-.119l-.001.003zm9.606 2.701c-.494-3.785-1.302-7.209-2.415-10.251 1.895-.307 3.988-.276 6.203.089a10.112 10.112 0 01-3.788 10.162z"/></svg>
      });
    }
    
    return links;
  };

  // Подготовка фильтров локаций
  const filterOptions = locations.map(loc => ({
    value: loc,
    label: loc === 'all' ? 'Все' : loc
  }));

  return (
    <section id="team" className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <h2 className="section-title text-center mx-auto mb-6">Наша команда</h2>
            <p className="text-center max-w-3xl mx-auto mb-16 text-lg">
              Каждый член команды DressCutur — профессионал своего дела, 
              вносящий уникальный вклад в создание идеальных изделий для наших клиентов
            </p>
          </motion.div>

          {/* Фильтры - показываем только если есть разные локации */}
          {locations.length > 2 && (
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  className={`px-5 py-2 rounded-full transition-all duration-300 ${
                    activeFilter === option.value
                      ? 'bg-primary text-white'
                      : 'bg-white text-dark hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveFilter(option.value)}
                  aria-pressed={activeFilter === option.value}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Состояние загрузки */}
          {loading ? (
            <motion.div variants={itemVariants} className="text-center py-12">
              <div className="inline-block animate-spin mr-2 h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <p>Загружаем нашу команду...</p>
            </motion.div>
          ) : (
            <>
              {/* Нет членов команды */}
              {teamMembers.length === 0 ? (
                <motion.div variants={itemVariants} className="text-center py-12">
                  <p>В настоящее время информация о команде еще не добавлена.</p>
                </motion.div>
              ) : (
                /* Сетка с членами команды */
                <motion.div 
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                  variants={itemVariants}
                >
                  {filteredMembers.map((member) => (
                    <TeamMember
                      key={member.id}
                      name={member.name}
                      role={member.position}
                      image={member.photo}
                      description={member.bio}
                      socialLinks={formatSocialLinks(member)}
                    />
                  ))}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
} 