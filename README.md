# Nhan Nguyen — Cloud • Software • AI Engineer Portfolio

[![Deploy to GitHub Pages](https://github.com/foxminchan/foxminchan.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/foxminchan/foxminchan.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-v10-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-FBF0DF?logo=bun&logoColor=black)](https://bun.sh/)

A clean, modern, and high-performance personal portfolio website built with **React 19**, **TypeScript 6**, **Tailwind CSS v4**, and **Vite 8**, powered exclusively by **Bun**. Designed to highlight cloud-native architectures, enterprise .NET microservices, verified industry credentials, and open-source contributions.

---

## 🚀 Features

- **Personal Hero Showcase**:
  - Crisp introduction with avatar portrait, technical domain specializations, location badge, and quick-action contact shortcuts.
  - Aggregated live GitHub metrics dynamically calculated across open-source repositories.
- **Enterprise Experience & Architecture**:
  - Highlights production delivery: 23+ microservices migrated to Azure Container Apps.
  - Deep-dive into Clean Architecture, Event-Driven Architecture (EDA), high-throughput message buses, and resilient cloud deployments.
- **Interactive 30+ Credentials Gallery**:
  - Filterable by issuer (Microsoft, Oracle Cloud, Google Cloud, IBM, Atlassian, Confluent, HashiCorp).
  - Searchable by certification name, skill, or credential code.
  - Direct links to verified Credly and Certiverse official records.
  - Expandable modal view for rich badge inspection and credential verification.
  - Lazy-loaded badge images (`LazyBadge`) with seamless fallback handling.
- **Categorized Technical Skills Matrix**:
  - Multi-category filtering across Backend (.NET/C#), Cloud & DevOps, Architecture, Databases, and AI Engineering.
  - Proficiency indicators and primary technology tags.
- **Live GitHub Integration**:
  - Direct GitHub REST API integration with real-time stars, forks, and repository metadata.
  - Multi-tier caching strategy (in-memory + `localStorage`) with manual refresh capabilities.
- **Dynamic Contact QR Code & Social Sharing**:
  - Client-side QR code generator (`qrcode`) for instant mobile contact sharing.
  - Integrated `SocialShareModal` supporting the native Web Share API and one-click link copying.
- **Global Keyboard Navigation**:
  - `T`: Toggle light / dark theme.
  - `S`: Open social share and OpenGraph preview modal.
  - `?` or `H`: Open interactive Keyboard Shortcuts help dialog.
  - `1`-`6`: Instant section jump (`1` About, `2` Experience, `3` Projects, `4` Skills, `5` Certifications, `6` Contact).
  - `R`: Refresh live GitHub statistics and star counts.
  - `G`: Smoothly scroll to the top of the page.
  - `Esc`: Dismiss any active modal or dialog.
  - Built-in input awareness (automatically bypassed while typing in contact form or search inputs) with tactile HUD toast notifications.
- **Reading Time & Scroll Progress**:
  - Viewport-top dynamic scroll progress indicator (`ScrollProgressBar`).
  - Reading time calculation utility (`ReadingTimeBadge`) for portfolio content estimation.
- **Theme Support**: Seamless dark mode and light mode switching with persistent user preference in `localStorage`.
- **SEO & Rich Snippets**:
  - Full Schema.org JSON-LD structured data graph (`Person`, `ProfilePage`, `WebSite`).
  - Open Graph and Twitter Card tags with dynamic URL origin synchronization for custom domains.
- **Automated CI/CD**: One-click GitHub Pages deployment pipeline using GitHub Actions with Bun, `.nojekyll`, and automatic SPA 404 fallback routing.

---

## 🛠️ Tech Stack

### Core Framework & UI

- **Framework**: [React 19](https://react.dev/) (`^19.3.0`) — Modern React features, concurrent rendering, and hooks-based state management
- **Language**: [TypeScript 6](https://www.typescriptlang.org/) (`^6.0.3`) — Strict typing across all components, props, models, and API responses
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`^4.3.3`) — Powered by the first-party `@tailwindcss/vite` plugin (CSS-first engine with `@import "tailwindcss";`, no configuration file required)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/) (`^8.3.1`) + [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) (`^6.1.1`) — Instant Hot Module Replacement (HMR) and optimized Rollup production builds

### State Management & Data Fetching

- **Data Fetching & Cache**: [TanStack Query v5](https://tanstack.com/query/latest) (`^5.104.0`) — Server-state caching, background revalidation, and declarative live GitHub metrics tracking
- **HTTP Client**: [Axios](https://axios-http.com/) (`^1.20.0`) — Configured HTTP client with unified headers and robust multi-tier fallback resilience
- **Global State**: [Jotai](https://jotai.org/) (`^3.0.0`) — Atomic state management powering theme persistence, modal visibility, and shortcut HUD toast triggers without prop-drilling

### Animation & Interactivity

- **Animations**: [Motion](https://motion.dev/) (`^13.4.4`) — Modern animation library for smooth accordion expanders, badge modals, and layout transitions
- **Iconography**: [Lucide React](https://lucide.dev/) (`^1.48.0`) + custom brand SVG components — Lightweight, accessible SVG icon components
- **QR Code Generation**: [qrcode](https://www.npmjs.com/package/qrcode) (`^1.5.4`) & `@types/qrcode` — Client-side vector and canvas QR code generator for instant contact sharing

### Tooling, Runtimes & Code Quality

- **Runtime & Package Manager**: [Bun](https://bun.sh/) — Fast, all-in-one JavaScript runtime, bundler, and package manager with `bun.lock` for deterministic, ultra-fast installs
- **Type Checking**: TypeScript compiler (`tsc --noEmit`)
- **Linter**: [ESLint](https://eslint.org/) (`^10.11.0`) with new flat config (`eslint.config.js`), `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`
- **Code Formatter**: [Prettier 3](https://prettier.io/) (`^3.9.9`) with pre-configured `.prettierrc` rules

### Deployment & Hosting

- **CI/CD**: [GitHub Actions](https://github.com/features/actions) (`.github/workflows/deploy.yml`) running on `ubuntu-latest` with Bun (`oven-sh/setup-bun@v2`)
- **Hosting**: [GitHub Pages](https://pages.github.com/) with automated SPA fallback (`cp dist/index.html dist/404.html`) and `.nojekyll` Jekyll bypass

---

## 💻 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)

To install Bun (macOS, Linux, WSL):

```bash
curl -fsSL https://bun.sh/install | bash
```

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/foxminchan/foxminchan.github.io.git
cd foxminchan.github.io

bun install
```

### Local Development

Start the Vite development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your console) in your browser.

### Building for Production

Compile and bundle the project into static files in the `dist/` directory:

```bash
bun run build
```

Preview the production build locally:

```bash
bun run preview
```

### Linting, Type Checking & Code Formatting

Run TypeScript type check and ESLint verification:

```bash
bun run lint
```

Automatically fix linting issues with ESLint:

```bash
bun run lint:fix
```

Format the entire codebase with Prettier:

```bash
bun run format
```

Check code formatting in CI:

```bash
bun run format:check
```

Clean build artifacts:

```bash
bun run clean
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
