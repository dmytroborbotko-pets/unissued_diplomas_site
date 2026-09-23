import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { DiplomaThumbnails } from "../shared/DiplomaThumbnails";
import { DiplomaModal } from "../shared/DiplomaModal";
import { cn } from "../utils/utils";
import { useContent } from "../hooks/useContent";
import { mediaUrl } from "../utils/media";

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
  const { diplomas, diplomaLanguages } = useContent();
  const [languageId, setLanguageId] = useState(diplomaLanguages[0]?.documentId);
  const language = diplomaLanguages.find((l) => l.documentId === languageId) ?? diplomaLanguages[0];
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

  // Students that have a version in the selected language, in diploma order
  const diplomaImages = useMemo(
    () =>
      diplomas.flatMap(({ studentName, versions }) => {
        const version = versions.find((v) => v.language?.documentId === language?.documentId);
        return version
          ? [{
              name: studentName,
              src: mediaUrl(version.image, "large"),
              thumb: mediaUrl(version.image, "thumbnail"),
              full: version.image.url,
            }]
          : [];
      }),
    [diplomas, language],
  );

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

  // A language can have fewer diplomas than the previously selected one
  const currentDiploma = diplomaImages[Math.min(currentIndex, diplomaImages.length - 1)];

  return (
    <div>
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
              <span className="text-base">{language?.name}</span>
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
                {diplomaLanguages.map((lang) => (
                  <li key={lang.documentId}>
                    <button
                      role="option"
                      aria-selected={lang.documentId === language?.documentId}
                      onClick={() => {
                        setLanguageId(lang.documentId);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-5 py-3 text-base transition-colors hover:bg-gray-800",
                        lang.documentId === language?.documentId ? "text-white" : "text-gray-300",
                      )}
                    >
                      {lang.name}
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

      {/* Donate button
      <button className="w-full py-2 mt-10 bg-theme-primary-dark text-white text-base tracking-widest uppercase rounded hover:bg-theme-primary transition-colors">
        Donate
      </button> */}

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
