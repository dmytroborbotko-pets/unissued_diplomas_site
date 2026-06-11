import { useState, useRef } from 'react';
import smallLogo from '../assets/small_logo.png';
import { Link } from 'react-router-dom';
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

export default function Header() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const headerRef = useRef(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const isScrollingDown = latest > previous && latest > 350;
    headerRef.current.style.transform = isScrollingDown ? 'translateY(-100%)' : 'translateY(0)';
    if (isScrollingDown) setIsLangDropdownOpen(false);
  });

  return (
    <header ref={headerRef} className="fixed top-0 w-full bg-theme-bg z-50 transition-transform duration-300">
      <div className="max-w-[1080px] mx-auto px-3 tablet-md:px-4">
        <div className="flex items-center justify-between h-16 tablet-md:h-20">

          {/* Mobile: hamburger | Desktop: Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="tablet-md:hidden text-white cursor-pointer flex flex-col justify-center items-center w-6 h-6 gap-[5px]"
            >
              <motion.span
                className="block w-6 h-[2px] bg-white origin-center"
                animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.125, ease: 'easeInOut' }}
              />
              <motion.span
                className="block w-6 h-[2px] bg-white"
                animate={isMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.1, ease: 'easeInOut' }}
              />
              <motion.span
                className="block w-6 h-[2px] bg-white origin-center"
                animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.125, ease: 'easeInOut' }}
              />
            </button>
            <Link to="/" className="hidden tablet-md:block">
              <img src={smallLogo} alt="Unissued Diplomas" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Mobile: centered logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 tablet-md:hidden">
            <img src={smallLogo} alt="Unissued Diplomas" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden tablet-md:flex items-center space-x-12">
            <a href="#about" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em] whitespace-nowrap">
              About the Project
            </a>
            <a href="#exhibitions" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em] whitespace-nowrap">
              All Exhibitions
            </a>
            <a href="#donate" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em] whitespace-nowrap">
              Donations
            </a>
            <a href="#faq" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em] whitespace-nowrap">
              FAQ
            </a>
            <a href="#contacts" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em] whitespace-nowrap">
              Contacts
            </a>
          </nav>

          {/* Language Dropdown (both mobile & desktop) */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center justify-center gap-3 tablet-md:gap-5 tablet-md:w-[97px] bg-brand-black/90 px-3 tablet-md:px-4 py-3 text-white uppercase text-[14px] tracking-[0.03em] transition-colors cursor-pointer hover:bg-[var(--color-theme-bg-grey)]"
            >
              {currentLanguage.toUpperCase()}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 top-full bg-black border border-white shadow-lg min-w-full">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 transition-colors uppercase text-[14px] tracking-[0.03em] cursor-pointer hover:bg-[var(--color-theme-bg-grey)] ${
                      currentLanguage === lang.code ? 'text-brand-red' : 'text-white'
                    }`}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Menu — inside header so it inherits translateY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="tablet-md:hidden absolute top-full left-0 w-full bg-theme-bg border-t border-gray-800 px-3 py-6 overflow-hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <nav className="flex flex-col space-y-6">
              <a href="#about" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em]" onClick={() => setIsMenuOpen(false)}>
                About the Project
              </a>
              <a href="#exhibitions" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em]" onClick={() => setIsMenuOpen(false)}>
                All Exhibitions
              </a>
              <a href="#donate" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em]" onClick={() => setIsMenuOpen(false)}>
                Donations
              </a>
              <a href="#faq" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em]" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </a>
              <a href="#contacts" className="text-white hover:text-brand-red transition-colors uppercase text-[14px] tracking-[0.03em]" onClick={() => setIsMenuOpen(false)}>
                Contacts
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
