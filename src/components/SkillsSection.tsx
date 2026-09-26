import React from 'react';
import { motion } from 'motion/react';
import { Server, Cloud, GitBranch, Bot, Code2 } from 'lucide-react';
import { SKILL_GROUPS } from '../data/portfolioData';
import { SECTION_READING_TIMES } from '../utils/readingTime';
import { ReadingTimeBadge } from './ReadingTimeBadge';

interface SkillsSectionProps {
  darkMode: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ darkMode }) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server':
        return <Server className="w-5 h-5 text-sky-400" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-indigo-400" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-purple-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-emerald-400" />;
      default:
        return <Code2 className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Code2 className="w-3.5 h-3.5" />
              <span>Technical Capabilities</span>
            </div>
            <ReadingTimeBadge
              text={SECTION_READING_TIMES.skills.text}
              words={SECTION_READING_TIMES.skills.words}
              darkMode={darkMode}
            />
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Engineering Stack & Skills
          </h2>
          <p
            className={`mt-2 text-base max-w-2xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Core engineering competencies across modern .NET distributed systems, cloud
            infrastructure, CI/CD automation, and intelligent agents.
          </p>
        </motion.div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILL_GROUPS.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700/80'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div
                    className={`p-2 rounded-xl border ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    {getCategoryIcon(group.iconName)}
                  </div>
                  <h3
                    className={`text-sm font-bold tracking-tight ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {group.category}
                  </h3>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        skill.highlight
                          ? darkMode
                            ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                            : 'bg-sky-50 text-sky-700 border-sky-200 font-semibold'
                          : darkMode
                            ? 'bg-slate-950/60 text-slate-300 border-slate-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
