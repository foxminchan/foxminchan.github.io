'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Code2, ExternalLink, GitFork, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  topics: string[];
}

async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      'https://api.github.com/users/foxminchan/repos?sort=stars&per_page=100',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        cache: 'force-cache',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub repos');
    }

    const repos: GitHubRepo[] = await response.json();

    const featuredNames = ['bookworm', 'lawknowledge', 'rookieshop', 'coolshop'];

    return repos
      .filter((repo) => featuredNames.includes(repo.name.toLowerCase()))
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getGitHubRepos().then(setProjects);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('projects');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Separator />
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="bg-white px-4 py-24 lg:py-32"
      >
        <div className="container mx-auto max-w-7xl">
          <div
            className={`mb-16 text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
          >
            <h2
              id="projects-heading"
              className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
            >
              Featured Projects
            </h2>
            <p className="text-lg text-pretty text-gray-600">
              A selection of my open-source work and personal projects showcasing modern software
              practices
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {projects.map((project, index) => (
              <article
                key={project.name}
                className={`group relative flex overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Card className="flex-1">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-cyan-50 opacity-0 transition-opacity group-hover:opacity-100" />

                  <CardContent className="relative flex h-full flex-col p-8">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue-200">
                          <Code2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                            {project.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />
                              <span>{project.stargazers_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-3.5 w-3.5" />
                              <span>{project.forks_count}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="bg-transparent transition-all hover:rotate-12 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <a
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.name} on GitHub`}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </Button>
                    </div>

                    <p className="mb-6 grow leading-relaxed text-gray-600">{project.description}</p>

                    <div className="mt-auto flex flex-wrap gap-2">
                      {project.topics.slice(0, 4).map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="hover:border-blue-600 hover:bg-blue-50"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {project.language && (
                        <Badge variant="secondary" className="ml-auto">
                          {project.language}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>

          <div
            className={`mt-16 text-center transition-all delay-500 duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 border-gray-300 bg-transparent px-8 text-base hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
            >
              <Link
                href="https://github.com/foxminchan?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View all projects on GitHub (opens in new tab)"
              >
                View All Projects on GitHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
