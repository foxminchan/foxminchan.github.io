'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { ArrowDown, Github, Linkedin, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const scrollToProjects = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      id="hero"
      aria-label="Introduction and hero section"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 pt-16"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)] bg-size-[100px_100px]" />
      </div>

      <div className="relative z-10 container max-w-6xl">
        <div className="animate-in fade-in slide-in-from-bottom-4 mb-8 flex justify-center duration-700">
          <Badge variant="secondary" className="relative inline-flex items-center gap-2 px-5 py-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="relative text-gray-700">
              Software Engineer • Ho Chi Minh City, Vietnam
            </span>
          </Badge>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 mb-10 space-y-6 text-center delay-100 duration-700">
          <h1 className="text-7xl font-bold tracking-tighter text-balance md:text-8xl lg:text-9xl">
            <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Nhan Nguyen
            </span>
          </h1>
          <p className="text-3xl font-light tracking-tight text-balance text-gray-800 md:text-4xl lg:text-5xl">
            Crafting exceptional digital experiences
          </p>
        </div>

        <p className="animate-in fade-in slide-in-from-bottom-4 mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-pretty text-gray-600 delay-200 duration-700 md:text-xl">
          Building scalable software solutions with expertise in .NET, microservices architecture,
          and healthcare IT. Passionate about clean code, system design, and delivering impactful
          products.
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-5 delay-300 duration-700 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={scrollToProjects}
            className="group relative h-14 overflow-hidden bg-linear-to-r from-blue-600 to-cyan-600 px-10 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
          >
            <span className="relative flex items-center gap-2">
              View My Work
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </span>
          </Button>

          <div className="flex gap-3">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 border-2 border-gray-300 bg-white px-7 text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg"
            >
              <Link
                href="https://github.com/foxminchan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GitHub profile"
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 border-2 border-gray-300 bg-white px-7 text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg"
            >
              <Link
                href="https://www.linkedin.com/in/nxnhan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit LinkedIn profile"
              >
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </Link>
            </Button>
          </div>
        </div>

        <div
          className="animate-float absolute bottom-10 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="text-xs font-medium">Scroll to explore</span>
            <div className="h-8 w-5 rounded-full border-2 border-gray-400">
              <div className="mx-auto mt-1.5 h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
