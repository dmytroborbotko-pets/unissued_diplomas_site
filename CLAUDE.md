# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Memorial website for "Unissued Diplomas". All content (texts, lists, images) is edited in Strapi (`backend/`) and baked into a static React site (`frontend/`) at build time — visitors never call Strapi.

Design: `docs/plans/2026-09-23-strapi-content-model-design.md`

## Commands

```bash
# backend/ — Strapi 5 (TypeScript) on the host, MySQL 8 in Docker (127.0.0.1:3307)
npm run db:up        # start MySQL (docker-compose.db.yml); db:down stops it
npm run develop      # Strapi with admin at http://localhost:1337/admin
npm test             # node:test for scripts/

# frontend/
npm run content      # pull content from Strapi → src/content/<locale>.json + public/uploads/
npm run dev          # runs `content --allow-stale` first (keeps old content if Strapi is down)
npm run build        # runs `content` first (fails if Strapi is unreachable)
npm run preview      # preview production build
npm run lint         # ESLint (flat config, JS/JSX only)
npm test             # node:test for scripts/
```

## Architecture

- **React 19 + Vite + Tailwind CSS v4** — no TypeScript, plain JSX
- **Routing**: React Router v7 with BrowserRouter. Two routes: `/` (Home) and `/exhibitions`
- **State/Context**: `LanguageProvider` wraps the app, providing `currentLanguage`, `changeLanguage`, and `supportedLanguages` via React Context. Access with `useLanguage()` hook. Language switches run in a transition so the old locale stays visible while the new content chunk loads.
- **i18n**: 6 site languages (en, uk, de, it, ja, es). Content translations come from Strapi i18n; missing translations fall back to English at build time. i18next (`src/i18n/config.js`) is initialized but has no UI-label resources yet.
- **Content (no runtime API)**: `scripts/fetch-content.mjs` calls Strapi's `GET /api/site-content?locale=xx` (custom endpoint in `backend/src/api/site-content/`), merges English fallback (`scripts/content-lib.mjs`), adds `mapId`/`coordinates` to exhibitions, writes `src/content/<locale>.json` and downloads uploads to `public/uploads/` (both gitignored). Components read it with `useContent()` (`src/hooks/useContent.js`, React `use()` + one lazy chunk per locale; `<Suspense>` in `App.jsx`).
- **Rich text**: Strapi "blocks" fields render via `shared/RichText.jsx` (`strongClassName` styles bold runs per section). Multi-line text fields: newline = line break (`whitespace-pre-line`, or `lines()` from `utils/media.js` for ActionBlock titles). `mediaUrl(media, format)` picks a Strapi image size (thumbnail/small/medium/large).
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

- `backend/.env` — Strapi secrets and `DATABASE_*` (also read by `docker-compose.db.yml`); see `backend/.env.example`.
- `frontend/.env` — used by the content build only:
  ```
  STRAPI_URL=http://localhost:1337
  STRAPI_TOKEN=<read-only API token "static-build" from Strapi admin → Settings → API Tokens>
  ```

## Strapi content model

Collections: Exhibition, Diploma (per student, `versions[]` = {Diploma language, image}), Diploma language, Sponsor, Partner, FAQ, Exhibition photo, Stat. Single types: Home, Global, Exhibitions page. Schemas live only in `backend/src/api/*/content-types/*/schema.json` (no per-type REST routes).

Adding a new field: edit the schema.json → populate it in the `site-content` controller if it's media/relation/component inside a collection → read it in the component via `useContent()`. Exhibition `country` enum = countries drawable on `public/data/countries-110m.json`. Upload security denies SVG, so logos must be raster.

## Key Component Patterns

- **DiplomaViewer** (`components/DiplomaViewer.jsx`): Diploma image slider with custom language dropdown, thumbnail carousel (`shared/DiplomaThumbnails`), and fullscreen modal (`shared/DiplomaModal`). Diplomas and diploma languages come from Strapi content; thumbnails use the `thumbnail` size, the main view `large`, the modal the original.
- **DiplomaModal** (`shared/DiplomaModal.jsx`): Expanded diploma view with prev/next navigation, close button, and browser-native fullscreen toggle (Fullscreen API). Callbacks stored in refs to avoid effect re-runs during navigation.
- **Shared components** live in `src/shared/` (reusable UI pieces like modals, thumbnails, action blocks), distinct from `src/components/` (page-section-level components).

## ESLint

Flat config (`eslint.config.js`). `no-unused-vars` ignores uppercase/underscore-prefixed variables (`varsIgnorePattern: '^[A-Z_]'`).
