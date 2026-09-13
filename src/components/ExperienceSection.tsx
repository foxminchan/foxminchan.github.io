import React from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';

interface ExperienceSectionProps {
  darkMode: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ darkMode }) => {
  return (
    <section
      id="experience"
      className={`py-20 border-t ${
        darkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50/50 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career & Enterprise Delivery</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Work Experience
          </h2>
          <p
            className={`mt-2 text-base max-w-2xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Track record of shipping mission-critical enterprise systems, microservices migrations,
            and DevOps automations.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-sky-500/30 space-y-12 ml-2 sm:ml-4">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="relative group"
            >
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[33px] sm:-left-[41px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform duration-200 group-hover:scale-125 ${
                  exp.isCurrent
                    ? 'bg-emerald-500 border-emerald-300 ring-4 ring-emerald-500/20'
                    : darkMode
                      ? 'bg-slate-900 border-sky-400'
                      : 'bg-white border-sky-600'
                }`}
              />

              {/* Main Card */}
              <div
                className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                  darkMode
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-lg shadow-black/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3
                        className={`text-xl sm:text-2xl font-bold tracking-tight ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {exp.role}
                      </h3>
                      {exp.isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Current Role
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm mt-1 text-sky-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {exp.company}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-400 font-normal">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg self-start sm:self-auto bg-slate-500/10 text-slate-400 border border-slate-500/20">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {/* Sub-projects (if multi-project like KMS) */}
                {exp.projects && exp.projects.length > 0 && (
                  <div className="space-y-8 mt-6">
                    {exp.projects.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className={`p-5 rounded-xl border ${
                          darkMode
                            ? 'bg-slate-950/60 border-slate-800'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                          <h4
                            className={`text-base sm:text-lg font-bold ${
                              darkMode ? 'text-slate-100' : 'text-slate-900'
                            }`}
                          >
                            {proj.name}
                          </h4>
                          <span className="text-xs font-mono text-sky-500 font-medium">
                            {proj.domain}
                          </span>
                        </div>

                        {/* Bullet achievements */}
                        <ul className="space-y-2.5 mb-4">
                          {proj.points.map((point, ptIdx) => (
                            <li
                              key={ptIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed"
                            >
                              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* Project Tech Stack */}
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-700/30">
                          {proj.techStack.map(tech => (
                            <span
                              key={tech}
                              className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                                darkMode
                                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                  : 'bg-white text-slate-700 border border-slate-300'
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Single Role Points (NashTech, Bitto Solution) */}
                {exp.points && (
                  <ul className="space-y-2.5 mt-4">
                    {exp.points.map((point, ptIdx) => (
                      <li
                        key={ptIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech Stack for single role */}
                {exp.techStack && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/30">
                    {exp.techStack.map(tech => (
                      <span
                        key={tech}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono ${
                          darkMode
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
