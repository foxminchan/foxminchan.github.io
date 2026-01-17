'use client';

import type React from 'react';
import { Blocks, Cloud, Code2, Database, Layers, Shield, Workflow } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface SkillCategory {
  category: string;
  skills: string[];
  icon: React.ElementType;
}

const skillCategories: SkillCategory[] = [
  {
    category: 'Backend Development',
    icon: Code2,
    skills: [
      '.NET Core',
      'C#',
      'ASP.NET',
      'Microservices',
      'Entity Framework',
      'MassTransit',
      'gRPC',
    ],
  },
  {
    category: 'Frontend & Mobile',
    icon: Workflow,
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Flutter'],
  },
  {
    category: 'Database & Storage',
    icon: Database,
    skills: ['PostgreSQL', 'SQL Server', 'MongoDB', 'Redis', 'Elasticsearch'],
  },
  {
    category: 'DevOps & Cloud',
    icon: Cloud,
    skills: ['Docker', 'Kubernetes', 'Azure', 'Git', 'CI/CD', 'RabbitMQ'],
  },
  {
    category: 'Architecture Patterns',
    icon: Blocks,
    skills: [
      'Clean Architecture',
      'CQRS',
      'Event-Driven',
      'Domain-Driven Design',
      'SOLID Principles',
    ],
  },
  {
    category: 'Security & Compliance',
    icon: Shield,
    skills: ['HIPAA', 'Healthcare IT', 'Security Best Practices'],
  },
];

export function SkillsSection() {
  const { ref: sectionRef, isVisible } = useIntersectionObserver();

  return (
    <>
      <Separator />
      <section
        id="skills"
        aria-labelledby="skills-heading"
        className="relative overflow-hidden bg-white px-4 py-24 lg:py-32"
        ref={sectionRef}
      >
        <div className="relative container mx-auto max-w-7xl">
          <div
            className={`mb-16 text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
          >
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2 px-4 py-2">
              <Layers className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-gray-900">Tech Stack</span>
            </Badge>
            <h2
              id="skills-heading"
              className="mb-4 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl"
            >
              <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Skills & Technologies
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Tools and technologies I use to bring ideas to life
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.category}
                  className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-cyan-50 to-blue-50 opacity-0 transition-opacity group-hover:opacity-100" />

                  <CardContent className="relative p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 to-blue-50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-blue-200">
                      <Icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                    </div>

                    <h3 className="mb-5 text-xl font-bold tracking-tight text-gray-900">
                      {category.category}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="transition-all hover:scale-105 hover:border-blue-600 hover:bg-blue-50 hover:shadow-md"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
