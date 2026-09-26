import {
  PERSONAL_INFO,
  EXPERIENCES,
  PROJECTS,
  SKILL_GROUPS,
  CERTIFICATIONS,
} from '../data/portfolioData';

export interface ReadingTimeResult {
  minutes: number;
  seconds: number;
  words: number;
  text: string;
}

export interface SectionReadingTime extends ReadingTimeResult {
  id: string;
  label: string;
}

/**
 * Standard adult reading speed in words per minute (WPM).
 * 200 WPM is the industry standard benchmark used by Medium, Dev.to, and UX researchers.
 */
export const STANDARD_WPM = 200;

/**
 * Strips markdown asterisks, links, and syntax to extract plain words for accurate calculation.
 */
export function countWords(content: string): number {
  if (!content || !content.trim()) return 0;
  // Remove markdown formatting like **bold**, links, code markers
  const clean = content
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#*_~`]/g, ' ')
    .trim();

  return clean.split(/\s+/).filter(Boolean).length;
}

/**
 * Calculates estimated reading time based on raw content or word count.
 *
 * @param content The text content or word count to analyze
 * @param wpm Reading speed in words per minute (default: 200)
 */
export function calculateReadingTime(content: string | number, wpm = STANDARD_WPM): ReadingTimeResult {
  const words = typeof content === 'number' ? content : countWords(content);

  if (words <= 0) {
    return {
      minutes: 0,
      seconds: 0,
      words: 0,
      text: '< 1 min read',
    };
  }

  const exactMinutes = words / wpm;
  const seconds = Math.max(5, Math.round(exactMinutes * 60));
  const minutes = Math.max(1, Math.ceil(exactMinutes));

  let textDisplay: string;
  if (words < 50) {
    textDisplay = '< 1 min read';
  } else if (minutes === 1) {
    textDisplay = '1 min read';
  } else {
    textDisplay = `${minutes} min read`;
  }

  return {
    minutes,
    seconds,
    words,
    text: textDisplay,
  };
}

/**
 * Calculates the total word count for the About / Hero section.
 */
export function getAboutSectionWords(): number {
  const text = [
    PERSONAL_INFO.name,
    PERSONAL_INFO.role,
    PERSONAL_INFO.tagline,
    PERSONAL_INFO.bio,
    PERSONAL_INFO.location,
    ...PERSONAL_INFO.metrics.map(m => `${m.label} ${m.value} ${m.subtext}`),
  ].join(' ');

  return countWords(text);
}

/**
 * Calculates the total word count for the Work Experience section.
 */
export function getExperienceSectionWords(): number {
  const chunks: string[] = [];

  EXPERIENCES.forEach(exp => {
    chunks.push(exp.company, exp.role, exp.location, exp.period);
    if (exp.projects) {
      exp.projects.forEach(p => {
        chunks.push(p.name, p.domain, ...p.points, ...p.techStack);
      });
    }
    if (exp.points) {
      chunks.push(...exp.points);
    }
    if (exp.techStack) {
      chunks.push(...exp.techStack);
    }
  });

  return countWords(chunks.join(' '));
}

/**
 * Calculates the total word count for the Featured Projects section.
 */
export function getProjectsSectionWords(): number {
  const chunks: string[] = [];

  PROJECTS.forEach(proj => {
    chunks.push(
      proj.title,
      proj.description,
      proj.featuredBadge || '',
      ...proj.highlights
    );
  });

  return countWords(chunks.join(' '));
}

/**
 * Calculates the total word count for the Engineering Stack & Skills section.
 */
export function getSkillsSectionWords(): number {
  const chunks: string[] = [];

  SKILL_GROUPS.forEach(grp => {
    chunks.push(grp.category);
    grp.skills.forEach(s => {
      chunks.push(s.name, s.level || '');
    });
  });

  return countWords(chunks.join(' '));
}

/**
 * Calculates the total word count for the Verified Certifications section.
 */
export function getCertificationsSectionWords(): number {
  const chunks: string[] = [];

  CERTIFICATIONS.forEach(cert => {
    chunks.push(cert.title, cert.issuer, cert.level, cert.issued);
  });

  return countWords(chunks.join(' '));
}

/**
 * Calculates the total word count for the Contact / Connect section.
 */
export function getContactSectionWords(): number {
  const text = [
    'Get In Touch',
    'Open to discussions on enterprise backend architecture, cloud-native modernization, and technical advisory roles.',
    PERSONAL_INFO.email,
    PERSONAL_INFO.location,
    'GitHub',
    'LinkedIn',
  ].join(' ');

  return countWords(text);
}

/**
 * Precomputed section reading times for fast zero-runtime-cost access.
 */
export const SECTION_READING_TIMES: Record<string, SectionReadingTime> = {
  about: {
    id: 'about',
    label: 'About',
    ...calculateReadingTime(getAboutSectionWords()),
  },
  experience: {
    id: 'experience',
    label: 'Experience',
    ...calculateReadingTime(getExperienceSectionWords()),
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    ...calculateReadingTime(getProjectsSectionWords()),
  },
  skills: {
    id: 'skills',
    label: 'Skills',
    ...calculateReadingTime(getSkillsSectionWords()),
  },
  certifications: {
    id: 'certifications',
    label: 'Certifications',
    ...calculateReadingTime(getCertificationsSectionWords()),
  },
  contact: {
    id: 'contact',
    label: 'Contact',
    ...calculateReadingTime(getContactSectionWords()),
  },
};

/**
 * Calculates the cumulative reading time across all content sections on the page.
 */
export function getTotalPortfolioReadingTime(): ReadingTimeResult {
  const totalWords = Object.values(SECTION_READING_TIMES).reduce(
    (acc, sec) => acc + sec.words,
    0
  );

  return calculateReadingTime(totalWords);
}
