import { useState, useEffect, startTransition } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, JAPAN_PATH } from '../constants/languages';
import { LanguageContext } from './Language.context';

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onJapanPage = pathname === JAPAN_PATH;
  const [savedLanguage, setSavedLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
      return savedLanguage;
    }
    return 'en';
  });
  const currentLanguage = onJapanPage ? 'ja' : savedLanguage;

  useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const changeLanguage = (languageCode) => {
    localStorage.setItem('language', languageCode);
    // Transition: keep the current page on screen while the new locale's content chunk loads
    startTransition(() => {
      setSavedLanguage(languageCode);
      if (languageCode === 'ja') navigate(JAPAN_PATH);
      else if (onJapanPage) navigate('/');
    });
  };

  if (savedLanguage === 'ja' && !onJapanPage) return <Navigate to={JAPAN_PATH} replace />;

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
