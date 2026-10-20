// Pure transforms applied to /api/site-content responses at build time.
import countries from 'i18n-iso-countries';
import { feature } from 'topojson-client';
import { geoCentroid } from 'd3-geo';

const isEmpty = (v) => v == null || v === '' || (Array.isArray(v) && v.length === 0);

// Field-level fallback: a translated field wins unless it is empty.
// `xMobileTitle` is an optional override of `xTitle`, so a missing one reuses the same-locale `xTitle` before English.
export const mergeEntry = (en, loc) => {
  if (!loc) return en;
  if (!en) return loc;
  const out = { ...en };
  for (const [key, value] of Object.entries(loc)) {
    const sameLocaleTitle = key.endsWith('MobileTitle') ? loc[key.replace('MobileTitle', 'Title')] : null;
    if (!isEmpty(value)) out[key] = value;
    else if (!isEmpty(sameLocaleTitle)) out[key] = sameLocaleTitle;
  }
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
