import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const { WIX_CLIENT_ID, WIX_CLIENT_SECRET } = process.env;
if (!WIX_CLIENT_ID || !WIX_CLIENT_SECRET) {
  console.error('Set WIX_CLIENT_ID and WIX_CLIENT_SECRET env vars.');
  process.exit(1);
}

const COLLECTION = 'Diplomaphoto';
const OUT_DIR = './downloads';

const client = createClient({
  modules: { items },
  auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, clientSecret: WIX_CLIENT_SECRET }),
});

// Media items carry `src` as a `wix:image://v1/<id>/<encoded-filename>` URI.
function resolveUrl(media) {
  const raw = media?.src;
  if (!raw) return null;
  if (raw.startsWith('wix:image://')) {
    const id = raw.replace('wix:image://v1/', '').split('/')[0];
    return `https://static.wixstatic.com/media/${id}`;
  }
  return raw;
}

function safeName(name, fallback) {
  return (name || fallback).replace(/[/\\?%*:|"<>]/g, '-');
}

async function downloadAll() {
  let result = await client.items.query(COLLECTION).find();
  let count = 0;

  while (true) {
    for (const row of result.items) {
      const lang = safeName(row.language, row._id);
      const dir = path.join(OUT_DIR, lang);
      await mkdir(dir, { recursive: true });

      const photos = row.diploma ?? [];
      for (const [i, photo] of photos.entries()) {
        const url = resolveUrl(photo);
        if (!url) continue;
        const filename = safeName(photo.title, `${i + 1}.jpg`);
        const res = await fetch(url);
        if (!res.ok) {
          console.error(`Failed ${url}: ${res.status}`);
          continue;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        await writeFile(path.join(dir, filename), buf);
        count++;
      }
    }

    if (!result.hasNext()) break;
    result = await result.next();
  }

  console.log(`Downloaded ${count} files into ${OUT_DIR}/`);
}

downloadAll();
