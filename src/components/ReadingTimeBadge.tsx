import React from 'react';
import { Clock } from 'lucide-react';

interface ReadingTimeBadgeProps {
  text: string;
  words?: number;
  variant?: 'header' | 'card' | 'hero' | 'minimal';
  darkMode: boolean;
  className?: string;
}

export const ReadingTimeBadge: React.FC<ReadingTimeBadgeProps> = ({
  text,
  words,
  variant = 'header',
  darkMode,
  className = '',
}) => {
  const tooltipText = words
    ? `Estimated reading time: ${text} (~${words} words at 200 wpm)`
    : `Estimated reading time: ${text}`;

  if (variant === 'hero') {
    return (
      <div
        title={tooltipText}
        aria-label={tooltipText}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-xs transition-colors shadow-2xs ${
          darkMode
            ? 'bg-slate-900/80 border-slate-700/80 text-slate-300'
            : 'bg-white border-slate-200 text-slate-700'
        } ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="font-semibold text-sky-400">{text}</span>
        {words && (
          <>
            <span className="opacity-30">·</span>
            <span className="text-[11px] opacity-80 font-mono">~{words} words</span>
          </>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <span
        title={tooltipText}
        aria-label={tooltipText}
        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        } ${className}`}
      >
        <Clock className="w-3 h-3 text-sky-400" />
        <span>{text}</span>
      </span>
    );
  }

  // 'header' & 'card' variants
  return (
    <div
      title={tooltipText}
      aria-label={tooltipText}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
        darkMode
          ? 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-slate-600'
          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs'
      } ${className}`}
    >
      <Clock className="w-3 h-3 text-sky-400 shrink-0" />
      <span className="font-semibold text-sky-400">{text}</span>
      {words && (
        <span className="text-[10px] font-mono opacity-70 hidden sm:inline">
          ({words}w)
        </span>
      )}
    </div>
  );
};
