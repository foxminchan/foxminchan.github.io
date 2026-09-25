import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // Read avatar if available
  let avatarBuffer: Buffer | null = null;
  const avatarPath = path.resolve('public/avatar.png');
  if (fs.existsSync(avatarPath)) {
    try {
      const avatarSize = 220;
      const circleMask = Buffer.from(
        `<svg width="${avatarSize}" height="${avatarSize}">
          <circle cx="${avatarSize / 2}" cy="${avatarSize / 2}" r="${avatarSize / 2}" fill="#ffffff"/>
        </svg>`
      );

      avatarBuffer = await sharp(avatarPath)
        .resize(avatarSize, avatarSize, { fit: 'cover' })
        .composite([{ input: circleMask, blend: 'dest-in' }])
        .png()
        .toBuffer();
    } catch (err) {
      console.warn('Could not process avatar:', err);
    }
  }

  // Read logo if available
  let logoBuffer: Buffer | null = null;
  const logoPath = path.resolve('public/logo.png');
  if (fs.existsSync(logoPath)) {
    try {
      logoBuffer = await sharp(logoPath)
        .resize(52, 52, { fit: 'contain' })
        .png()
        .toBuffer();
    } catch (err) {
      console.warn('Could not process logo:', err);
    }
  }

  // Badges to highlight (Azure Expert, GCP PCA, HashiCorp Terraform, GitHub AI Agent)
  const badgeBuffers: { input: Buffer; top: number; left: number }[] = [];
  const badgePaths = [
    { file: 'public/badges/ms-expert.svg', left: 990, top: 115, size: 86 },
    { file: 'public/badges/gcp-pca.png', left: 1045, top: 235, size: 82 },
    { file: 'public/badges/hashicorp-terraform.png', left: 1005, top: 355, size: 80 },
    { file: 'public/badges/github-agentic-ai-developer.svg', left: 935, top: 460, size: 78 },
  ];

  for (const b of badgePaths) {
    const fullPath = path.resolve(b.file);
    if (fs.existsSync(fullPath)) {
      try {
        const buf = await sharp(fullPath)
          .resize(b.size, b.size, { fit: 'contain' })
          .png()
          .toBuffer();
        badgeBuffers.push({ input: buf, left: b.left, top: b.top });
      } catch (err) {
        console.warn(`Could not process badge ${b.file}:`, err);
      }
    }
  }

  // Create base SVG with dark cyberpunk/enterprise theme
  const svgOverlay = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#030712"/>
      <stop offset="50%" stop-color="#081024"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Radial Glows -->
    <radialGradient id="glowCyan" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowIndigo" cx="80%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="60%" cy="90%" r="40%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>

    <!-- Text Gradients -->
    <linearGradient id="nameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>

    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>

    <linearGradient id="cardBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5"/>
      <stop offset="50%" stop-color="#6366f1" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0.4"/>
    </linearGradient>

    <linearGradient id="avatarRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>

    <!-- Subtle Tech Grid -->
    <pattern id="techGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.75" stroke-opacity="0.35"/>
      <circle cx="0" cy="0" r="1.5" fill="#38bdf8" fill-opacity="0.25"/>
    </pattern>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#glowCyan)"/>
  <rect width="${width}" height="${height}" fill="url(#glowIndigo)"/>
  <rect width="${width}" height="${height}" fill="url(#glowViolet)"/>
  <rect width="${width}" height="${height}" fill="url(#techGrid)"/>

  <!-- Outer Card Frame with subtle glowing borders -->
  <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="24" fill="none" stroke="url(#cardBorderGrad)" stroke-width="1.5"/>

  <!-- Top Status Pill / Identity -->
  <g transform="translate(68, 64)">
    <rect x="0" y="0" width="280" height="36" rx="18" fill="#0f172a" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.4"/>
    <circle cx="18" cy="18" r="4.5" fill="#22c55e" filter="url(#softGlow)"/>
    <text x="32" y="23" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">SOFTWARE ENGINEER PORTFOLIO</text>
  </g>

  <!-- Top Right Platform Badges -->
  <g transform="translate(860, 68)">
    <rect x="0" y="0" width="260" height="32" rx="16" fill="#0f172a" fill-opacity="0.7" stroke="#334155" stroke-width="1"/>
    <text x="130" y="21" text-anchor="middle" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" letter-spacing="1">github.com/foxminchan</text>
  </g>

  <!-- Main Hero Title & Identity -->
  <g transform="translate(68, 160)">
    <!-- Candidate Name -->
    <text x="0" y="44" fill="url(#nameGrad)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">Nhan Nguyen</text>
    <text x="360" y="44" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="500">(@foxminchan)</text>

    <!-- Role and Domain -->
    <text x="0" y="96" fill="url(#accentGrad)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="700">Enterprise Applications &amp; Cloud-Native Architecture</text>

    <!-- Bio / Value Proposition -->
    <text x="0" y="136" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="400">
      Specializing in high-throughput .NET microservices, Azure cloud infrastructure,
    </text>
    <text x="0" y="162" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="400">
      distributed systems reliability, and 30+ multi-cloud certified engineering.
    </text>
  </g>

  <!-- Stat Metric Cards Row -->
  <g transform="translate(68, 380)">
    <!-- Metric 1: 30+ Certifications -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="144" height="92" rx="14" fill="#0f172a" fill-opacity="0.85" stroke="#1e293b" stroke-width="1.2"/>
      <rect x="0" y="0" width="144" height="4" rx="2" fill="#38bdf8"/>
      <text x="18" y="42" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800">30+</text>
      <text x="18" y="66" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600">Certifications</text>
      <text x="18" y="80" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500">Azure · GCP · Hashi · GH</text>
    </g>

    <!-- Metric 2: 23 Microservices -->
    <g transform="translate(156, 0)">
      <rect x="0" y="0" width="144" height="92" rx="14" fill="#0f172a" fill-opacity="0.85" stroke="#1e293b" stroke-width="1.2"/>
      <rect x="0" y="0" width="144" height="4" rx="2" fill="#6366f1"/>
      <text x="18" y="42" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800">23</text>
      <text x="18" y="66" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600">Microservices</text>
      <text x="18" y="80" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500">Azure Container Apps</text>
    </g>

    <!-- Metric 3: 620+ GitHub Stars -->
    <g transform="translate(312, 0)">
      <rect x="0" y="0" width="144" height="92" rx="14" fill="#0f172a" fill-opacity="0.85" stroke="#1e293b" stroke-width="1.2"/>
      <rect x="0" y="0" width="144" height="4" rx="2" fill="#eab308"/>
      <text x="18" y="42" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800">620+</text>
      <text x="18" y="66" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600">GitHub Stars</text>
      <text x="18" y="80" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500">Open-Source .NET</text>
    </g>

    <!-- Metric 4: 2+ Years Exp -->
    <g transform="translate(468, 0)">
      <rect x="0" y="0" width="144" height="92" rx="14" fill="#0f172a" fill-opacity="0.85" stroke="#1e293b" stroke-width="1.2"/>
      <rect x="0" y="0" width="144" height="4" rx="2" fill="#10b981"/>
      <text x="18" y="42" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800">2+ Yrs</text>
      <text x="18" y="66" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600">Experience</text>
      <text x="18" y="80" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500">Enterprise Backend</text>
    </g>
  </g>

  <!-- Bottom Tech Stack Badges Row -->
  <g transform="translate(68, 510)">
    <!-- Pill 1: .NET / C# -->
    <rect x="0" y="0" width="86" height="30" rx="15" fill="#172554" stroke="#1d4ed8" stroke-width="1"/>
    <text x="43" y="20" text-anchor="middle" fill="#93c5fd" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700">.NET 9 / C#</text>

    <!-- Pill 2: Azure -->
    <rect x="96" y="0" width="100" height="30" rx="15" fill="#082f49" stroke="#0284c7" stroke-width="1"/>
    <text x="146" y="20" text-anchor="middle" fill="#7dd3fc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700">Azure Cloud</text>

    <!-- Pill 3: Docker & K8s -->
    <rect x="206" y="0" width="116" height="30" rx="15" fill="#1e1b4b" stroke="#4f46e5" stroke-width="1"/>
    <text x="264" y="20" text-anchor="middle" fill="#a5b4fc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700">Docker &amp; K8s</text>

    <!-- Pill 4: CI/CD DevOps -->
    <rect x="332" y="0" width="114" height="30" rx="15" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <text x="389" y="20" text-anchor="middle" fill="#cbd5e1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700">CI/CD DevOps</text>

    <!-- Pill 5: Agentic AI -->
    <rect x="456" y="0" width="104" height="30" rx="15" fill="#3b0764" stroke="#9333ea" stroke-width="1"/>
    <text x="508" y="20" text-anchor="middle" fill="#d8b4fe" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700">Agentic AI</text>

    <!-- Location & Status Tag -->
    <g transform="translate(680, 0)">
      <circle cx="8" cy="15" r="4" fill="#38bdf8"/>
      <text x="20" y="20" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600">Ho Chi Minh City, VN · Open for Opportunities</text>
    </g>
  </g>

  <!-- Right Side Decorative Elements: Glowing Rings around Avatar -->
  <g transform="translate(730, 160)">
    <!-- Outer ambient decorative circles -->
    <circle cx="110" cy="110" r="140" fill="none" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.15" stroke-dasharray="8 6"/>
    <circle cx="110" cy="110" r="126" fill="none" stroke="url(#avatarRingGrad)" stroke-width="3" stroke-opacity="0.9" filter="url(#softGlow)"/>
    <circle cx="110" cy="110" r="122" fill="#0f172a" fill-opacity="0.8"/>
  </g>

  <!-- Floating Badge card overlay frame -->
  <g transform="translate(710, 430)">
    <rect x="0" y="0" width="220" height="54" rx="16" fill="#0b1329" fill-opacity="0.92" stroke="#334155" stroke-width="1"/>
    <circle cx="28" cy="27" r="14" fill="#0284c7" fill-opacity="0.25"/>
    <path d="M 28 19 L 34 23 L 34 29 C 34 33 28 36 28 36 C 28 36 22 33 22 29 L 22 23 Z" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
    <text x="52" y="24" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700">Enterprise Verified</text>
    <text x="52" y="39" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500">Azure · GCP · Terraform · GH</text>
  </g>
</svg>
`;

  const composites: Array<{ input: Buffer; top: number; left: number }> = [
    {
      input: Buffer.from(svgOverlay),
      top: 0,
      left: 0,
    },
  ];

  // Place Avatar if available (circle avatar at x: 730, y: 160)
  if (avatarBuffer) {
    composites.push({
      input: avatarBuffer,
      left: 730,
      top: 160,
    });
  }

  // Place Badges
  for (const b of badgeBuffers) {
    composites.push({
      input: b.input,
      left: b.left,
      top: b.top,
    });
  }

  // Render final 1200x630 OpenGraph Image
  const outputPathPng = path.resolve('public/og-image.png');
  const outputPathJpg = path.resolve('public/og-image.jpg');

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 3, g: 7, b: 18, alpha: 1 },
    },
  })
    .composite(composites)
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPathPng);

  console.log('✅ Generated public/og-image.png (1200x630)');

  // Also create a high-quality JPG version for any platform preferring JPG
  await sharp(outputPathPng)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outputPathJpg);

  console.log('✅ Generated public/og-image.jpg (1200x630)');
}

generateOgImage().catch((err) => {
  console.error('Error generating OG image:', err);
  process.exit(1);
});
