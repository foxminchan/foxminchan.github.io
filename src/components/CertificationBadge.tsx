import React, { useState, useEffect, useRef } from 'react';
import { Award, CheckCircle2, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { CertLevel } from '../types';

export interface CertificationBadgeProps {
  src?: string;
  title: string;
  issuer: string;
  level?: CertLevel;
  darkMode?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'modal';
  featured?: boolean;
  className?: string;
  priority?: boolean;
}

// Issuer Theme definitions for color halo, gradient, and brand accents
interface IssuerTheme {
  primary: string;
  glowColor: string;
  ringColor: string;
  bgTint: string;
  darkGlow: string;
  lightGlow: string;
}

const getIssuerTheme = (issuer: string, level?: CertLevel): IssuerTheme => {
  const normalized = issuer.toLowerCase();

  if (normalized.includes('microsoft')) {
    if (level === 'Expert' || level === 'Professional') {
      return {
        primary: '#0078D4',
        glowColor: 'rgba(0, 120, 212, 0.4)',
        ringColor: 'border-amber-400/40',
        bgTint: 'from-blue-600/20 via-sky-500/10 to-amber-500/10',
        darkGlow: 'rgba(0, 164, 239, 0.25)',
        lightGlow: 'rgba(0, 120, 212, 0.15)',
      };
    }
    return {
      primary: '#00A4EF',
      glowColor: 'rgba(0, 164, 239, 0.35)',
      ringColor: 'border-sky-400/40',
      bgTint: 'from-sky-500/20 via-blue-500/10 to-transparent',
      darkGlow: 'rgba(0, 164, 239, 0.22)',
      lightGlow: 'rgba(0, 120, 212, 0.12)',
    };
  }

  if (normalized.includes('oracle')) {
    return {
      primary: '#F80000',
      glowColor: 'rgba(248, 0, 0, 0.3)',
      ringColor: 'border-red-400/40',
      bgTint: 'from-red-600/20 via-rose-500/10 to-transparent',
      darkGlow: 'rgba(248, 0, 0, 0.2)',
      lightGlow: 'rgba(220, 38, 38, 0.12)',
    };
  }

  if (normalized.includes('google')) {
    return {
      primary: '#4285F4',
      glowColor: 'rgba(66, 133, 244, 0.35)',
      ringColor: 'border-blue-400/40',
      bgTint: 'from-blue-500/20 via-indigo-500/10 to-emerald-500/10',
      darkGlow: 'rgba(66, 133, 244, 0.22)',
      lightGlow: 'rgba(66, 133, 244, 0.14)',
    };
  }

  if (normalized.includes('atlassian')) {
    return {
      primary: '#0052CC',
      glowColor: 'rgba(0, 82, 204, 0.35)',
      ringColor: 'border-blue-500/40',
      bgTint: 'from-blue-600/20 via-sky-600/10 to-transparent',
      darkGlow: 'rgba(38, 132, 255, 0.22)',
      lightGlow: 'rgba(0, 82, 204, 0.14)',
    };
  }

  if (normalized.includes('asana')) {
    return {
      primary: '#F06A6A',
      glowColor: 'rgba(240, 106, 106, 0.35)',
      ringColor: 'border-rose-400/40',
      bgTint: 'from-rose-500/20 via-orange-500/10 to-transparent',
      darkGlow: 'rgba(240, 106, 106, 0.22)',
      lightGlow: 'rgba(240, 106, 106, 0.14)',
    };
  }

  if (normalized.includes('confluent') || normalized.includes('ibm')) {
    return {
      primary: '#0F62FE',
      glowColor: 'rgba(15, 98, 254, 0.35)',
      ringColor: 'border-indigo-400/40',
      bgTint: 'from-indigo-600/20 via-blue-500/10 to-fuchsia-500/10',
      darkGlow: 'rgba(15, 98, 254, 0.22)',
      lightGlow: 'rgba(15, 98, 254, 0.14)',
    };
  }

  if (normalized.includes('new relic')) {
    return {
      primary: '#1CE783',
      glowColor: 'rgba(28, 231, 131, 0.3)',
      ringColor: 'border-emerald-400/40',
      bgTint: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      darkGlow: 'rgba(28, 231, 131, 0.2)',
      lightGlow: 'rgba(16, 185, 129, 0.12)',
    };
  }

  if (normalized.includes('dynatrace')) {
    return {
      primary: '#1496FF',
      glowColor: 'rgba(20, 150, 255, 0.35)',
      ringColor: 'border-cyan-400/40',
      bgTint: 'from-cyan-500/20 via-blue-500/10 to-purple-500/10',
      darkGlow: 'rgba(20, 150, 255, 0.22)',
      lightGlow: 'rgba(20, 150, 255, 0.14)',
    };
  }

  if (normalized.includes('hashicorp')) {
    return {
      primary: '#E535AB',
      glowColor: 'rgba(229, 53, 171, 0.3)',
      ringColor: 'border-purple-400/40',
      bgTint: 'from-purple-600/20 via-pink-500/10 to-transparent',
      darkGlow: 'rgba(229, 53, 171, 0.2)',
      lightGlow: 'rgba(229, 53, 171, 0.12)',
    };
  }

  // Default neutral tech aura
  return {
    primary: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    ringColor: 'border-sky-400/30',
    bgTint: 'from-sky-500/20 via-indigo-500/10 to-transparent',
    darkGlow: 'rgba(56, 189, 248, 0.2)',
    lightGlow: 'rgba(56, 189, 248, 0.12)',
  };
};

// Custom crafted SVG Emblem Fallback when an image fails or is missing
const FallbackBadgeEmblem: React.FC<{
  issuer: string;
  level?: CertLevel;
  title: string;
  darkMode: boolean;
}> = ({ issuer, level, title, darkMode }) => {
  const norm = issuer.toLowerCase();

  // Tier color styling
  const isExpert = level === 'Expert' || level === 'Professional';
  const isAssociate = level === 'Associate';
  const isSpecialty = level === 'Specialty';

  const accentColor = isExpert
    ? '#F59E0B'
    : isAssociate
      ? '#0EA5E9'
      : isSpecialty
        ? '#10B981'
        : '#6366F1';

  return (
    <svg
      viewBox="0 0 160 160"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${title} fallback badge`}
    >
      <defs>
        {/* Background shield radial gradient */}
        <radialGradient
          id={`shield-grad-${level || 'all'}`}
          cx="50%"
          cy="40%"
          r="60%"
          fx="50%"
          fy="30%"
        >
          <stop offset="0%" stopColor={darkMode ? '#1E293B' : '#FFFFFF'} />
          <stop offset="100%" stopColor={darkMode ? '#0F172A' : '#F1F5F9'} />
        </radialGradient>
        {/* Outer crest border gradient */}
        <linearGradient
          id={`crest-border-${level || 'all'}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
          <stop offset="50%" stopColor={darkMode ? '#475569' : '#CBD5E1'} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Decorative Outer Aura Circle */}
      <circle
        cx="80"
        cy="80"
        r="74"
        stroke={`url(#crest-border-${level || 'all'})`}
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.6"
      />

      {/* Main Hexagonal Shield Crest */}
      <path
        d="M80 14L136 40V90C136 122 80 146 80 146C80 146 24 122 24 90V40L80 14Z"
        fill={`url(#shield-grad-${level || 'all'})`}
        stroke={`url(#crest-border-${level || 'all'})`}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Inner Accent Hairline Shield */}
      <path
        d="M80 22L128 44V88C128 116 80 137 80 137C80 137 32 116 32 88V44L80 22Z"
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.4"
        fill="none"
      />

      {/* Brand Iconography Silhouette in Center */}
      {norm.includes('microsoft') ? (
        <g transform="translate(62, 48)">
          {/* Microsoft 4-square motif */}
          <rect x="0" y="0" width="16" height="16" fill="#F25022" rx="1.5" />
          <rect x="20" y="0" width="16" height="16" fill="#7FBA00" rx="1.5" />
          <rect x="0" y="20" width="16" height="16" fill="#00A4EF" rx="1.5" />
          <rect x="20" y="20" width="16" height="16" fill="#FFB900" rx="1.5" />
        </g>
      ) : norm.includes('oracle') ? (
        <g transform="translate(56, 52)">
          {/* Oracle Stylized Ring */}
          <rect
            x="4"
            y="4"
            width="40"
            height="26"
            rx="13"
            stroke="#F80000"
            strokeWidth="5"
            fill="none"
          />
        </g>
      ) : norm.includes('google') ? (
        <g transform="translate(57, 50)">
          {/* Google Cloud hexagon symbol */}
          <path
            d="M23 4L42 15V37L23 48L4 37V15L23 4Z"
            stroke="#4285F4"
            strokeWidth="3.5"
            fill="none"
          />
          <circle cx="23" cy="26" r="6" fill="#EA4335" />
        </g>
      ) : norm.includes('atlassian') ? (
        <g transform="translate(60, 52)">
          {/* Atlassian sails */}
          <path
            d="M17.5 12C12 18 5 32 5 32H24C24 32 23 20 17.5 12Z"
            fill="#0052CC"
          />
          <path
            d="M22 6C16 12 12 24 12 24H35C35 24 30 14 22 6Z"
            fill="#2684FF"
          />
        </g>
      ) : norm.includes('asana') ? (
        <g transform="translate(55, 52)">
          {/* Asana three coral dots */}
          <circle cx="25" cy="12" r="7" fill="#F06A6A" />
          <circle cx="12" cy="28" r="7" fill="#F06A6A" />
          <circle cx="38" cy="28" r="7" fill="#F06A6A" />
        </g>
      ) : norm.includes('dynatrace') ? (
        <g transform="translate(62, 50)">
          {/* Dynatrace badge icon motif */}
          <rect x="0" y="0" width="16" height="16" rx="3" fill="#80B600" />
          <rect x="18" y="0" width="16" height="16" rx="3" fill="#1496FF" />
          <rect x="0" y="18" width="16" height="16" rx="3" fill="#6A1B9A" />
          <rect x="18" y="18" width="16" height="16" rx="3" fill="#1E293B" />
        </g>
      ) : (
        <g transform="translate(60, 50)">
          {/* Generic Credential Laurel / Award Icon */}
          <circle cx="20" cy="16" r="13" fill={accentColor} fillOpacity="0.2" stroke={accentColor} strokeWidth="2.5" />
          <path d="M15 16L18.5 19.5L25.5 12.5" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 28L10 40L20 35L30 40L26 28" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="1.5" />
        </g>
      )}

      {/* Tier Label Banner across lower shield */}
      <rect
        x="36"
        y="102"
        width="88"
        height="18"
        rx="9"
        fill={darkMode ? '#020617' : '#FFFFFF'}
        stroke={accentColor}
        strokeWidth="1.5"
      />
      <text
        x="80"
        y="114"
        textAnchor="middle"
        dominantBaseline="central"
        fill={accentColor}
        fontSize="8"
        fontWeight="800"
        letterSpacing="1.2"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {(level || 'CERTIFIED').toUpperCase()}
      </text>

      {/* Verified Micro Star at bottom tip */}
      <polygon
        points="80,126 81.8,131.5 87.5,131.5 82.9,134.8 84.7,140.3 80,137 75.3,140.3 77.1,134.8 72.5,131.5 78.2,131.5"
        fill={accentColor}
      />
    </svg>
  );
};

export const CertificationBadge: React.FC<CertificationBadgeProps> = ({
  src,
  title,
  issuer,
  level = 'Associate',
  darkMode = true,
  size = 'md',
  featured = false,
  className = '',
  priority = false,
}) => {
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lazy loading observer
  useEffect(() => {
    if (priority || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
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
        rootMargin: '300px 0px', // Start loading 300px ahead
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Dimension scaling based on size variant
  const sizeClasses = {
    sm: 'w-20 h-20 max-w-[80px] max-h-[80px]',
    md: 'w-36 h-36 max-w-[148px] max-h-[148px]',
    lg: 'w-40 h-40 max-w-[164px] max-h-[164px]',
    modal: 'w-40 h-40 sm:w-44 sm:h-44 max-w-[176px] max-h-[176px]',
  }[size];

  const imgPx = size === 'sm' ? 80 : size === 'lg' ? 164 : size === 'modal' ? 176 : 148;

  const theme = getIssuerTheme(issuer, level);

  // Level Tier Icon
  const renderTierIcon = () => {
    switch (level) {
      case 'Expert':
      case 'Professional':
        return <Star className="w-3 h-3 fill-amber-400 text-amber-400" />;
      case 'Specialty':
        return <Sparkles className="w-3 h-3 text-emerald-400" />;
      case 'Associate':
        return <ShieldCheck className="w-3 h-3 text-sky-400" />;
      default:
        return <CheckCircle2 className="w-3 h-3 text-indigo-400" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative group/badge flex items-center justify-center ${sizeClasses} ${className}`}
    >
      {/* 1. Dynamic Ambient Radial Aura Glow */}
      <div
        className="absolute -inset-2.5 rounded-full blur-2xl opacity-25 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* 2. Concentric Precision Halo / Medal Pedestal Ring */}
      <div
        className={`absolute inset-0 rounded-full border transition-all duration-300 pointer-events-none ${
          darkMode
            ? 'border-white/5 group-hover:border-white/20 bg-radial from-white/[0.03] to-transparent'
            : 'border-black/5 group-hover:border-black/15 bg-radial from-slate-900/[0.02] to-transparent'
        }`}
        aria-hidden="true"
      />

      {/* 3. Loading Shimmer Skeleton */}
      {(!isLoaded || !isInView) && !hasError && (
        <div
          aria-hidden="true"
          className={`absolute inset-2 rounded-2xl flex flex-col items-center justify-center animate-pulse transition-opacity duration-300 ${
            darkMode ? 'bg-slate-800/40 text-slate-600' : 'bg-slate-100 text-slate-400'
          }`}
        >
          <Award className="w-8 h-8 opacity-40 animate-pulse" />
          <span className="text-[10px] font-mono mt-1 opacity-40 tracking-wider">VERIFYING</span>
        </div>
      )}

      {/* 4. Render Primary Badge Artwork or High-Craft Fallback */}
      {hasError || !src ? (
        <div className="relative w-full h-full flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-105">
          <FallbackBadgeEmblem
            issuer={issuer}
            level={level}
            title={title}
            darkMode={darkMode}
          />
        </div>
      ) : (
        isInView && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={src}
              alt={`${title} Badge`}
              width={imgPx}
              height={imgPx}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-full object-contain filter drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300 ease-out transform ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              } group-hover:scale-108 group-hover:-translate-y-1`}
            />

            {/* Subtle Diagonal Sheen Highlight on Hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              aria-hidden="true"
            />
          </div>
        )
      )}

      {/* 5. Micro Verified Trust Watermark Seal (Quiet corner indicator) */}
      {isLoaded && !hasError && featured && (
        <div
          className={`absolute -bottom-1 -right-1 p-1 rounded-full shadow-md backdrop-blur-md border transition-transform duration-300 group-hover:scale-110 pointer-events-none ${
            darkMode
              ? 'bg-slate-900/90 border-slate-700/80 text-amber-400 shadow-black/60'
              : 'bg-white/95 border-slate-200 text-amber-500 shadow-slate-300/60'
          }`}
          title="Featured Credential"
        >
          {renderTierIcon()}
        </div>
      )}
    </div>
  );
};
