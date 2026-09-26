import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  Mail,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { SECTION_READING_TIMES, getTotalPortfolioReadingTime } from '../utils/readingTime';

interface ScrollProgressBarProps {
  darkMode: boolean;
}

interface SectionMilestone {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: SectionMilestone[] = [
  { id: 'about', label: 'About', icon: Terminal },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ darkMode }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const [overallPercent, setOverallPercent] = useState<number>(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('about');
  const [activeSectionProgress, setActiveSectionProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Monitor scroll for section reading progress and visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;

      // Overall page percentage
      const totalPct =
        docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollPos / docHeight) * 100))) : 0;
      setOverallPercent(totalPct);

      // Only show the floating reading badge once scrolled past initial header area
      setIsVisible(scrollPos > 120);

      // Detect active section & calculate reading progress inside that section
      let currentSection = SECTIONS[0].id;
      let sectionProg = 0;

      for (let i = 0; i < SECTIONS.length; i++) {
        const sec = SECTIONS[i];
        const el = document.getElementById(sec.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const topOffset = rect.top;
        const sectionHeight = rect.height;

        // When the top of the section is at or above 30% of viewport and bottom is still below 15%
        if (topOffset <= windowHeight * 0.35 && rect.bottom >= windowHeight * 0.15) {
          currentSection = sec.id;
          // Calculate how much of this specific section has been scrolled past
          const scrolledInSection = Math.max(0, -topOffset + windowHeight * 0.2);
          sectionProg = Math.min(
            100,
            Math.max(0, Math.round((scrolledInSection / sectionHeight) * 100))
          );
          break;
        } else if (topOffset < windowHeight * 0.5) {
          currentSection = sec.id;
        }
      }

      setActiveSectionId(currentSection);
      setActiveSectionProgress(sectionProg);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeSection = useMemo(() => {
    return SECTIONS.find(s => s.id === activeSectionId) || SECTIONS[0];
  }, [activeSectionId]);

  const ActiveIcon = activeSection.icon;

  const totalReadingTime = useMemo(() => getTotalPortfolioReadingTime(), []);
  const activeReadingTime = SECTION_READING_TIMES[activeSectionId] || SECTION_READING_TIMES.about;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* 1. Hardware-accelerated viewport-top scroll line */}
      <div
        id="scroll-progress-viewport"
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none select-none bg-slate-900/10 dark:bg-slate-800/40"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={overallPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 origin-left shadow-[0_0_10px_rgba(14,165,233,0.6)]"
          style={{ scaleX }}
        />
      </div>

      {/* 2. Micro Floating Reading Progress Badge */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-[4.5rem] right-4 sm:right-6 z-[45] pointer-events-auto"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(prev => !prev)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all shadow-md cursor-pointer ${
                  darkMode
                    ? 'bg-slate-900/90 hover:bg-slate-850 border-slate-700/80 text-slate-200 hover:border-slate-600 shadow-black/40'
                    : 'bg-white/90 hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 shadow-slate-200/50'
                }`}
                title={`Currently reading ${activeSection.label} (~${activeReadingTime.text} · ${activeSectionProgress}% section, ${overallPercent}% total)`}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="p-1 rounded-full bg-sky-500/15 text-sky-400">
                  <ActiveIcon className="w-3 h-3" />
                </span>

                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {activeSection.label}
                </span>

                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  {activeReadingTime.text}
                </span>

                {/* Micro section progress bar */}
                <span className="flex items-center gap-1.5 pl-1 border-l border-slate-200 dark:border-slate-700/80">
                  <span className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                    <span
                      className="h-full bg-sky-500 rounded-full transition-all duration-150"
                      style={{ width: `${activeSectionProgress}%` }}
                    />
                  </span>
                  <span className="font-mono text-[11px] text-sky-500 font-semibold">
                    {overallPercent}%
                  </span>
                </span>

                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Section Jump Dropdown */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.16 }}
                    className={`absolute right-0 mt-2 w-64 rounded-xl border p-2 shadow-xl backdrop-blur-md z-10 ${
                      darkMode
                        ? 'bg-slate-900/95 border-slate-800 text-slate-200 shadow-black/60'
                        : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/40'
                    }`}
                  >
                    <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800 mb-1">
                      <span>Jump to Section</span>
                      <span>Read Time</span>
                    </div>
                    {SECTIONS.map(sec => {
                      const Icon = sec.icon;
                      const isCurrent = sec.id === activeSectionId;
                      const secReadingTime = SECTION_READING_TIMES[sec.id];
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => scrollToSection(sec.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-sky-500/15 text-sky-400 font-semibold'
                              : darkMode
                                ? 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-sky-400" />
                            <span>{sec.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            {isCurrent && (
                              <span className="text-[10px] px-1 py-0.5 rounded bg-sky-500/20 text-sky-400 font-sans">
                                Active
                              </span>
                            )}
                            <span className="text-slate-400 dark:text-slate-500">
                              {secReadingTime ? secReadingTime.text : '~1 min'}
                            </span>
                          </div>
                        </button>
                      );
                    })}

                    {/* Total Reading Time Footer */}
                    <div className="mt-1 pt-1.5 border-t border-slate-200 dark:border-slate-800 px-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" />
                        Total Read:
                      </span>
                      <span className="font-semibold text-sky-400">
                        {totalReadingTime.text} (~{totalReadingTime.words} words)
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
