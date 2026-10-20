import { use } from "react";
import { useLanguage } from "./useLanguage";

// Site texts: one lazy chunk per language (src/texts, copied from the old site); ja has no Home texts (/jp is standalone) → en.
// Diplomas: src/content/diplomas.json, generated from Strapi by scripts/fetch-content.mjs.
const texts = import.meta.glob(["../texts/*.json", "!../texts/jp.json"], { import: "default" });
const diplomas = import("../content/diplomas.json").then((m) => m.default);
const cache = new Map();

const load = (lang) => {
  if (!cache.has(lang)) {
    const loadTexts = texts[`../texts/${lang}.json`] ?? texts["../texts/en.json"];
    cache.set(lang, Promise.all([loadTexts(), diplomas]).then(([t, d]) => ({ ...t, ...d })));
  }
  return cache.get(lang);
};

export const useContent = () => use(load(useLanguage().currentLanguage));
