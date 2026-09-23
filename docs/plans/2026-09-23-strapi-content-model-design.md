# Strapi content model & static delivery — design

Date: 2026-09-23
Status: implemented (plan: `2026-09-23-strapi-static-content.md`). Deviations found during implementation:
- `node --test` needs a glob (`"scripts/*.test.mjs"`) on Node 24, not a directory.
- Empty `xMobileTitle` falls back to the same-locale `xTitle` before English (otherwise German phones showed English block titles).
- The one-off import still reads `frontend/src/constants/exhibitions.js` and `config/actionBlockTitles.js`, so those stay until the import is retired.

## Goal

Admins change everything on the site (texts, lists, images) in Strapi, with no code changes.
The public site must be as fast as possible at the lowest cost (100–1000 visitors/week).

## Decisions

| Topic | Decision |
|---|---|
| Delivery | Static site. Content + images are pulled from Strapi at build time; visitors never call Strapi |
| Publish flow | Strapi webhook → Cloudflare Pages deploy hook → rebuild (~1–2 min to go live) |
| Hosting | Frontend: Cloudflare Pages (free). Strapi + MySQL: small VPS (~€4–5/mo), same Docker setup as local |
| Locales | en (default, required), uk, de, it, ja, es. Missing translations fall back to en |
| UI labels | Nav/button labels stay in repo JSON. Section headings live in Strapi |
| Annual results pages | Dropped. Remove `/:year-achievements` route and placeholder page |

## Content model

### Collections (8)

| Type | Fields | Localized |
|---|---|---|
| Exhibition | country (enum, all ISO alpha-2), city, venue, startDate, endDate?, hours?, dateNote?, url? | no |
| Diploma | order, studentName, versions[] (component) | no |
| Diploma language | name ("Deutsch"), order | no |
| Sponsor | name, logo, url?, order, size (wide / square / bordered / text) | no |
| Partner | same as Sponsor | no |
| FAQ | question, answer (rich text), order | yes |
| Exhibition photo | image, caption, order | caption only |
| Stat | number ("300+"), label, icon (enum of the 6 existing SVG icons), order | label only |

### Single types (3)

- **Home** (localized, all fields optional): hero tagline; action-block titles (text, newline = line break);
  about heading + text; parallax image + quote; hall-of-diplomas text + SoundCloud URL; photos heading;
  map heading + text; donate heading, text, URL; stories heading, text, link; sponsors/partners/FAQ headings.
  (The Mission section is commented out in `Main.jsx`, so it is left out.)
- **Global**: contact email, social links[] (component: platform enum, url), copyright (localized), host-exhibition form URL.
- **Exhibitions page** (localized): heading, subtitle.

Reads go through one custom endpoint, `GET /api/site-content?locale=xx`, protected by a read-only API token
(no per-type REST routes, and the Public role stays closed).

### Components

- `diploma.version` — language (relation → Diploma language), image
- `shared.social-link` — platform, url

Diplomas are modeled per student (not per language) so replacing or removing one image for one
language never shifts other students' images. Diploma languages are a collection (not an enum) so
admins can add a language without a deploy; they are independent of the site's 6 UI locales.

Draft & Publish stays on; the build reads published content only.

### Stays in code

Logo, nav/button labels, SVG icons, layout, map geometry, and the ISO country → map id/coordinates
table (covering all countries so any new exhibition country works without a code change).

## Delivery & caching

```
Strapi (VPS, admins only) ──publish webhook──▶ Cloudflare Pages build
                                                 └─ scripts/fetch-content: content/<locale>.json + uploads
Visitors ◀── Cloudflare CDN ◀── static files
```

- **Build script** (`frontend/scripts/fetch-content.mjs`, runs before `build` and `dev`): reads Strapi
  with a read-only API token (Strapi Public role stays closed), merges en fallback into each locale,
  writes one JSON per locale and downloads referenced upload files. If Strapi is unreachable and
  content files already exist, keeps them (dev convenience); on a fresh build it fails loudly.
- **Frontend** reads content via one hook that lazy-imports the current locale's JSON (Vite hashes the
  chunk). No runtime API calls, no loading states for content.
- **Cache headers** (Cloudflare `_headers`): `/assets/*` and `/uploads/*` → `max-age=31536000, immutable`
  (Vite and Strapi both produce hashed file names); `index.html` → revalidate every time.
- **Images**: each spot uses one of Strapi's generated formats (thumbnails → `thumbnail`, slider → `medium`,
  main diploma → `large`, logos → `small`) with `loading="lazy"`; originals only in the fullscreen diploma
  modal and the parallax image. `srcset` can be added later if measurements show a need.

## Migration (one-off import, `backend/scripts/`)

- Exhibitions ← `frontend/src/constants/exhibitions.js`
- FAQ, stats, captions, section texts ← current components
- Diplomas ← `downloads/` (8 languages × 40, matched to students by the number in the file name;
  Korean files use a trailing `NN`, others a leading `NNd`)
- Sponsor/partner logos ← live site / existing files
- Idempotent (skips existing entries). After import, hardcoded constants and asset files are deleted.

## Out of scope

Annual results pages, per-section visibility toggles, SEO fields, instant (non-rebuild) publishing.

## Verification

- Import: entry counts in Strapi match source counts (e.g. 40 diplomas × 8 versions).
- Every page renders in all 6 locales with no missing content; build works with Strapi stopped
  after content was fetched.
