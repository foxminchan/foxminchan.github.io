import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Search,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  Sparkles,
  X,
  Star,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RotateCcw,
  Building2,
  GraduationCap,
  Globe,
} from 'lucide-react';
import { CERTIFICATIONS } from '../data/portfolioData';
import { Certification } from '../types';
import { LazyBadge } from './LazyBadge';

interface CertificationsSectionProps {
  darkMode: boolean;
}

interface IssuerTab {
  id: string;
  label: string;
  count: number;
}

interface LevelTab {
  id: string;
  label: string;
  note?: string;
  count: number;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ darkMode }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);

  // Helper to match certification level with 4-level filter
  const matchesLevel = (certLevel: string, filterId: string) => {
    if (filterId === 'All') return true;
    if (filterId === 'Fundamentals') {
      return certLevel === 'Fundamentals' || certLevel === 'Foundations';
    }
    if (filterId === 'Associate') {
      return certLevel === 'Associate';
    }
    if (filterId === 'Professional') {
      return certLevel === 'Professional' || certLevel === 'Expert';
    }
    if (filterId === 'Specialty') {
      return certLevel === 'Specialty';
    }
    return true;
  };

  // Level tabs: 4 levels (Fundamentals, Associate, Professional, Specialty)
  const levelTabs: LevelTab[] = useMemo(() => {
    const fundamentalsCount = CERTIFICATIONS.filter(
      c => c.level === 'Fundamentals' || c.level === 'Foundations'
    ).length;
    const associateCount = CERTIFICATIONS.filter(c => c.level === 'Associate').length;
    const professionalCount = CERTIFICATIONS.filter(
      c => c.level === 'Professional' || c.level === 'Expert'
    ).length;
    const specialtyCount = CERTIFICATIONS.filter(c => c.level === 'Specialty').length;

    return [
      { id: 'All', label: 'All Levels', count: CERTIFICATIONS.length },
      { id: 'Fundamentals', label: 'Fundamentals', count: fundamentalsCount },
      { id: 'Associate', label: 'Associate', count: associateCount },
      { id: 'Professional', label: 'Professional', count: professionalCount },
      { id: 'Specialty', label: 'Specialty', count: specialtyCount },
    ];
  }, []);

  // Issuer tabs: MS and GitHub merged as Microsoft, IBM and Confluent merged as IBM
  const issuerTabs: IssuerTab[] = useMemo(() => {
    const msCount = CERTIFICATIONS.filter(
      c => c.issuer.includes('Microsoft') || c.issuer.includes('GitHub')
    ).length;
    const atlassianCount = CERTIFICATIONS.filter(c => c.issuer.includes('Atlassian')).length;
    const oracleCount = CERTIFICATIONS.filter(c => c.issuer.includes('Oracle')).length;
    const googleCount = CERTIFICATIONS.filter(c => c.issuer.includes('Google')).length;
    const ibmCount = CERTIFICATIONS.filter(
      c => c.issuer.includes('IBM') || c.issuer.includes('Confluent')
    ).length;

    return [
      { id: 'All', label: 'All Issuers', count: CERTIFICATIONS.length },
      { id: 'Microsoft', label: 'Microsoft', count: msCount },
      { id: 'Atlassian', label: 'Atlassian', count: atlassianCount },
      { id: 'Oracle', label: 'Oracle', count: oracleCount },
      { id: 'Google', label: 'Google', count: googleCount },
      { id: 'IBM', label: 'IBM', count: ibmCount },
    ];
  }, []);

  // Filtered certifications
  const filteredCerts = useMemo(() => {
    return CERTIFICATIONS.filter(cert => {
      // Level filter
      if (!matchesLevel(cert.level, selectedLevel)) {
        return false;
      }
      // Issuer filter
      if (selectedIssuer !== 'All') {
        if (selectedIssuer === 'Microsoft') {
          const isMsOrGithub = cert.issuer.includes('Microsoft') || cert.issuer.includes('GitHub');
          if (!isMsOrGithub) return false;
        } else if (selectedIssuer === 'IBM') {
          const isIbmOrConfluent = cert.issuer.includes('IBM') || cert.issuer.includes('Confluent');
          if (!isIbmOrConfluent) return false;
        } else {
          const matches = cert.issuer.toLowerCase().includes(selectedIssuer.toLowerCase());
          if (!matches) return false;
        }
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = cert.title.toLowerCase().includes(query);
        const matchesIssuer = cert.issuer.toLowerCase().includes(query);
        const matchesId = cert.credentialId.toLowerCase().includes(query);
        if (!matchesTitle && !matchesIssuer && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }, [selectedLevel, selectedIssuer, searchQuery]);

  // Collapse to 2 rows (6 cards in 3-column desktop layout) by default
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedCerts = useMemo(() => {
    if (isExpanded) return filteredCerts;
    return filteredCerts.slice(0, 6);
  }, [filteredCerts, isExpanded]);

  const handleCopy = (credentialId: string) => {
    navigator.clipboard.writeText(credentialId);
    setCopiedId(credentialId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Issuer badge helper
  const getIssuerBadgeStyle = (issuer: string) => {
    if (issuer.includes('Microsoft')) {
      return darkMode
        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
        : 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (issuer.includes('GitHub')) {
      return darkMode
        ? 'bg-violet-500/10 text-violet-400 border-violet-500/30'
        : 'bg-violet-50 text-violet-700 border-violet-200';
    }
    if (issuer.includes('Google')) {
      return darkMode
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        : 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (issuer.includes('Oracle')) {
      return darkMode
        ? 'bg-red-500/10 text-red-400 border-red-500/30'
        : 'bg-red-50 text-red-700 border-red-200';
    }
    if (issuer.includes('IBM') || issuer.includes('Confluent')) {
      return darkMode
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    return darkMode
      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200';
  };

  // Expiration date validity helper
  const hasExpiryDate = (expires?: string) => {
    if (!expires) return false;
    const trimmed = expires.trim().toLowerCase();
    return (
      trimmed !== '' &&
      trimmed !== 'never' &&
      trimmed !== 'no expiration' &&
      trimmed !== 'none' &&
      trimmed !== 'n/a'
    );
  };

  // Check if a certificate was archived / achieved within the past week (past 7 days)
  const isArchivedWithinPastWeek = (cert: Certification, refDate: Date = new Date()): boolean => {
    if (typeof cert.isNew === 'boolean') {
      return cert.isNew;
    }
    const dateStr = cert.archivedDate || cert.issueDate || cert.issued;
    if (!dateStr) return false;

    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return false;

    const diffMs = refDate.getTime() - parsed.getTime();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    // Achieved within the past 7 days (with 1 day buffer for timezones)
    return diffMs >= -86400000 && diffMs <= oneWeekMs;
  };

  // Level counts (matching the 4 distinct tiers)
  const levelCounts = useMemo(() => {
    const professional = CERTIFICATIONS.filter(
      c => c.level === 'Expert' || c.level === 'Professional'
    ).length;
    const associate = CERTIFICATIONS.filter(c => c.level === 'Associate').length;
    const specialty = CERTIFICATIONS.filter(c => c.level === 'Specialty').length;
    const fundamentals = CERTIFICATIONS.filter(
      c => c.level === 'Foundations' || c.level === 'Fundamentals'
    ).length;
    return { professional, associate, specialty, fundamentals };
  }, []);

  return (
    <section
      id="certifications"
      className={`py-20 border-t ${
        darkMode ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50/70 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-500 border border-sky-500/20 mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Industry Credentials ({CERTIFICATIONS.length})</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Professional Certifications
            </h2>
            <p
              className={`mt-2 text-base max-w-2xl ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              A verified portfolio of 30 credentials spanning Cloud Architecture, Agentic AI
              Systems, DevOps Engineering, and Data Streaming.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="cert-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search title, ID, or issuer..."
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border outline-none transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 shadow-xs'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Credential Level Stats Strip (Interactive quick filter) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <button
            type="button"
            onClick={() =>
              setSelectedLevel(selectedLevel === 'Professional' ? 'All' : 'Professional')
            }
            className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
              selectedLevel === 'Professional'
                ? darkMode
                  ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                  : 'bg-amber-50 border-amber-300 shadow-sm'
                : darkMode
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Star className="w-5 h-5 fill-amber-400/30 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-extrabold">{levelCounts.professional}</div>
              <div className="text-[11px] text-slate-400 font-medium truncate">
                Professional & Expert
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedLevel(selectedLevel === 'Associate' ? 'All' : 'Associate')}
            className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
              selectedLevel === 'Associate'
                ? darkMode
                  ? 'bg-sky-500/15 border-sky-500/50 shadow-md'
                  : 'bg-sky-50 border-sky-300 shadow-sm'
                : darkMode
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-extrabold">{levelCounts.associate}</div>
              <div className="text-[11px] text-slate-400 font-medium truncate">Associate Tier</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedLevel(selectedLevel === 'Specialty' ? 'All' : 'Specialty')}
            className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
              selectedLevel === 'Specialty'
                ? darkMode
                  ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md'
                  : 'bg-emerald-50 border-emerald-300 shadow-sm'
                : darkMode
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-extrabold">{levelCounts.specialty}</div>
              <div className="text-[11px] text-slate-400 font-medium truncate">Specialty Tier</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedLevel(selectedLevel === 'Fundamentals' ? 'All' : 'Fundamentals')
            }
            className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
              selectedLevel === 'Fundamentals'
                ? darkMode
                  ? 'bg-indigo-500/15 border-indigo-500/50 shadow-md'
                  : 'bg-indigo-50 border-indigo-300 shadow-sm'
                : darkMode
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-extrabold">{levelCounts.fundamentals}</div>
              <div className="text-[11px] text-slate-400 font-medium truncate">
                Fundamentals & Foundations
              </div>
            </div>
          </button>
        </div>

        {/* Redesigned Filter Station */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border mb-6 transition-all ${
            darkMode
              ? 'bg-slate-900/80 border-slate-800/90 shadow-xl shadow-black/20 backdrop-blur-md'
              : 'bg-white border-slate-200 shadow-xs backdrop-blur-md'
          }`}
        >
          {/* Header row: Refine title & live stats counter */}
          <div
            className={`flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b ${
              darkMode ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg ${darkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <span
                className={`text-xs sm:text-sm font-bold tracking-tight ${
                  darkMode ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                Refine Credentials
              </span>
            </div>

            {/* Results counter & reset trigger */}
            <div className="flex items-center gap-2.5 text-xs">
              <span
                className={`font-mono text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
              >
                Showing{' '}
                <strong className={darkMode ? 'text-white' : 'text-slate-900'}>
                  {displayedCerts.length}
                </strong>{' '}
                of {CERTIFICATIONS.length}
                {!isExpanded && filteredCerts.length > 6 && ' (2 rows)'}
              </span>
              {(selectedLevel !== 'All' || selectedIssuer !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedLevel('All');
                    setSelectedIssuer('All');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Rows Container */}
          <div className="pt-3.5 space-y-3">
            {/* Filter Row 1: Level */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 shrink-0 sm:w-28 text-xs font-semibold text-slate-400">
                <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
                <span className="uppercase tracking-wider text-[10px]">Tier Level</span>
              </div>
              <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide snap-x">
                {levelTabs.map(tab => {
                  const isSelected = selectedLevel === tab.id;
                  const getTierDot = (id: string) => {
                    switch (id) {
                      case 'Fundamentals':
                        return 'bg-indigo-400';
                      case 'Associate':
                        return 'bg-sky-400';
                      case 'Professional':
                        return 'bg-amber-400';
                      case 'Specialty':
                        return 'bg-emerald-400';
                      default:
                        return 'bg-slate-400';
                    }
                  };

                  return (
                    <motion.button
                      key={tab.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedLevel(tab.id)}
                      id={`level-tab-${tab.id.toLowerCase()}`}
                      className={`snap-start shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
                        isSelected
                          ? darkMode
                            ? 'bg-blue-700 text-white border-blue-600 font-semibold shadow-xs shadow-blue-700/30'
                            : 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                          : darkMode
                            ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/60'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getTierDot(tab.id)}`} />
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-black/20 text-white'
                            : darkMode
                              ? 'bg-slate-900 text-slate-400'
                              : 'bg-white text-slate-500 border border-slate-200 shadow-2xs'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Subtle Divider between groups */}
            <div className={`border-t ${darkMode ? 'border-slate-800/80' : 'border-slate-100'}`} />

            {/* Filter Row 2: Issuer */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 shrink-0 sm:w-28 text-xs font-semibold text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span className="uppercase tracking-wider text-[10px]">Issuer</span>
              </div>
              <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide snap-x">
                {issuerTabs.map(tab => {
                  const isSelected = selectedIssuer === tab.id;
                  const getIssuerDot = (id: string) => {
                    switch (id) {
                      case 'Microsoft':
                        return 'bg-[#00a4ef]';
                      case 'Atlassian':
                        return 'bg-[#0052cc]';
                      case 'Oracle':
                        return 'bg-[#f80000]';
                      case 'Google':
                        return 'bg-[#ea4335]';
                      case 'IBM':
                        return 'bg-[#0f62fe]';
                      default:
                        return 'bg-slate-400';
                    }
                  };

                  return (
                    <motion.button
                      key={tab.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedIssuer(tab.id)}
                      id={`issuer-tab-${tab.id.toLowerCase()}`}
                      className={`snap-start shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
                        isSelected
                          ? darkMode
                            ? 'bg-blue-700 text-white border-blue-600 font-semibold shadow-xs shadow-blue-700/30'
                            : 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                          : darkMode
                            ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/60'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${getIssuerDot(tab.id)}`}
                      />
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-black/20 text-white'
                            : darkMode
                              ? 'bg-slate-900 text-slate-400'
                              : 'bg-white text-slate-500 border border-slate-200 shadow-2xs'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar (Shown whenever non-default filters exist) */}
          {(selectedLevel !== 'All' || selectedIssuer !== 'All' || searchQuery) && (
            <div
              className={`mt-3.5 pt-3 border-t flex flex-wrap items-center gap-2 text-xs ${
                darkMode ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <span className="text-[11px] font-medium text-slate-400">Active Criteria:</span>
              {selectedLevel !== 'All' && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    darkMode
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}
                >
                  <span>Level: {selectedLevel}</span>
                  <button
                    onClick={() => setSelectedLevel('All')}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Remove level filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedIssuer !== 'All' && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    darkMode
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  <span>Issuer: {selectedIssuer}</span>
                  <button
                    onClick={() => setSelectedIssuer('All')}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Remove issuer filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    darkMode
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span>Query: "{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Remove search query"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Certifications Grid: Clean Digital Badge Cards matching Credly specification */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          {displayedCerts.map(cert => {
            const hasExpiry = hasExpiryDate(cert.expires);
            const isNew = isArchivedWithinPastWeek(cert);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={cert.id}
                id={`cert-card-${cert.id}`}
                onClick={() => setPreviewCert(cert)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setPreviewCert(cert);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`relative rounded-3xl border p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group select-none text-left ${
                  darkMode
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-black/50'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60'
                }`}
              >
                {/* "New" Badge if archived within the past week */}
                {isNew && (
                  <div className="absolute top-5 right-5 z-10 pointer-events-none">
                    <span
                      id={`cert-new-badge-${cert.id}`}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                        darkMode
                          ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shadow-emerald-950/50'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-300/80 shadow-xs'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      New
                    </span>
                  </div>
                )}
                {/* Centered Badge Artwork */}
                <div className="flex items-center justify-center py-6 mb-6">
                  <LazyBadge
                    src={cert.badgeImage}
                    alt={`${cert.title} Badge`}
                    darkMode={darkMode}
                    width={144}
                    height={144}
                    className="w-36 h-36 max-w-[150px] max-h-[150px] object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs"
                  />
                </div>

                {/* Content: Title, Issuer, and Expiration / Archived Date */}
                <div className="mt-auto space-y-1.5">
                  <h3
                    className={`text-lg sm:text-xl font-bold tracking-tight leading-snug line-clamp-2 transition-colors ${
                      darkMode
                        ? 'text-slate-100 group-hover:text-sky-400'
                        : 'text-slate-900 group-hover:text-sky-600'
                    }`}
                  >
                    {cert.title}
                  </h3>

                  <p
                    className={`text-sm sm:text-base font-normal ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {cert.issuer}
                  </p>

                  <p
                    className={`text-sm sm:text-base font-normal pt-2 ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {hasExpiry ? `Expires ${cert.expires}` : `Achieved ${cert.issued}`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Expand / Collapse Control */}
        {filteredCerts.length > 6 && (
          <div className="mt-10 text-center flex flex-col items-center justify-center">
            {!isExpanded ? (
              <div className="flex flex-col items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsExpanded(true)}
                  id="expand-certifications-btn"
                  className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all shadow-md cursor-pointer ${
                    darkMode
                      ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-950/50 hover:shadow-lg'
                      : 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-200 hover:shadow-lg'
                  }`}
                >
                  <span>View all {filteredCerts.length} certifications</span>
                  <ChevronDown className="w-4 h-4 text-white" />
                </motion.button>
                <span
                  className={`text-xs font-mono mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                >
                  Showing 2 rows preview · {filteredCerts.length - 6} more certifications available
                </span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsExpanded(false);
                  const el = document.getElementById('certifications');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                id="collapse-certifications-btn"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs'
                }`}
              >
                <span>Collapse</span>
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </motion.button>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredCerts.length === 0 && (
          <div
            className={`text-center py-16 rounded-xl border ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <Award className="w-12 h-12 mx-auto text-slate-500 mb-3 opacity-60" />
            <h3 className={`text-lg font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              No certifications matched your filter
            </h3>
            <p className={`text-sm mt-1 mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Try clearing your search query or resetting the level and issuer filters.
            </p>
            <button
              onClick={() => {
                setSelectedLevel('All');
                setSelectedIssuer('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-600 text-white hover:bg-sky-500 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Credential Details Modal (Reveals ID and Archived Date on click) */}
        {previewCert &&
          (() => {
            const modalHasExpiry = hasExpiryDate(previewCert.expires);
            const modalIsNew = isArchivedWithinPastWeek(previewCert);
            return (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
                onClick={() => setPreviewCert(null)}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className={`relative max-w-md w-full rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setPreviewCert(null)}
                    className={`absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ${
                      darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                    title="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal Badge Image */}
                  <div className="flex flex-col items-center text-center pt-2 pb-2">
                    <div className="w-36 h-36 flex items-center justify-center mb-4">
                      <LazyBadge
                        src={previewCert.badgeImage}
                        alt={previewCert.title}
                        darkMode={darkMode}
                        width={144}
                        height={144}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md"
                      />
                    </div>

                    <h3
                      className={`text-xl font-bold leading-snug px-2 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {previewCert.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 justify-center">
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {previewCert.issuer}
                      </p>
                      {modalIsNew && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                            darkMode
                              ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Box: ID & Archived Date */}
                  <div
                    className={`p-4 rounded-2xl text-sm space-y-3 my-5 ${
                      darkMode
                        ? 'bg-slate-950/80 border border-slate-800'
                        : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {/* Archived Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Archived Date:</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}
                        >
                          {previewCert.issued}
                        </span>
                        {modalIsNew && (
                          <span
                            className={`px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide ${
                              darkMode
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expiration Date - ONLY show if certificate has an expiration date */}
                    {modalHasExpiry && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Expiration Date:</span>
                        <span className="text-emerald-500 font-semibold">
                          {previewCert.expires}
                        </span>
                      </div>
                    )}

                    {/* Credential ID with Copy Button */}
                    <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-2">
                      <span className="text-slate-400 font-medium shrink-0">Credential ID:</span>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="font-mono text-xs truncate text-sky-400 font-semibold"
                          title={previewCert.credentialId}
                        >
                          {previewCert.credentialId}
                        </span>
                        <button
                          onClick={() => handleCopy(previewCert.credentialId)}
                          className={`p-1.5 rounded-lg cursor-pointer transition-colors shrink-0 ${
                            darkMode
                              ? 'hover:bg-slate-800 text-slate-300'
                              : 'hover:bg-slate-200 text-slate-700'
                          }`}
                          title="Copy Credential ID"
                        >
                          {copiedId === previewCert.credentialId ? (
                            <span className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied</span>
                            </span>
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Verify and Close */}
                  <div className="flex items-center gap-3">
                    <a
                      href={previewCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                    >
                      <span>Verify on {previewCert.issuer}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setPreviewCert(null)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                        darkMode
                          ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                          : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>
    </section>
  );
};
