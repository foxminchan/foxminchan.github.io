import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  darkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`py-12 border-t ${
        darkMode
          ? 'bg-slate-950 border-slate-900 text-slate-400'
          : 'bg-white border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="foxminchan logo" className="w-6 h-6 object-contain" />
              <span
                className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
              >
                {PERSONAL_INFO.name}
              </span>
              <span className="text-xs font-mono text-sky-500">· Software Engineer</span>
            </div>
            <p className="text-xs text-slate-500">
              Building resilient cloud-native architectures, distributed systems, and open-source
              tooling.
            </p>
          </div>

          {/* Social Links & Back to top */}
          <div className="flex items-center gap-4">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:text-white hover:bg-slate-900'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:text-white hover:bg-slate-900'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:text-white hover:bg-slate-900'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <button
              onClick={scrollToTop}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                darkMode
                  ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono">
          <span>
            © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
          </span>
          <span>Designed with modern .NET & Cloud engineering aesthetic.</span>
        </div>
      </div>
    </footer>
  );
};
