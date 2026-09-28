import React, { useState, useMemo } from 'react';
import { motion, Variants } from 'motion/react';
import {
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Award,
  Download,
  Filter,
} from 'lucide-react';
import { Certification } from '../types';
import {
  groupCertsByYearAndMonth,
  getIssuerStyle,
  getLevelBadgeStyle,
} from '../utils/certTimelineData';
import { CertificationBadge } from './CertificationBadge';

interface CertificationTimelineViewProps {
  certifications: Certification[];
  darkMode: boolean;
  onSelectCert: (cert: Certification) => void;
  onOpenExportModal: () => void;
}

const timelineGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const timelineCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const CertificationTimelineView: React.FC<CertificationTimelineViewProps> = ({
  certifications,
  darkMode,
  onSelectCert,
  onOpenExportModal,
}) => {
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered certifications
  const filteredCerts = useMemo(() => {
    if (selectedIssuer === 'All') return certifications;
    return certifications.filter(cert => {
      if (selectedIssuer === 'Microsoft') {
        return cert.issuer.includes('Microsoft') || cert.issuer.includes('GitHub');
      }
      if (selectedIssuer === 'IBM') {
        return cert.issuer.includes('IBM') || cert.issuer.includes('Confluent');
      }
      return cert.issuer.toLowerCase().includes(selectedIssuer.toLowerCase());
    });
  }, [certifications, selectedIssuer]);

  // Group by year and month
  const yearGroups = useMemo(() => {
    return groupCertsByYearAndMonth(filteredCerts);
  }, [filteredCerts]);

  const handleCopy = (e: React.MouseEvent, credentialId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(credentialId);
    setCopiedId(credentialId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const issuersList = ['All', 'Microsoft', 'Oracle', 'Google', 'Atlassian', 'Asana', 'IBM', 'New Relic'];

  return (
    <div className="space-y-10">
      {/* Timeline Control Bar: Issuers filter + Export Image Button */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md shadow-xl'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Issuer Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-sky-500" />
              <span>Issuer</span>
            </span>
            {issuersList.map(issuer => {
              const isSelected = selectedIssuer === issuer;
              return (
                <button
                  key={issuer}
                  onClick={() => setSelectedIssuer(issuer)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                    isSelected
                      ? darkMode
                        ? 'bg-sky-500 text-white border-sky-400 font-semibold shadow-xs shadow-sky-500/30'
                        : 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                      : darkMode
                        ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/60'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
                  }`}
                >
                  {issuer}
                </button>
              );
            })}
          </div>

          {/* Right: Download Timeline Image Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenExportModal}
            id="download-timeline-image-btn"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 transition-all shadow-md shadow-sky-600/25 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Timeline Image</span>
          </motion.button>
        </div>
      </div>

      {/* Main Timeline Spine Structure */}
      {yearGroups.length === 0 ? (
        <div
          className={`text-center py-16 rounded-2xl border ${
            darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <Award className="w-12 h-12 mx-auto text-slate-500 mb-3 opacity-60" />
          <h3 className={`text-lg font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            No credentials found for this issuer
          </h3>
          <button
            onClick={() => setSelectedIssuer('All')}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-sky-600 text-white hover:bg-sky-500 transition-colors cursor-pointer"
          >
            Reset Issuer Filter
          </button>
        </div>
      ) : (
        yearGroups.map(yearGroup => (
          <div key={yearGroup.year} className="relative">
            {/* Year Milestone Header Card */}
            <div className="flex items-center justify-center mb-10 sticky top-20 z-20">
              <div
                className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border shadow-xl backdrop-blur-md ${
                  darkMode
                    ? 'bg-slate-950/90 border-sky-500/40 text-white shadow-sky-950/40'
                    : 'bg-white/95 border-sky-300 text-slate-900 shadow-slate-200'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-base sm:text-lg font-extrabold tracking-tight">
                  {yearGroup.year} Certification Journey
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    darkMode
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}
                >
                  {yearGroup.totalCount} Earned
                </span>
              </div>
            </div>

            {/* Timeline Stream by Month */}
            <div className="relative pl-6 sm:pl-10 md:pl-12 space-y-12">
              {/* Continuous Vertical Glowing Line */}
              <div
                className="absolute left-2.5 sm:left-4 md:left-5 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-sky-500 via-indigo-500 to-purple-600 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                aria-hidden="true"
              />

              {yearGroup.months.map(monthGroup => (
                <div key={monthGroup.monthKey} className="relative">
                  {/* Month Anchor Node on Spine */}
                  <div className="flex items-center gap-3 mb-6 -ml-6 sm:-ml-10 md:-ml-12">
                    {/* Node Dot */}
                    <div
                      className={`relative z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform duration-300 ${
                        darkMode
                          ? 'bg-slate-950 border-sky-400 shadow-sky-500/50'
                          : 'bg-white border-sky-500 shadow-sky-200'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-sky-500" />
                    </div>

                    {/* Month Pill */}
                    <div
                      className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase border flex items-center gap-2 shadow-xs ${
                        darkMode
                          ? 'bg-slate-900 border-slate-700 text-slate-200'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-sky-500" />
                      <span>{monthGroup.fullMonthName} {monthGroup.year}</span>
                      <span className="text-[11px] font-mono opacity-60">
                        ({monthGroup.certs.length})
                      </span>
                    </div>
                  </div>

                  {/* Certifications Grid for this Month */}
                  <motion.div
                    variants={timelineGridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5"
                  >
                    {monthGroup.certs.map(cert => {
                      const issuerStyle = getIssuerStyle(cert.issuer);
                      const levelStyle = getLevelBadgeStyle(cert.level);

                      return (
                        <motion.div
                          key={cert.id}
                          variants={timelineCardVariants}
                          whileHover={{ y: -3, scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => onSelectCert(cert)}
                          className={`relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer group flex flex-col justify-between text-left select-none ${
                            darkMode
                              ? 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700 hover:shadow-xl hover:shadow-black/40'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50'
                          }`}
                        >
                          {/* Issuer Accent Left Border */}
                          <div
                            className="absolute top-0 bottom-0 left-0 w-1.5 rounded-l-2xl"
                            style={{ backgroundColor: issuerStyle.color }}
                            aria-hidden="true"
                          />

                          <div>
                            {/* Top Row: Issuer & Level Pills + Date */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-1.5">
                                {/* Issuer Pill */}
                                <span
                                  className="text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                                  style={{
                                    backgroundColor: issuerStyle.bgColor,
                                    color: issuerStyle.color,
                                    border: `1px solid ${issuerStyle.borderColor}`,
                                  }}
                                >
                                  {issuerStyle.name}
                                </span>

                                {/* Level Pill */}
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                                  style={{
                                    backgroundColor: levelStyle.bgColor,
                                    color: levelStyle.color,
                                    border: `1px solid ${levelStyle.borderColor}`,
                                  }}
                                >
                                  {cert.level}
                                </span>
                              </div>

                              <span
                                className={`text-xs font-mono font-medium ${
                                  darkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}
                              >
                                {cert.parsedDate.displayDate}
                              </span>
                            </div>

                            {/* Center Row: Badge Thumbnail + Title */}
                            <div className="flex items-start gap-3.5 my-2">
                              <div className="shrink-0 w-14 h-14 flex items-center justify-center">
                                <CertificationBadge
                                  src={cert.badgeImage}
                                  title={cert.title}
                                  issuer={cert.issuer}
                                  level={cert.level}
                                  darkMode={darkMode}
                                  size="sm"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4
                                  className={`text-sm sm:text-base font-bold leading-snug line-clamp-2 transition-colors ${
                                    darkMode
                                      ? 'text-slate-100 group-hover:text-sky-400'
                                      : 'text-slate-900 group-hover:text-sky-600'
                                  }`}
                                >
                                  {cert.title}
                                </h4>
                                <p
                                  className={`text-xs mt-1 truncate ${
                                    darkMode ? 'text-slate-400' : 'text-slate-500'
                                  }`}
                                >
                                  {cert.issuer}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row: Credential ID + Copy & Verify Links */}
                          <div
                            className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 text-xs ${
                              darkMode ? 'border-slate-800' : 'border-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-mono text-[11px] text-slate-400 truncate">
                                ID: {cert.credentialId}
                              </span>
                              <button
                                onClick={e => handleCopy(e, cert.credentialId)}
                                className={`p-1 rounded-md transition-colors cursor-pointer ${
                                  darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                                }`}
                                title="Copy credential ID"
                              >
                                {copiedId === cert.credentialId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className={`inline-flex items-center gap-1 font-semibold text-[11px] transition-colors ${
                                darkMode
                                  ? 'text-sky-400 hover:text-sky-300'
                                  : 'text-sky-600 hover:text-sky-700'
                              }`}
                            >
                              <span>Verify</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
