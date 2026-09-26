import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Keyboard,
  X,
  Sun,
  Share2,
  RefreshCw,
  ArrowUp,
  Terminal,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  Mail,
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenShare: () => void;
  onRefreshData?: () => void;
  onScrollToTop?: () => void;
  onNavigateSection?: (sectionId: string, label: string) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  onToggleTheme,
  onOpenShare,
  onRefreshData,
  onScrollToTop,
  onNavigateSection,
}) => {
  // Prevent body scroll when modal is open (desktop mode only)
  useEffect(() => {
    if (isOpen && window.innerWidth >= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const actions = [
    {
      keys: ['T'],
      label: 'Toggle Theme',
      description: 'Switch between Dark and Light mode',
      icon: Sun,
      action: () => {
        onToggleTheme();
      },
    },
    {
      keys: ['S'],
      label: 'Share Modal',
      description: 'Open social sharing and OpenGraph preview',
      icon: Share2,
      action: () => {
        onClose();
        setTimeout(onOpenShare, 100);
      },
    },
    {
      keys: ['R'],
      label: 'Refresh GitHub',
      description: 'Fetch latest live repository metrics & stars',
      icon: RefreshCw,
      action: () => {
        onRefreshData?.();
        onClose();
      },
    },
    {
      keys: ['G'],
      label: 'Scroll to Top',
      description: 'Smoothly scroll to the top of the page',
      icon: ArrowUp,
      action: () => {
        if (onScrollToTop) {
          onScrollToTop();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        onClose();
      },
    },
    {
      keys: ['?'],
      label: 'Shortcuts Help',
      description: 'Toggle this keyboard shortcuts dialog',
      icon: Keyboard,
      action: onClose,
    },
    {
      keys: ['Esc'],
      label: 'Close Modals',
      description: 'Dismiss any active popup or dialog',
      icon: X,
      action: onClose,
    },
  ];

  const navigations = [
    {
      keys: ['1'],
      id: 'about',
      label: 'About',
      description: 'Hero, profile, live stats & bio',
      icon: Terminal,
    },
    {
      keys: ['2'],
      id: 'experience',
      label: 'Experience',
      description: 'Cloud microservices & architecture history',
      icon: Briefcase,
    },
    {
      keys: ['3'],
      id: 'projects',
      label: 'Projects',
      description: 'Featured repositories & architectural systems',
      icon: FolderGit2,
    },
    {
      keys: ['4'],
      id: 'skills',
      label: 'Skills',
      description: 'Categorized technical proficiencies',
      icon: Cpu,
    },
    {
      keys: ['5'],
      id: 'certifications',
      label: 'Certifications',
      description: '30+ verified credentials gallery',
      icon: Award,
    },
    {
      keys: ['6'],
      id: 'contact',
      label: 'Contact',
      description: 'Reach out, social links & contact QR code',
      icon: Mail,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 hidden md:flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-auto ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/60'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${
                darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    darkMode
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : 'bg-sky-50 text-sky-600 border-sky-200'
                  }`}
                >
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Keyboard Shortcuts</h3>
                  <p className="text-xs text-slate-400">
                    Navigate and interact without leaving your keyboard
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className={`p-2 rounded-xl border transition-colors ${
                  darkMode
                    ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Quick Actions */}
              <div>
                <h4
                  className={`text-xs font-mono font-semibold uppercase tracking-wider mb-3 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Quick Actions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {actions.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                          darkMode
                            ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-sky-500 shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="text-xs font-semibold">{item.label}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {item.keys.map(k => (
                            <kbd
                              key={k}
                              className={`px-2 py-0.5 text-xs font-mono font-bold rounded border shadow-xs ${
                                darkMode
                                  ? 'bg-slate-800 text-sky-400 border-slate-700'
                                  : 'bg-white text-sky-700 border-slate-200'
                              }`}
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Navigation */}
              <div>
                <h4
                  className={`text-xs font-mono font-semibold uppercase tracking-wider mb-3 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Section Navigation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {navigations.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigateSection?.(item.id, item.label);
                          onClose();
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                          darkMode
                            ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="text-xs font-semibold">{item.label}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {item.keys.map(k => (
                            <kbd
                              key={k}
                              className={`px-2 py-0.5 text-xs font-mono font-bold rounded border shadow-xs ${
                                darkMode
                                  ? 'bg-slate-800 text-emerald-400 border-slate-700'
                                  : 'bg-white text-emerald-700 border-slate-200'
                              }`}
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`px-6 py-3 border-t flex items-center justify-between text-xs text-slate-400 ${
                darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span>Shortcuts are disabled while typing in input fields.</span>
              <kbd
                className={`px-2 py-0.5 text-[11px] font-mono rounded border ${
                  darkMode
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Press Esc to close
              </kbd>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
