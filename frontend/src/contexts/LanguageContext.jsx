import { useState, useEffect, startTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { LanguageContext } from './Language.context';

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
      return savedLanguage;
    }
    return 'en';
  });

  useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const changeLanguage = (languageCode) => {
    // Transition: keep the current language on screen while the new locale's content chunk loads
    startTransition(() => setCurrentLanguage(languageCode));
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
