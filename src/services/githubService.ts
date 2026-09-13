import { GitHubRepoData } from '../types';

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

// Curated verified fallbacks in case of GitHub rate-limiting (60 req/hr unauthenticated)
const FALLBACK_REPOS: Record<string, GitHubRepoData> = {
  BookWorm: {
    id: 829413452,
    name: 'BookWorm',
    fullName: 'foxminchan/BookWorm',
    description: 'The practical implementation of Aspire using Microservices, AI-Agents',
    htmlUrl: 'https://github.com/foxminchan/BookWorm',
    homepage: null,
    starsCount: 505,
    forksCount: 67,
    openIssuesCount: 55,
    language: 'C#',
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
    topics: ['ai', 'aspire', 'clean-architecture', 'csharp', 'dotnet', 'microservices'],
    pushedAt: '2026-09-11T03:53:22Z',
    updatedAt: '2026-09-11T03:53:25Z',
    createdAt: '2024-07-16T15:00:00Z',
    archived: false,
    cloneUrl: 'https://github.com/foxminchan/BookWorm.git',
    defaultBranch: 'main',
  },
  LawKnowledge: {
    id: 773192800,
    name: 'LawKnowledge',
    fullName: 'foxminchan/LawKnowledge',
    description:
      "A legal knowledge search and Q&A application based on Vietnam's Legal Code and legal document database ⚖️",
    htmlUrl: 'https://github.com/foxminchan/LawKnowledge',
    homepage: null,
    starsCount: 124,
    forksCount: 15,
    openIssuesCount: 0,
    language: 'TypeScript',
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
    topics: ['generative-ai', 'natural-language-processing', 'nlp', 'rag', 'semantic-search'],
    pushedAt: '2024-03-17T04:30:53Z',
    updatedAt: '2026-09-08T10:00:00Z',
    createdAt: '2024-03-16T12:00:00Z',
    archived: false,
    cloneUrl: 'https://github.com/foxminchan/LawKnowledge.git',
    defaultBranch: 'main',
  },
};

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

function getFromCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`gh_${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(`gh_${key}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function saveToCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(`gh_${key}`, JSON.stringify(entry));
  } catch {
    // ignore quota errors
  }
}

function normalizeRepo(data: any): GitHubRepoData {
  return {
    id: data.id,
    name: data.name,
    fullName: data.full_name,
    description: data.description || '',
    htmlUrl: data.html_url,
    homepage: data.homepage || null,
    starsCount: Number(data.stargazers_count ?? 0),
    forksCount: Number(data.forks_count ?? 0),
    openIssuesCount: Number(data.open_issues_count ?? 0),
    language: data.language || null,
    license: data.license
      ? {
          key: data.license.key || '',
          name: data.license.name || '',
          spdx_id: data.license.spdx_id || '',
        }
      : null,
    topics: Array.isArray(data.topics) ? data.topics : [],
    pushedAt: data.pushed_at || data.updated_at || '',
    updatedAt: data.updated_at || '',
    createdAt: data.created_at || '',
    archived: Boolean(data.archived),
    cloneUrl: data.clone_url || data.html_url + '.git',
    defaultBranch: data.default_branch || 'main',
  };
}

/**
 * Fetch detailed repository information from GitHub API
 */
export async function fetchGitHubRepo(
  owner: string,
  repo: string,
  forceFresh = false
): Promise<GitHubRepoData> {
  const cacheKey = `repo_${owner}_${repo}`;

  if (!forceFresh) {
    const cached = getFromCache<GitHubRepoData>(cacheKey);
    if (cached) return cached;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const json = await res.json();
    const normalized = normalizeRepo(json);
    saveToCache(cacheKey, normalized);
    return normalized;
  } catch (error) {
    console.warn(
      `GitHub API request failed for ${owner}/${repo}, falling back to cache/defaults:`,
      error
    );

    // Check expired cache
    try {
      const raw = localStorage.getItem(`gh_${cacheKey}`);
      if (raw) {
        const entry: CacheEntry<GitHubRepoData> = JSON.parse(raw);
        return entry.data;
      }
    } catch {
      // ignore
    }

    // Fall back to predefined backup if available
    if (FALLBACK_REPOS[repo]) {
      return FALLBACK_REPOS[repo];
    }

    throw error;
  }
}

/**
 * Fetch all public repositories of a GitHub user
 */
export async function fetchUserRepos(
  username: string,
  forceFresh = false
): Promise<GitHubRepoData[]> {
  const cacheKey = `user_repos_${username}`;

  if (!forceFresh) {
    const cached = getFromCache<GitHubRepoData[]>(cacheKey);
    if (cached) return cached;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const list = await res.json();
    if (!Array.isArray(list)) {
      throw new Error('Expected array of repos');
    }

    const normalizedList = list
      .filter((item: any) => !item.fork) // prioritize original projects
      .map(normalizeRepo);

    saveToCache(cacheKey, normalizedList);
    return normalizedList;
  } catch (error) {
    console.warn(`GitHub API request failed for user ${username}:`, error);

    // Try stale cache
    try {
      const raw = localStorage.getItem(`gh_${cacheKey}`);
      if (raw) {
        const entry: CacheEntry<GitHubRepoData[]> = JSON.parse(raw);
        return entry.data;
      }
    } catch {
      // ignore
    }

    return Object.values(FALLBACK_REPOS);
  }
}

/**
 * Get GitHub official language dot colors
 */
export function getLanguageColor(language: string | null): string {
  if (!language) return '#94a3b8';
  switch (language.toLowerCase()) {
    case 'c#':
    case 'csharp':
      return '#178600';
    case 'typescript':
      return '#3178c6';
    case 'javascript':
      return '#f1e05a';
    case 'python':
      return '#3572A5';
    case 'go':
      return '#00ADD8';
    case 'html':
      return '#e34c26';
    case 'css':
      return '#563d7c';
    case 'dockerfile':
      return '#384d54';
    case 'shell':
    case 'bash':
      return '#89e051';
    case 'rust':
      return '#dea584';
    default:
      return '#64748b';
  }
}

/**
 * Formats date to a human readable relative format
 */
export function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'recently';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return dateString;
  }
}
