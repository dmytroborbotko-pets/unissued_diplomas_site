import { createPortal } from 'react-dom';
import { useState, useRef } from 'react';
import smallLogo from '../assets/small_logo.png';
import { Link, useLocation } from 'react-router-dom';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useContent } from '../hooks/useContent';

// The logo also works as "back to top" when it links to the current page (/jp with Japanese saved redirects back)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Old Wix mobile menu toggle: three 22×2 lines 9px apart; open = cross (outer lines turn 45°, middle fades) in ~0.12s (measured)
const Burger = ({ open, onClick, label }) => (
  <button onClick={onClick} aria-label={label} className="relative w-[50px] h-[50px] cursor-pointer">
    <span className="absolute left-[14px] top-[15px] w-[22px] h-5">
      {[0, 9, 18].map((top, i) => (
        <span
          key={top}
          style={{
            top,
            transformOrigin: '11px 1px',
            transition: 'all 0.12s ease-in-out',
            transform: open && i !== 1 ? `translateY(${i ? -9 : 9}px) rotate(${i ? 45 : -45}deg)` : 'none',
            opacity: open && i === 1 ? 0 : 1,
          }}
          className="absolute left-0 w-[22px] h-[2px] bg-white"
        />
      ))}
    </span>
  </button>
);

// Menu panel motion of the old site: slides down 50px and fades in over 0.46s
const MENU_MS = 460;

// `links` and `cta` (donate button) let the /jp page reuse the header with its own nav
export default function Header({ links, cta }) {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const { nav, mobileMenu, layout } = useContent();
  // old site: English pages have a #171717 header, translated pages a black one (uk/es show the English 2023 page)
  const { pathname } = useLocation();
  // tablets (769–1088px) on the main pages use the phone bar and menu: the old desktop menu needs the full 1057px
  const tabBar = links ? '' : 'tab:block';
  const blackHeader = !links && currentLanguage !== 'en' && !(pathname === '/2023-achievements' && ['uk', 'es'].includes(currentLanguage));
  const [isSubOpen, setIsSubOpen] = useState(false);
  // Same menu as the old site: about, exhibition list, 2023 results, FAQ, contacts
  const NAV_LINKS = links ?? ['/#about', '/#exhibitions', '/2023-achievements', '/#faq', '/#contacts'].map((to, i) => ({ to, label: nav[i] }));
  // menu: mounted while visible or animating out; `isMenuOpen` drives the transition
  const [menuMounted, setMenuMounted] = useState(false);
  const [isMenuOpen, setIsMenuShown] = useState(false);
  const closeTimer = useRef(null);
  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setMenuMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsMenuShown(true)));
  };
  const setIsMenuOpen = (open) => {
    if (open) return openMenu();
    setIsMenuShown(false);
    closeTimer.current = setTimeout(() => { setMenuMounted(false); setIsSubOpen(false); }, MENU_MS);
  };
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
      className={`fixed top-0 w-full ${blackHeader ? "bg-black" : "bg-theme-bg"} z-50 transition-transform duration-300`}
    >
      {/* Phones: the old mobile bar (73-77px, burger left, logo centered, language right) */}
      <div className="max-w-[1080px] mx-auto pl-[15px] pr-[25px] tablet-md:px-4">
        <div className="flex items-center justify-between h-(--mh) tablet-md:h-20">

          {/* Mobile: hamburger | Desktop: Logo */}
          <div className="flex items-center">
            {/* old position: 15px from the left, 10px from the top */}
            <div className={`tablet-md:hidden ${tabBar} absolute left-[15px] top-[10px] tab:top-[15px]`}>
              <Burger open={false} onClick={() => setIsMenuOpen(true)} label="Open navigation menu" />
            </div>
            <Link to="/" onClick={scrollToTop} className={`hidden tablet-md:block ${links ? '' : 'tab:hidden'}`}>
              <img src={smallLogo} alt="Unissued Diplomas" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Mobile: centered logo */}
          <Link to="/" onClick={scrollToTop} className={`absolute left-1/2 -translate-x-1/2 tablet-md:hidden ${tabBar}`}>
            <img src={smallLogo} alt="Unissued Diplomas" className="w-[26px] h-[30px] object-contain" />
          </Link>

          {/* Desktop Navigation */}
          {/* Home menu: items where the old page placed them (texts `layout.nav`: [x from center, top, width]) */}
          <nav className={cta ? "hidden tablet-md:flex items-center space-x-12" : "hidden tablet-md:block tab:hidden absolute inset-0"}>
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
              className="flex items-center justify-center gap-[14px] tablet-md:gap-5 tablet-md:w-[97px] px-0 tablet-md:px-4 py-3 text-white uppercase text-[12px] tablet-md:text-[14px] tracking-[0.03em] cursor-pointer"
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

      {/* Phones: the old full-screen menu (English: "Home" with collapsible section links; translations: two items).
          Portaled to <body>: the header's transform would otherwise clip a fixed child to the header's own box.
          The toggle stays on top of the panel and turns into a cross */}
      {menuMounted && createPortal(
        <>
          <div
            style={{
              transform: isMenuOpen ? 'none' : 'translateY(-50px)',
              opacity: isMenuOpen ? 1 : 0,
              transition: `transform ${MENU_MS}ms cubic-bezier(0.455, 0.03, 0.515, 0.955), opacity ${MENU_MS}ms cubic-bezier(0.645, 0.045, 0.355, 1)`,
            }}
            className={`tablet-md:hidden ${tabBar} fixed inset-0 z-[60] bg-theme-bg-grey text-white px-[15px] pt-[49px] tab:pt-[64px] overflow-y-auto`}
          >
            <nav className={mobileMenu.sub ? "text-[20px] leading-[56px]" : "mt-[19px] text-[30px]"}>
              <div className="flex items-center">
                {mobileMenu.sub && (
                  <button onClick={() => setIsSubOpen((v) => !v)} aria-expanded={isSubOpen} aria-label={mobileMenu.home} className="w-[50px] h-[56px] flex items-center justify-center cursor-pointer">
                    <svg viewBox="0 0 9.2828 4.89817" className={`w-3 h-1.5 fill-current translate-x-px ${isSubOpen ? "rotate-180" : ""}`}>
                      <path d="M4.64116,4.89817a.5001.5001,0,0,1-.34277-.13574L.15727.86448A.50018.50018,0,0,1,.84282.136L4.64116,3.71165,8.44.136a.50018.50018,0,0,1,.68555.72852L4.98393,4.76243A.5001.5001,0,0,1,4.64116,4.89817Z" />
                    </svg>
                  </button>
                )}
                <Link to="/" onClick={() => { setIsMenuOpen(false); scrollToTop(); }} className={mobileMenu.sub ? "pl-[10px]" : "leading-[45px] mb-[19px]"}>
                  {mobileMenu.home}
                </Link>
              </div>
              {/* sections: shown at once, fading in over 0.4s */}
              {mobileMenu.sub && (
                <div style={{ transition: 'opacity 0.4s' }} className={isSubOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}>
                  {["/#about", "/#diplomas", "/#exhibitions", "/#donate", "/#faq"].map((to, i) => (
                    <Link key={to} to={to} onClick={() => setIsMenuOpen(false)} className="block pl-[25px]">
                      {mobileMenu.sub[i]}
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/2023-achievements" onClick={() => setIsMenuOpen(false)} className={mobileMenu.sub ? "block pl-[10px]" : "block leading-[45px]"}>
                {mobileMenu.results}
              </Link>
            </nav>
          </div>
          <div className={`tablet-md:hidden ${tabBar} fixed left-[15px] top-[10px] tab:top-[15px] z-[61]`}>
            <Burger open={isMenuOpen} onClick={() => setIsMenuOpen(false)} label="Close navigation menu" />
          </div>
        </>,
        document.body,
      )}
    </header>
  );
}
