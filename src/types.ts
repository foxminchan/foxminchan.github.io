export type CertLevel =
  'Expert' | 'Associate' | 'Specialty' | 'Foundations' | 'Professional' | 'Fundamentals';

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  issued: string;
  expires: string;
  credentialId: string;
  credentialUrl: string;
  level: CertLevel;
  featured?: boolean;
  badgeImage?: string;
  isNew?: boolean;
  issueDate?: string;
  archivedDate?: string;
}

export interface GitHubRepoData {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage?: string | null;
  starsCount: number;
  forksCount: number;
  openIssuesCount: number;
  language: string | null;
  license?: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  topics: string[];
  pushedAt: string;
  updatedAt: string;
  createdAt: string;
  archived: boolean;
  cloneUrl: string;
  defaultBranch: string;
}

export interface Project {
  id: string;
  title: string;
  repoName?: string;
  description: string;
  stars: string;
  githubUrl: string;
  demoUrl?: string;
  highlights: string[];
  featuredBadge?: string;
}

export interface ExperienceRole {
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent?: boolean;
  projects?: {
    name: string;
    domain: string;
    points: string[];
    techStack: string[];
  }[];
  points?: string[];
  techStack?: string[];
}

export interface SkillGroup {
  category: string;
  iconName: string;
  skills: {
    name: string;
    level?: 'Advanced' | 'Proficient' | 'Core';
    highlight?: boolean;
  }[];
}

export interface HonorAward {
  id: string;
  title: string;
  issuer: string;
  date: string;
  associatedWith: string;
  description: string;
  category?: 'National Olympiad' | 'Innovation & Hackathon' | 'Networking Competition';
  highlightBadge?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  institutionShort?: string;
  degree: string;
  fieldOfStudy: string;
  period: string;
  startDate: string;
  endDate: string;
  grade: string;
  location: string;
  status?: string;
  highlights?: string[];
  honors: HonorAward[];
}
