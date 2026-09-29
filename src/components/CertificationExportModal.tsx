import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Certification } from '../types';
import {
  renderTimelineToCanvas,
  downloadImage,
  TimelineExportOptions,
} from '../utils/certTimelineExporter';

interface CertificationExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  certifications: Certification[];
  darkMode: boolean;
}

export const CertificationExportModal: React.FC<CertificationExportModalProps> = ({
  isOpen,
  onClose,
  certifications,
  darkMode,
}) => {
  const [layout, setLayout] = useState<'poster' | 'landscape'>('poster');
  const [theme, setTheme] = useState<'dark' | 'navy' | 'light'>('dark');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [canvasInstance, setCanvasInstance] = useState<HTMLCanvasElement | null>(null);
  const [copiedImage, setCopiedImage] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  // Generate canvas preview whenever options change
  const generateCanvas = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Small tick for UI responsiveness
      await new Promise(r => setTimeout(r, 50));
      const options: TimelineExportOptions = {
        layout,
        theme,
        yearFilter: 'all',
        highResScale: layout === 'poster' ? 2 : 2,
      };

      const canvas = await renderTimelineToCanvas(certifications, options);
      setCanvasInstance(canvas);
      const dataUrl = canvas.toDataURL('image/png');
      setPreviewDataUrl(dataUrl);
    } catch (err) {
      console.error('Failed to render timeline canvas:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [certifications, layout, theme]);

  useEffect(() => {
    if (isOpen) {
      generateCanvas();
    }
  }, [isOpen, generateCanvas]);

  // Handle ESC key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!previewDataUrl) return;
    const filename = `nhan-nguyen-certifications-timeline-${layout}.png`;
    downloadImage(previewDataUrl, filename);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopyImage = async () => {
    if (!canvasInstance) return;
    try {
      canvasInstance.toBlob(async blob => {
        if (!blob) return;
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
        } else {
          // Fallback download if clipboard item is not supported in environment
          handleDownload();
        }
      });
    } catch {
      handleDownload();
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overscroll-contain"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onTouchEnd={e => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      tabIndex={-1}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        onClick={e => e.stopPropagation()}
        className={`relative max-w-4xl w-full max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          darkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`px-6 py-4.5 border-b flex items-center justify-between shrink-0 ${
            darkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 id="export-modal-title" className="text-base sm:text-lg font-bold">
                Export Certification Timeline Image
              </h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                High-resolution PNG with timeline axis, cert titles, and issuer credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-200 active:scale-95 transition-all cursor-pointer ${
              darkMode ? 'hover:bg-slate-800 active:bg-slate-700' : 'hover:bg-slate-100 active:bg-slate-200'
            }`}
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Options Bar */}
        <div
          className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-4 text-xs shrink-0 ${
            darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-white'
          }`}
        >
          {/* Layout Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Layout:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <button
                onClick={() => setLayout('poster')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  layout === 'poster'
                    ? 'bg-sky-500 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Poster Infographic (Full Timeline)
              </button>
              <button
                onClick={() => setLayout('landscape')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  layout === 'landscape'
                    ? 'bg-sky-500 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Landscape Card (16:9)
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Color Theme:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-sky-500 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark Slate
              </button>
              <button
                onClick={() => setTheme('navy')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  theme === 'navy'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Midnight Navy
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Clean Light
              </button>
            </div>
          </div>
        </div>

        {/* Live Canvas Preview Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40 flex flex-col items-center justify-center min-h-[360px] max-h-[58vh]">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              <p className="text-sm font-medium">Rendering high-resolution timeline...</p>
            </div>
          ) : previewDataUrl ? (
            <div className="w-full flex justify-center">
              <div
                className={`relative rounded-2xl overflow-hidden border shadow-2xl max-w-full ${
                  layout === 'poster' ? 'max-w-2xl' : 'max-w-3xl'
                } ${darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-300 bg-white'}`}
              >
                <img
                  src={previewDataUrl}
                  alt="Certification Timeline Infographic Preview"
                  className="w-full h-auto object-contain max-h-[52vh] rounded-xl"
                />
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">Preview not available</div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div
          className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 ${
            darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Includes: Timeline Spine, Cert Name, Issuer Pill, Credential ID</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyImage}
              disabled={isGenerating || !previewDataUrl}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
                copiedImage
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : darkMode
                    ? 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {copiedImage ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image</span>
                </>
              )}
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              disabled={isGenerating || !previewDataUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 transition-all shadow-md shadow-sky-600/30 cursor-pointer disabled:opacity-50"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Image (PNG)</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
