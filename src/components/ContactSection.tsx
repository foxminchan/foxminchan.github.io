import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Copy, Check, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Linkedin, Github } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ContactQRCode } from './ContactQRCode';
import { SECTION_READING_TIMES } from '../utils/readingTime';
import { ReadingTimeBadge } from './ReadingTimeBadge';

interface ContactSectionProps {
  darkMode: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ darkMode }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => {
        setCopiedEmail(false);
      }, 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <section
      id="contact"
      className={`py-20 border-t transition-colors ${
        darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/50 border-slate-200'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-500 border border-sky-500/20">
              <Mail className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>
            <ReadingTimeBadge
              text={SECTION_READING_TIMES.contact.text}
              words={SECTION_READING_TIMES.contact.words}
              darkMode={darkMode}
            />
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Let’s Connect
          </h2>
          <p
            className={`mt-3 text-base leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Feel free to reach out for software engineering opportunities, cloud architecture
            discussions, or open-source collaboration.
          </p>
        </motion.div>

        {/* 3 Simple Direct Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            whileHover={{ y: -3 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div>
              <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Email
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 font-mono break-all">
                {PERSONAL_INFO.email}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                id="contact-email-mailto-btn"
                className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 text-center transition-colors"
              >
                Send Email
              </a>
              <button
                onClick={handleCopyEmail}
                id="contact-email-copy-btn"
                title="Copy email address"
                className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                  copiedEmail
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : darkMode
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>

          {/* LinkedIn Card */}
          <motion.a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-linkedin-btn"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            whileHover={{ y: -3 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all group cursor-pointer ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 hover:border-sky-500/50 hover:bg-slate-850 shadow-sm'
                : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Linkedin className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3
                className={`text-base font-bold transition-colors group-hover:text-sky-400 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                LinkedIn
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">linkedin.com/in/nxnhan</p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold text-sky-500 flex items-center gap-1">
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </motion.a>

          {/* GitHub Card */}
          <motion.a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-github-btn"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.19 }}
            whileHover={{ y: -3 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all group cursor-pointer ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 shadow-sm'
                : 'bg-white border-slate-200 hover:border-purple-400 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Github className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3
                className={`text-base font-bold transition-colors group-hover:text-purple-400 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                GitHub
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">github.com/foxminchan</p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold text-purple-400 flex items-center gap-1">
              <span>View Repositories</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </motion.a>
        </div>

        {/* QR Code Quick Save Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mb-10"
        >
          <ContactQRCode darkMode={darkMode} />
        </motion.div>

        {/* Location & Status Footer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border text-xs ${
            darkMode
              ? 'bg-slate-900/50 border-slate-800 text-slate-400'
              : 'bg-slate-100/70 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>
              Based in{' '}
              <strong className={darkMode ? 'text-slate-200' : 'text-slate-800'}>
                {PERSONAL_INFO.location}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Open to remote & hybrid opportunities</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
