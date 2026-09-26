import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Smartphone, Mail, UserCheck } from 'lucide-react';
import { Linkedin } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ContactQRCodeProps {
  darkMode: boolean;
}

type QRMode = 'vcard' | 'linkedin' | 'email';

export const ContactQRCode: React.FC<ContactQRCodeProps> = ({ darkMode }) => {
  const [activeMode, setActiveMode] = useState<QRMode>('vcard');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedData, setCopiedData] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // vCard 3.0 representation
  const vCardContent = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${PERSONAL_INFO.name}`,
    'N:Nguyen;Nhan;;;',
    `TITLE:${PERSONAL_INFO.role}`,
    `EMAIL;TYPE=INTERNET,PREF:${PERSONAL_INFO.email}`,
    `URL;TYPE=LinkedIn:${PERSONAL_INFO.linkedin}`,
    `URL;TYPE=GitHub:${PERSONAL_INFO.github}`,
    `ADR;TYPE=HOME:;;;${PERSONAL_INFO.location};;;`,
    `NOTE:Software Engineer · Enterprise & Cloud Architecture`,
    'END:VCARD',
  ].join('\r\n');

  const getContentForMode = (
    mode: QRMode
  ): { title: string; content: string; description: string } => {
    switch (mode) {
      case 'vcard':
        return {
          title: 'Full Contact Card (vCard)',
          content: vCardContent,
          description:
            'Encodes your Name, Email, LinkedIn, and details. Scanning on iOS or Android directly prompts "Add to Contacts".',
        };
      case 'linkedin':
        return {
          title: 'LinkedIn Profile',
          content: PERSONAL_INFO.linkedin,
          description:
            'Direct link to your LinkedIn profile. Scanning opens LinkedIn or browser to connect.',
        };
      case 'email':
        return {
          title: 'Direct Email',
          content: `mailto:${PERSONAL_INFO.email}?subject=Let's%20Connect%20-%20Portfolio`,
          description:
            'Encodes your email address. Scanning launches the default mobile email app ready to compose.',
        };
    }
  };

  const currentModeInfo = getContentForMode(activeMode);

  // Generate QR code whenever activeMode changes
  useEffect(() => {
    let isMounted = true;
    setError(null);

    QRCode.toDataURL(currentModeInfo.content, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a', // Deep slate for high contrast & reliable camera recognition
        light: '#ffffff',
      },
    })
      .then(url => {
        if (isMounted) {
          setQrDataUrl(url);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError('Failed to generate QR code');
          console.error('QR code generation error:', err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeMode, currentModeInfo.content]);

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      const textToCopy =
        activeMode === 'vcard'
          ? `Name: ${PERSONAL_INFO.name}\nEmail: ${PERSONAL_INFO.email}\nLinkedIn: ${PERSONAL_INFO.linkedin}`
          : currentModeInfo.content;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedData(true);
      setTimeout(() => setCopiedData(false), 2000);
    } catch {
      setCopiedData(false);
    }
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    setDownloading(true);
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `nhan-nguyen-${activeMode}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 800);
  };

  const handleDownloadVCard = () => {
    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Nhan_Nguyen_Contact.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`rounded-2xl border transition-all p-6 sm:p-8 ${
        darkMode
          ? 'bg-slate-900/80 border-slate-800 shadow-xl'
          : 'bg-white border-slate-200/90 shadow-lg shadow-slate-200/40'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Left Side: Mode Selection & Details */}
        <div className="flex-1 w-full text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-lg bg-sky-500/10 text-sky-500 border border-sky-500/20">
              <QrCode className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-500">
              Mobile Quick Connect
            </span>
          </div>

          <h3
            className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Scan & Save Contact
          </h3>

          <p
            className={`text-sm leading-relaxed mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Scan with your smartphone camera to quickly save my contact information or open my
            professional profiles on mobile devices.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              type="button"
              onClick={() => setActiveMode('vcard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'vcard'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30 ring-1 ring-sky-500'
                  : darkMode
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Contact Card (vCard)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('linkedin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'linkedin'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 ring-1 ring-blue-500'
                  : darkMode
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn URL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('email')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'email'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-1 ring-emerald-500'
                  : darkMode
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </button>
          </div>

          {/* Mode explanation box */}
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed mb-6 ${
              darkMode
                ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                  {currentModeInfo.title}
                </p>
                <p className="text-slate-500 dark:text-slate-400">{currentModeInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Encoded Data Summary */}
          <div className="space-y-1.5 mb-6 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-200/50 dark:border-slate-800">
              <span className="font-sans font-medium uppercase tracking-wider text-[11px]">
                Encoded Payload
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-sky-500 hover:text-sky-400 cursor-pointer font-sans"
              >
                {copiedData ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {activeMode === 'vcard' ? (
              <div
                className={`p-2.5 rounded-lg text-[11px] overflow-x-auto ${
                  darkMode ? 'bg-slate-950/40 text-slate-300' : 'bg-slate-100/70 text-slate-700'
                }`}
              >
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Name:</span>{' '}
                  {PERSONAL_INFO.name}
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Email:</span>{' '}
                  <span className="text-sky-500">{PERSONAL_INFO.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">LinkedIn:</span>{' '}
                  <span className="text-blue-500">{PERSONAL_INFO.linkedin}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Location:</span>{' '}
                  {PERSONAL_INFO.location}
                </div>
              </div>
            ) : (
              <div
                className={`p-2.5 rounded-lg text-[11px] truncate font-mono ${
                  darkMode ? 'bg-slate-950/40 text-slate-300' : 'bg-slate-100/70 text-slate-700'
                }`}
              >
                {currentModeInfo.content}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={!qrDataUrl || downloading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Downloading...' : 'Download QR Image (.png)'}</span>
            </button>

            {activeMode === 'vcard' && (
              <button
                type="button"
                onClick={handleDownloadVCard}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer ${
                  darkMode
                    ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Save Contact File (.vcf)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: QR Code Frame */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div
            className={`relative p-4 sm:p-5 rounded-2xl border transition-all ${
              darkMode
                ? 'bg-slate-950/90 border-slate-700/80 shadow-2xl shadow-sky-500/5'
                : 'bg-white border-slate-200 shadow-xl shadow-slate-200/60'
            }`}
          >
            {/* Visual QR Card wrapper */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-inner flex flex-col items-center justify-center">
              {error ? (
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-xs text-rose-500 text-center p-4">
                  {error}
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${currentModeInfo.title}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 block rounded-lg select-none"
                  width={224}
                  height={224}
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 animate-pulse bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}

              {/* Inset Subtext inside the badge plate */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 w-full text-center">
                <span className="text-[11px] font-semibold text-slate-800 tracking-tight flex items-center justify-center gap-1">
                  <span>{PERSONAL_INFO.name}</span>
                  <span className="text-slate-400 font-normal">·</span>
                  <span className="text-sky-600 font-mono text-[10px]">
                    {activeMode === 'vcard'
                      ? 'vCard 3.0'
                      : activeMode === 'linkedin'
                        ? 'LinkedIn'
                        : 'Email'}
                  </span>
                </span>
              </div>
            </div>

            {/* Scan Prompt below code */}
            <div className="mt-3.5 flex items-center justify-center gap-1.5 text-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span
                className={`text-[11px] font-medium ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Point camera to scan instantly
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
