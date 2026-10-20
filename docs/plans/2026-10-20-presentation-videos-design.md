# Presentation videos — design

Goal: show a non-technical team what is ready in the React rewrite (not deployed yet) and how content is managed in Strapi. Output lives in `presentation/` at the repo root.

## Deliverables

```
presentation/
  record-site.mjs      # Playwright: desktop / tablet / mobile clips
  record-strapi.mjs    # Playwright: Strapi walkthrough with captions
  assemble.sh          # ffmpeg: device frames, fades, concat
  clips/               # raw .webm recordings
  site-demo.mp4        # no text, no sound, ~3–4 min
  strapi-demo.mp4      # Ukrainian captions, no sound, ~2–2.5 min
```

Playwright runs via `npx` — no changes to `frontend/package.json`. Recording is fully automated so videos can be re-shot when the site changes. Playwright doesn't render a cursor, so a small fake cursor (dot + click pulse) is injected into the page.

## Video 1 — site (English, no text, no audio)

No comparison with the original site. Only already-working links are clicked; external links and unbuilt pages (`/achievements`, `/donate`, `/unissued-diplomas`, mailto, sponsor logos) are skipped.

1. **Desktop 1440×900 (~2 min)**
   - Hero pause → language dropdown: uk → ja → en.
   - Smooth scroll with stops: DiplomaViewer (diploma language dropdown, 2 thumbnails, open modal, prev/next, close); exhibitions slider arrows; map hover tooltip → click country → `/exhibitions?country=…`.
   - `/exhibitions`: country chips, chip arrows, "All", scroll list.
   - Back home → menu link to `/#faq` → expand 2 questions → scroll to Donate, sponsors, footer.
2. **Tablet 820×1180 in iPad frame (~40 s)**: full scroll, map, diploma modal.
3. **Mobile 390×844 in iPhone frame (~40 s)**: burger menu, language, scroll, slider, FAQ.

Scenes are joined with fade-through-black on a dark background.

## Video 2 — Strapi (Ukrainian captions)

Captions are an overlay element injected into the admin page during recording (no ffmpeg text rendering).

1. Login — «Strapi: панель, де команда сама редагує весь вміст сайту — без програміста».
2. Content overview: Exhibitions, Diplomas, FAQ, Sponsors — «Кожен розділ сайту має свою таблицю».
3. Edit an exhibition (fields, photo, country) and a diploma (language versions + images), no save — «Фото завантажуються перетягуванням».
4. Locales en → uk → ja on one entry — «Немає перекладу — сайт покаже англійську».
5. Change → site (split screen): edit Home hero title, save/publish, `npm run content`, site shows the new title — «Зміни з'являються на сайті після оновлення». The script stores the original value first and reverts it afterwards (revert is not recorded).
6. Closing caption — «Все, що ви бачили на сайті, редагується тут».

## Constraints

- Admin credentials only from env: `STRAPI_ADMIN_EMAIL`, `STRAPI_ADMIN_PASSWORD`. Never written to files.
- Requires running: MySQL (`npm run db:up`), Strapi (`npm run develop`), frontend dev server.
- Revert of the hero title must run even if a later step fails (`finally`).
