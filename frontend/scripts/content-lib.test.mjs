import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slim } from './content-lib.mjs';

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
