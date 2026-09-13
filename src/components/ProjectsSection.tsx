import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  FolderGit2,
  Star,
  GitFork,
  ExternalLink,
  Github,
  CheckCircle2,
  Boxes,
  Scale,
  Copy,
  Check,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { PROJECTS, PERSONAL_INFO } from '../data/portfolioData';
import { fetchGitHubRepo } from '../services/githubService';
import { GitHubRepoData } from '../types';

interface ProjectsSectionProps {
  darkMode: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ darkMode }) => {
  // Live GitHub repo data keyed by repoName ('BookWorm', 'LawKnowledge')
  const [featuredData, setFeaturedData] = useState<Record<string, GitHubRepoData>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Copied clone URL feedback state: repoName -> boolean
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);

  // Load GitHub data for BookWorm and LawKnowledge
  const loadGitHubData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [bookworm, lawknowledge] = await Promise.allSettled([
        fetchGitHubRepo('foxminchan', 'BookWorm', isManualRefresh),
        fetchGitHubRepo('foxminchan', 'LawKnowledge', isManualRefresh),
      ]);

      const featuredMap: Record<string, GitHubRepoData> = {};
      if (bookworm.status === 'fulfilled') {
        featuredMap['BookWorm'] = bookworm.value;
      }
      if (lawknowledge.status === 'fulfilled') {
        featuredMap['LawKnowledge'] = lawknowledge.value;
      }
      setFeaturedData(featuredMap);
    } catch (err) {
      console.warn('Could not complete live GitHub fetch, using cached/fallback metrics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGitHubData();
  }, []);

  const handleCopyClone = (cloneUrl: string, repoName: string) => {
    navigator.clipboard.writeText(`git clone ${cloneUrl}`);
    setCopiedRepo(repoName);
    setTimeout(() => {
      setCopiedRepo(null);
    }, 2500);
  };

  // Calculate live cumulative stars for BookWorm and LawKnowledge
  const totalStars = useMemo(() => {
    const bookwormStars = featuredData['BookWorm']?.starsCount ?? 505;
    const lawKnowledgeStars = featuredData['LawKnowledge']?.starsCount ?? 124;
    return bookwormStars + lawKnowledgeStars;
  }, [featuredData]);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Open-Source & Architectures</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Featured Projects
            </h2>
            <p
              className={`mt-2 text-base max-w-2xl ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Production-grade microservices, distributed systems, and domain-specific AI engines on
              GitHub.
            </p>
          </div>

          {/* Quick GitHub Profile & Live Star Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadGitHubData(true)}
              disabled={refreshing}
              title="Refresh live GitHub data"
              className={`p-2 rounded-xl border text-xs transition-all ${
                darkMode
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              id="view-all-github-projects"
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                darkMode
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 hover:text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-slate-900 shadow-xs'
              }`}
            >
              <Github className="w-4 h-4" />
              <span>@{PERSONAL_INFO.githubUsername}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                <Star className="w-3 h-3 fill-current" />
                {totalStars}+ stars
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </motion.div>

        {/* Featured Projects Grid: BookWorm and LawKnowledge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PROJECTS.map((project, idx) => {
            const live = project.repoName ? featuredData[project.repoName] : undefined;
            const starDisplay = live ? live.starsCount : project.stars;
            const forkDisplay = live ? live.forksCount : project.id === 'bookworm' ? 67 : 15;
            const languageDisplay =
              live?.language || (project.id === 'bookworm' ? 'C#' : 'TypeScript');
            const cloneUrl = live?.cloneUrl || `${project.githubUrl}.git`;
            const topics = live?.topics || [];

            return (
              <motion.div
                key={project.id}
                id={`project-card-${project.id}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  darkMode
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 shadow-lg shadow-black/30'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Top accent bar */}
                <div
                  className={`h-1.5 w-full ${
                    project.id === 'bookworm' ? 'bg-sky-500' : 'bg-indigo-500'
                  }`}
                />

                <div className="p-6 sm:p-7">
                  {/* Header: Domain Badge & Live Stars */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      {project.id === 'bookworm' ? (
                        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          <Boxes className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Scale className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-500">
                        {project.featuredBadge}
                      </span>
                    </div>

                    {/* Live Stats Pills */}
                    <div className="flex items-center gap-2">
                      <div
                        title="GitHub Stars"
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          darkMode
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        <span>{starDisplay}</span>
                      </div>
                      <div
                        title="GitHub Forks"
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                          darkMode
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <GitFork className="w-3 h-3" />
                        <span>{forkDisplay}</span>
                      </div>
                    </div>
                  </div>

                  {/* Repository Title */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className={`text-xs font-mono ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
                    >
                      foxminchan /
                    </span>
                    <h3
                      className={`text-2xl font-extrabold tracking-tight ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {project.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                        darkMode
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {languageDisplay}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed mb-5 ${
                      darkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {live?.description || project.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-5">
                    {project.highlights.map((highlight, idx) => {
                      const parts = highlight.split(':');
                      const hasPrefix = parts.length > 1;
                      return (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                            {hasPrefix ? (
                              <>
                                <strong
                                  className={
                                    darkMode
                                      ? 'text-white font-semibold'
                                      : 'text-slate-900 font-semibold'
                                  }
                                >
                                  {parts[0]}:
                                </strong>
                                {parts.slice(1).join(':')}
                              </>
                            ) : (
                              highlight
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tags fetched dynamically via GitHub API */}
                  {topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      {topics.map(topic => (
                        <span
                          key={topic}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium ${
                            darkMode
                              ? 'bg-slate-950 border border-slate-800 text-slate-300'
                              : 'bg-slate-100 border border-slate-200 text-slate-700'
                          }`}
                        >
                          <Tag className="w-3 h-3 text-sky-400 opacity-80" />
                          <span>#{topic}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div
                  className={`p-4 sm:p-5 border-t flex items-center gap-3 ${
                    darkMode
                      ? 'border-slate-800 bg-slate-950/40'
                      : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`project-github-${project.id}`}
                    aria-label={`View ${project.title} on GitHub`}
                    className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-sky-600 hover:bg-sky-500 flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
                  >
                    <Github className="w-4 h-4" />
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>

                  <button
                    onClick={() => handleCopyClone(cloneUrl, project.id)}
                    id={`copy-clone-${project.id}`}
                    title={`Copy clone command: git clone ${cloneUrl}`}
                    className={`py-2.5 px-3 rounded-xl font-medium text-xs border transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      copiedRepo === project.id
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : darkMode
                          ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                          : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {copiedRepo === project.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Clone</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
