import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Copy, Check, FolderGit2, Award, Download } from 'lucide-react';
import { CERTIFICATIONS, PERSONAL_INFO } from '../data/portfolioData';
import { formatThresholdCount, formatYearsExperience } from '../utils/metricFormatters';
import { getTotalPortfolioReadingTime } from '../utils/readingTime';
import { ReadingTimeBadge } from './ReadingTimeBadge';

interface HeroProps {
  darkMode: boolean;
  totalStars: number;
}

export const Hero: React.FC<HeroProps> = ({ darkMode, totalStars }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const totalReadingTime = getTotalPortfolioReadingTime();
  const certificationDisplay = formatThresholdCount(CERTIFICATIONS.length);
  const experienceDisplay = formatYearsExperience(PERSONAL_INFO.experienceStartDate);
  const metrics = PERSONAL_INFO.metrics.map(metric => {
    if (metric.label === 'Professional Certifications') {
      return { ...metric, value: certificationDisplay };
    }
    if (metric.label === 'GitHub Stars') {
      return { ...metric, value: formatThresholdCount(totalStars) };
    }
    if (metric.label === 'Years Experience') {
      return { ...metric, value: experienceDisplay };
    }
    return metric;
  });

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PERSONAL_INFO.email);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = PERSONAL_INFO.email;
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!copied) throw new Error('Copy command was rejected');
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <section id="about" className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
      {/* Background ambient gradient */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 opacity-25 ${
          darkMode
            ? 'bg-gradient-to-tr from-sky-600 to-indigo-700'
            : 'bg-gradient-to-tr from-sky-300 to-indigo-200'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Clear, Focused Bio & Value Proposition */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.04 },
              },
            }}
            className="order-2 lg:order-1 lg:col-span-7 flex flex-col space-y-6"
          >
            {/* Role & Location Pill + Estimated Reading Time */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="flex flex-wrap items-center gap-2.5 self-start"
            >
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border shadow-xs backdrop-blur-md transition-colors ${
                  darkMode
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="font-semibold text-sky-500">Software Engineer</span>
                <span className="opacity-30">·</span>
                <span>Ho Chi Minh City, Vietnam</span>
              </div>

              <ReadingTimeBadge
                text={`${totalReadingTime.text} total`}
                words={totalReadingTime.words}
                variant="header"
                darkMode={darkMode}
              />
            </motion.div>

            {/* Headline */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="space-y-3"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                <span className={darkMode ? 'text-white' : 'text-slate-900'}>Hi, I'm </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600">
                  {PERSONAL_INFO.name}
                </span>
                <span
                  className={`block text-xl sm:text-2xl lg:text-3xl font-bold mt-2 ${
                    darkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  Software Engineer · Cloud-Native & .NET Backend
                </span>
              </h1>

              <p
                className={`text-base sm:text-lg font-normal leading-relaxed max-w-2xl ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {PERSONAL_INFO.bio
                  .replace('2+', `${experienceDisplay}`)
                  .replace('30+', `${certificationDisplay}`)}
              </p>
            </motion.div>

            {/* Focused CTAs: Only 2 primary actions + clean email copy */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <motion.a
                href="#contact"
                id="hero-cta-contact"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 transition-all shadow-md shadow-sky-600/25 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                href="#"
                id="hero-cta-download-cv"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-medium text-sm transition-all border cursor-pointer ${
                  darkMode
                    ? 'border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                }`}
              >
                <Download className="w-4 h-4 text-sky-500" />
                <span>Download CV</span>
              </motion.a>

              <motion.a
                href="#projects"
                id="hero-cta-projects"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-medium text-sm transition-all border cursor-pointer ${
                  darkMode
                    ? 'border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                }`}
              >
                <FolderGit2 className="w-4 h-4 text-sky-500" />
                <span>View Projects</span>
              </motion.a>

              <motion.button
                onClick={handleCopyEmail}
                id="hero-cta-copy-email"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-1.5 px-4 py-3 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all border cursor-pointer ${
                  copiedEmail
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                    : darkMode
                      ? 'border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title="Copy candidate email"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column: Profile Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="hidden order-1 lg:order-2 lg:col-span-5 lg:flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[400px]">
              {/* Subtle ambient blur glow */}
              <div
                className={`absolute -inset-2 rounded-3xl blur-2xl opacity-30 -z-10 transition-colors ${
                  darkMode
                    ? 'bg-gradient-to-tr from-sky-500 to-indigo-600'
                    : 'bg-gradient-to-tr from-sky-300 to-indigo-300'
                }`}
              />

              {/* Avatar Frame Card */}
              <div
                className={`relative rounded-3xl overflow-hidden border shadow-2xl transition-all ${
                  darkMode
                    ? 'border-slate-800/90 bg-slate-900/80 shadow-black/50 backdrop-blur-md'
                    : 'border-slate-200/90 bg-white shadow-xl shadow-slate-200/60 backdrop-blur-md'
                }`}
              >
                {/* Photo container */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900 group">
                  <img
                    src="/avatar.png"
                    alt={`${PERSONAL_INFO.name} - Software Engineer`}
                    referrerPolicy="no-referrer"
                    onError={e => {
                      e.currentTarget.src = 'https://avatars.githubusercontent.com/u/56079798?v=4';
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient overlay for bottom legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Floating badges on photo */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <div className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-slate-950/80 text-white border border-white/15 flex items-center gap-2 shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>{PERSONAL_INFO.name}</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md bg-sky-500/85 text-white border border-white/20 shadow-lg flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>{certificationDisplay} Certs</span>
                    </div>
                  </div>
                </div>

                {/* Sub-card details */}
                <div
                  className={`p-4 flex items-center justify-between border-t ${
                    darkMode
                      ? 'border-slate-800/80 bg-slate-950/60'
                      : 'border-slate-100 bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sky-500/10 text-sky-500 border border-sky-500/20 font-bold text-xs">
                      VN
                    </div>
                    <div>
                      <div
                        className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}
                      >
                        {PERSONAL_INFO.location}
                      </div>
                      <div
                        className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                      >
                        Cloud-Native & .NET Backend
                      </div>
                    </div>
                  </div>

                  <a
                    href="#contact"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      darkMode
                        ? 'text-sky-400 hover:text-white hover:bg-slate-800'
                        : 'text-sky-700 hover:text-sky-900 hover:bg-sky-50'
                    }`}
                  >
                    <span>Connect</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* High-Level Impact Metrics Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                darkMode
                  ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 shadow-md'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-sm'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-600">
                {metric.value}
              </div>
              <div
                className={`text-xs sm:text-sm font-semibold mt-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}
              >
                {metric.label}
              </div>
              <div
                className={`text-[11px] sm:text-xs mt-0.5 leading-normal ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
              >
                {metric.subtext}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
