'use client';

import { Building2, Calendar } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
}

const experiences: Experience[] = [
  {
    company: 'KMS Technology, Inc.',
    role: 'Software Engineer',
    period: 'Jul 2024 - Present',
    description:
      'Working on healthcare IT solutions with HIPAA compliance, developing microservices, and implementing scalable backend systems.',
    highlights: ['.NET Core', 'Microservices', 'HIPAA', 'Azure'],
  },
  {
    company: 'NashTech Limited',
    role: 'Software Engineer',
    period: 'Mar 2024 - Jun 2024',
    description:
      'Developed enterprise applications and contributed to various client projects using modern software engineering practices.',
    highlights: ['Enterprise Apps', 'Clean Architecture', 'Agile'],
  },
  {
    company: 'BitTo Solution',
    role: 'Software Engineer',
    period: 'Jan 2023 - Feb 2024',
    description:
      'Built full-stack applications, worked with Laravel and Flutter, and delivered solutions for diverse client requirements.',
    highlights: ['Laravel', 'Flutter', 'Full-Stack'],
  },
];

export function ExperienceSection() {
  const { ref: sectionRef, isVisible } = useIntersectionObserver();

  return (
    <>
      <Separator />
      <section
        id="experience"
        aria-labelledby="experience-heading"
        className="relative overflow-hidden bg-white px-4 py-24 lg:py-32"
        ref={sectionRef}
      >
        <div className="relative container mx-auto max-w-5xl">
          <div
            className={`mb-16 text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
          >
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2 px-4 py-2">
              <Calendar className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-gray-900">My Journey</span>
            </Badge>
            <h2
              id="experience-heading"
              className="mb-4 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl"
            >
              <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            <p className="text-lg text-gray-600">My professional journey in software engineering</p>
          </div>

          <div className="relative space-y-12">
            <div
              className="absolute top-0 bottom-0 left-8 w-0.5 bg-linear-to-b from-blue-600 via-cyan-600 to-blue-600 md:left-1/2"
              aria-hidden="true"
            />

            {experiences.map((exp, index) => (
              <article
                key={index}
                className={`relative transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="absolute top-8 left-8 z-10 md:left-1/2" aria-hidden="true">
                  <div className="h-5 w-5 -translate-x-1/2 animate-pulse rounded-full border-4 border-white bg-blue-600 shadow-lg shadow-blue-200" />
                  <div className="absolute inset-0 h-5 w-5 -translate-x-1/2 rounded-full bg-blue-400 blur-md" />
                </div>

                <div
                  className={`md:grid md:grid-cols-2 md:gap-8 ${index % 2 === 0 ? '' : 'md:grid-flow-dense'}`}
                >
                  <div className={index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'}>
                    <Card className="group ml-16 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-100 md:ml-0">
                      <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-cyan-50 opacity-0 transition-opacity group-hover:opacity-100" />

                      <CardContent className="relative p-8">
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Badge className="mb-1 bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-100 hover:to-cyan-100">
                              {exp.period}
                            </Badge>
                            <h3 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                              {exp.role}
                            </h3>
                            <div className="mt-2 flex items-center gap-2 text-gray-600">
                              <Building2 className="h-4 w-4" />
                              <p className="font-medium">{exp.company}</p>
                            </div>
                          </div>
                        </div>

                        <p className="mb-6 leading-relaxed text-gray-600">{exp.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {exp.highlights.map((highlight) => (
                            <Badge
                              key={highlight}
                              variant="outline"
                              className="transition-all hover:scale-105 hover:border-blue-600 hover:bg-blue-50"
                            >
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
