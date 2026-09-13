# Nhan Nguyen — Software Engineer Portfolio

[![Deploy to GitHub Pages](https://github.com/foxminchan/foxminchan.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/foxminchan/foxminchan.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)

A clean, modern, and performant personal portfolio website built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**. Designed to highlight cloud-native architectures, enterprise .NET microservices, verified industry credentials, and open-source contributions.

---

## 🚀 Features

- **Personal Hero Showcase**: Crisp introduction with avatar portrait, core technical domain, location, and quick-action contact shortcuts.
- **Interactive 30+ Credentials Gallery**:
  - Filterable by issuer (Microsoft, Oracle Cloud, Google Cloud, IBM, Atlassian, Confluent, HashiCorp).
  - Searchable by certification name, skill, or credential code.
  - Direct links to verified Credly and Certiverse records.
  - Compact preview mode with expandable modal view for rich badge inspection.
- **Enterprise Experience & Architecture**:
  - Highlights production delivery: 23+ microservices migrated to Azure Container Apps.
  - Interactive clean architecture and EDA diagrams.
- **Live GitHub Integration**:
  - Fetches real-time repository stats, stars, forks, and pinned projects directly via GitHub API.
- **Theme Support**: Seamless dark mode and light mode switching with persistent user preference.
- **Automated CI/CD**: One-click GitHub Pages deployment pipeline using GitHub Actions with `.nojekyll` and SPA fallback handling.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Deployment**: [GitHub Pages](https://pages.github.com/) via [GitHub Actions](https://github.com/features/actions)

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/) / [pnpm](https://pnpm.io/)

### Installation

Clone the repository and install dependencies:

```bash
# Clone repository
git clone https://github.com/foxminchan/foxminchan.github.io.git
cd foxminchan.github.io

# Install packages
npm install
```

### Local Development

Start the Vite development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your console) in your browser.

### Building for Production

Compile and bundle the project into static files in the `dist/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Type Checking & Code Formatting

Run TypeScript verification:

```bash
npm run lint
```

Format the entire codebase with Prettier:

```bash
npm run format
```

Check code formatting in CI:

```bash
npm run format:check
```

---

## 🚢 Continuous Deployment (GitHub Pages)

This project includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that automatically builds and deploys to GitHub Pages on every push to `main` or `master`.

### Activation Steps:

1. Push your code to your GitHub repository.
2. In your repository on GitHub, go to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow will automatically trigger, build the static bundle, and deploy to your GitHub Pages URL or custom domain.

---

## 📂 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment pipeline
├── public/
│   ├── badges/                 # Verified certification badges
│   ├── logo.png                # Brand logo
│   ├── avatar.png              # Profile portrait photo
│   ├── favicon.ico             # Browser favicon
│   ├── site.webmanifest        # Web App Manifest
│   ├── .nojekyll               # Disables Jekyll processing on GitHub Pages
│   ├── robots.txt              # Search engine crawling rules
│   └── sitemap.xml             # Search engine sitemap
├── src/
│   ├── components/             # Modular React UI components
│   │   ├── Navbar.tsx          # Navigation header & theme switcher
│   │   ├── Hero.tsx            # Hero section with avatar & metrics
│   │   ├── AboutSection.tsx    # Technical background & expertise
│   │   ├── CertificationsSection.tsx # Filterable 30+ certs gallery
│   │   ├── ProjectsSection.tsx # Production microservices & GitHub repos
│   │   ├── ContactSection.tsx  # Contact form & social links
│   │   └── Footer.tsx          # Footer with quick links
│   ├── data/
│   │   └── portfolioData.ts    # Centralized portfolio data & cert list
│   ├── services/
│   │   └── githubService.ts    # GitHub REST API client & cache
│   ├── types.ts                # TypeScript interfaces and types
│   ├── App.tsx                 # Root application component
│   └── main.tsx                # React DOM entry point
├── .prettierrc                 # Prettier code formatting rules
├── .prettierignore             # Prettier ignore patterns
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE                     # MIT License
└── README.md
```

---

## 📄 License

Distributed under the [MIT License](LICENSE). See `LICENSE` for more information.

---

## 📬 Contact

**Nguyen Xuan Nhan (Nhan Nguyen)**

- **Email**: [nguyenxuannhan407@gmail.com](mailto:nguyenxuannhan407@gmail.com)
- **LinkedIn**: [linkedin.com/in/nxnhan](https://www.linkedin.com/in/nxnhan)
- **GitHub**: [@foxminchan](https://github.com/foxminchan)
- **Website**: [foxminchan.github.io](https://foxminchan.github.io)
