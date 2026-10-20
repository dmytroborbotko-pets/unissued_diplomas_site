import { useEffect, useRef, useState } from "react";

// Full-width photo strip with a centered caption; the photo slides as the strip scrolls past (parallax)
export const Banner = ({ text, image }) => {
  const parallaxRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const element = parallaxRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      // 0 when the strip enters at the bottom, 1 when it leaves at the top
      const progress = (window.innerHeight - rect.bottom) / (window.innerHeight + rect.height);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={parallaxRef} className="relative w-full h-[280px] tablet:h-[323px] overflow-hidden">
      <img
        src={image}
        alt=""
        style={{ transform: `translateY(${-25 + scrollProgress * 25}%)` }}
        className="absolute top-0 left-0 w-full h-[160%] object-cover object-center"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-[24px] mobile-sm:text-[34px] tablet:text-[40px] font-normal uppercase leading-none text-white text-center px-4 max-w-[700px] whitespace-pre-line">
          {text}
        </h2>
      </div>
    </div>
  );
};
