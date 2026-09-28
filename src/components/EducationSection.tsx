import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Trophy,
  CheckCircle2,
  Medal,
  Building2,
  Sparkles,
  Filter,
} from 'lucide-react';
import { EDUCATION } from '../data/portfolioData';
import { SECTION_READING_TIMES } from '../utils/readingTime';
import { ReadingTimeBadge } from './ReadingTimeBadge';

interface EducationSectionProps {
  darkMode: boolean;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ darkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const edu = EDUCATION[0];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    edu?.honors.forEach(h => {
      if (h.category) cats.add(h.category);
    });
    return ['all', ...Array.from(cats)];
  }, [edu]);

  const filteredHonors = useMemo(() => {
    if (!edu) return [];
    if (selectedCategory === 'all') return edu.honors;
    return edu.honors.filter(h => h.category === selectedCategory);
  }, [edu, selectedCategory]);

  if (!edu) return null;

  return (
    <section
      id="education"
      className={`py-20 border-t ${
        darkMode ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50/60 border-slate-200'
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
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academics &amp; Honors</span>
            </div>
            {SECTION_READING_TIMES.education && (
              <ReadingTimeBadge
                text={SECTION_READING_TIMES.education.text}
                words={SECTION_READING_TIMES.education.words}
                darkMode={darkMode}
              />
            )}
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Education &amp; Academic Honors
          </h2>
          <p
            className={`mt-2 text-base max-w-2xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Formal degree in Information Technology paired with national-level informatics
            competitions and software innovation awards.
          </p>
        </motion.div>

        {/* Primary Education Degree Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl border p-6 sm:p-8 mb-12 transition-all relative overflow-hidden ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl shadow-black/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
          }`}
        >
          {/* Subtle decorative background gradient */}
          <div
            className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-30 ${
              darkMode ? 'bg-indigo-500/15' : 'bg-indigo-400/10'
            }`}
          />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Institution and Degree Details */}
              <div className="flex items-start gap-4 sm:gap-5">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                    darkMode
                      ? 'bg-slate-800/90 border-slate-700 text-indigo-400 shadow-inner'
                      : 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-xs'
                  }`}
                >
                  <GraduationCap className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        darkMode
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {edu.status || 'Graduated'}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        darkMode
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      Grade: {edu.grade}
                    </span>
                  </div>

                  <h3
                    className={`text-xl sm:text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {edu.institution}
                  </h3>

                  <p
                    className={`text-base sm:text-lg font-medium ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`}
                  >
                    {edu.degree}, {edu.fieldOfStudy}
                  </p>
                </div>
              </div>

              {/* Meta details: Period and Location */}
              <div
                className={`flex md:flex-col items-start md:items-end gap-3 text-xs sm:text-sm font-medium ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  <span>{edu.period}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{edu.location}</span>
                </div>
              </div>
            </div>

            {/* Academic Highlights & Key Notes */}
            {edu.highlights && edu.highlights.length > 0 && (
              <div
                className={`mt-6 pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 ${
                  darkMode ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                {edu.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        darkMode ? 'text-indigo-400' : 'text-indigo-600'
                      }`}
                    />
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Honors & Awards Subheader */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${
                darkMode
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-amber-50 text-amber-600 border-amber-200'
              }`}
            >
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold tracking-tight ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Honors &amp; Awards
              </h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {edu.honors.length} competitive programming &amp; software awards earned during
                university
              </p>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-xs mr-1 hidden sm:flex items-center gap-1 ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? darkMode
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-indigo-600 text-white shadow-xs'
                      : darkMode
                        ? 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Awards' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Honors & Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredHonors.map((honor, idx) => {
              const isOlympiad = honor.category === 'National Olympiad';
              const isHackathon = honor.category === 'Innovation & Hackathon';

              return (
                <motion.div
                  key={honor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all group ${
                    darkMode
                      ? 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900 shadow-md'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Card Top Row: Category and Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          isOlympiad
                            ? darkMode
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                            : isHackathon
                              ? darkMode
                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                              : darkMode
                                ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                                : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}
                      >
                        {honor.category || 'Award'}
                      </span>

                      <span
                        className={`text-xs font-mono font-medium flex items-center gap-1.5 ${
                          darkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {honor.date}
                      </span>
                    </div>

                    {/* Award Title */}
                    <div className="flex items-start gap-3 mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 transition-transform group-hover:scale-105 ${
                          isOlympiad
                            ? darkMode
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                              : 'bg-amber-100 border-amber-200 text-amber-600'
                            : isHackathon
                              ? darkMode
                                ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                                : 'bg-purple-100 border-purple-200 text-purple-600'
                              : darkMode
                                ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                                : 'bg-sky-100 border-sky-200 text-sky-600'
                        }`}
                      >
                        <Medal className="w-5 h-5" />
                      </div>

                      <div>
                        <h4
                          className={`text-base sm:text-lg font-bold leading-snug ${
                            darkMode
                              ? 'text-slate-100 group-hover:text-white'
                              : 'text-slate-900 group-hover:text-indigo-950'
                          }`}
                        >
                          {honor.title}
                        </h4>
                        <p
                          className={`text-xs mt-1 font-medium ${
                            darkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          Issued by{' '}
                          <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>
                            {honor.issuer}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Associated With Institution Tag */}
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg mb-3 ${
                        darkMode
                          ? 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                          : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{honor.associatedWith}</span>
                    </div>

                    {/* Award Description */}
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        darkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {honor.description}
                    </p>
                  </div>

                  {/* Card Bottom Tag */}
                  {honor.highlightBadge && (
                    <div className="mt-4 pt-3 border-t flex items-center justify-between border-slate-200/40 dark:border-slate-800">
                      <span
                        className={`text-[11px] font-medium flex items-center gap-1 ${
                          darkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Distinction
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                          darkMode
                            ? 'bg-slate-800 text-slate-200 border border-slate-700'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {honor.highlightBadge}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
