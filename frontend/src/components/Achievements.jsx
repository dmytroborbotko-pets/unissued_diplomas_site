import { useEffect, useRef, useState } from "react";
import ParralaxQuotImage from "../assets/ParralaxQuotImage.avif";
import { RightArrowLongIcon } from "../assets/RightArrowLongIcon";

export const Achievements = () => {
  const parallaxRef = useRef(null);
  const imageRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const element = parallaxRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Calculate when element enters (bottom) to when it exits (top)
      // When rect.bottom = windowHeight (entering), progress = 0
      // When rect.top = 0 (exiting), progress = 1
      const totalScrollDistance = windowHeight + elementHeight;
      const scrolled = windowHeight - rect.bottom;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Image moves from bottom (-50% shows bottom half) to top (0% shows top half)
  const imageTransform = `translateY(${-50 + scrollProgress * 50}%)`;
  return (
    <>
      {/* Achievements Button */}
      <div className="tablet:px-4 mobile-xs:px-1 tablet:mt-20 max-tablet:mt-12 pb-8 bg-[#262623] w-full">
        <p className="max-w-[1080px] mx-auto pt-[42px] pb-[30px] px-[14px] text-[16px] max-tablet:text-[16.8px]">
          The Unissued diplomas initiative was started in 2023, when 110
          exhibitions were held in 24 countries. While this page focuses on
          project's current activities, you can read more about what we have
          achieved in 2023 on a dedicated page.
        </p>
        <div className="max-w-[1080px] mx-auto pb-[20px] px-[14px]">
          <a
            href="/achievements"
            className="group inline-flex items-center justify-between w-full bg-white text-[var(--color-theme-bg)] px-5 py-1 max-tablet:py-4 transition-colors hover:bg-[var(--color-theme-primary-dark)] hover:text-white"
          >
            <span className="text-[22px] max-tablet:text-[20px] font-[800] uppercase tracking-wide">
              EXPLORE OUR 2025 ACHIEVEMENTS
            </span>
            <RightArrowLongIcon className="w-20 h-12 transition-colors" />
          </a>
        </div>
      </div>
      {/* Parallax Window Section - Tablet and up */}
      <div
        ref={parallaxRef}
        className="relative w-full h-[400px] tablet:h-[320px] overflow-hidden max-[481px]:hidden"
      >
        {/* Large image that moves upward as you scroll down */}
        <div
          ref={imageRef}
          style={{ transform: imageTransform }}
          className="absolute top-0 left-0 w-full h-[300%] transition-transform duration-0"
        >
          <img
            src={ParralaxQuotImage}
            alt="Never Graduated, Eternally Honored"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h2 className="mobile-xs:text-[34px] max-tablet:text-[41px] tablet:text-[41px] font-normal uppercase leading-tight text-white text-center px-4">
            NEVER GRADUATED,
            <br />
            ETERNALLY HONORED
          </h2>
        </div>
      </div>

      {/* Static Image Section - Small Mobile only (<=481px) */}
      <div className="relative w-full h-[280px] overflow-hidden tablet:hidden min-[482px]:hidden">
        <img
          src={ParralaxQuotImage}
          alt="Never Graduated, Eternally Honored"
          className="w-full h-full object-cover object-center"
        />
        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h2 className="text-[24px] font-normal uppercase leading-tight text-white text-center px-4">
            NEVER GRADUATED,
            <br />
            ETERNALLY HONORED
          </h2>
        </div>
      </div>
    </>
  );
};
