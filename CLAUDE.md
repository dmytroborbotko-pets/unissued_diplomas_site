# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Memorial website for "Unissued Diplomas" — a React SPA that fetches content from a Strapi CMS backend. The frontend lives entirely in the `frontend/` directory; there is no backend code in this repo.

## Commands

All commands run from `frontend/`:

```bash
cd frontend
npm install          # install dependencies
npm run dev          # start Vite dev server (http://localhost:5173)
npm run build        # production build to frontend/dist/
npm run preview      # preview production build
npm run lint         # ESLint (flat config, JS/JSX only)
```

## Architecture

- **React 19 + Vite + Tailwind CSS v4** — no TypeScript, plain JSX
- **Routing**: React Router v7 with BrowserRouter. Two routes: `/` (Home) and `/:year-achievements` (Achievements)
- **State/Context**: `LanguageProvider` wraps the app, providing `currentLanguage`, `changeLanguage`, and `supportedLanguages` via React Context. Access with `useLanguage()` hook.
- **i18n**: i18next initialized in `src/i18n/config.js` with 6 languages (en, uk, de, it, ja, es). Translation resources are loaded from Strapi at runtime, not bundled.
- **API layer**: `src/services/strapi.js` — axios client hitting `VITE_STRAPI_URL/api`. Exports: `getSponsors`, `getPartners`, `getFAQs`, `getExhibitions`, `getAchievements`, `getLinks`, `getTranslations`. All accept a locale parameter.
- **Animations**: Framer Motion
- **CSS utility**: `cn()` helper in `src/utils/utils.js` combining clsx + tailwind-merge

## Tailwind & Styling

Tailwind v4 with PostCSS plugin (`@tailwindcss/postcss`). Theme tokens defined in `src/index.css` under `@theme` — not in `tailwind.config.js`.

Custom breakpoints (mobile-first):
- `mobile-xs:` 342px, `mobile-sm:` 480px, `mobile-lg:` 481px
- `tablet:` 769px, `tablet-md:` 905px
- `desktop:` 1280px

Color tokens (use as `bg-theme-*`, `text-theme-*`, etc.):
- `theme-bg` (#171717), `theme-bg-dark` (#1a1a1a)
- `theme-primary` (#a83232), `theme-primary-dark` (#b10000)
- `theme-accent` (#f5f5f5), `theme-border` (#ffffff)
- `theme-text` (#ffffff), `theme-text-muted` (#e5e5e5)

Prefer theme tokens over hardcoded hex values (e.g. `bg-theme-bg-dark` not `bg-[#1a1a1a]`).

Custom font: "KyivType Sans" loaded via @font-face in `index.css`, font files in `frontend/font/`.

## Environment

Requires `frontend/.env` with:
```
VITE_STRAPI_URL=http://localhost:1337
```
Copy from `frontend/.env.example`.

## Key Component Patterns

- **DiplomaViewer** (`components/DiplomaViewer.jsx`): Diploma image slider with custom language dropdown, thumbnail carousel (`shared/DiplomaThumbnails`), and fullscreen modal (`shared/DiplomaModal`). Diploma images are loaded dynamically via `import.meta.glob`.
- **DiplomaModal** (`shared/DiplomaModal.jsx`): Expanded diploma view with prev/next navigation, close button, and browser-native fullscreen toggle (Fullscreen API). Callbacks stored in refs to avoid effect re-runs during navigation.
- **Shared components** live in `src/shared/` (reusable UI pieces like modals, thumbnails, action blocks), distinct from `src/components/` (page-section-level components).

## ESLint

Flat config (`eslint.config.js`). `no-unused-vars` ignores uppercase/underscore-prefixed variables (`varsIgnorePattern: '^[A-Z_]'`).
