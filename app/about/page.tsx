'use client';

import Hero from './components/Hero';
import StorySection from './components/StorySection';
import TeamSection from './components/TeamSection';
import ValuesSection from './components/ValuesSection';
import WorkspaceSection from './components/WorkspaceSection';
import AchievementsSection from './components/AchievementsSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactCTA from './components/ContactCTA';

export default function AboutPage() {

  return (
    <main id="main-content" className="min-h-screen bg-light">
      {/* Hero section */}
      <Hero />
      
      {/* Story section */}
      <StorySection />
      
      {/* Team section */}
      <TeamSection />
      
      {/* Values section */}
      <ValuesSection />
      
      {/* Workspace section */}
      <WorkspaceSection />
      
      {/* Achievements section */}
      <AchievementsSection />
      
      {/* Testimonials section */}
      <TestimonialsSection />
      
      {/* Contact CTA section */}
      <ContactCTA />
    </main>
  );
} 