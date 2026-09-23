import { useMemo } from "react";
import { EXHIBITIONS, COUNTRY_GEO } from "../constants/exhibitions";
import { useLanguage } from "./useLanguage";

// "UA" → 🇺🇦 (each letter maps to its regional indicator symbol)
const flagOf = (code) =>
  String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));

// Groups exhibitions by country, keyed by TopoJSON numeric id (what WorldMap expects)
export const useExhibitions = () => {
  const { currentLanguage } = useLanguage();

  const exhibitionsByCountry = useMemo(() => {
    const names = new Intl.DisplayNames([currentLanguage], { type: "region" });
    const byCountry = new Map();

    for (const exhibition of EXHIBITIONS) {
      const { id, coordinates } = COUNTRY_GEO[exhibition.country];
      if (!byCountry.has(id)) {
        byCountry.set(id, {
          name: names.of(exhibition.country),
          flag: flagOf(exhibition.country),
          isoAlpha2: exhibition.country,
          coordinates,
          exhibitions: [],
          count: 0,
        });
      }
      const country = byCountry.get(id);
      country.exhibitions.push(exhibition);
      country.count++;
    }

    return byCountry;
  }, [currentLanguage]);

  return { exhibitionsByCountry, isLoading: false };
};
