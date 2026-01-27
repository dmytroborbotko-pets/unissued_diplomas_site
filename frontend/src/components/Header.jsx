import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function Header() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-brand-black/90 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 tablet:px-8">
        <div className="flex items-center justify-between h-16 tablet:h-20">
          {/* Logo */}
          <Link to="/" className="text-white font-bold text-lg tablet:text-xl">
            UNISSUED DIPLOMAS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden tablet:flex items-center space-x-8">
            <a href="#about" className="text-white hover:text-brand-red transition-colors">
              About Project
            </a>
            <a href="#hall" className="text-white hover:text-brand-red transition-colors">
              Hall of Diplomas
            </a>
            <a href="#exhibitions" className="text-white hover:text-brand-red transition-colors">
              Exhibitions
            </a>
            <a href="#donate" className="text-white hover:text-brand-red transition-colors">
              Donate
            </a>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="text-white hover:text-brand-red transition-colors uppercase"
              >
                {currentLanguage}
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors ${
                        currentLanguage === lang.code ? 'text-brand-red' : 'text-white'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="tablet:hidden text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="tablet:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <a
                href="#about"
                className="text-white hover:text-brand-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Project
              </a>
              <a
                href="#hall"
                className="text-white hover:text-brand-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hall of Diplomas
              </a>
              <a
                href="#exhibitions"
                className="text-white hover:text-brand-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Exhibitions
              </a>
              <a
                href="#donate"
                className="text-white hover:text-brand-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate
              </a>

              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm mb-2">Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded border ${
                        currentLanguage === lang.code
                          ? 'bg-brand-red border-brand-red text-white'
                          : 'border-gray-700 text-white hover:border-brand-red'
                      } transition-colors`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
