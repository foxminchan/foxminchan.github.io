# Portfolio

A modern, responsive portfolio website built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern and clean design with animated backgrounds
- 📱 Fully responsive across all devices
- ⚡ Built with Next.js 16 and React 19
- 🎯 TypeScript for type safety
- 🎭 Smooth animations and interactions
- 🌐 SEO optimized with structured data
- 📊 Analytics integration with Vercel Analytics
- ♿ Accessible navigation components

## Tech Stack

- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Language:** TypeScript
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd foxminchan.github.io
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check for code issues
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # UI components (buttons, cards, etc.)
│   ├── hero-section.tsx
│   ├── about-section.tsx
│   ├── experience-section.tsx
│   ├── projects-section.tsx
│   ├── skills-section.tsx
│   └── contact-section.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── public/             # Static assets
```

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and deploy

## Customization

1. Update the content in the component files under `components/`
2. Modify styles in `app/globals.css` or component-level styles
3. Configure SEO metadata in `app/layout.tsx`
4. Update manifest and robots files for PWA and SEO

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Feel free to reach out if you have any questions or suggestions!
