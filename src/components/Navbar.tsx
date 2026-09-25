import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Award,
  Briefcase,
  FolderGit2,
  Cpu,
  Mail,
  Github,
  Linkedin,
  Sun,
  Moon,
  Menu,
  X,
  Share2,
} from 'lucide-react';
import { CERTIFICATIONS, PERSONAL_INFO } from '../data/portfolioData';
interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenShare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleTheme, onOpenShare }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about', icon: Terminal },
    { label: 'Experience', href: '#experience', icon: Briefcase },
    { label: 'Projects', href: '#projects', icon: FolderGit2 },
    { label: 'Skills', href: '#skills', icon: Cpu },
    {
      label: 'Certifications',
      href: '#certifications',
      icon: Award,
      badge: String(CERTIFICATIONS.length),
    },
    { label: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? darkMode
            ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20'
            : 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-md shadow-slate-200/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a href="#about" id="nav-brand-link" className="flex shrink-0 items-center gap-2.5 group">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center p-1 transition-all duration-200 border ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 shadow-md shadow-orange-500/10 group-hover:border-orange-500/30'
                  : 'bg-white border-slate-200 shadow-xs group-hover:border-orange-400/40'
              }`}
            >
              <img
                src="/favicon-32x32.png"
                alt="foxminchan logo"
                className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            <div className="hidden flex-col sm:flex">
              <span
                className={`whitespace-nowrap text-base font-bold tracking-tight ${
                  darkMode
                    ? 'text-slate-100 group-hover:text-white'
                    : 'text-slate-900 group-hover:text-sky-700'
                }`}
              >
                {PERSONAL_INFO.name}
              </span>
              <span
                className={`-mt-1 hidden text-xs font-mono sm:block ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Software Engineer
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 lg:gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  id={`nav-link-${item.label.toLowerCase()}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    darkMode
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                        darkMode
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-sky-100 text-sky-700 border border-sky-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Action Icons & Theme Toggle */}
          <div className="flex items-center gap-2">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              id="nav-github-link"
              aria-label="GitHub Profile"
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              id="nav-linkedin-link"
              aria-label="LinkedIn Profile"
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {onOpenShare && (
              <button
                onClick={onOpenShare}
                id="nav-share-btn"
                aria-label="Share Portfolio & View OG Card"
                title="Social Share & OG Card Preview"
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'text-slate-300 hover:text-sky-400 hover:bg-slate-800'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
                }`}
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onToggleTheme}
              id="theme-toggle-btn"
              aria-label="Toggle light or dark theme"
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'text-amber-400 hover:bg-slate-800'
                  : 'text-indigo-600 hover:bg-slate-100'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className={`xl:hidden p-2 rounded-lg transition-colors ${
                darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className={`xl:hidden px-4 pt-2 pb-6 border-b overflow-hidden ${
              darkMode
                ? 'bg-slate-950/95 border-slate-800 text-slate-100'
                : 'bg-white/95 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex flex-col gap-2 pt-2">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium ${
                      darkMode
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-sky-500" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}

              {onOpenShare && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenShare();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-left ${
                    darkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-sky-500" />
                    <span>Social Media &amp; OG Card</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase">
                    1200×630
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
