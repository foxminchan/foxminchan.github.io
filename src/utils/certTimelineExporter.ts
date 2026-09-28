import { Certification } from '../types';
import {
  getTimelineCertifications,
  groupCertsByYearAndMonth,
  getIssuerStyle,
  getLevelBadgeStyle,
} from './certTimelineData';
import { PERSONAL_INFO } from '../data/portfolioData';

export interface TimelineExportOptions {
  yearFilter?: number | 'all';
  theme?: 'dark' | 'navy' | 'light';
  layout?: 'poster' | 'landscape';
  highResScale?: number;
}

// Word-wrap utility for HTML5 Canvas 2D
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    const width = ctx.measureText(testLine).width;
    if (width < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Rounded rect fallback
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | number[]
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  } else {
    // Basic fallback
    const r = typeof radius === 'number' ? radius : radius[0] || 8;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

/**
 * Generates an infographic canvas showcasing certifications earned across the timeline.
 * Guaranteed to feature timeline axis, certification title, issuer, credential level, and issue dates.
 */
export async function renderTimelineToCanvas(
  certs: Certification[],
  options: TimelineExportOptions = {}
): Promise<HTMLCanvasElement> {
  const {
    yearFilter = 'all',
    theme = 'dark',
    layout = 'poster',
    highResScale = 2,
  } = options;

  let activeCerts = getTimelineCertifications(certs);
  if (yearFilter !== 'all') {
    activeCerts = activeCerts.filter(c => c.parsedDate.year === yearFilter);
  }

  const yearGroups = groupCertsByYearAndMonth(activeCerts);

  if (layout === 'landscape') {
    return renderLandscapeShowcase(activeCerts, yearGroups, theme, highResScale);
  }

  return renderPosterShowcase(activeCerts, yearGroups, theme, highResScale);
}

/**
 * Renders Full Poster Infographic with 2-column alternating timeline cards
 */
async function renderPosterShowcase(
  activeCerts: ReturnType<typeof getTimelineCertifications>,
  yearGroups: ReturnType<typeof groupCertsByYearAndMonth>,
  themeName: 'dark' | 'navy' | 'light',
  scale: number
): Promise<HTMLCanvasElement> {
  const width = 1400;
  const colWidth = 560;
  const leftX = 80;
  const rightX = 760;
  const spineX = 700;

  // Pre-calculate heights
  const headerHeight = 320;
  let runningY = headerHeight + 40;

  interface LayoutItem {
    type: 'year' | 'month' | 'cert';
    y: number;
    height: number;
    year?: number;
    totalCount?: number;
    monthName?: string;
    cert?: (typeof activeCerts)[0];
    column?: 'left' | 'right';
  }

  const layoutItems: LayoutItem[] = [];

  yearGroups.forEach(yg => {
    // Year Header
    layoutItems.push({
      type: 'year',
      y: runningY,
      height: 52,
      year: yg.year,
      totalCount: yg.totalCount,
    });
    runningY += 96; // Generous breathing room between Year Banner and Month Pill

    yg.months.forEach(mg => {
      // Month Marker on Spine
      layoutItems.push({
        type: 'month',
        y: runningY,
        height: 38,
        monthName: `${mg.monthName.toUpperCase()} ${mg.year}`,
        totalCount: mg.certs.length,
      });
      runningY += 66; // Clear spacing after Month Pill before first certificate row

      // Render cert cards in alternating left/right
      for (let i = 0; i < mg.certs.length; i += 2) {
        const cert1 = mg.certs[i];
        const cert2 = mg.certs[i + 1];

        const rowY = runningY;
        const cardHeight = 138;

        layoutItems.push({
          type: 'cert',
          y: rowY,
          height: cardHeight,
          cert: cert1,
          column: 'left',
        });

        if (cert2) {
          layoutItems.push({
            type: 'cert',
            y: rowY,
            height: cardHeight,
            cert: cert2,
            column: 'right',
          });
        }

        runningY += cardHeight + 20;
      }

      runningY += 28;
    });

    runningY += 36;
  });

  const footerHeight = 140;
  const totalHeight = runningY + footerHeight;

  // Create High-DPI Canvas
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = totalHeight * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.scale(scale, scale);

  // Background Theme
  const isDark = themeName !== 'light';
  if (isDark) {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, totalHeight);
    if (themeName === 'navy') {
      bgGrad.addColorStop(0, '#0a1128');
      bgGrad.addColorStop(0.5, '#070b19');
      bgGrad.addColorStop(1, '#050711');
    } else {
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(0.5, '#0d1527');
      bgGrad.addColorStop(1, '#060a12');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, totalHeight);

    // Ambient radial glow behind header
    const glow1 = ctx.createRadialGradient(spineX, 160, 20, spineX, 160, 600);
    glow1.addColorStop(0, 'rgba(0, 164, 239, 0.16)');
    glow1.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, 500);

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, totalHeight);
      ctx.stroke();
    }
    for (let y = 40; y < totalHeight; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, totalHeight);
  }

  // Draw Header
  drawHeader(ctx, width, activeCerts.length, isDark);

  // Draw Central Timeline Spine
  const spineStartY = headerHeight + 20;
  const spineEndY = runningY - 10;
  const spineGrad = ctx.createLinearGradient(spineX, spineStartY, spineX, spineEndY);
  spineGrad.addColorStop(0, '#38bdf8');
  spineGrad.addColorStop(0.5, '#818cf8');
  spineGrad.addColorStop(1, '#a855f7');

  ctx.strokeStyle = spineGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(spineX, spineStartY);
  ctx.lineTo(spineX, spineEndY);
  ctx.stroke();

  // Subtle outer spine glow
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(spineX, spineStartY);
  ctx.lineTo(spineX, spineEndY);
  ctx.stroke();

  // Render Layout Items
  for (const item of layoutItems) {
    if (item.type === 'year') {
      // Year Banner across spine
      const bannerText = `${item.year} CREDENTIAL TIMELINE (${item.totalCount} CERTIFICATIONS)`;
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      const textMetrics = ctx.measureText(bannerText);
      const bannerW = Math.max(480, Math.ceil(textMetrics.width + 64));
      const bannerH = 52;
      const bannerX = spineX - bannerW / 2;
      const bannerY = item.y;

      // Glow behind banner
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.12)';
      drawRoundRect(ctx, bannerX - 4, bannerY - 4, bannerW + 8, bannerH + 8, 30);
      ctx.fill();

      // Card Gradient Background
      const yGrad = ctx.createLinearGradient(bannerX, bannerY, bannerX + bannerW, bannerY);
      yGrad.addColorStop(0, '#0284c7');
      yGrad.addColorStop(1, '#4f46e5');
      ctx.fillStyle = yGrad;
      drawRoundRect(ctx, bannerX, bannerY, bannerW, bannerH, 26);
      ctx.fill();

      // Border outline
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, bannerX, bannerY, bannerW, bannerH, 26);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bannerText, spineX, bannerY + bannerH / 2);
    } else if (item.type === 'month') {
      // Month Marker Pill centered on spine
      const monthLabel = `${item.monthName} · ${item.totalCount} earned`;
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      const textMetrics = ctx.measureText(monthLabel);
      const dotDiameter = 7;
      const dotGap = 10;
      const contentWidth = dotDiameter + dotGap + textMetrics.width;

      const pillW = Math.max(220, Math.ceil(contentWidth + 48));
      const pillH = 36;
      const pillX = spineX - pillW / 2;
      const pillY = item.y;

      // Soft ambient aura
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.08)';
      drawRoundRect(ctx, pillX - 3, pillY - 3, pillW + 6, pillH + 6, 21);
      ctx.fill();

      // Solid Opaque Container (Masks central spine behind text cleanly)
      ctx.fillStyle = isDark ? '#0b1329' : '#ffffff';
      ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 1.75;
      drawRoundRect(ctx, pillX, pillY, pillW, pillH, 18);
      ctx.fill();
      ctx.stroke();

      // Centered content group: [Dot] [Gap] [Text] - No overlapping dot!
      const startX = spineX - contentWidth / 2;
      const centerY = pillY + pillH / 2;

      // Left Indicator Dot
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.beginPath();
      ctx.arc(startX + dotDiameter / 2, centerY, dotDiameter / 2, 0, Math.PI * 2);
      ctx.fill();

      // Month Label Text cleanly starting after dot + gap
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(monthLabel, startX + dotDiameter + dotGap, centerY);
    } else if (item.type === 'cert' && item.cert) {
      const cert = item.cert;
      const isLeft = item.column === 'left';
      const cardX = isLeft ? leftX : rightX;
      const cardY = item.y;
      const cardW = colWidth;
      const cardH = item.height;

      // Connecting horizontal line from spine to card
      const spineNodeY = cardY + cardH / 2;
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(cardX + cardW, spineNodeY);
        ctx.lineTo(spineX, spineNodeY);
      } else {
        ctx.moveTo(spineX, spineNodeY);
        ctx.lineTo(cardX, spineNodeY);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Polished Junction Node on Spine
      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(spineX, spineNodeY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.beginPath();
      ctx.arc(spineX, spineNodeY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw Certification Card
      drawCertCard(ctx, cardX, cardY, cardW, cardH, cert, isDark);
    }
  }

  // Draw Footer
  drawFooter(ctx, width, totalHeight, activeCerts.length, isDark);

  return canvas;
}

/**
 * Draws a single polished certification card inside the timeline
 */
function drawCertCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  cert: ReturnType<typeof getTimelineCertifications>[0],
  isDark: boolean
) {
  const issuerStyle = getIssuerStyle(cert.issuer);
  const levelStyle = getLevelBadgeStyle(cert.level);

  // Card Background with slight dark glass styling
  ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
  ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.stroke();

  // Left Issuer Accent Color Bar
  ctx.fillStyle = issuerStyle.color;
  drawRoundRect(ctx, x, y, 6, h, [16, 0, 0, 16]);
  ctx.fill();

  const contentLeft = x + 24;
  let cursorY = y + 24;

  // 1. Tag Row: Issuer Badge + Level Badge + Date
  // Issuer Pill
  const issuerText = issuerStyle.name.toUpperCase();
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  const issuerW = ctx.measureText(issuerText).width + 16;
  ctx.fillStyle = issuerStyle.bgColor;
  ctx.strokeStyle = issuerStyle.borderColor;
  ctx.lineWidth = 1;
  drawRoundRect(ctx, contentLeft, cursorY - 14, issuerW, 20, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = issuerStyle.color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(issuerText, contentLeft + 8, cursorY - 4);

  // Level Pill
  const levelText = cert.level ? cert.level.toUpperCase() : 'ASSOCIATE';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  const levelX = contentLeft + issuerW + 8;
  const levelW = ctx.measureText(levelText).width + 16;
  ctx.fillStyle = levelStyle.bgColor;
  ctx.strokeStyle = levelStyle.borderColor;
  drawRoundRect(ctx, levelX, cursorY - 14, levelW, 20, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = levelStyle.color;
  ctx.fillText(levelText, levelX + 8, cursorY - 4);

  // Date Tag on Far Right
  const dateStr = cert.parsedDate.displayDate;
  ctx.font = '500 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, x + w - 20, cursorY - 4);

  // 2. Title (Prominent, Multi-line with smart wrapping)
  cursorY += 28;
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const maxTitleW = w - 44;
  const titleLines = wrapText(ctx, cert.title, maxTitleW);

  // Limit to 2 lines
  for (let l = 0; l < Math.min(2, titleLines.length); l++) {
    ctx.fillText(titleLines[l], contentLeft, cursorY + l * 22);
  }

  // 3. Footer row inside card: Credential ID
  cursorY = y + h - 22;
  ctx.font = '500 11px monospace, system-ui';
  ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`ID: ${cert.credentialId}`, contentLeft, cursorY);

  // "Verified" checkmark marker on bottom right
  ctx.fillStyle = isDark ? '#10b981' : '#059669';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('✓ Verified Credential', x + w - 20, cursorY);
}

/**
 * Draws the master header of the timeline infographic
 */
function drawHeader(
  ctx: CanvasRenderingContext2D,
  width: number,
  certCount: number,
  isDark: boolean
) {
  const centerX = width / 2;

  // Top Pill: Journey Timeline
  const pillText = 'VERIFIED CREDENTIAL JOURNEY · CHRONOLOGICAL TIMELINE';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  const pillW = ctx.measureText(pillText).width + 32;
  ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)';
  ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.3)';
  ctx.lineWidth = 1;
  drawRoundRect(ctx, centerX - pillW / 2, 40, pillW, 28, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pillText, centerX, 54);

  // Main Candidate Name Headline
  ctx.font = '800 44px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText(`${PERSONAL_INFO.name}`, centerX, 110);

  // Subtitle
  ctx.font = '500 18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
  ctx.fillText(
    `Software Engineer · Enterprise Architecture, Cloud-Native Systems & Agentic AI`,
    centerX,
    148
  );

  // 3-Box Stats Counter Strip
  const stripW = 860;
  const stripH = 72;
  const stripX = centerX - stripW / 2;
  const stripY = 184;

  ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.75)' : '#ffffff';
  ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.8)' : '#cbd5e1';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, stripX, stripY, stripW, stripH, 16);
  ctx.fill();
  ctx.stroke();

  const statCols = [
    { value: `${certCount}`, label: 'Total Industry Credentials' },
    { value: '7', label: 'Ecosystem Issuers' },
    { value: '2026', label: 'Active Year Milestone' },
  ];

  const colWidth = stripW / statCols.length;
  statCols.forEach((stat, idx) => {
    const colX = stripX + idx * colWidth + colWidth / 2;

    ctx.font = '800 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(stat.value, colX, stripY + 12);

    ctx.font = '500 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.fillText(stat.label, colX, stripY + 44);

    if (idx < statCols.length - 1) {
      ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.6)' : '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(stripX + (idx + 1) * colWidth, stripY + 14);
      ctx.lineTo(stripX + (idx + 1) * colWidth, stripY + stripH - 14);
      ctx.stroke();
    }
  });
}

/**
 * Draws the footer of the infographic
 */
function drawFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  totalHeight: number,
  certCount: number,
  isDark: boolean
) {
  const footerY = totalHeight - 110;

  // Divider
  ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.6)' : '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, footerY);
  ctx.lineTo(width - 80, footerY);
  ctx.stroke();

  // Left: Verification Guarantee
  ctx.font = '600 14px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Official Credentials Verification Portfolio', 80, footerY + 24);

  ctx.font = '400 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.fillText(
    `All ${certCount} credentials verified via Microsoft Learn, Oracle CertView, Google Cloud Credly & Atlassian`,
    80,
    footerY + 46
  );

  // Right: Portfolio Link & Timestamp
  ctx.font = '600 14px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.textAlign = 'right';
  ctx.fillText('https://foxminchan.github.io', width - 80, footerY + 24);

  const exportDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  ctx.font = '400 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.fillText(`Exported Timeline · ${exportDate}`, width - 80, footerY + 46);
}

/**
 * Renders Landscape Summary Showcase (1200x675 standard social sharing card)
 */
async function renderLandscapeShowcase(
  activeCerts: ReturnType<typeof getTimelineCertifications>,
  yearGroups: ReturnType<typeof groupCertsByYearAndMonth>,
  themeName: 'dark' | 'navy' | 'light',
  scale: number
): Promise<HTMLCanvasElement> {
  const width = 1200;
  const height = 675;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.scale(scale, scale);

  const isDark = themeName !== 'light';
  ctx.fillStyle = isDark ? '#0b1120' : '#f8fafc';
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText('OFFICIAL CREDENTIAL TIMELINE', 60, 50);

  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(`${PERSONAL_INFO.name} — Certification Journey`, 60, 95);

  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = '500 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `${activeCerts.length} verified credentials earned in 2026 across Microsoft, Oracle, Google Cloud & IBM`,
    60,
    125
  );

  // Timeline Horizontal Bar
  const timelineY = 200;
  const timelineStartX = 60;
  const timelineEndX = 1140;

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(timelineStartX, timelineY);
  ctx.lineTo(timelineEndX, timelineY);
  ctx.stroke();

  // Draw monthly milestone nodes
  const yg = yearGroups[0];
  if (yg) {
    const monthCount = yg.months.length;
    const step = (timelineEndX - timelineStartX) / Math.max(1, monthCount - 1);

    yg.months.forEach((m, idx) => {
      const nodeX = timelineStartX + idx * step;

      // Node
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(nodeX, timelineY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Month Label
      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(m.monthName.toUpperCase(), nodeX, timelineY - 18);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${m.certs.length} certs`, nodeX, timelineY + 24);
    });
  }

  // Key Highlights Grid (3 representative certs)
  const previewCerts = activeCerts.slice(0, 3);
  const cardW = 340;
  const cardH = 200;
  const startX = 60;
  const cardY = 320;

  previewCerts.forEach((c, idx) => {
    const cX = startX + idx * 380;
    drawCertCard(ctx, cX, cardY, cardW, cardH, c, isDark);
  });

  // Footer
  ctx.font = '500 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.textAlign = 'left';
  ctx.fillText('https://foxminchan.github.io/ · Verified Credentials', 60, height - 30);

  return canvas;
}

/**
 * Triggers a direct browser download of the generated timeline image
 */
export function downloadImage(dataUrl: string, filename = 'nhan-nguyen-certifications-timeline.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
