'use client';

import { Briefcase, GraduationCap, MapPin, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

export function AboutSection() {
  const { ref: sectionRef, isVisible } = useIntersectionObserver();

  return (
    <>
      <Separator />
      <section
        id="about"
        aria-labelledby="about-heading"
        className="relative overflow-hidden bg-white px-4 py-24 lg:py-32"
        ref={sectionRef}
      >
        <div className="relative container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div
              className={`transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
            >
              <Badge variant="secondary" className="mb-8 inline-flex items-center gap-2 px-4 py-2">
                <Sparkles className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span className="text-gray-900">Get to know me</span>
              </Badge>

              <h2
                id="about-heading"
                className="mb-8 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl"
              >
                <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  About Me
                </span>
              </h2>

              <div className="space-y-4">
                <Card className="group transition-all delay-100 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-100">
                  <CardContent className="flex gap-4 p-6">
                    <div className="shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 to-blue-50 transition-transform group-hover:scale-110 group-hover:rotate-6">
                        <MapPin className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">Location</div>
                      <div className="text-sm text-gray-600">Ho Chi Minh City, Vietnam</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group transition-all delay-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-100">
                  <CardContent className="flex gap-4 p-6">
                    <div className="shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-cyan-100 to-cyan-50 transition-transform group-hover:scale-110 group-hover:rotate-6">
                        <Briefcase className="h-6 w-6 text-cyan-600" aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">Experience</div>
                      <div className="text-sm text-gray-600">2+ years in Software Engineering</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group transition-all delay-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-100">
                  <CardContent className="flex gap-4 p-6">
                    <div className="shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-purple-100 to-purple-50 transition-transform group-hover:scale-110 group-hover:rotate-6">
                        <GraduationCap className="h-6 w-6 text-purple-600" aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">Education</div>
                      <div className="text-sm text-gray-600">B.Eng in IT, HUTECH (GPA: 3.7)</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div
              className={`space-y-6 text-lg leading-relaxed text-gray-600 transition-all delay-200 duration-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
            >
              <p className="text-2xl leading-snug font-semibold text-gray-900">
                Building scalable, high-quality applications with modern technologies.
              </p>
              <p className="text-base">
                Specialized in{' '}
                <span className="font-semibold text-blue-600">.NET, C#, and web development</span>{' '}
                with a focus on clean, testable code. Currently at{' '}
                <span className="font-semibold text-gray-900">KMS Technology</span>, working on
                HIPAA-compliant healthcare platforms.
              </p>
              <p className="text-base">
                Experienced in cross-functional teams, delivering reliable solutions across the full
                development lifecycle—from design to maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
