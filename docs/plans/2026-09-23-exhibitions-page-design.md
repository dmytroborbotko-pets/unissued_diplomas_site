# Exhibitions page — design

## Data model (future Strapi collection `Exhibition`, i18n enabled)

| Field     | Type   | Required | Localized | Notes |
|-----------|--------|----------|-----------|-------|
| country   | string | yes      | no        | ISO 3166-1 alpha-2 (`"UA"`) |
| city      | string | yes      | yes       | |
| venue     | string | yes      | yes       | |
| startDate | date   | yes      | no        | |
| endDate   | date   | no       | no        | `null` → single day (unless `dateNote`) |
| hours     | string | no       | yes       | free text, e.g. `Mon–Wed 9AM–9PM` |
| dateNote  | string | no       | yes       | replaces the range end: `TBA`, `mid-Mar`, `ongoing` |
| url       | string | no       | no        | |

Derived on the frontend, never stored: country name + flag (`Intl.DisplayNames` / regional
indicators), year, status (upcoming / now open / past), per-country counts.
Map geometry (`COUNTRY_GEO`: ISO → TopoJSON numeric id + coordinates) stays a frontend constant.

## Page (`/exhibitions`)

1. Hero: title, stats line (countries · venues), lazy `WorldMap` on tablet+.
2. Sticky chip bar: `All` + flag chip per country (sorted by count). Reads/writes `?country=`.
   Map clicks already navigate to `?country=XX`, so they filter too.
3. Country sections: sticky left column (flag, name, venue count), venue rows on the right
   (city, venue link ↗, dates · hours, status badge). Single column on mobile.
4. Unknown `?country=` → empty state with "Show all".

Deferred: map highlight of the selected country, search, year chips (until >1 year exists).
