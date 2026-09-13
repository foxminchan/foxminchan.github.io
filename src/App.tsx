/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CertificationsSection } from './components/CertificationsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  // Modern theme: default to dark theme
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved) return saved === 'dark';
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Navigation Header */}
      <Navbar darkMode={darkMode} onToggleTheme={toggleTheme} />

      {/* Main Content */}
      <main id="main-content">
        <Hero darkMode={darkMode} />
        <ExperienceSection darkMode={darkMode} />
        <ProjectsSection darkMode={darkMode} />
        <SkillsSection darkMode={darkMode} />
        <CertificationsSection darkMode={darkMode} />
        <ContactSection darkMode={darkMode} />
      </main>

      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
}
