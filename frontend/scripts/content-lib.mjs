// Pure transforms applied to /api/site-content responses at build time.
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
