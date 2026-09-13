import React, { useState, useEffect, useRef } from 'react';
import { Award } from 'lucide-react';

interface LazyBadgeProps {
  src?: string;
  alt: string;
  className?: string;
  darkMode?: boolean;
  width?: number;
  height?: number;
}

export const LazyBadge: React.FC<LazyBadgeProps> = ({
  src,
  alt,
  className = '',
  darkMode = false,
  width = 144,
  height = 144,
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If IntersectionObserver is not available, immediately load
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        rootMargin: '250px 0px', // Preload when within 250px of viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-36 h-36 max-w-[150px] max-h-[150px]"
      style={{ minHeight: `${height}px`, minWidth: `${width}px` }}
    >
      {/* Loading Skeleton Placeholder */}
      {(!isLoaded || !isInView) && !hasError && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 rounded-2xl animate-pulse flex items-center justify-center transition-opacity duration-300 ${
            darkMode ? 'bg-slate-800/50' : 'bg-slate-100'
          }`}
        >
          <Award
            className={`w-8 h-8 opacity-25 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
          />
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div
          className={`w-full h-full rounded-2xl flex flex-col items-center justify-center p-2 text-center border ${
            darkMode
              ? 'bg-slate-800/40 border-slate-700 text-slate-400'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <Award className="w-10 h-10 text-amber-500/70 mb-1" />
          <span className="text-[10px] font-mono leading-tight">Badge Verified</span>
        </div>
      ) : (
        isInView &&
        src && (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`${className} ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } transition-all duration-300 object-contain`}
          />
        )
      )}
    </div>
  );
};
