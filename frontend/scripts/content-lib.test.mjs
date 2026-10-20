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

test('mergeEntry: a missing mobile title falls back to the same-locale title before English', () => {
  const en = { hostBlockTitle: 'GUIDE', hostBlockMobileTitle: 'GUIDE (mobile)', donateBlockTitle: 'DONATE', donateBlockMobileTitle: 'DONATE (mobile)' };
  const de = { hostBlockTitle: 'LEITFADEN', hostBlockMobileTitle: null, donateBlockTitle: null, donateBlockMobileTitle: null };
  const merged = mergeEntry(en, de);
  assert.equal(merged.hostBlockMobileTitle, 'LEITFADEN');
  assert.equal(merged.donateBlockMobileTitle, 'DONATE (mobile)'); // nothing translated → English as usual
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
