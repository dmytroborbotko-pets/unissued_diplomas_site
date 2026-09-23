import { useCallback, useMemo, useRef } from "react";

const CAPTIONS = [
  "Kyiv, 2023",
  "Lviv, 2023",
  "Warsaw, 2024",
  "Berlin, 2024",
  "Toronto, 2024",
  "Vienna, 2025",
];

export const ExhibitionsSlider = () => {
  const scrollRef = useRef(null);

  const photos = useMemo(() => {
    const images = import.meta.glob("/src/assets/photo-slider/*.png", {
      eager: true,
    });

    return Object.entries(images)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([, module], index) => ({
        src: module.default,
        caption: CAPTIONS[index] ?? `Exhibition ${index + 1}`,
      }));
  }, []);

  const scroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="px-4 tablet:px-0 max-w-[1080px] mx-auto">
      <div className="tablet:px-4 mobile-xs:px-1 py-(--section-space)">
        <h2 className="font-heading font-normal uppercase leading-tight text-center text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px] mb-8 tablet:mb-12">
          Exhibitions Throughout the Years
        </h2>

        <div className="relative left-1/2 w-screen -translate-x-1/2 px-5">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-[calc(50%-1.5rem)] -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-r transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto px-10 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {photos.map((photo) => (
              <div
                key={photo.src}
                className="group relative flex-shrink-0 w-[300px] tablet:w-[380px] h-[420px] tablet:h-[520px] overflow-hidden"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="absolute left-4 right-4 bottom-4 text-[15px] tablet:text-[16px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.caption}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-[calc(50%-1.5rem)] -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-l transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <a
          href="/exhibitions"
          className="block w-full mt-10 tablet:mt-14 py-3 tablet:py-4 text-center uppercase tracking-widest font-[500] text-[14px] mobile-sm:text-[15px] tablet:text-[16px] bg-[#fbfbfb] text-black transition-colors duration-200 hover:bg-theme-primary hover:text-[#fbfbfb]"
        >
          Learn More About Past Exhibitions &amp; Impact
        </a>
      </div>
    </div>
  );
};
