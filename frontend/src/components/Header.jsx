import { useState, useRef } from 'react';
import smallLogo from '../assets/small_logo.png';
import { Link } from 'react-router-dom';
import { useScroll, useMotionValueEvent, motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useContent } from '../hooks/useContent';

// The logo also works as "back to top" when it links to the current page (/jp with Japanese saved redirects back)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// `links` and `cta` (donate button) let the /jp page reuse the header with its own nav
export default function Header({ links, cta }) {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const { nav, mobileMenu, layout } = useContent();
  const [isSubOpen, setIsSubOpen] = useState(true);
  // Same menu as the old site: about, exhibition list, 2023 results, FAQ, contacts
  const NAV_LINKS = links ?? ['/#about', '/#exhibitions', '/2023-achievements', '/#faq', '/#contacts'].map((to, i) => ({ to, label: nav[i] }));
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
    <header
      ref={headerRef}
      style={{ "--mh": `${layout.m.header}px` }}
      className="fixed top-0 w-full bg-theme-bg-grey tablet-md:bg-theme-bg z-50 transition-transform duration-300"
    >
      {/* Phones: the old mobile bar (73-77px, burger left, logo centered, language right) */}
      <div className="max-w-[1080px] mx-auto pl-[15px] pr-[25px] tablet-md:px-4">
        <div className="flex items-center justify-between h-(--mh) tablet-md:h-20">

          {/* Mobile: hamburger | Desktop: Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open navigation menu"
              className="tablet-md:hidden text-white cursor-pointer flex flex-col justify-center items-center w-[50px] h-[50px] gap-[5px]"
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
            <Link to="/" onClick={scrollToTop} className="hidden tablet-md:block">
              <img src={smallLogo} alt="Unissued Diplomas" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Mobile: centered logo */}
          <Link to="/" onClick={scrollToTop} className="absolute left-1/2 -translate-x-1/2 tablet-md:hidden">
            <img src={smallLogo} alt="Unissued Diplomas" className="w-[26px] h-[30px] object-contain" />
          </Link>

          {/* Desktop Navigation */}
          {/* Home menu: items where the old page placed them (texts `layout.nav`: [x from center, top, width]) */}
          <nav className={cta ? "hidden tablet-md:flex items-center space-x-12" : "hidden tablet-md:block absolute inset-0"}>
            {NAV_LINKS.map(({ to, label }, i) => {
              const [x, y, w] = layout.nav.items[i];
              return (
                <Link
                  key={to}
                  to={to}
                  style={cta ? undefined : { left: `calc(50% + ${x}px)`, top: y, maxWidth: w, fontSize: layout.nav.fs, lineHeight: 1.5, letterSpacing: layout.nav.fs === 16 ? "0.05em" : "0.03em" }}
                  className={`${cta ? "text-[14px] whitespace-pre" : "absolute whitespace-pre-line"} text-[#ebebeb] hover:text-brand-red transition-colors uppercase tracking-[0.03em] text-center`}
                >
                  {label}
                </Link>
              );
            })}
            {cta && (
              <a href={cta.href} target="_blank" rel="noopener noreferrer" className="bg-theme-primary-dark hover:bg-theme-primary transition-colors text-white text-[14px] tracking-[0.03em] whitespace-nowrap px-8 py-2">
                {cta.label}
              </a>
            )}
          </nav>

          {/* Language Dropdown (both mobile & desktop) */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center justify-center gap-[14px] tablet-md:gap-5 tablet-md:w-[97px] px-0 tablet-md:px-4 py-3 text-white uppercase text-[12px] tablet-md:text-[14px] tracking-[0.03em] transition-colors cursor-pointer hover:bg-[var(--color-theme-bg-grey)]"
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

      {/* Phones: the old full-screen menu. English has "Home" with section links; translations have two items */}
      {isMenuOpen && (
        <div className="tablet-md:hidden fixed inset-0 z-50 bg-theme-bg-grey text-[#ebebeb] px-[15px] pt-[15px] overflow-y-auto">
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close navigation menu" className="w-[34px] h-[34px] flex items-center justify-center cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.6"><path d="M2 2l16 16M18 2L2 18" /></svg>
          </button>
          <nav className={mobileMenu.sub ? "mt-[0px] text-[20px]" : "mt-[19px] text-[30px]"}>
            <div className="flex items-center">
              {mobileMenu.sub && (
                <button onClick={() => setIsSubOpen((v) => !v)} aria-expanded={isSubOpen} aria-label="Toggle sections" className="w-[50px] h-[56px] flex items-center justify-center cursor-pointer">
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" stroke="currentColor" strokeWidth="1.4" className={isSubOpen ? "" : "rotate-180"}><path d="M1 6l5-5 5 5" /></svg>
                </button>
              )}
              <Link to="/" onClick={() => { setIsMenuOpen(false); scrollToTop(); }} className={mobileMenu.sub ? "leading-[56px]" : "leading-[45px] mb-[19px]"}>
                {mobileMenu.home}
              </Link>
            </div>
            {mobileMenu.sub && isSubOpen && ["/#about", "/#diplomas", "/#exhibitions", "/#donate", "/#faq"].map((to, i) => (
              <Link key={to} to={to} onClick={() => setIsMenuOpen(false)} className="block pl-[18px] leading-[56px]">
                {mobileMenu.sub[i]}
              </Link>
            ))}
            <Link to="/2023-achievements" onClick={() => setIsMenuOpen(false)} className={mobileMenu.sub ? "block leading-[56px]" : "block leading-[45px]"}>
              {mobileMenu.results}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
