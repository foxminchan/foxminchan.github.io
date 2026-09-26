import { useEffect, useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PROJECTS } from './data/portfolioData';

import { CertificationsSection } from './components/CertificationsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SocialShareModal } from './components/SocialShareModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ShortcutToast } from './components/ShortcutToast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFeaturedRepos } from './hooks/useGitHubData';
import {
  darkModeAtom,
  shareModalOpenAtom,
  shortcutsModalOpenAtom,
  shortcutToastAtom,
} from './store/atoms';

export default function App() {
  // Global atomic state with Jotai
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [shareOpen, setShareOpen] = useAtom(shareModalOpenAtom);
  const [shortcutsOpen, setShortcutsOpen] = useAtom(shortcutsModalOpenAtom);
  const [toast, setToast] = useAtom(shortcutToastAtom);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // TanStack Query + Axios for GitHub repository metrics & star aggregation
  const { featuredData, isFetching, refetch, totalStars } = useFeaturedRepos(PROJECTS);

  const showToast = useCallback(
    (message: string, keyHint?: string) => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      setToast({ message, keyHint });
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 1800);
    },
    [setToast]
  );

  // Synchronize document element class with theme atom
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
  }, [setDarkMode]);

  const handleNavigateSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  }, []);

  // Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onToggleTheme: toggleTheme,
    onOpenShare: () => setShareOpen(prev => !prev),
    onToggleShortcutsModal: () => setShortcutsOpen(prev => !prev),
    onCloseModals: () => {
      setShortcutsOpen(false);
      setShareOpen(false);
    },
    onRefreshData: () => void refetch(),
    onScrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    onNavigateSection: handleNavigateSection,
    showToast,
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Scroll Progress Indicator (Viewport-Top & Long Section Tracking) */}
      <ScrollProgressBar darkMode={darkMode} />

      {/* Navigation Header */}
      <Navbar
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onOpenShare={() => setShareOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      {/* Main Content */}
      <main id="main-content">
        <Hero darkMode={darkMode} totalStars={totalStars} />
        <ExperienceSection darkMode={darkMode} />
        <ProjectsSection
          darkMode={darkMode}
          featuredData={featuredData}
          refreshing={isFetching}
          onRefresh={() => void refetch()}
        />
        <SkillsSection darkMode={darkMode} />
        <CertificationsSection darkMode={darkMode} />
        <ContactSection darkMode={darkMode} />
      </main>

      {/* Footer */}
      <Footer
        darkMode={darkMode}
        onOpenShare={() => setShareOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      {/* Social Media & OpenGraph Preview Modal */}
      <SocialShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        darkMode={darkMode}
      />

      {/* Global Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onOpenShare={() => setShareOpen(true)}
        onRefreshData={() => void refetch()}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateSection={handleNavigateSection}
      />

      {/* Shortcut Feedback Toast HUD */}
      <ShortcutToast toast={toast} darkMode={darkMode} />
    </div>
  );
}
