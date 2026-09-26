import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command } from 'lucide-react';

interface ShortcutToastProps {
  toast: { message: string; keyHint?: string } | null;
  darkMode: boolean;
}

export const ShortcutToast: React.FC<ShortcutToastProps> = ({ toast, darkMode }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.message + (toast.keyHint || '')}
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none hidden md:block"
        >
          <div
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium shadow-xl border backdrop-blur-md ${
              darkMode
                ? 'bg-slate-900/90 text-slate-100 border-slate-700/80 shadow-black/40'
                : 'bg-white/95 text-slate-900 border-slate-200/90 shadow-slate-300/40'
            }`}
          >
            <Command className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>{toast.message}</span>
            {toast.keyHint && (
              <kbd
                className={`ml-1 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded border uppercase ${
                  darkMode
                    ? 'bg-slate-800 text-sky-400 border-slate-700'
                    : 'bg-slate-100 text-sky-700 border-slate-200'
                }`}
              >
                {toast.keyHint}
              </kbd>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
