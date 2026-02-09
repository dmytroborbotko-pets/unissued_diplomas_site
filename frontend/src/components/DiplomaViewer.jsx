import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { DiplomaThumbnails } from "../shared/DiplomaThumbnails";
import { DiplomaModal } from "../shared/DiplomaModal";
import { cn } from "../utils/utils";

const DIPLOMA_LANGUAGES = [
  "English",
  "Deutsch",
  "Italiano",
  "Español",
  "Français",
  "日本語",
];

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export const DiplomaViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load all diploma images dynamically
  const diplomaImages = useMemo(() => {
    const images = import.meta.glob("/src/assets/diplomas_en_version/*.jpg", {
      eager: true,
    });

    // Convert to array and sort by number in filename
    return Object.entries(images)
      .sort(([a], [b]) => {
        // Extract number from filename (e.g., "10d" -> 10)
        const numA = parseInt(a.match(/(\d+)d/)?.[1] || "0");
        const numB = parseInt(b.match(/(\d+)d/)?.[1] || "0");
        return numA - numB;
      })
      .map(([path, module]) => ({
        src: module.default,
        name: path.split("/").pop().replace("_HD.jpg", ""),
      }));
  }, []);

  const nextDiploma = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === diplomaImages.length - 1 ? 0 : prev + 1,
    );
  }, [diplomaImages.length]);

  const prevDiploma = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? diplomaImages.length - 1 : prev - 1,
    );
  }, [diplomaImages.length]);

  const selectDiploma = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const onClose = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const currentDiploma = diplomaImages[currentIndex];

  return (
    <div className="mt-12 tablet:mt-20">
      {/* Top controls bar */}
      <div className="flex items-start justify-between mb-6">
        {/* Left: Language selector and Fullscreen toggle */}
        <div className="flex items-start gap-3">
          {/* Language dropdown */}
          <div ref={dropdownRef} className="relative">
            <p className="text-gray-200 text-sm mb-2">Language of diplomas</p>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center justify-between w-full min-w-[280px] tablet:min-w-[304px] bg-transparent text-white px-5 py-2 border border-gray-500 hover:border-gray-400 transition-colors cursor-pointer focus:outline-none"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-label="Select diploma language"
            >
              <span className="text-base">{language}</span>
              <ChevronDownIcon
                className={cn(
                  "w-5 h-5 text-white transition-transform duration-200",
                  isDropdownOpen && "rotate-180",
                )}
              />
            </button>

            {isDropdownOpen && (
              <ul
                role="listbox"
                className="absolute z-50 top-full left-0 w-full bg-theme-bg-dark border-l-2 border-l-gray-400 border border-gray-700 max-h-80 overflow-y-auto"
              >
                {DIPLOMA_LANGUAGES.map((lang) => (
                  <li key={lang}>
                    <button
                      role="option"
                      aria-selected={language === lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-5 py-3 text-base transition-colors hover:bg-gray-800",
                        language === lang ? "text-white" : "text-gray-300",
                      )}
                    >
                      {lang}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: Instruction hint */}
        <div className="flex items-center gap-2 text-neutral-700 text-md mt-8">
          <svg
            className="w-9 h-9"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
          <span className="hidden tablet:inline">
            Click on the diploma to zoom in
          </span>
        </div>
      </div>

      {/* Main diploma display */}
      <div className="mb-8">
        <button
          onClick={() => setIsFullscreen(true)}
          className="w-full cursor-pointer hover:opacity-90 transition-opacity"
          aria-label="Click to view diploma in fullscreen"
        >
          <img
            src={currentDiploma?.src}
            alt={currentDiploma?.name}
            className="w-full h-auto object-contain max-h-[600px]"
          />
        </button>
      </div>

      {/* Thumbnail carousel */}
      <DiplomaThumbnails
        diplomas={diplomaImages}
        currentIndex={currentIndex}
        onSelect={selectDiploma}
      />

      {/* Donate button */}
      <button className="w-full py-2 mt-10 bg-theme-primary-dark text-white text-base tracking-widest uppercase rounded hover:bg-theme-primary transition-colors">
        Donate
      </button>

      {/* Fullscreen modal */}
      <DiplomaModal
        isOpen={isFullscreen}
        onClose={onClose}
        diploma={currentDiploma}
        onNext={nextDiploma}
        onPrev={prevDiploma}
      />
    </div>
  );
};
