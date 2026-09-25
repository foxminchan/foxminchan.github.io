import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Twitter,
  Linkedin,
  Facebook,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

type PlatformTab = 'x' | 'linkedin' | 'facebook' | 'discord' | 'full';

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<PlatformTab>('x');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-fiz6fotqwsv3jer6ehdytd-922523362036.asia-southeast1.run.app';

  const shareTitle = `${PERSONAL_INFO.name} | Software Engineer Portfolio`;
  const shareText = `Check out ${PERSONAL_INFO.name}'s Software Engineer portfolio – enterprise .NET microservices, cloud-native architecture & 30+ certifications:`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleShareX = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(currentUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden my-auto ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-5 py-4 border-b ${
              darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  darkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'
                }`}
              >
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">Social Media OpenGraph (OG) Image</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Optimized for Facebook, LinkedIn, X (Twitter), Discord &amp; Slack (1200×630px)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-130px)] overflow-y-auto">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <button
                onClick={() => setActiveTab('x')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'x'
                    ? darkMode
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X / Twitter Card</span>
              </button>

              <button
                onClick={() => setActiveTab('linkedin')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'linkedin'
                    ? darkMode
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Post</span>
              </button>

              <button
                onClick={() => setActiveTab('facebook')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'facebook'
                    ? darkMode
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook Feed</span>
              </button>

              <button
                onClick={() => setActiveTab('discord')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'discord'
                    ? darkMode
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Discord / Slack</span>
              </button>

              <button
                onClick={() => setActiveTab('full')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'full'
                    ? darkMode
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Full Asset (1200×630)</span>
              </button>
            </div>

            {/* Platform Preview Container */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border ${
                darkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Tab 1: X (Twitter) Card */}
              {activeTab === 'x' && (
                <div className="max-w-xl mx-auto space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/avatar.png"
                      alt={PERSONAL_INFO.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold">{PERSONAL_INFO.name}</span>
                        <span className="text-xs text-slate-400">@foxminchan</span>
                        <span className="text-xs text-slate-400">· 1m</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Enterprise .NET microservices, cloud-native architecture &amp; 30+ industry
                        credentials. Explore my projects and portfolio below 🚀
                      </p>
                    </div>
                  </div>

                  {/* Twitter summary_large_image card */}
                  <div className="rounded-2xl border border-slate-700/80 overflow-hidden bg-slate-900/90 shadow-md">
                    <div className="relative aspect-[1200/630] w-full overflow-hidden bg-slate-950">
                      <img
                        src="/og-image.png"
                        alt="Nhan Nguyen Portfolio Social Card"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono text-slate-300">
                        1200×630
                      </div>
                    </div>
                    <div className="p-3.5 border-t border-slate-800">
                      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        {currentUrl.replace(/^https?:\/\//, '')}
                      </p>
                      <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                        Nhan Nguyen | Software Engineer Portfolio
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        Enterprise .NET microservices, cloud-native architecture, 30+ certifications
                        from Microsoft, Oracle, Google, and open-source projects.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: LinkedIn Post */}
              {activeTab === 'linkedin' && (
                <div className="max-w-xl mx-auto space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/avatar.png"
                      alt={PERSONAL_INFO.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold">{PERSONAL_INFO.name}</span>
                        <span className="text-xs text-slate-400">· 1st</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Software Engineer | Enterprise .NET &amp; Cloud Architect
                      </p>
                      <p className="text-[10px] text-slate-400">Just now · 🌐</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">
                    Excited to share my updated portfolio featuring 23 production microservices on
                    Azure Container Apps, 30+ certifications, and open-source tooling!
                  </p>

                  {/* LinkedIn Feed Card */}
                  <div className="rounded-xl border border-slate-700/80 overflow-hidden bg-slate-900 shadow-md">
                    <div className="aspect-[1200/630] w-full bg-slate-950">
                      <img
                        src="/og-image.png"
                        alt="Nhan Nguyen Portfolio LinkedIn Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-slate-800/80 border-t border-slate-700">
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        Nhan Nguyen | Software Engineer Portfolio
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {currentUrl.replace(/^https?:\/\//, '')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Facebook Feed */}
              {activeTab === 'facebook' && (
                <div className="max-w-xl mx-auto space-y-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/avatar.png"
                      alt={PERSONAL_INFO.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <span className="text-sm font-bold">{PERSONAL_INFO.name}</span>
                      <p className="text-[10px] text-slate-400">Public · Just now</p>
                    </div>
                  </div>

                  {/* Facebook Feed Link Card */}
                  <div className="rounded-lg border border-slate-700/80 overflow-hidden bg-slate-900 shadow-sm">
                    <div className="aspect-[1200/630] w-full bg-slate-950">
                      <img
                        src="/og-image.png"
                        alt="Nhan Nguyen Facebook Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-slate-800/70 border-t border-slate-700">
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {currentUrl.replace(/^https?:\/\//, '').toUpperCase()}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                        Nhan Nguyen | Software Engineer Portfolio
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        Enterprise .NET microservices, cloud-native architecture, 30+ certifications.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Discord / Slack */}
              {activeTab === 'discord' && (
                <div className="max-w-xl mx-auto space-y-3">
                  <div className="rounded-r-lg border-l-4 border-l-sky-500 bg-slate-900/90 border border-slate-800 p-4 space-y-3 shadow-md">
                    <div>
                      <span className="text-xs font-semibold text-sky-400">Nhan Nguyen Portfolio</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        Nhan Nguyen | Software Engineer Portfolio
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Software Engineer portfolio showcasing enterprise .NET microservices,
                        cloud-native architecture, 30+ certifications, and open-source projects.
                      </p>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-slate-800 aspect-[1200/630] w-full bg-slate-950">
                      <img
                        src="/og-image.png"
                        alt="Discord Slack Embed Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Full Resolution Asset */}
              {activeTab === 'full' && (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-xl aspect-[1200/630] w-full">
                    <img
                      src="/og-image.png"
                      alt="Full OpenGraph 1200x630 banner"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Dimensions</p>
                      <p className="text-sm font-bold text-white mt-0.5">1200 × 630 px</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Aspect Ratio</p>
                      <p className="text-sm font-bold text-white mt-0.5">1.905 : 1 (16:9)</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">PNG Size</p>
                      <p className="text-sm font-bold text-white mt-0.5">135 KB (Ultra HD)</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">JPG Size</p>
                      <p className="text-sm font-bold text-white mt-0.5">109 KB (Lightweight)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Direct Share &amp; Export
                </span>
                <span className="text-[11px] text-sky-400 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Ready for Social Feeds
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleShareX}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
                >
                  <Twitter className="w-4 h-4 text-sky-400" />
                  <span>Share on X</span>
                </button>

                <button
                  onClick={handleShareLinkedIn}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0A66C2] hover:bg-[#084e96] text-white transition-colors shadow-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Share on LinkedIn</span>
                </button>

                <button
                  onClick={handleShareFacebook}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#1877F2] hover:bg-[#155fc2] text-white transition-colors shadow-sm"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Share on Facebook</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    copiedLink
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
                </button>

                <a
                  href="/og-image.png"
                  download="nhan-nguyen-og-image.png"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-sm ml-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG (1200×630)</span>
                </a>
              </div>
            </div>

            {/* Platform Debugger links */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
              <span>Test live card rendering on official platform debuggers:</span>
              <div className="flex items-center gap-3">
                <a
                  href={`https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                >
                  LinkedIn Inspector <ExternalLink className="w-3 h-3" />
                </a>
                <span>·</span>
                <a
                  href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                >
                  Facebook Debugger <ExternalLink className="w-3 h-3" />
                </a>
                <span>·</span>
                <a
                  href={`https://www.opengraph.xyz/url/${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                >
                  OpenGraph.xyz <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
