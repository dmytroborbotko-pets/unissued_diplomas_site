import { useEffect, useRef } from "react";

// Full-width photo strip with a centered caption. Parallax like the old Wix strip: a viewport-high photo
// trails the scroll at 0.8 (it drifts 0.2× relative to the screen), measured on the old site.
// Phones (old mobile pages): no parallax, the whole photo fills the strip.
// `mobileHeight`: strip height on phones (old mobile pages: 199-219px)
// `offset`: measured caption shift from `ink()`; `width`: caption width on desktop (old Ukrainian page: wider)
export const Banner = ({ text, image, mobileHeight, offset, width = 653 }) => {
  const stripRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const parallax = window.matchMedia("(min-width: 769px)");
    const onScroll = () => {
      const top = stripRef.current.getBoundingClientRect().top;
      imageRef.current.style.transform = parallax.matches ? `translateY(${-0.8 * top}px)` : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    parallax.addEventListener("change", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      parallax.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <div ref={stripRef} style={{ "--mh": `${mobileHeight}px` }} className="relative w-full h-(--mh) tablet:h-[323px] overflow-hidden">
      <img
        ref={imageRef}
        src={image}
        alt=""
        className="absolute top-0 left-0 w-full h-full tablet:h-screen object-cover object-center tablet:will-change-transform"
      />
      <div className="absolute inset-0 flex items-center justify-center pb-[10px] tablet:pb-[18px]">
        <h2 style={{ "--bw": `${width}px`, ...offset?.style }} className={`text-[19px] tablet:text-[40px] font-normal uppercase leading-none text-white text-center max-tablet:max-w-[234px] tablet:px-4 tablet:max-w-(--bw) tracking-[0.01em] whitespace-pre-line ${offset?.className ?? ""}`}>
          {text}
        </h2>
      </div>
    </div>
  );
};
