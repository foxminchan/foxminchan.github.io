import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://foxminchan.github.io'),
  title: {
    default: 'Nhan Nguyen - Software Engineer | .NET & Microservices Expert',
    template: '%s | Nhan Nguyen',
  },
  description:
    'Software Engineer specializing in .NET, microservices, and healthcare IT. Building scalable solutions at KMS Technology. Expert in C#, Azure, and clean architecture.',
  keywords: [
    'Software Engineer',
    'Full Stack Developer',
    '.NET Developer',
    'Microservices',
    'C# Developer',
    'Azure',
    'Healthcare IT',
    'HIPAA Compliance',
    'Clean Architecture',
    'Next.js',
    'React',
    'TypeScript',
    'Nhan Nguyen',
    'Ho Chi Minh City Developer',
  ],
  authors: [{ name: 'Nhan Nguyen', url: 'https://github.com/foxminchan' }],
  creator: 'Nhan Nguyen',
  publisher: 'Nhan Nguyen',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://foxminchan.github.io',
    title: 'Nhan Nguyen - Software Engineer | .NET & Microservices Expert',
    description:
      'Software Engineer specializing in .NET, microservices, and healthcare IT. Building scalable solutions with expertise in C#, Azure, and clean architecture.',
    siteName: 'Nhan Nguyen Portfolio',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Nhan Nguyen - Software Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Nhan Nguyen - Software Engineer',
    description: 'Software Engineer specializing in .NET, microservices, and healthcare IT.',
    images: ['/logo.png'],
    creator: '@nxnhan',
  },
  alternates: {
    canonical: 'https://foxminchan.github.io',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/logo.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="canonical" href="https://foxminchan.github.io" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-blue-600 focus:px-6 focus:py-3 focus:text-white focus:shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
