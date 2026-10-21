import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Bright fullscreen viewer of the old Wix gallery: white page, photo fitted, round translucent
// prev/next and fullscreen buttons, close cross at the top right, photos cross-fade (0.6s)
export const PhotoLightbox = ({ photos, index, onIndex, onClose }) => {
  const [isFull, setIsFull] = useState(false);
  const go = (d) => onIndex((index + d + photos.length) % photos.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndex((i) => (i - 1 + photos.length) % photos.length);
    };
    const onFull = () => setIsFull(!!document.fullscreenElement);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFull);
    };
  }, [onClose, onIndex, photos.length]);

  const toggleFull = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.());
  const round = "absolute w-20 h-20 flex items-center justify-center cursor-pointer text-black before:absolute before:inset-0 before:rounded-full before:bg-white before:opacity-40 [&>svg]:relative";

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-white" role="dialog" aria-modal="true">
      {photos.map(({ src, full, alt }, i) => (
        <img
          key={src}
          src={full ?? src}
          alt={alt}
          loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-[600ms] ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        />
      ))}

      <button onClick={toggleFull} aria-label={isFull ? "Exit fullscreen" : "Fullscreen"} className={`${round} left-[10px] top-[10px]`}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2">
          {isFull ? <path d="M9 1v8H1M13 21v-8h8M9 9L1 1M13 13l8 8" /> : <path d="M1 9V1h8M21 13v8h-8M1 1l8 8M21 21l-8-8" />}
        </svg>
      </button>
      <button onClick={onClose} aria-label="Close" className="absolute right-[10px] top-[10px] w-20 h-20 flex items-center justify-center cursor-pointer text-black">
        <svg width="28" height="28" viewBox="0 0 28 28" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l26 26M27 1L1 27" /></svg>
      </button>
      <button onClick={() => go(-1)} aria-label="Previous photo" className={`${round} left-[10px] top-1/2 -translate-y-1/2`}>
        <svg width="14" height="26" viewBox="0 0 14 26" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 1L1 13l12 12" /></svg>
      </button>
      <button onClick={() => go(1)} aria-label="Next photo" className={`${round} right-[10px] top-1/2 -translate-y-1/2`}>
        <svg width="14" height="26" viewBox="0 0 14 26" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l12 12L1 25" /></svg>
      </button>
    </div>,
    document.body,
  );
};
