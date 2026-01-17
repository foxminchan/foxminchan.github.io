import { AboutSection } from '@/components/about-section';
import { AnimatedBackground } from '@/components/animated-background';
import { ContactSection } from '@/components/contact-section';
import { ExperienceSection } from '@/components/experience-section';
import { HeroSection } from '@/components/hero-section';
import { Navigation } from '@/components/navigation';
import { ProjectsSection } from '@/components/projects-section';
import { SkillsSection } from '@/components/skills-section';
import { StructuredData } from '@/components/structured-data';

export default function PortfolioPage() {
  return (
    <>
      <StructuredData />
      <AnimatedBackground />
      <Navigation />
      <main id="main-content" className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </>
  );
}
