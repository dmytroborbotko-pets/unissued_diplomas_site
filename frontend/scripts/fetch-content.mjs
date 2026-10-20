// Pulls the diplomas from Strapi into src/content/diplomas.json and their images into public/uploads/.
// Site texts are not in Strapi: they live in src/texts/<lang>.json.
// Runs before `dev` (--allow-stale: keep old content if Strapi is down) and `build` (strict).
import { access, mkdir, writeFile } from 'node:fs/promises';
import { slim } from './content-lib.mjs';

const { STRAPI_URL = 'http://localhost:1337', STRAPI_TOKEN } = process.env;
const CONTENT_DIR = new URL('../src/content/', import.meta.url);
const OUT = new URL('diplomas.json', CONTENT_DIR);
const PUBLIC_DIR = new URL('../public/', import.meta.url);
const exists = (url) => access(url).then(() => true, () => false);

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
  const res = await fetch(`${STRAPI_URL}/api/site-content?locale=en`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });
  if (!res.ok) throw new Error(`site-content: HTTP ${res.status}`);
  const { diplomas, diplomaLanguages } = await res.json();

  const urls = new Set();
  await mkdir(CONTENT_DIR, { recursive: true });
  await writeFile(OUT, JSON.stringify(slim({ diplomas, diplomaLanguages }, urls)));

  const queue = [...urls];
  await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await download(queue.pop()); }));
  console.log(`content: ${diplomas.length} diplomas, ${urls.size} files`);
} catch (err) {
  if (process.argv.includes('--allow-stale') && (await exists(OUT))) {
    console.warn(`⚠ content not refreshed, using existing files (${err.message})`);
  } else {
    console.error(err);
    process.exit(1);
  }
}
