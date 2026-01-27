import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language resources will be loaded from Strapi
const resources = {
  en: { translation: {} },
  uk: { translation: {} },
  de: { translation: {} },
  it: { translation: {} },
  ja: { translation: {} },
  es: { translation: {} },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
