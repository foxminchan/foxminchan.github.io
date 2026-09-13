import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PROJECTS } from './data/portfolioData';
import { fetchGitHubRepo } from './services/githubService';
import { GitHubRepoData } from './types';

import { CertificationsSection } from './components/CertificationsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [featuredData, setFeaturedData] = useState<Record<string, GitHubRepoData>>({});
  const [refreshing, setRefreshing] = useState(false);

  const loadGitHubData = async (isManualRefresh = false) => {
    setRefreshing(isManualRefresh);

    try {
      const repos = await Promise.allSettled(
        PROJECTS.filter(project => project.repoName).map(project =>
          fetchGitHubRepo('foxminchan', project.repoName!, isManualRefresh)
        )
      );
      const repoMap: Record<string, GitHubRepoData> = {};

      repos.forEach((repo, index) => {
        const repoName = PROJECTS.filter(project => project.repoName)[index].repoName;
        if (repo.status === 'fulfilled' && repoName) {
          repoMap[repoName] = repo.value;
        }
      });

      setFeaturedData(repoMap);
    } catch (error) {
      console.warn('Could not complete live GitHub fetch, using cached/default metrics', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadGitHubData();
  }, []);

  const totalStars = PROJECTS.reduce((total, project) => {
    const liveStars = project.repoName ? featuredData[project.repoName]?.starsCount : undefined;
    return total + (liveStars ?? Number.parseInt(project.stars, 10));
  }, 0);

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
        <Hero darkMode={darkMode} totalStars={totalStars} />
        <ExperienceSection darkMode={darkMode} />
        <ProjectsSection
          darkMode={darkMode}
          featuredData={featuredData}
          refreshing={refreshing}
          onRefresh={() => void loadGitHubData(true)}
        />
        <SkillsSection darkMode={darkMode} />
        <CertificationsSection darkMode={darkMode} />
        <ContactSection darkMode={darkMode} />
      </main>

      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
}
