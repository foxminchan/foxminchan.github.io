'use client';

import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin, Mail, Send } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'nguyenxuannhan407@gmail.com',
    href: 'mailto:nguyenxuannhan407@gmail.com',
    description: 'Drop me a line',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'foxminchan',
    href: 'https://github.com/foxminchan',
    description: 'Check out my code',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'nxnhan',
    href: 'https://www.linkedin.com/in/nxnhan/',
    description: "Let's connect",
  },
];

export function ContactSection() {
  const { ref: sectionRef, isVisible } = useIntersectionObserver();

  return (
    <>
      <Separator />
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="relative overflow-hidden bg-white px-4 py-24 lg:py-32"
        ref={sectionRef}
      >
        <div className="relative container mx-auto max-w-5xl">
          <div
            className={`mb-16 text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
          >
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2 px-4 py-2">
              <Send className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-gray-900">Get In Touch</span>
            </Badge>
            <h2 id="contact-heading" className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
              <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Let's Work Together
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-pretty text-gray-600">
              I'm always open to discussing new opportunities, collaborations, or interesting
              projects. Feel free to reach out through any of the channels below.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card
                  key={method.label}
                  className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <Link
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    aria-label={`Contact via ${method.label}: ${method.value}`}
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-cyan-50 opacity-0 transition-opacity group-hover:opacity-100" />

                    <CardContent className="relative p-8">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 to-blue-50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-blue-200">
                          <Icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                        </div>
                        <ArrowUpRight
                          className="h-5 w-5 text-gray-600 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-600"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">{method.label}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                        <p className="text-sm font-semibold text-blue-600">{method.value}</p>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>

          <footer
            className={`border-border/40 mt-24 border-t pt-12 transition-all delay-500 duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="text-center md:text-left">
                <p className="text-foreground/70 text-sm">
                  © {new Date().getFullYear()} Nhan Nguyen. All rights reserved.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-accent/10 transition-all hover:scale-110"
                >
                  <Link
                    href="https://github.com/foxminchan"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit GitHub profile (opens in new tab)"
                  >
                    <Github className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-accent/10 transition-all hover:scale-110"
                >
                  <Link
                    href="https://www.linkedin.com/in/nxnhan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit LinkedIn profile (opens in new tab)"
                  >
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
