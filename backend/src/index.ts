import type { Core } from '@strapi/strapi';

// Site UI locales besides the default `en` (must match frontend/src/constants/languages.js)
const LOCALES = [
  ['uk', 'Ukrainian (uk)'],
  ['de', 'German (de)'],
  ['it', 'Italian (it)'],
  ['ja', 'Japanese (ja)'],
  ['es', 'Spanish (es)'],
];

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const locales = strapi.plugin('i18n').service('locales');
    const existing = new Set((await locales.find()).map((locale: { code: string }) => locale.code));
    for (const [code, name] of LOCALES) {
      if (!existing.has(code)) await locales.create({ code, name });
    }
  },
};
