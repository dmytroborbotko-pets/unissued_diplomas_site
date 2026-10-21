import { useRef, useEffect, useCallback } from 'react';
import { cn } from '../utils/utils';

// `square`: old Wix gallery strip — 108px square crops, no scroll buttons
export const DiplomaThumbnails = ({ diplomas, currentIndex, onSelect, square, className }) => {
  const scrollContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);

  // Auto-scroll to active thumbnail
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex] && scrollContainerRef.current) {
      const thumbnail = thumbnailRefs.current[currentIndex];
      const container = scrollContainerRef.current;

      const thumbnailLeft = thumbnail.offsetLeft;
      const thumbnailWidth = thumbnail.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;

      // Calculate if thumbnail is out of view
      if (
        thumbnailLeft < scrollLeft ||
        thumbnailLeft + thumbnailWidth > scrollLeft + containerWidth
      ) {
        // Scroll to center the thumbnail
        container.scrollTo({
          left: thumbnailLeft - containerWidth / 2 + thumbnailWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  const scroll = useCallback((direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Left scroll button */}
      {!square && <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-r transition-colors"
        aria-label="Scroll left"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>}

      {/* Thumbnail container */}
      <div
        ref={scrollContainerRef}
        className={cn("flex overflow-x-auto [&::-webkit-scrollbar]:hidden", square ? "gap-[10px] py-[5px] px-[5px]" : "gap-4 px-12")}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {diplomas.map((diploma, index) => (
          <button
            key={diploma.name}
            ref={(el) => (thumbnailRefs.current[index] = el)}
            onClick={() => onSelect(index)}
            className={cn(
              'flex-shrink-0 transition-all duration-200',
              square ? cn('bg-white', index === currentIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100') : index === currentIndex
                ? 'ring-4 ring-theme-primary-dark scale-105'
                : 'ring-2 ring-gray-600 hover:ring-gray-400',
            )}
            aria-label={`View diploma ${index + 1}`}
          >
            <img
              src={diploma.thumb ?? diploma.src}
              alt={diploma.name}
              className={square ? 'w-[108px] h-[108px] object-cover' : 'w-32 h-auto object-cover'}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      {!square && <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-l transition-colors"
        aria-label="Scroll right"
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>}
    </div>
  );
};
