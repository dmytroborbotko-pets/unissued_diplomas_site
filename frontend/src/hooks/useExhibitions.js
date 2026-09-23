import { useMemo } from "react";
import { useContent } from "./useContent";
import { useLanguage } from "./useLanguage";

// "UA" → 🇺🇦 (each letter maps to its regional indicator symbol)
const flagOf = (code) =>
  String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));

// Groups exhibitions by country, keyed by TopoJSON numeric id (what WorldMap expects).
// `mapId` and `coordinates` are added at build time by scripts/fetch-content.mjs.
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
