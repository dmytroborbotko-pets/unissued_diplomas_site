# Strapi Content + Static Delivery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Every text, list and image on the site is edited in Strapi. At build time the frontend pulls it
into static JSON and image files, so visitors never call Strapi.

**Architecture:** Strapi 5 (`backend/`, MySQL in Docker on :3307) defines 9 collection/single types and one
custom read-only endpoint, `GET /api/site-content?locale=xx`, that returns everything in one response.
`frontend/scripts/fetch-content.mjs` runs before `dev`/`build`: it calls the endpoint once per locale,
merges English fallback, adds map data to exhibitions, writes `src/content/<locale>.json` and downloads
every referenced upload into `public/uploads/`. React reads the current locale's JSON via `use()` + a
lazy import (one hashed chunk per locale).

**Tech Stack:** Strapi 5.54 (TypeScript), MySQL 8, React 19 + Vite 7, `node:test` for tests (no new test
framework), `i18n-iso-countries` (only new dependency; build time only).

Design: `docs/plans/2026-09-23-strapi-content-model-design.md`

**Commits:** the branch `feat/create-landing-react` already has uncommitted user work. Ask the user once
before the first commit. If they say no, skip every "Commit" step.

**Prerequisites (running during the whole plan):**
```bash
cd backend && npm run db:up && npm run develop   # admin: http://localhost:1337/admin
```
Strapi restarts itself when files in `backend/src` change.

---

## Phase 1: Strapi

### Task 1: Create the 5 extra locales on boot

**Files:**
- Modify: `backend/src/index.ts`

**Step 1: Replace the file content**

```ts
import type { Core } from '@strapi/strapi';

// Site UI locales besides the default `en` (must match frontend/src/constants/languages.js)
const LOCALES = [
  ['uk', 'Ukrainian (uk)'],
  ['de', 'German (de)'],
  ['it', 'Italian (it)'],
  ['ja', 'Japanese (ja)'],
  ['es', 'Spanish (es)'],
];

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const locales = strapi.plugin('i18n').service('locales');
    const existing = new Set((await locales.find()).map((locale: { code: string }) => locale.code));
    for (const [code, name] of LOCALES) {
      if (!existing.has(code)) await locales.create({ code, name });
    }
  },
};
```

**Step 2: Verify**

Strapi restarts. Admin → Settings → Internationalization lists 6 locales, with `en` as default.
Restart Strapi again: no errors, still 6 (idempotent).

**Step 3: Commit**
```bash
git add backend/src/index.ts && git commit -m "feat(backend): create site locales on boot"
```

---

### Task 2: Components

**Files:**
- Create: `backend/src/components/diploma/version.json`
- Create: `backend/src/components/shared/social-link.json`

**Step 1: `diploma/version.json`**

```json
{
  "collectionName": "components_diploma_versions",
  "info": { "displayName": "Version", "description": "One language version of a diploma image" },
  "options": {},
  "attributes": {
    "language": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::diploma-language.diploma-language"
    },
    "image": { "type": "media", "multiple": false, "required": true, "allowedTypes": ["images"] }
  }
}
```

**Step 2: `shared/social-link.json`**

```json
{
  "collectionName": "components_shared_social_links",
  "info": { "displayName": "Social link" },
  "options": {},
  "attributes": {
    "platform": {
      "type": "enumeration",
      "enum": ["instagram", "facebook", "linkedin", "tiktok", "x"],
      "required": true
    },
    "url": { "type": "string", "required": true }
  }
}
```

Do not verify yet: `version.json` points to `diploma-language`, which Task 3 creates. Strapi may log an
error until then.

---

### Task 3: Collection types

Each content type needs only `content-types/<name>/schema.json`. No routes, controllers or services,
because all reads go through the custom endpoint in Task 5.

**Files (all Create):**
- `backend/src/api/exhibition/content-types/exhibition/schema.json`
- `backend/src/api/diploma/content-types/diploma/schema.json`
- `backend/src/api/diploma-language/content-types/diploma-language/schema.json`
- `backend/src/api/sponsor/content-types/sponsor/schema.json`
- `backend/src/api/partner/content-types/partner/schema.json`
- `backend/src/api/faq/content-types/faq/schema.json`
- `backend/src/api/exhibition-photo/content-types/exhibition-photo/schema.json`
- `backend/src/api/stat/content-types/stat/schema.json`

**Step 1: Install the country-code library (frontend, used in Step 2 and Task 7)**
```bash
cd frontend && npm i -D i18n-iso-countries
```

**Step 2: `exhibition/schema.json`** (`country.enum` starts empty; Step 3 fills it)

```json
{
  "kind": "collectionType",
  "collectionName": "exhibitions",
  "info": { "singularName": "exhibition", "pluralName": "exhibitions", "displayName": "Exhibition" },
  "options": { "draftAndPublish": true },
  "attributes": {
    "country": { "type": "enumeration", "enum": [], "required": true },
    "city": { "type": "string", "required": true },
    "venue": { "type": "string", "required": true },
    "startDate": { "type": "date", "required": true },
    "endDate": { "type": "date" },
    "hours": { "type": "string" },
    "dateNote": { "type": "string" },
    "url": { "type": "string" }
  }
}
```

**Step 3: Fill the country dropdown with every country the world map can show**

Only countries in `countries-110m.json` are allowed, so every exhibition gets a map marker.
```bash
cd frontend && node -e '
const fs = require("fs");
const countries = require("i18n-iso-countries");
const topo = require("./public/data/countries-110m.json");
const codes = topo.objects.countries.geometries
  .map((g) => countries.numericToAlpha2(g.id)).filter(Boolean);
const file = "../backend/src/api/exhibition/content-types/exhibition/schema.json";
const schema = JSON.parse(fs.readFileSync(file));
schema.attributes.country.enum = [...new Set(codes)].sort();
fs.writeFileSync(file, JSON.stringify(schema, null, 2) + "\n");
console.log(schema.attributes.country.enum.length, "countries");
'
```
Expected: about `170 countries`. Check that every code used in `frontend/src/constants/exhibitions.js` is in the list:
```bash
node -e '
const e = require("../backend/src/api/exhibition/content-types/exhibition/schema.json").attributes.country.enum;
import("./src/constants/exhibitions.js").then(({ EXHIBITIONS }) =>
  console.log("missing:", [...new Set(EXHIBITIONS.map((x) => x.country))].filter((c) => !e.includes(c))));
'
```
Expected: `missing: []`

**Step 4: `diploma-language/schema.json`**
```json
{
  "kind": "collectionType",
  "collectionName": "diploma_languages",
  "info": { "singularName": "diploma-language", "pluralName": "diploma-languages", "displayName": "Diploma language" },
  "options": { "draftAndPublish": true },
  "attributes": {
    "name": { "type": "string", "required": true, "unique": true },
    "order": { "type": "integer", "default": 0 }
  }
}
```

**Step 5: `diploma/schema.json`**
```json
{
  "kind": "collectionType",
  "collectionName": "diplomas",
  "info": { "singularName": "diploma", "pluralName": "diplomas", "displayName": "Diploma" },
  "options": { "draftAndPublish": true },
  "attributes": {
    "studentName": { "type": "string", "required": true },
    "order": { "type": "integer", "required": true },
    "versions": { "type": "component", "repeatable": true, "component": "diploma.version" }
  }
}
```

**Step 6: `sponsor/schema.json`** (and `partner/schema.json`, which is identical except
`collectionName: "partners"`, `singularName: "partner"`, `pluralName: "partners"`, `displayName: "Partner"`)
```json
{
  "kind": "collectionType",
  "collectionName": "sponsors",
  "info": { "singularName": "sponsor", "pluralName": "sponsors", "displayName": "Sponsor" },
  "options": { "draftAndPublish": true },
  "attributes": {
    "name": { "type": "string", "required": true },
    "logo": { "type": "media", "multiple": false, "required": true, "allowedTypes": ["images"] },
    "url": { "type": "string" },
    "size": { "type": "enumeration", "enum": ["wide", "square", "bordered", "text"], "default": "wide", "required": true },
    "order": { "type": "integer", "default": 0 }
  }
}
```

**Step 7: `faq/schema.json`** (localized)
```json
{
  "kind": "collectionType",
  "collectionName": "faqs",
  "info": { "singularName": "faq", "pluralName": "faqs", "displayName": "FAQ" },
  "options": { "draftAndPublish": true },
  "pluginOptions": { "i18n": { "localized": true } },
  "attributes": {
    "question": { "type": "string", "required": true, "pluginOptions": { "i18n": { "localized": true } } },
    "answer": { "type": "blocks", "required": true, "pluginOptions": { "i18n": { "localized": true } } },
    "order": { "type": "integer", "default": 0, "pluginOptions": { "i18n": { "localized": false } } }
  }
}
```

**Step 8: `exhibition-photo/schema.json`** (only the caption is localized)
```json
{
  "kind": "collectionType",
  "collectionName": "exhibition_photos",
  "info": { "singularName": "exhibition-photo", "pluralName": "exhibition-photos", "displayName": "Exhibition photo" },
  "options": { "draftAndPublish": true },
  "pluginOptions": { "i18n": { "localized": true } },
  "attributes": {
    "image": { "type": "media", "multiple": false, "required": true, "allowedTypes": ["images"], "pluginOptions": { "i18n": { "localized": false } } },
    "caption": { "type": "string", "pluginOptions": { "i18n": { "localized": true } } },
    "order": { "type": "integer", "default": 0, "pluginOptions": { "i18n": { "localized": false } } }
  }
}
```

**Step 9: `stat/schema.json`** (only the label is localized; the icon keys match the SVGs in `frontend/src/assets/`)
```json
{
  "kind": "collectionType",
  "collectionName": "stats",
  "info": { "singularName": "stat", "pluralName": "stats", "displayName": "Stat" },
  "options": { "draftAndPublish": true },
  "pluginOptions": { "i18n": { "localized": true } },
  "attributes": {
    "number": { "type": "string", "required": true, "pluginOptions": { "i18n": { "localized": false } } },
    "label": { "type": "string", "required": true, "pluginOptions": { "i18n": { "localized": true } } },
    "icon": {
      "type": "enumeration",
      "enum": ["diploma", "media", "exhibitions", "world", "team", "fund"],
      "required": true,
      "pluginOptions": { "i18n": { "localized": false } }
    },
    "order": { "type": "integer", "default": 0, "pluginOptions": { "i18n": { "localized": false } } }
  }
}
```

**Step 10: Verify**

Strapi restarts with no errors. Content Manager shows 8 collection types. Create one Diploma by hand and
confirm that a version's language dropdown lists Diploma languages. Then delete the test entry.

**Step 11: Commit**
```bash
git add backend/src frontend/package.json frontend/package-lock.json
git commit -m "feat(backend): collection types and components"
```

---

### Task 4: Single types

All fields are optional, because translations are partial and the frontend falls back to English.
A field whose text contains newlines renders one line per newline.

**Files (all Create):**
- `backend/src/api/home/content-types/home/schema.json`
- `backend/src/api/global/content-types/global/schema.json`
- `backend/src/api/exhibitions-page/content-types/exhibitions-page/schema.json`

**Step 1: `home/schema.json`**
```json
{
  "kind": "singleType",
  "collectionName": "homes",
  "info": { "singularName": "home", "pluralName": "homes", "displayName": "Home" },
  "options": { "draftAndPublish": true },
  "pluginOptions": { "i18n": { "localized": true } },
  "attributes": {
    "heroTagline": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "exhibitionsBlockTitle": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "exhibitionsBlockMobileTitle": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "hostBlockTitle": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "hostBlockMobileTitle": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "donateBlockTitle": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "donateBlockMobileTitle": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "aboutHeading": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "aboutText": { "type": "blocks", "pluginOptions": { "i18n": { "localized": true } } },
    "quoteText": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "quoteImage": { "type": "media", "multiple": false, "allowedTypes": ["images"], "pluginOptions": { "i18n": { "localized": false } } },
    "hallText": { "type": "blocks", "pluginOptions": { "i18n": { "localized": true } } },
    "soundcloudUrl": { "type": "string", "pluginOptions": { "i18n": { "localized": false } } },
    "photosHeading": { "type": "string", "pluginOptions": { "i18n": { "localized": true } } },
    "mapHeading": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "mapText": { "type": "blocks", "pluginOptions": { "i18n": { "localized": true } } },
    "donateHeading": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "donateText": { "type": "blocks", "pluginOptions": { "i18n": { "localized": true } } },
    "donateUrl": { "type": "string", "pluginOptions": { "i18n": { "localized": false } } },
    "storiesHeading": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } },
    "storiesText": { "type": "blocks", "pluginOptions": { "i18n": { "localized": true } } },
    "storiesLinkUrl": { "type": "string", "pluginOptions": { "i18n": { "localized": false } } },
    "sponsorsHeading": { "type": "string", "pluginOptions": { "i18n": { "localized": true } } },
    "partnersHeading": { "type": "string", "pluginOptions": { "i18n": { "localized": true } } },
    "faqHeading": { "type": "text", "pluginOptions": { "i18n": { "localized": true } } }
  }
}
```

**Step 2: `global/schema.json`**
```json
{
  "kind": "singleType",
  "collectionName": "globals",
  "info": { "singularName": "global", "pluralName": "globals", "displayName": "Global" },
  "options": { "draftAndPublish": true },
  "pluginOptions": { "i18n": { "localized": true } },
  "attributes": {
    "contactEmail": { "type": "email", "pluginOptions": { "i18n": { "localized": false } } },
    "socialLinks": { "type": "component", "repeatable": true, "component": "shared.social-link", "pluginOptions": { "i18n": { "localized": false } } },
    "copyright": { "type": "string", "pluginOptions": { "i18n": { "localized": true } } },
    "hostExhibitionUrl": { "type": "string", "pluginOptions": { "i18n": { "localized": false } } }
  }
}
```

**Step 3: `exhibitions-page/schema.json`**
```json
{
  "kind": "singleType",
  "collectionName": "exhibitions_pages",
  "info": { "singularName": "exhibitions-page", "pluralName": "exhibitions-pages", "displayName": "Exhibitions page" },
  "options": { "draftAndPublish": true },
  "pluginOptions": { "i18n": { "localized": true } },
  "attributes": {
    "heading": { "type": "string", "pluginOptions": { "i18n": { "localized": true } } },
    "subtitle": { "type": "string", "pluginOptions": { "i18n": { "localized": true } } }
  }
}
```

**Step 4: Verify**: Content Manager → Single types lists Home, Global and Exhibitions page, each with a locale switcher.

**Step 5: Commit**
```bash
git add backend/src/api && git commit -m "feat(backend): home, global and exhibitions-page single types"
```

---

### Task 5: `GET /api/site-content` endpoint

**Files:**
- Create: `backend/src/api/site-content/routes/site-content.ts`
- Create: `backend/src/api/site-content/controllers/site-content.ts`

**Step 1: Route**
```ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/site-content',
      handler: 'site-content.find',
      config: { policies: [] },
    },
  ],
};
```

**Step 2: Controller**
```ts
import type { Core } from '@strapi/strapi';

// Everything the static build needs for one locale, in one response.
// Localized types are returned as stored; the frontend build merges the English fallback.
export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: any) {
    const locale = String(ctx.query.locale ?? 'en');
    const published = { status: 'published' as const };
    const list = (uid: any, params: any = {}) =>
      strapi.documents(uid).findMany({ ...published, sort: 'order:asc', ...params });
    const single = (uid: any, params: any = {}) =>
      strapi.documents(uid).findFirst({ ...published, locale, populate: '*', ...params });

    const [home, global, exhibitionsPage, exhibitions, diplomas, diplomaLanguages, sponsors, partners, faqs, exhibitionPhotos, stats] =
      await Promise.all([
        single('api::home.home'),
        single('api::global.global'),
        single('api::exhibitions-page.exhibitions-page'),
        list('api::exhibition.exhibition', { sort: 'startDate:asc' }),
        list('api::diploma.diploma', { populate: { versions: { populate: ['language', 'image'] } } }),
        list('api::diploma-language.diploma-language'),
        list('api::sponsor.sponsor', { populate: ['logo'] }),
        list('api::partner.partner', { populate: ['logo'] }),
        list('api::faq.faq', { locale }),
        list('api::exhibition-photo.exhibition-photo', { locale, populate: ['image'] }),
        list('api::stat.stat', { locale }),
      ]);

    ctx.body = { home, global, exhibitionsPage, exhibitions, diplomas, diplomaLanguages, sponsors, partners, faqs, exhibitionPhotos, stats };
  },
});
```

**Step 3: Create the build token**

Admin → Settings → API Tokens → Create: name `static-build`, duration Unlimited, type **Read-only**.
Copy the token into `frontend/.env` as `STRAPI_TOKEN=...` (Task 8 sets up the file).

**Step 4: Verify access control**
```bash
curl -s -o /dev/null -w '%{http_code}\n' 'localhost:1337/api/site-content?locale=en'
# Expected: 403 (or 401): no anonymous reads
curl -s -H "Authorization: Bearer $STRAPI_TOKEN" 'localhost:1337/api/site-content?locale=en' | head -c 300
# Expected: {"home":null,"global":null,...,"exhibitions":[],...}
```
If the read-only token gets 403: in the token settings, switch the type to **Custom** and tick
`site-content → find`.

**Step 5: Commit**
```bash
git add backend/src/api/site-content && git commit -m "feat(backend): site-content endpoint for static build"
```

---

### Task 6: One-off import of current content

**Files:**
- Create: `backend/scripts/diploma-files.mjs`
- Test: `backend/scripts/diploma-files.test.mjs`
- Create: `backend/scripts/import.mjs`
- Modify: `backend/package.json` (scripts)

Diploma file names in `downloads/<Language>/` are inconsistent:
- English: `12d Kotlubei_HD.jpg`, `6 Levchuk_HD.jpg`, `1d Yevdokymov EU_HD.jpg`, `40d Rybytva merged eu_HD.jpg`
- German: `12d Kotlubei, dip+photo, German.jpg`
- Chinese/French/Italian/Korean/Spanish: `photo+diploma eng+korean 12.jpg`
- Japanese: `Lysenko Olha 37 diploma+photo eng+jap.jpg` or `kotlubei_diploma+photo-min.png` (no number;
  match on surname; `oblomey` is spelled `Oblomei` in English)

**Step 1: Write the failing test**
```js
// backend/scripts/diploma-files.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { parseEnglish, orderOf } from './diploma-files.mjs';

const DOWNLOADS = new URL('../../downloads/', import.meta.url);

test('parseEnglish reads order and surname', () => {
  assert.deepEqual(parseEnglish('12d Kotlubei_HD.jpg'), { order: 12, studentName: 'Kotlubei' });
  assert.deepEqual(parseEnglish('6 Levchuk_HD.jpg'), { order: 6, studentName: 'Levchuk' });
  assert.deepEqual(parseEnglish('1d Yevdokymov EU_HD.jpg'), { order: 1, studentName: 'Yevdokymov' });
  assert.deepEqual(parseEnglish('40d Rybytva merged eu_HD.jpg'), { order: 40, studentName: 'Rybytva' });
});

test('orderOf uses the number, else the surname', () => {
  const students = [{ order: 12, studentName: 'Kotlubei' }, { order: 29, studentName: 'Oblomei' }];
  assert.equal(orderOf('12d Kotlubei, dip+photo, German.jpg', students), 12);
  assert.equal(orderOf('photo+diploma eng+korean 12.jpg', students), 12);
  assert.equal(orderOf('Lysenko Olha 37 diploma+photo eng+jap.jpg', students), 37);
  assert.equal(orderOf('kotlubei_diploma+photo-min.png', students), 12);
  assert.equal(orderOf('oblomey_diploma+photo-min.png', students), 29);
  assert.throws(() => orderOf('unknown_diploma.png', students), /unknown_diploma/);
});

test('every downloaded language maps to exactly students 1..40', { skip: !existsSync(DOWNLOADS) }, () => {
  const students = readdirSync(new URL('English/', DOWNLOADS)).map(parseEnglish);
  for (const lang of readdirSync(DOWNLOADS)) {
    const orders = readdirSync(new URL(`${lang}/`, DOWNLOADS)).map((f) => orderOf(f, students));
    assert.deepEqual(orders.sort((a, b) => a - b), Array.from({ length: 40 }, (_, i) => i + 1), lang);
  }
});
```

**Step 2: Run it and confirm it fails**

Run: `cd backend && node --test scripts/`
Expected: FAIL: `Cannot find module .../diploma-files.mjs`

**Step 3: Implement**
```js
// backend/scripts/diploma-files.mjs
// Maps the inconsistent Wix export file names (downloads/<Language>/*) to a student's order number.
const ALIASES = { oblomey: 'oblomei' };

export const parseEnglish = (file) => {
  const [, order, studentName] = file.match(/^(\d+)d? (.+?)(?: merged)?(?: eu)?_HD\.jpg$/i);
  return { order: Number(order), studentName };
};

export const orderOf = (file, students) => {
  const number = file.match(/\b(\d{1,2})d?\b/);
  if (number) return Number(number[1]);
  const surname = file.split(/[_ ,]/)[0].toLowerCase();
  const student = students.find((s) => s.studentName.toLowerCase() === (ALIASES[surname] ?? surname));
  if (!student) throw new Error(`No student for ${file}`);
  return student.order;
};
```

**Step 4: Run the tests and confirm they pass**

Run: `cd backend && node --test scripts/`
Expected: 3 tests pass (the third runs against the real `downloads/`).

**Step 5: Write the import script**
```js
// backend/scripts/import.mjs
// One-off: moves today's hardcoded site content into Strapi. Skips any type that already has entries.
// Run: npm run import   (Strapi dev server may keep running)
import strapiPkg from '@strapi/strapi';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { parseEnglish, orderOf } from './diploma-files.mjs';
import { EXHIBITIONS } from '../../frontend/src/constants/exhibitions.js';
import { ACTION_BLOCK_TITLES } from '../../frontend/src/config/actionBlockTitles.js';

const { createStrapi, compileStrapi } = strapiPkg;
const ROOT = path.resolve(import.meta.dirname, '../..');
const DOWNLOADS = path.join(ROOT, 'downloads');
const ASSETS = path.join(ROOT, 'frontend/src/assets');
const DIPLOMA_LANGUAGES = [
  ['English', 'English'], ['German', 'Deutsch'], ['Italian', 'Italiano'], ['Spanish', 'Español'],
  ['French', 'Français'], ['Japanese', '日本語'], ['Chinese', '中文'], ['Korean', '한국어'],
];

const strapi = await createStrapi(await compileStrapi()).load();

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.avif': 'image/avif' };
const upload = async (filepath) => {
  const { size } = await stat(filepath);
  const [file] = await strapi.plugin('upload').service('upload').upload({
    data: {},
    files: { filepath, originalFilename: path.basename(filepath), mimetype: MIME[path.extname(filepath).toLowerCase()], size },
  });
  return file.id;
};

const docs = (uid) => strapi.documents(uid);
const create = (uid, data, locale) => docs(uid).create({ data, locale, status: 'published' });
const isEmpty = async (uid) => (await docs(uid).count({})) === 0;
const run = async (uid, fn) => {
  if (!(await isEmpty(uid))) return console.log(`skip ${uid} (has entries)`);
  await fn();
  console.log(`done ${uid}: ${await docs(uid).count({})}`);
};

// Blocks rich text: p('plain ', { b: 'bold' }, ' plain')
const p = (...parts) => ({
  type: 'paragraph',
  children: parts.map((t) => (typeof t === 'string' ? { type: 'text', text: t } : { type: 'text', text: t.b, bold: true })),
});
const lines = (value) => (Array.isArray(value) ? value.join('\n') : value);

await run('api::exhibition.exhibition', async () => {
  for (const exhibition of EXHIBITIONS) await create('api::exhibition.exhibition', exhibition);
});

await run('api::diploma-language.diploma-language', async () => {
  for (const [order, [, name]] of DIPLOMA_LANGUAGES.entries()) {
    await create('api::diploma-language.diploma-language', { name, order: order + 1 });
  }
});

await run('api::diploma.diploma', async () => {
  const languages = await docs('api::diploma-language.diploma-language').findMany({ status: 'published' });
  const english = await readdir(path.join(DOWNLOADS, 'English'));
  const students = english.map(parseEnglish);
  const versions = new Map(students.map((s) => [s.order, []]));
  for (const [folder, name] of DIPLOMA_LANGUAGES) {
    const language = languages.find((l) => l.name === name).documentId;
    for (const file of await readdir(path.join(DOWNLOADS, folder))) {
      const image = await upload(path.join(DOWNLOADS, folder, file));
      versions.get(orderOf(file, students)).push({ language, image });
    }
    console.log(`  uploaded ${folder}`);
  }
  for (const s of students) await create('api::diploma.diploma', { ...s, versions: versions.get(s.order) });
});

await run('api::faq.faq', async () => {
  const faqs = [
    ['Were only 40 students killed?', 'No, the full-scale russian invasion has taken more student lives, as, in total, more than 6000 civilians and 13 000 soldiers have been reported killed since February 24, 2022. The exact number of students among them is unknown, considering that losses keep increasing every day.'],
    ['Are exhibitions free to attend?', "Yes, exhibitions are free of charge. However, you are welcome to donate, as we want to support financially Ukrainian students who stay in Ukraine and sacrifice their time and education to work for Ukraine's freedom."],
    ['Where can I learn more about other events?', 'You can find more information on our social media, the links to which are just below the FAQ section. We would also highly appreciate you sharing the events with those who might be interested, as we hope for this project to reach as many people as possible.'],
  ];
  for (const [i, [question, answer]] of faqs.entries()) {
    await create('api::faq.faq', { question, answer: [p(answer)], order: i + 1 }, 'en');
  }
});

await run('api::stat.stat', async () => {
  const stats = [
    ['40', 'DIPLOMAS OF STUDENTS KILLED BY RUSSIA', 'diploma'],
    ['300+', 'MEDIA MENTIONS', 'media'],
    ['300+', 'EXHIBITIONS', 'exhibitions'],
    ['23', 'LANGUAGES FOR GLOBAL IMPACT', 'world'],
    ['100+', 'TEAM MEMBERS', 'team'],
    ['CAD $25,000+', 'RAISED FOR THE ENDOWMENT FUND', 'fund'],
  ];
  for (const [i, [number, label, icon]] of stats.entries()) {
    await create('api::stat.stat', { number, label, icon, order: i + 1 }, 'en');
  }
});

await run('api::exhibition-photo.exhibition-photo', async () => {
  const captions = ['Kyiv, 2023', 'Lviv, 2023', 'Warsaw, 2024', 'Berlin, 2024', 'Toronto, 2024', 'Vienna, 2025'];
  for (const [i, caption] of captions.entries()) {
    const image = await upload(path.join(ASSETS, `photo-slider/photo${i + 1}.png`));
    await create('api::exhibition-photo.exhibition-photo', { image, caption, order: i + 1 }, 'en');
  }
});

await run('api::home.home', async () => {
  const blockTitles = (lang) => {
    const t = (block) => ACTION_BLOCK_TITLES[block][lang] ?? {};
    return {
      exhibitionsBlockTitle: lines(t('block2').title), exhibitionsBlockMobileTitle: lines(t('block2').mobileTitle),
      hostBlockTitle: lines(t('block3').title), hostBlockMobileTitle: lines(t('block3').mobileTitle),
      donateBlockTitle: lines(t('block4').title), donateBlockMobileTitle: lines(t('block4').mobileTitle),
    };
  };
  const home = await create('api::home.home', {
    heroTagline: 'When your classroom turns into a battlefield, your major becomes bravery.',
    ...blockTitles('en'),
    aboutHeading: "WHAT'S\nTHE PROJECT\nABOUT?",
    aboutText: [
      p('The "Unissued Diplomas" international exhibitions honor ', { b: 'Ukrainian students who will never graduate because their lives were taken' }, ' by the russian invasion.'),
      p('The project shares the stories of ', { b: '40 students' }, ' — civilians and military service members, young men and women — whose futures were cut short by the war. Through their stories, we commemorate their lives, their contributions, and the impact they had on their communities.'),
      p('Over ', { b: '100 people' }, ' have been involved in bringing the project to life. All united in one mission: to preserve their memory and remind the world that the full-scale war continues to take innocent lives. We operate on a ', { b: 'franchise-based model' }, ' by providing end-to-end support to local organizers for global scalability and impact.'),
    ],
    quoteText: 'NEVER GRADUATED,\nETERNALLY HONORED',
    quoteImage: await upload(path.join(ASSETS, 'ParralaxQuotImage.avif')),
    hallText: [
      p('They used to spend their days in study halls. They had favourite classes and those they dreaded weekly. And how scary it was for them to even think of failing a midterm.'),
      p('But ', { b: 'after February 24, 2022, everything changed for Ukrainian students.' }, ' Classrooms turned into bomb shelters and battlefields. Fear changed its course, and bravery took control.'),
      p({ b: 'Now, diplomas of some will never be issued.' }, " Because russia took the lives of their to-be owners in its attempt to take Ukraine's freedom."),
    ],
    soundcloudUrl: 'https://soundcloud.com/user-418708485/unissued-diplomas-audiotour-1',
    photosHeading: 'Exhibitions Throughout the Years',
    mapHeading: 'GLOBAL IMPACT, ONE EXHIBITION\nAT A TIME',
    mapText: [p('"Unissued Diplomas" operates on a franchise-based model. Our core team prepares all print-ready materials and provides full support to local organizers, ensuring the exhibition can be easily adapted and scaled worldwide.')],
    donateHeading: 'Donate to honor\nTheir Memory',
    donateText: [
      p('The goal of ', { b: 'The Unissued Diplomas Endowment Fund' }, ' is to raise $75,000 USD ($100,000 CAD). Reaching this target — in partnership with the Kyiv-Mohyla Foundations of America and Canada — will allow us to establish a sustainable endowment fund that finances ', { b: 'an annual scholarship' }, '.'),
      p("Each year, this scholarship will cover the full cost of one student's education. It will serve as a living tribute to the students of Kyiv-Mohyla Academy and other universities who lost their lives during Russia's full-scale invasion of Ukraine."),
      p("Through this fund, we honor their memory by investing in what they believed in — education, opportunity, and the future of Ukraine's next generation."),
    ],
    storiesHeading: 'The Stories Behind the Diplomas',
    storiesText: [
      p('We contacted relatives, universities, and the platform Memorial to collect the stories and turn them into Unissued Diplomas.'),
      p('With the consent of parents and families, our team created each story in memory of the students whose lives were taken by the war, honoring their contributions and the future they were building.'),
    ],
    storiesLinkUrl: 'https://memorial.ua',
    sponsorsHeading: 'Sponsors',
    partnersHeading: 'Partners',
    faqHeading: 'FREQUENTLY\nASKED\nQUESTIONS',
  }, 'en');
  // The action-block titles already exist in 5 more languages; everything else falls back to English
  for (const lang of ['uk', 'de', 'it', 'ja', 'es']) {
    await docs('api::home.home').update({ documentId: home.documentId, locale: lang, data: blockTitles(lang), status: 'published' });
  }
});

await run('api::global.global', async () => {
  await create('api::global.global', {
    contactEmail: 'unissueddiplomas@gmail.com',
    // Placeholder URLs copied from the current Footer: admins must replace them with real profiles
    socialLinks: ['instagram', 'facebook', 'linkedin', 'tiktok', 'x'].map((platform) => ({ platform, url: `https://${platform === 'x' ? 'x' : platform}.com` })),
    copyright: 'Unissued Diplomas ©2026',
    hostExhibitionUrl: '',
  }, 'en');
});

await run('api::exhibitions-page.exhibitions-page', async () => {
  await create('api::exhibitions-page.exhibitions-page', {
    heading: 'Exhibitions',
    subtitle: 'Supported by the Ministry of Education and Science of Ukraine',
  }, 'en');
});

await strapi.destroy();
```

**Step 6: Add the script to `backend/package.json` `scripts`**
```json
"import": "node scripts/import.mjs",
"test": "node --test scripts/"
```

**Step 7: Run the import**

Run: `cd backend && npm run import`
Expected (this takes several minutes because 320 diplomas get resized):
```
done api::exhibition.exhibition: <count of EXHIBITIONS>
done api::diploma-language.diploma-language: 8
  uploaded English … uploaded Korean
done api::diploma.diploma: 40
done api::faq.faq: 3
done api::stat.stat: 6
done api::exhibition-photo.exhibition-photo: 6
done api::home.home: 1
done api::global.global: 1
done api::exhibitions-page.exhibitions-page: 1
```
Run it again: every line says `skip … (has entries)`.

**Step 8: Verify in the admin**: open Diploma #12 (Kotlubei). It has 8 versions, and the German one shows
the German Kotlubei image. Open Home → locale `de`: the block titles are German and the other fields are empty.

**Step 9: Commit**
```bash
git add backend/scripts backend/package.json && git commit -m "feat(backend): one-off content import"
```

---

## Phase 2: Frontend static content

### Task 7: Content transform library (TDD)

**Files:**
- Create: `frontend/scripts/content-lib.mjs`
- Test: `frontend/scripts/content-lib.test.mjs`

**Step 1: Write the failing tests**
```js
// frontend/scripts/content-lib.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mergeEntry, mergeList, slim, enrichExhibitions } from './content-lib.mjs';

test('mergeEntry: translated value wins, empty values fall back to English', () => {
  const en = { title: 'Hello', text: 'Body', list: [1] };
  const de = { title: 'Hallo', text: '', list: [] };
  assert.deepEqual(mergeEntry(en, de), { title: 'Hallo', text: 'Body', list: [1] });
  assert.deepEqual(mergeEntry(en, null), en);
});

test('mergeList keeps English order and items, swaps in translations by documentId', () => {
  const en = [{ documentId: 'a', q: 'A' }, { documentId: 'b', q: 'B' }];
  const de = [{ documentId: 'b', q: 'B-de' }];
  assert.deepEqual(mergeList(en, de), [{ documentId: 'a', q: 'A' }, { documentId: 'b', q: 'B-de' }]);
});

test('slim strips metadata, shrinks media and collects upload URLs', () => {
  const urls = new Set();
  const input = {
    id: 1, documentId: 'x', createdAt: 't', updatedAt: 't', publishedAt: 't', locale: 'en', title: 'T',
    image: {
      id: 9, mime: 'image/jpeg', url: '/uploads/a.jpg', alternativeText: null, width: 2000, height: 1000, hash: 'h',
      formats: { thumbnail: { url: '/uploads/thumbnail_a.jpg', width: 245, size: 1 } },
    },
  };
  assert.deepEqual(slim(input, urls), {
    documentId: 'x', title: 'T',
    image: { url: '/uploads/a.jpg', alt: '', width: 2000, height: 1000, formats: { thumbnail: { url: '/uploads/thumbnail_a.jpg', width: 245 } } },
  });
  assert.deepEqual([...urls], ['/uploads/a.jpg', '/uploads/thumbnail_a.jpg']);
});

test('enrichExhibitions adds map id and marker coordinates', () => {
  const topology = JSON.parse(readFileSync(new URL('../public/data/countries-110m.json', import.meta.url)));
  const [ua, pl] = enrichExhibitions([{ country: 'UA' }, { country: 'PL' }], topology, { UA: [31.16, 48.38] });
  assert.deepEqual(ua, { country: 'UA', mapId: '804', coordinates: [31.16, 48.38] }); // override wins
  assert.equal(pl.mapId, '616');
  assert.equal(pl.coordinates.length, 2); // centroid computed from the map shape
  assert.ok(pl.coordinates[0] > 14 && pl.coordinates[0] < 25, `PL lon ${pl.coordinates[0]}`);
});
```

**Step 2: Run and confirm it fails**

Run: `cd frontend && node --test scripts/`
Expected: FAIL: `Cannot find module .../content-lib.mjs`

**Step 3: Implement**
```js
// frontend/scripts/content-lib.mjs
// Pure transforms applied to /api/site-content responses at build time.
import countries from 'i18n-iso-countries';
import { feature } from 'topojson-client';
import { geoCentroid } from 'd3-geo';

const isEmpty = (v) => v == null || v === '' || (Array.isArray(v) && v.length === 0);

// Field-level fallback: a translated field wins unless it is empty
export const mergeEntry = (en, loc) => {
  if (!loc) return en;
  if (!en) return loc;
  const out = { ...en };
  for (const [key, value] of Object.entries(loc)) if (!isEmpty(value)) out[key] = value;
  return out;
};

// English decides which items exist and their order; translations replace fields per document
export const mergeList = (en = [], loc = []) => {
  const byId = new Map(loc.map((doc) => [doc.documentId, doc]));
  return en.map((doc) => mergeEntry(doc, byId.get(doc.documentId)));
};

const DROP = new Set(['id', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations']);
const isMedia = (v) => v && typeof v === 'object' && 'mime' in v && 'url' in v;

// Drops Strapi metadata and shrinks media objects; every referenced file URL is added to `urls`
export const slim = (value, urls) => {
  if (Array.isArray(value)) return value.map((v) => slim(v, urls));
  if (isMedia(value)) {
    urls.add(value.url);
    const formats = Object.fromEntries(
      Object.entries(value.formats ?? {}).map(([name, f]) => {
        urls.add(f.url);
        return [name, { url: f.url, width: f.width }];
      }),
    );
    return { url: value.url, alt: value.alternativeText ?? '', width: value.width, height: value.height, formats };
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).filter(([k]) => !DROP.has(k)).map(([k, v]) => [k, slim(v, urls)]),
    );
  }
  return value;
};

// Adds the TopoJSON id the WorldMap uses and a marker position (hand-tuned override, else shape centroid)
export const enrichExhibitions = (exhibitions, topology, overrides) => {
  const shapes = new Map(feature(topology, topology.objects.countries).features.map((f) => [f.id, f]));
  return exhibitions.map((exhibition) => {
    const mapId = countries.alpha2ToNumeric(exhibition.country);
    const shape = shapes.get(mapId);
    const coordinates = overrides[exhibition.country] ?? (shape && geoCentroid(shape).map((n) => Number(n.toFixed(2))));
    return { ...exhibition, mapId, coordinates };
  });
};
```

**Step 4: Run and confirm the tests pass**

Run: `cd frontend && node --test scripts/`
Expected: 4 tests pass. If `mapId` comes back unpadded (`'36'` for AU), wrap it:
`String(countries.alpha2ToNumeric(...)).padStart(3, '0')`.

**Step 5: Commit**
```bash
git add frontend/scripts && git commit -m "feat(frontend): build-time content transforms"
```

---

### Task 8: `fetch-content` script, npm hooks, env and ignores

**Files:**
- Create: `frontend/scripts/fetch-content.mjs`
- Create: `frontend/src/constants/markerCoordinates.js`
- Modify: `frontend/package.json`, `frontend/.gitignore`, `frontend/.env.example`, `frontend/.env`

**Step 1: `markerCoordinates.js`**: move the hand-tuned marker positions out of `COUNTRY_GEO`
(`frontend/src/constants/exhibitions.js:156-185`), keeping only the coordinates:
```js
// Hand-tuned map marker positions (lon, lat). Countries not listed use their shape's centroid.
export const MARKER_COORDINATES = {
  AU: [133.78, -25.27], BE: [4.47, 50.5], BG: [25.49, 42.73], CA: [-106.35, 56.13], CZ: [15.47, 49.82],
  DE: [10.45, 51.16], DK: [9.5, 56.26], EE: [25.01, 58.6], ES: [-3.75, 40.46], FI: [25.75, 61.92],
  FR: [2.21, 46.23], GB: [-3.44, 55.38], ID: [113.92, -0.79], IE: [-8.24, 53.41], JP: [138.25, 36.2],
  KR: [127.77, 35.91], LT: [23.88, 55.17], NG: [8.68, 9.08], NL: [5.29, 52.13], NO: [8.47, 60.47],
  PL: [19.15, 51.92], QA: [51.18, 25.35], RO: [24.97, 45.94], SE: [18.64, 60.13], SK: [19.7, 48.67],
  TW: [120.96, 23.7], UA: [31.16, 48.38], US: [-95.71, 37.09],
};
```
(Leave `constants/exhibitions.js` in place for now; Task 13 deletes it.)

**Step 2: `fetch-content.mjs`**
```js
// Pulls all site content from Strapi into src/content/<locale>.json and public/uploads/.
// Runs before `dev` (--allow-stale: keep old content if Strapi is down) and `build` (strict).
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { mergeEntry, mergeList, slim, enrichExhibitions } from './content-lib.mjs';
import { MARKER_COORDINATES } from '../src/constants/markerCoordinates.js';
import { SUPPORTED_LANGUAGES } from '../src/constants/languages.js';

const { STRAPI_URL = 'http://localhost:1337', STRAPI_TOKEN } = process.env;
const CONTENT_DIR = new URL('../src/content/', import.meta.url);
const PUBLIC_DIR = new URL('../public/', import.meta.url);
const exists = (url) => access(url).then(() => true, () => false);

const get = async (locale) => {
  const res = await fetch(`${STRAPI_URL}/api/site-content?locale=${locale}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });
  if (!res.ok) throw new Error(`site-content?locale=${locale}: HTTP ${res.status}`);
  return res.json();
};

const withFallback = (en, loc) => ({
  ...en,
  home: mergeEntry(en.home, loc.home),
  global: mergeEntry(en.global, loc.global),
  exhibitionsPage: mergeEntry(en.exhibitionsPage, loc.exhibitionsPage),
  faqs: mergeList(en.faqs, loc.faqs),
  exhibitionPhotos: mergeList(en.exhibitionPhotos, loc.exhibitionPhotos),
  stats: mergeList(en.stats, loc.stats),
});

// Upload names contain a hash, so an existing file is never stale
const download = async (url) => {
  const dest = new URL(`.${url}`, PUBLIC_DIR);
  if (await exists(dest)) return;
  const res = await fetch(`${STRAPI_URL}${url}`);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  await mkdir(new URL('.', dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
};

try {
  const topology = JSON.parse(await readFile(new URL('data/countries-110m.json', PUBLIC_DIR)));
  const en = await get('en');
  en.exhibitions = enrichExhibitions(en.exhibitions, topology, MARKER_COORDINATES);

  const urls = new Set();
  await mkdir(CONTENT_DIR, { recursive: true });
  for (const { code } of SUPPORTED_LANGUAGES) {
    const content = code === 'en' ? en : withFallback(en, await get(code));
    await writeFile(new URL(`${code}.json`, CONTENT_DIR), JSON.stringify(slim(content, urls)));
  }

  const queue = [...urls];
  await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await download(queue.pop()); }));
  console.log(`content: ${SUPPORTED_LANGUAGES.length} locales, ${urls.size} files`);
} catch (err) {
  if (process.argv.includes('--allow-stale') && (await exists(new URL('en.json', CONTENT_DIR)))) {
    console.warn(`⚠ content not refreshed, using existing files (${err.message})`);
  } else {
    console.error(err);
    process.exit(1);
  }
}
```

**Step 3: `frontend/package.json` scripts**: add these next to the existing ones:
```json
"content": "node --env-file-if-exists=.env scripts/fetch-content.mjs",
"predev": "npm run content -- --allow-stale",
"prebuild": "npm run content",
"test": "node --test scripts/"
```

**Step 4: `frontend/.gitignore`**: append:
```
# Generated from Strapi by scripts/fetch-content.mjs
src/content/
public/uploads/
```

**Step 5: `frontend/.env.example`**: replace the content:
```
# Strapi used at build time only (scripts/fetch-content.mjs); the site itself never calls it
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=
```
Update `frontend/.env` the same way, pasting the token from Task 5.

**Step 6: Run it**

Run: `cd frontend && npm run content`
Expected: `content: 6 locales, <N> files`. `src/content/en.json` exists, and `public/uploads/` holds the
diplomas in every size. Check the fallback:
```bash
node -e 'const d=require("./src/content/de.json");console.log(d.home.exhibitionsBlockTitle, "|", d.home.heroTagline, "|", d.exhibitions[0].mapId, d.exhibitions[0].coordinates)'
```
Expected: German block title | English tagline | a 3-digit id and 2 numbers.

Stop Strapi, then run `npm run content -- --allow-stale`. Expected: a `⚠ content not refreshed…` warning,
exit 0. `npm run content` (without the flag) exits 1. Start Strapi again.

**Step 7: Commit**
```bash
git add frontend/scripts frontend/src/constants/markerCoordinates.js frontend/package.json frontend/.gitignore frontend/.env.example
git commit -m "feat(frontend): fetch Strapi content at build time"
```

---

### Task 9: Content plumbing in React

**Files:**
- Create: `frontend/src/hooks/useContent.js`
- Create: `frontend/src/shared/RichText.jsx`
- Create: `frontend/src/utils/media.js`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/contexts/LanguageContext.jsx:22-26`

**Step 1: `useContent.js`**
```js
import { use } from "react";
import { useLanguage } from "./useLanguage";

// One JSON chunk per locale, generated by scripts/fetch-content.mjs; loaded once, then cached
const loaders = import.meta.glob("../content/*.json", { import: "default" });
const cache = new Map();

const load = (lang) => {
  if (!cache.has(lang)) {
    cache.set(lang, (loaders[`../content/${lang}.json`] ?? loaders["../content/en.json"])());
  }
  return cache.get(lang);
};

export const useContent = () => use(load(useLanguage().currentLanguage));
```

**Step 2: `RichText.jsx`**: renders Strapi "blocks" (paragraphs with bold, italic and links; other block types are ignored)
```jsx
import { Fragment } from "react";

const renderChildren = (children, strongClassName) =>
  children.map((child, i) => {
    if (child.type === "link") {
      return (
        <a key={i} href={child.url} target="_blank" rel="noopener noreferrer" className="underline">
          {renderChildren(child.children, strongClassName)}
        </a>
      );
    }
    let node = child.text;
    if (child.bold) node = <strong className={strongClassName}>{node}</strong>;
    if (child.italic) node = <em>{node}</em>;
    return <Fragment key={i}>{node}</Fragment>;
  });

// Strapi "blocks" rich text → <p> elements; `strongClassName` styles bold runs (each section highlights differently)
export const RichText = ({ blocks = [], className, strongClassName }) =>
  blocks.map((block, i) =>
    block.type === "paragraph" ? (
      <p key={i} className={className}>
        {renderChildren(block.children, strongClassName)}
      </p>
    ) : null,
  );
```

**Step 3: `media.js`**
```js
// Strapi image → URL of a generated size (thumbnail 245 / small 500 / medium 750 / large 1000px), else the original
export const mediaUrl = (media, format) => media?.formats?.[format]?.url ?? media?.url;

// Multi-line text field → array of lines (ActionBlock titles, headings)
export const lines = (text) => text?.split("\n");
```

**Step 4: `App.jsx`**: remove the achievements route and add a Suspense boundary for `use()`:
```jsx
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Home from './pages/Home';
import Exhibitions from './pages/Exhibitions';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exhibitions" element={<Exhibitions />} />
          </Routes>
        </Suspense>
      </Router>
    </LanguageProvider>
  );
}

export default App;
```
Delete `frontend/src/pages/Achievements.jsx`.

**Step 5: `LanguageContext.jsx`**: switch languages in a transition, so the old language stays on screen
while the new locale's chunk loads (no blank flash):
```jsx
import { useState, useEffect, startTransition } from 'react';
// ...
  const changeLanguage = (languageCode) => {
    startTransition(() => setCurrentLanguage(languageCode));
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };
```

**Step 6: Verify**: `npm run dev`. The home page still renders (nothing reads content yet), with no console errors.

**Step 7: Commit**
```bash
git add -A frontend/src && git commit -m "feat(frontend): useContent hook, RichText, media helpers"
```

---

### Task 10: Home top sections read from content

**Files:**
- Modify: `frontend/src/components/Main.jsx`
- Modify: `frontend/src/components/Achievements.jsx` (parallax quote)
- Modify: `frontend/src/components/HallOfDiplomas.jsx`
- Modify: `frontend/src/components/ExhibitionMap.jsx:17-31`
- Modify: `frontend/src/components/DonateSection.jsx`
- Modify: `frontend/src/components/StoriesSection.jsx`

**Step 1: `Main.jsx`**
- Imports: remove `useLanguage` and `ACTION_BLOCK_TITLES`, and add:
  ```jsx
  import { useContent } from "../hooks/useContent";
  import { RichText } from "../shared/RichText";
  import { lines } from "../utils/media";
  ```
- Replace lines 18-22 with `const { home, global } = useContent();`
- Tagline (lines 38-39) and Block 1 `description`: `{home.heroTagline}` / `description={home.heroTagline}`
- Block 2: `title={lines(home.exhibitionsBlockTitle)} mobileTitle={lines(home.exhibitionsBlockMobileTitle)}`
- Block 3: `title={lines(home.hostBlockTitle)} mobileTitle={lines(home.hostBlockMobileTitle)} href={global.hostExhibitionUrl || "#"}`
- Block 4: `title={lines(home.donateBlockTitle)} mobileTitle={lines(home.donateBlockMobileTitle)}`
- About `<h2>` (lines 94-96): add `whitespace-pre-line` to its className; content becomes `{home.aboutHeading}`
- Replace the three `<p>` (lines 101-133) inside `<div className="mt-8 tablet:mt-0 space-y-6">` with:
  ```jsx
  <RichText
    blocks={home.aboutText}
    className="text-[#ebebeb] max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6"
    strongClassName="font-[600] max-tablet:text-[20px] tablet:text-[16px]"
  />
  ```
- Replace `<SponsorsSection />` and `<PartnersSection />` later in Task 12.

Note: `ActionBlock` passes `href` to `<Link href>` (`shared/ActionBlock.jsx:160`), but React Router's `Link`
expects `to`. This bug already exists and is out of scope. Mention it to the user and don't fix it here.

**Step 2: `Achievements.jsx`**: the image and quote come from Home:
- Remove `import ParralaxQuotImage …`, and add `import { useContent } from "../hooks/useContent";`
- First line in the component: `const { home } = useContent();`
- Both `<img>`: `src={home.quoteImage?.url} alt={home.quoteText}`
- Both `<h2>`: add `whitespace-pre-line` to the className; content becomes `{home.quoteText}` (delete the `<br />` markup)

**Step 3: `HallOfDiplomas.jsx`**: replace the whole component:
```jsx
import { DiplomaViewer } from "./DiplomaViewer";
import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";

const soundcloudPlayer = (url) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;

export const HallOfDiplomas = () => {
  const { home } = useContent();

  return (
    <div className="px-4 tablet:px-0 max-w-[1080px] mx-auto">
      <div className="tablet:px-4 mobile-xs:px-1 pt-(--section-space)">
        <DiplomaViewer />

        <div className="mt-12 tablet:mt-20 space-y-6">
          <RichText
            blocks={home.hallText}
            className="max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6"
            strongClassName="text-[#ff6868] font-[500] max-tablet:text-[20px] tablet:text-[16px]"
          />
          {home.soundcloudUrl && (
            <iframe
              width="100%"
              height="120"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={soundcloudPlayer(home.soundcloudUrl)}
              title="Unissued Diplomas Audio Tour"
              className="!mt-14"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};
```

**Step 4: `ExhibitionMap.jsx`**: add `const { home } = useContent();` (with the imports for `useContent` and
`RichText`). The `<h2>` gets `whitespace-pre-line` and `{home.mapHeading}`. Replace the `<p>` with:
```jsx
<RichText
  blocks={home.mapText}
  className="mt-6 max-w-[640px] max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6 text-theme-text-muted"
/>
```

**Step 5: `DonateSection.jsx`**: add `const { home } = useContent();`. The `<h2>` gets `whitespace-pre-line`
and `{home.donateHeading}`. The three `<p>` become
`<RichText blocks={home.donateText} strongClassName="font-bold" />` (inside the existing `space-y-6` div).
Button: `href={home.donateUrl || "#donate"} target="_blank" rel="noopener noreferrer"`.

**Step 6: `StoriesSection.jsx`**: add `const { home } = useContent();`. The `<h2>` becomes `{home.storiesHeading}`,
the two `<p>` become `<RichText blocks={home.storiesText} />`, and the link gets `href={home.storiesLinkUrl}`.

**Step 7: Verify**: `npm run dev`. The home page looks the same as before in `en`. Switch to Deutsch: the action-block
titles are German and everything else is English (fallback). In Strapi, edit Home → en → hero tagline → Publish,
then restart `npm run dev` (predev refetches): the new tagline shows.

**Step 8: Commit**
```bash
git add frontend/src && git commit -m "feat(frontend): home sections read Strapi content"
```

---

### Task 11: Diploma viewer from Strapi

**Files:**
- Modify: `frontend/src/components/DiplomaViewer.jsx`
- Modify: `frontend/src/shared/DiplomaThumbnails.jsx:89`
- Modify: `frontend/src/shared/DiplomaModal.jsx:153`

**Step 1: `DiplomaViewer.jsx`**
- Delete `DIPLOMA_LANGUAGES` (lines 6-13) and the `import.meta.glob` `useMemo` (lines 43-61).
- Imports: add `import { useContent } from "../hooks/useContent";` and `import { mediaUrl } from "../utils/media";`
- State and data (replace `const [language, setLanguage] = useState("English");`):
  ```jsx
  const { diplomas, diplomaLanguages } = useContent();
  const [languageId, setLanguageId] = useState(diplomaLanguages[0]?.documentId);
  const language = diplomaLanguages.find((l) => l.documentId === languageId) ?? diplomaLanguages[0];

  // Students that have a version in the selected language, in diploma order
  const diplomaImages = useMemo(
    () =>
      diplomas.flatMap(({ studentName, versions }) => {
        const version = versions.find((v) => v.language?.documentId === language?.documentId);
        return version
          ? [{
              name: studentName,
              src: mediaUrl(version.image, "large"),
              thumb: mediaUrl(version.image, "thumbnail"),
              full: version.image.url,
            }]
          : [];
      }),
    [diplomas, language],
  );
  ```
- `const currentDiploma = diplomaImages[Math.min(currentIndex, diplomaImages.length - 1)];`
  (a language can have fewer diplomas than the previous one)
- Button label: `{language?.name}`
- Dropdown list:
  ```jsx
  {diplomaLanguages.map((lang) => (
    <li key={lang.documentId}>
      <button
        role="option"
        aria-selected={lang.documentId === language?.documentId}
        onClick={() => {
          setLanguageId(lang.documentId);
          setIsDropdownOpen(false);
        }}
        className={cn(
          "w-full text-left px-5 py-3 text-base transition-colors hover:bg-gray-800",
          lang.documentId === language?.documentId ? "text-white" : "text-gray-300",
        )}
      >
        {lang.name}
      </button>
    </li>
  ))}
  ```

**Step 2:** `DiplomaThumbnails.jsx:89` → `src={diploma.thumb ?? diploma.src}` and add `loading="lazy"`.
`DiplomaModal.jsx:153` → `src={diploma?.full ?? diploma?.src}`.

**Step 3: Verify**: the dropdown lists 8 languages in admin order. Switching to Deutsch changes the main
image and thumbnails to German. The thumbnails load `thumbnail_*` files (DevTools → Network). The modal
loads the original.

**Step 4: Commit**
```bash
git add frontend/src && git commit -m "feat(frontend): diploma viewer reads Strapi diplomas"
```

---

### Task 12: Lists: photos, stats, sponsors/partners, FAQ, footer, exhibitions

**Files:**
- Modify: `frontend/src/components/ExhibitionsSlider.jsx`
- Modify: `frontend/src/components/AchievementsGrid.jsx`
- Create: `frontend/src/shared/LogoSection.jsx`
- Delete: `frontend/src/components/SponsorsSection.jsx`, `frontend/src/components/PartnersSection.jsx`
- Modify: `frontend/src/components/Main.jsx` (sponsors/partners)
- Modify: `frontend/src/components/FAQSection.jsx`
- Modify: `frontend/src/components/Footer.jsx`
- Modify: `frontend/src/hooks/useExhibitions.js`
- Modify: `frontend/src/pages/Exhibitions.jsx:224-229`

**Step 1: `ExhibitionsSlider.jsx`**: delete `CAPTIONS` and the glob `useMemo`:
```jsx
import { useCallback, useRef } from "react";
import { useContent } from "../hooks/useContent";
import { mediaUrl } from "../utils/media";
// ...
  const { home, exhibitionPhotos } = useContent();
  const photos = exhibitionPhotos.map((p) => ({ src: mediaUrl(p.image, "medium"), caption: p.caption }));
```
The heading becomes `{home.photosHeading}`.

**Step 2: `AchievementsGrid.jsx`**: replace `STATS` with an icon map:
```jsx
import { useContent } from "../hooks/useContent";

// Keys match the Stat.icon enum in Strapi
const ICONS = {
  diploma: DiplomaScrollIcon,
  media: MediaMentionsIcon,
  exhibitions: ExhibitionsIcon,
  world: WorldMapIcon,
  team: TeamMembersIcon,
  fund: EndowmentFundIcon,
};

export const AchievementsGrid = () => {
  const { stats } = useContent();
  // ...
  {stats.map((stat) => {
    const Icon = ICONS[stat.icon];
    return (
      <div key={stat.documentId} className="flex flex-col justify-between h-full">
        {/* same markup; <stat.Icon …/> becomes <Icon …/> */}
      </div>
    );
  })}
```

**Step 3: `LogoSection.jsx`**: one component for sponsors and partners (it replaces the placeholder rows):
```jsx
import { Fragment } from "react";
import { cn } from "../utils/utils";
import { mediaUrl } from "../utils/media";

// Box per Strapi `size` value; partners are shown larger than sponsors (as in the Figma placeholders)
const SIZES = {
  sponsors: {
    wide: "h-[48px] mobile-sm:h-[56px] tablet:h-[64px] w-[100px] mobile-sm:w-[120px] tablet:w-[140px] tablet-md:w-[160px]",
    square: "w-[60px] h-[60px] mobile-sm:w-[70px] mobile-sm:h-[70px] tablet:w-[80px] tablet:h-[80px]",
    text: "h-[48px] w-[140px] mobile-sm:w-[160px] tablet:w-[180px]",
    bordered: "border border-white/30 p-2 w-[120px] h-[64px] mobile-sm:w-[140px] mobile-sm:h-[72px] tablet:w-[160px] tablet:h-[80px]",
  },
  partners: {
    wide: "h-[56px] mobile-sm:h-[64px] tablet:h-[72px] w-[140px] mobile-sm:w-[160px] tablet:w-[220px] tablet-md:w-[260px]",
    square: "w-[72px] h-[72px] tablet:w-[88px] tablet:h-[88px]",
    text: "h-[56px] mobile-sm:h-[64px] tablet:h-[72px] w-[140px] mobile-sm:w-[160px] tablet:w-[200px]",
    bordered: "border border-white/30 p-2 w-[140px] h-[64px] mobile-sm:w-[160px] mobile-sm:h-[72px] tablet:w-[200px] tablet:h-[80px]",
  },
};

export const LogoSection = ({ heading, items, variant, className }) => {
  if (!items.length) return null;

  return (
    <section className={cn("w-full text-theme-text", className)}>
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4 py-(--section-space)">
        <h2
          className="font-heading font-normal uppercase leading-none mb-8 tablet:mb-12
            text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]"
        >
          {heading}
        </h2>

        <div className="flex flex-wrap gap-5 tablet:gap-8 tablet-md:gap-10 items-center">
          {items.map((item) => {
            const logo = (
              <img
                src={mediaUrl(item.logo, "small")}
                alt={item.name}
                loading="lazy"
                className={cn("flex-shrink-0 object-contain", SIZES[variant][item.size])}
              />
            );
            return item.url ? (
              <a key={item.documentId} href={item.url} target="_blank" rel="noopener noreferrer">
                {logo}
              </a>
            ) : (
              <Fragment key={item.documentId}>{logo}</Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};
```
In `Main.jsx`: remove the `SponsorsSection`/`PartnersSection` imports, import `LogoSection`, use
`const { home, global, sponsors, partners } = useContent();`, and replace the two elements with:
```jsx
<LogoSection heading={home.sponsorsHeading} items={sponsors} variant="sponsors" className="bg-theme-bg" />
<LogoSection heading={home.partnersHeading} items={partners} variant="partners" className="bg-theme-bg-grey" />
```
Delete `SponsorsSection.jsx` and `PartnersSection.jsx`.

**Step 4: `FAQSection.jsx`**: delete `FAQ_ITEMS`:
```jsx
import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";
// ...
  const { home, faqs } = useContent();
  const [openId, setOpenId] = useState(faqs[0]?.documentId);
```
- The three heading `<span>`s become `{home.faqHeading?.split("\n").map((line) => <span key={line}>{line}</span>)}`
- `item.id` → `item.documentId` (key, toggle, compare)
- The answer `<p>` becomes:
  ```jsx
  <RichText
    blocks={item.answer}
    className="pb-5 tablet:pb-6 text-[13px] tablet:text-[15px] leading-relaxed text-theme-text-muted"
  />
  ```

**Step 5: `Footer.jsx`**: move the 5 SVG paths into a map keyed by platform and render from `global`:
```jsx
import { useContent } from '../hooks/useContent';

// Keys match the social-link `platform` enum in Strapi; path data unchanged from the old markup
const SOCIAL_ICONS = {
  instagram: { label: 'Instagram', path: 'M12 2.163c3.204 …' },
  facebook: { label: 'Facebook', path: 'M24 12.073c0-6.627 …' },
  linkedin: { label: 'LinkedIn', path: 'M20.447 20.452h-3.554 …' },
  tiktok: { label: 'TikTok', path: 'M12.525.02c1.31-.02 …' },
  x: { label: 'X (Twitter)', path: 'M18.244 2.25h3.308 …' },
};
```
(copy each full `d` string from the current `<path>` elements). Then, inside the component:
```jsx
const { global } = useContent();
// email link
<a href={`mailto:${global.contactEmail}`} className="…unchanged…">{global.contactEmail?.toUpperCase()}</a>
// socials
<div className="flex space-x-4 tablet:space-x-8 mt-6">
  {global.socialLinks?.map(({ platform, url }) => (
    <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
      className="text-white hover:text-brand-red transition-colors" aria-label={SOCIAL_ICONS[platform].label}>
      <svg className="w-6 h-6 tablet:w-10 tablet:h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d={SOCIAL_ICONS[platform].path} />
      </svg>
    </a>
  ))}
</div>
// copyright
<p>{global.copyright}</p>
```

**Step 6: `useExhibitions.js`**: exhibitions come from content, with `mapId`/`coordinates` added at build time:
```js
import { useMemo } from "react";
import { useContent } from "./useContent";
import { useLanguage } from "./useLanguage";

// "UA" → 🇺🇦 (each letter maps to its regional indicator symbol)
const flagOf = (code) =>
  String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));

// Groups exhibitions by country, keyed by TopoJSON numeric id (what WorldMap expects)
export const useExhibitions = () => {
  const { currentLanguage } = useLanguage();
  const { exhibitions } = useContent();

  const exhibitionsByCountry = useMemo(() => {
    const names = new Intl.DisplayNames([currentLanguage], { type: "region" });
    const byCountry = new Map();

    for (const exhibition of exhibitions) {
      const { mapId, coordinates } = exhibition;
      if (!byCountry.has(mapId)) {
        byCountry.set(mapId, {
          name: names.of(exhibition.country),
          flag: flagOf(exhibition.country),
          isoAlpha2: exhibition.country,
          coordinates,
          exhibitions: [],
          count: 0,
        });
      }
      const country = byCountry.get(mapId);
      country.exhibitions.push(exhibition);
      country.count++;
    }

    return byCountry;
  }, [currentLanguage, exhibitions]);

  return { exhibitionsByCountry, isLoading: false };
};
```

**Step 7: `Exhibitions.jsx`**: add `const { exhibitionsPage } = useContent();` (import `useContent`).
The `<h1>` becomes `{exhibitionsPage.heading}` and the subtitle `<p>` becomes `{exhibitionsPage.subtitle}`.

**Step 8: Verify**: home: the slider shows 6 photos with captions, the stats grid shows 6 items with the right icons,
sponsors/partners are hidden (none in Strapi yet), FAQ has 3 items with the first one open, and the footer shows the email,
5 socials and ©2026. `/exhibitions`: same venues as before, the map has dots on the same countries, and `?country=UA` filters.
In Strapi, add a sponsor (PNG logo, size `square`) → Publish → restart dev: the Sponsors section appears with the logo.

**Step 9: Commit**
```bash
git add -A frontend/src && git commit -m "feat(frontend): lists and footer read Strapi content"
```

---

### Task 13: Remove hardcoded content, unused deps, add cache headers

**Files:**
- Delete: `frontend/src/constants/exhibitions.js`, `frontend/src/config/actionBlockTitles.js`
- Delete: `frontend/src/assets/diplomas_en_version/`, `frontend/src/assets/photo-slider/`, `frontend/src/assets/ParralaxQuotImage.avif`
- Create: `frontend/public/_headers`
- Modify: `frontend/package.json` (dependencies)

**Step 1: Confirm nothing imports them**
```bash
cd frontend && grep -rn "constants/exhibitions\|actionBlockTitles\|diplomas_en_version\|photo-slider\|ParralaxQuotImage\|axios\|@wix" src
```
Expected: no output. (`backend/scripts/import.mjs` imports the first two. It is a one-off that has already run,
so delete `import.mjs` too, or keep it and accept that it no longer runs. Recommendation: delete it; the history has it.)

**Step 2: Delete the files above, then remove the unused runtime deps**
```bash
npm uninstall axios @wix/data @wix/sdk
```
(`download-diplomas.mjs` uses the root `package.json`, not the frontend one.)

**Step 3: `public/_headers`** (Cloudflare Pages). Vite's `/assets/*` and Strapi's `/uploads/*` names both
contain a content hash, so they never change:
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/uploads/*
  Cache-Control: public, max-age=31536000, immutable
```
`index.html` keeps Cloudflare's default (revalidated on every visit).

**Step 4: Verify**: `npm run lint && npm test && npm run build`. All three pass and `dist/` contains
`_headers`, `uploads/` and one `assets/<locale>-<hash>.js` chunk per locale.

**Step 5: Commit**
```bash
git add -A frontend backend/scripts && git commit -m "chore(frontend): drop hardcoded content and unused deps; cache headers"
```

---

### Task 14: End-to-end verification

**Step 1:** `cd frontend && npm run build && npm run preview`. With DevTools → Network open, load `/`:
- no request goes to `localhost:1337`
- one `en-*.js` content chunk
- diploma thumbnails are `thumbnail_*` files
Reload: `assets/*` and `uploads/*` come from the cache.

**Step 2:** Switch through all 6 languages on `/` and `/exhibitions`. No blank sections, no console errors,
and only one new content chunk per language.

**Step 3:** Stop Strapi (`Ctrl+C`, then `npm run db:down`) and run `npm run preview` again. The site still works fully.

**Step 4:** Run `npm test` in both `backend/` and `frontend/`. All pass.

---

### Task 15: Update docs

**Files:**
- Modify: `CLAUDE.md`
- Modify: `docs/plans/2026-09-23-strapi-content-model-design.md` (mark as implemented; note the custom endpoint
  instead of per-type REST, the Mission section left out because it's commented out in `Main.jsx`, and the
  single donate URL)

**CLAUDE.md changes:**
- Project overview: the repo now has `backend/` (Strapi 5 + MySQL in Docker) and `frontend/`.
- Commands: `backend`: `npm run db:up`, `npm run develop`, `npm test`. `frontend`: `npm run content`, and a
  note that `dev`/`build` fetch content first.
- Replace the "API layer" bullet: there is no runtime API. `scripts/fetch-content.mjs` writes
  `src/content/<locale>.json` and `public/uploads/`, and components read them with `useContent()`.
- Routes: `/` and `/exhibitions` (the achievements route is gone).
- Environment: `frontend/.env` has `STRAPI_URL` and `STRAPI_TOKEN` (a read-only token, used only by the build).
- Adding content: always in Strapi. Adding a new *field* means editing the schema.json, the
  `site-content` controller if it needs populating, and the component.

**Commit**
```bash
git add CLAUDE.md docs/plans && git commit -m "docs: document Strapi static content flow"
```

---

## Not in this plan (next plan: production deploy)

- VPS with Strapi + MySQL in Docker (+ Caddy for HTTPS), backups of the MySQL volume and `public/uploads`
- Cloudflare Pages project (build: `npm run build` in `frontend/`, env `STRAPI_URL`, `STRAPI_TOKEN`)
- Strapi webhook (entry publish/unpublish/delete, media update) → Cloudflare Pages deploy hook
- Translating UI labels (buttons, nav) into repo JSON for i18next
- Real social URLs, host-exhibition form URL, donate URL, sponsor/partner logos: entered by admins in Strapi
