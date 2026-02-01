import { useState, useMemo } from 'react';
import { DiplomaThumbnails } from '../shared/DiplomaThumbnails';
import { DiplomaModal } from '../shared/DiplomaModal';

export const DiplomaViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [language, setLanguage] = useState('English');

  // Load all diploma images dynamically
  const diplomaImages = useMemo(() => {
    const images = import.meta.glob(
      '/src/assets/diplomas_en_version/*.jpg',
      { eager: true }
    );

    // Convert to array and sort by number in filename
    return Object.entries(images)
      .sort(([a], [b]) => {
        // Extract number from filename (e.g., "10d" -> 10)
        const numA = parseInt(a.match(/(\d+)d/)?.[1] || '0');
        const numB = parseInt(b.match(/(\d+)d/)?.[1] || '0');
        return numA - numB;
      })
      .map(([path, module]) => ({
        src: module.default,
        name: path.split('/').pop().replace('_HD.jpg', ''),
      }));
  }, []);

  const nextDiploma = () => {
    setCurrentIndex((prev) =>
      prev === diplomaImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevDiploma = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? diplomaImages.length - 1 : prev - 1
    );
  };

  const selectDiploma = (index) => {
    setCurrentIndex(index);
  };

  const currentDiploma = diplomaImages[currentIndex];

  return (
    <div className="mt-12 tablet:mt-16">
      {/* Top controls bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Left: Language selector and Fullscreen toggle */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-[#1a1a1a] text-white px-4 py-2 pr-10 rounded border border-gray-600 hover:border-gray-400 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#b10000]"
              aria-label="Select language"
            >
              <option value="English">English</option>
              <option value="Ukrainian">Ukrainian</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Fullscreen toggle button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="bg-[#1a1a1a] text-white p-2 rounded border border-gray-600 hover:border-gray-400 transition-colors"
            aria-label="Toggle fullscreen"
            title="Open fullscreen view"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>

        {/* Right: Instruction hint */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
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

      {/* Fullscreen modal */}
      <DiplomaModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        diploma={currentDiploma}
        onNext={nextDiploma}
        onPrev={prevDiploma}
      />
    </div>
  );
};
