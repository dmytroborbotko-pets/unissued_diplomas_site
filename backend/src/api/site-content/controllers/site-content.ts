import type { Core } from '@strapi/strapi';

// Everything the static build needs for one locale, in one response.
// Localized types are returned as stored; the frontend build merges the English fallback.
export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: any) {
    const locale = String(ctx.query.locale ?? 'en');
    const published = { status: 'published' as const };
    const list = (uid: any, params: any = {}) =>
      strapi.documents(uid).findMany({ ...published, sort: 'order:asc', ...params });
    const single = (uid: any, params: any = {}) =>
      strapi.documents(uid).findFirst({ ...published, locale, populate: '*', ...params });

    const [home, global, exhibitionsPage, exhibitions, diplomas, diplomaLanguages, sponsors, partners, faqs, exhibitionPhotos, stats] =
      await Promise.all([
        single('api::home.home'),
        single('api::global.global'),
        single('api::exhibitions-page.exhibitions-page'),
        list('api::exhibition.exhibition', { sort: 'startDate:asc' }),
        list('api::diploma.diploma', { populate: { versions: { populate: ['language', 'image'] } } }),
        list('api::diploma-language.diploma-language'),
        list('api::sponsor.sponsor', { populate: ['logo'] }),
        list('api::partner.partner', { populate: ['logo'] }),
        list('api::faq.faq', { locale }),
        list('api::exhibition-photo.exhibition-photo', { locale, populate: ['image'] }),
        list('api::stat.stat', { locale }),
      ]);

    ctx.body = { home, global, exhibitionsPage, exhibitions, diplomas, diplomaLanguages, sponsors, partners, faqs, exhibitionPhotos, stats };
  },
});
