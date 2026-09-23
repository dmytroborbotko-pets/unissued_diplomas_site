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
