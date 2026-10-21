import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LegacyLogos } from "../components/LegacyLogos";
import { RightArrowLongIcon } from "../assets/RightArrowLongIcon";
import { useContent } from "../hooks/useContent";
import { useHashScroll } from "../hooks/useHashScroll";
import { RichText } from "../shared/RichText";
import { PhotoLightbox } from "../shared/PhotoLightbox";
import { toBlocks } from "../utils/markup";

// "2023 results" page — a copy of the old /2023-achievements (texts: texts/<lang>.json `y2023`).
// Phones: positions measured on the old 320px mobile canvas.
const ORGANIZER_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSevvnb-yj7pCqaW6yK-lJM6jDjMrsXC4_nxjXZzgg3euD2-vA/viewform";
const WRAP = "max-w-[1089px] mx-auto px-4";

// Stat cards on phones, in the old mobile order: stat index, icon [file, x, y, w, h], number top, label px, line top
const MOBILE_STATS = [
  [0, ["scroll.svg", 15, 127, 86, 40], 108, 14, 184],
  [1, ["translate.svg", 15, 252, 77, 56], 266, 14, 324],
  [3, ["map.png", 22, 393, 77, 56], 412, 15, 470],
  [4, ["megaphone.svg", 25, 543, 79, 56], 552, 14, 623],
  [2, ["exhibitions.svg", 22, 684, 65, 72], 688, 15, 769],
  [5, ["cap.svg", 18, 849, 75, 43], 843, 11, 914],
];
// Label details per stat index (old pages): letter-spacing, [desktop gap above / below the number], [phones gap above / below]
const LABELS = [
  ["normal", [0, 9], [0, 0]],
  ["0.05em", [0, 0], [0, 0]],
  ["normal", [0, 9], [0, 8]],
  ["normal", [0, 0], [6, 4]],
  ["0.05em", [0, 3], [3, 3]],
  ["0.05em", [0, 0], [2, 0]],
];
// The "hosted by" card: 14px label above the number, a small one below
const BOTTOM_SIZE = { 5: [10, 11] };

// Desktop: stat index, icon [file, x, y, w, h], text column left, number top, label px, line [x, y]
const DESKTOP_STATS = [
  [0, ["scroll.svg", 43, 187, 86, 41], 128, 170, 14, [84, 259]],
  [1, ["translate.svg", 400, 186, 85, 62], 485, 192, 14, [440, 259]],
  [2, ["exhibitions.svg", 743, 176, 56, 62], 813, 180, 14, [767, 255]],
  [3, ["map.png", 43, 361, 86, 52], 129, 374, 14, [84, 445]],
  [4, ["megaphone.svg", 399, 360, 85, 60], 484, 371, 14, [439, 451]],
  [5, ["cap.svg", 726, 367, 85, 48], 811, 366, 10, [766, 451]],
];

// `shift`: per-stat vertical offsets on phones where a translation sits lower (texts `y2023.mobile.statShift`)
const Stats = ({ heading, stats, h, mobileTop, shift = {} }) => (
  // h: old header and section heights of this language (texts `layout.y2023`); our header is 80px
  <section style={{ "--mt": `${h.header - 80}px`, "--mmt": `${mobileTop}px` }} className="bg-[#ebebeb] text-theme-bg mt-(--mmt) tablet-md:mt-(--mt)">
    {/* Phones */}
    <div className="tablet:hidden relative h-[994px] w-[320px] mx-auto">
      <h1 className="pt-5 text-center text-[40px] font-[800] tracking-[0.01em] text-theme-primary-dark">{heading}</h1>
      {MOBILE_STATS.map(([i, [icon, x, y, w, h], top, size, line]) => {
        const { top: above, number, bottom } = stats[i];
        return (
          <div key={i}>
            <img src={`/legacy/y2023/icon-${icon}`} alt="" className="absolute object-contain" style={{ left: x, top: y, width: w, height: h }} />
            <div className="absolute left-[88px] w-[222px] text-center uppercase leading-[1.4] font-[700]" style={{ top: top + (shift[i] ?? 0), fontSize: i === 5 ? 14 : size, letterSpacing: LABELS[i][0] }}>
              {/* "HOSTED BY" sits 4px further right on the old phone page */}
              {above && <p className="absolute bottom-full inset-x-0 whitespace-pre-line" style={{ marginBottom: LABELS[i][2][0], left: i === 5 ? 4 : 0 }}>{above}</p>}
              <p className="text-[36px] leading-[37px] tracking-normal text-theme-primary-dark">{number}</p>
              <p className="whitespace-pre-line" style={{ marginTop: LABELS[i][2][1], fontSize: BOTTOM_SIZE[i]?.[1] }}>{bottom}</p>
            </div>
            <img src="/legacy/y2023/icon-line.svg" alt="" className="absolute left-[45px] w-[248px] h-[21px]" style={{ top: line }} />
          </div>
        );
      })}
    </div>

    {/* Desktop: measured placement in the 1057px column */}
    {/* Tablets: the same stats as a grid (the measured desktop infographic needs 1057px) */}
    <div className="hidden tab:block max-w-[1089px] mx-auto px-4 pt-10 pb-16">
      <h1 className="text-[64px] font-[800] leading-[1.2] tracking-[0.01em] text-theme-primary-dark">{heading}</h1>
      <div className="mt-10 grid grid-cols-2 tablet-md:grid-cols-3 gap-x-8 gap-y-12">
        {DESKTOP_STATS.map(([i, [icon, , , w, h]]) => {
          const { top: above, number, bottom } = stats[i];
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="flex items-center gap-4">
                <img src={`/legacy/y2023/icon-${icon}`} alt="" className="shrink-0 object-contain" style={{ width: w, height: h }} />
                <div className="text-center uppercase leading-[1.4] font-[700] text-[14px]" style={{ letterSpacing: LABELS[i][0] }}>
                  {above && <p className="whitespace-pre-line">{above}</p>}
                  <p className="text-[40px] leading-[41px] tracking-normal text-theme-primary-dark">{number}</p>
                  <p className="whitespace-pre-line">{bottom}</p>
                </div>
              </div>
              <img src="/legacy/y2023/icon-line.svg" alt="" className="mt-3 w-[248px] h-[21px]" />
            </div>
          );
        })}
      </div>
    </div>

    <div style={{ height: h.stats }} className="max-tablet:hidden tab:hidden relative max-w-[1057px] mx-auto">
      <h1 className="absolute left-[43px] top-[23px] text-[80px] font-[800] leading-[1.45] tracking-[0.01em] text-theme-primary-dark">{heading}</h1>
      {DESKTOP_STATS.map(([i, [icon, x, y, w, h], left, top, size, [lx, ly]]) => {
        const { top: above, number, bottom } = stats[i];
        return (
          <div key={i}>
            <img src={`/legacy/y2023/icon-${icon}`} alt="" className="absolute object-contain" style={{ left: x, top: y, width: w, height: h }} />
            <div className="absolute w-[188px] text-center uppercase leading-[1.4] font-[700]" style={{ left, top, fontSize: i === 5 ? 14 : size, letterSpacing: LABELS[i][0] }}>
              {above && <p className="absolute bottom-full inset-x-0 whitespace-pre-line" style={{ marginBottom: LABELS[i][1][0] }}>{above}</p>}
              <p className="text-[40px] leading-[41px] tracking-normal text-theme-primary-dark">{number}</p>
              <p className="whitespace-pre-line" style={{ marginTop: LABELS[i][1][1], fontSize: BOTTOM_SIZE[i]?.[0] }}>{bottom}</p>
            </div>
            <img src="/legacy/y2023/icon-line.svg" alt="" className="absolute w-[248px] h-[21px]" style={{ left: lx, top: ly }} />
          </div>
        );
      })}
    </div>
  </section>
);

// Flag emoji per country of the 2023 list (the old popup shows one above each country)
const FLAGS = {
  AUSTRALIA: "AU", AUSTRIA: "AT", BELGIUM: "BE", BULGARIA: "BG", CANADA: "CA", HUNGARY: "HU", "CZECH REPUBLIC": "CZ",
  FRANCE: "FR", ITALY: "IT", DENMARK: "DK", FINLAND: "FI", GERMANY: "DE", INDIA: "IN", JAPAN: "JP", LITHUANIA: "LT",
  NETHERLANDS: "NL", ESTONIA: "EE", POLAND: "PL", PORTUGAL: "PT", SPAIN: "ES", NORWAY: "NO", "UNITED ARAB EMIRATES": "AE",
  "UNITED STATES OF AMERICA": "US", "UNITED KINGDOM": "GB",
};
const flag = (name) => FLAGS[name] && String.fromCodePoint(...[...FLAGS[name]].map((c) => 0x1f1a5 + c.charCodeAt(0)));

// Popup with the full 2023 list (old "See full list"); the list is English on every old page, so is its title.
// The old popup broke country names mid-word ("AUSTRALI / A") — here they wrap normally.
const FullList = ({ countries, onClose }) => (
  <div className="fixed inset-0 z-[60] bg-black/70 flex items-start justify-center overflow-y-auto py-10" onClick={onClose}>
    <div className="relative bg-theme-bg text-[#ebebeb] w-[90%] max-w-[700px] px-6 tablet:px-10 pt-10 pb-10" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.6"><path d="M2 2l16 16M18 2L2 18" /></svg>
      </button>
      <h2 className="text-center text-white text-[34px] tablet:text-[48px] leading-[1.15] font-bold">List of 2023 exhibitions</h2>
      {countries.map(({ name, venues }) => (
        <div key={name} className="mt-6">
          {flag(name) && <p className="text-[38px] leading-none">{flag(name)}</p>}
          <h3 className="mt-5 text-[22px] tablet:text-[26px] leading-[1.15] font-[500] uppercase">{name}</h3>
          {venues.map(({ name: venue, href }) => (
            <p key={venue} className="mt-2.5 text-[17px] tablet:text-[19px] leading-[1.15]">
              {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">{venue}</a> : venue}
            </p>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// White (or light grey) full-width link box with a bold label and an arrow
// `mobileRegular`: the old mobile page sets this label in the regular weight
// hover (old site): red background, 1px light border, light label; the arrow stays dark
const ArrowBox = ({ to, href, label, className = "bg-[#fbfbfb]", mobileRegular, labelClassName = "" }) => {
  const cls = `flex items-center justify-between w-[287px] tablet:w-full h-[81px] tablet:h-[61px] pl-[10px] pr-[13px] tablet:pl-[23px] tablet:pr-[17px] text-black transition-all duration-200 ease-[ease] hover:bg-theme-primary-dark hover:border hover:border-[#fafafa] hover:text-[#fafafa] ${className}`;
  const body = (
    <>
      <span className={`max-w-[220px] tablet:max-w-none font-[800] text-[16px] tablet:text-[28px] uppercase tracking-[0.05em] leading-[1.35] ${mobileRegular ? "max-tablet:font-normal max-tablet:tracking-normal max-tablet:text-theme-bg" : ""} ${labelClassName}`}>{label}</span>
      <RightArrowLongIcon className="max-tablet:hidden w-[100px] h-5 shrink-0 text-theme-bg" />
      {/* phones: the old short arrow (the long one squashed to this width loses its head) */}
      <svg viewBox="0 0 32 16" className="tablet:hidden w-[32px] h-4 shrink-0 text-theme-bg" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M0 8h30M23 1l7 7-7 7" /></svg>
    </>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a> : <Link to={to} className={cls}>{body}</Link>;
};

// Slider motion of the old Wix gallery, fitted to its measured positions: starts after 150ms, 850ms, slow start
const bezier = (x1, y1, x2, y2) => (t) => {
  let u = t; // solve x(u) = t (Newton), return y(u)
  for (let i = 0; i < 8; i++) {
    const x = 3 * x1 * u * (1 - u) ** 2 + 3 * x2 * u ** 2 * (1 - u) + u ** 3 - t;
    const dx = 3 * x1 * (1 - u) ** 2 + 6 * (x2 - x1) * u * (1 - u) + 3 * (1 - x2) * u ** 2;
    if (Math.abs(x) < 1e-5 || !dx) break;
    u -= x / dx;
  }
  return 3 * y1 * u * (1 - u) ** 2 + 3 * y2 * u ** 2 * (1 - u) + u ** 3;
};
const slideEase = bezier(0.9, 0.2, 0.3, 0.8);

const NavArrow = ({ dir, onClick }) => (
  <button
    onClick={onClick}
    aria-label={dir > 0 ? "Next Item" : "Previous Item"}
    className={`absolute ${dir > 0 ? "right-[13px] tablet:right-[23px]" : "left-[13px] tablet:left-[23px]"} top-1/2 max-tablet:-mt-px -translate-y-1/2 w-[46px] h-[46px] tablet:w-[75px] tablet:h-[75px] flex items-center justify-center bg-black/60 tablet:bg-black/80 opacity-90 hover:opacity-100 cursor-pointer`}
  >
    {/* the old gallery's arrow (39×11 at 80%) */}
    <svg viewBox="0 0 39 11" className={`w-[22px] tablet:w-[31px] h-auto fill-white ${dir > 0 ? "" : "-scale-x-100"}`}><polygon points="30.79 0 38.18 5.21 30.79 10.35 30.79 6.24 0 6.24 0 4.32 30.79 4.32" /></svg>
  </button>
);

// Old gallery: grey (#BFBFBF) until a photo has loaded, then it fades in. Desktop hover: the photo zooms to 110%
// over 2.2s while a dark gradient and the caption (Avenir Light 16/20, 30px from the bottom left) fade in over 0.4s.
// Phones: no hover, swipe snaps photo by photo
const ZOOM = "2.2s cubic-bezier(0.14, 0.4, 0.09, 0.99)";
const GalleryPhoto = ({ src, alt, caption, onOpen }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <button onClick={onOpen} className="group relative shrink-0 snap-start w-[147px] h-[195px] tablet:w-[439px] tablet:h-[585px] overflow-hidden bg-[#bfbfbf] cursor-pointer text-left">
      <img
        ref={(img) => img?.complete && img.naturalWidth && setLoaded(true)}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ transition: `opacity 0.4s ease, scale ${ZOOM}` }}
        className={`w-full h-full object-cover tablet:group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <span
        style={{ transition: `opacity 0.4s, scale ${ZOOM}` }}
        className="max-tablet:hidden absolute inset-0 bg-linear-to-b from-[rgba(64,64,64,0.01)] to-[rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 group-hover:scale-111"
      />
      {caption && (
        <span
          style={{ transition: "opacity 0.4s", fontFamily: "Avenir, 'Avenir Next', 'Helvetica Neue', sans-serif" }}
          className="max-tablet:hidden absolute left-[31px] right-[30px] bottom-[31px] text-[16px] leading-[20px] font-light text-white opacity-0 group-hover:opacity-100"
        >
          {caption}
        </span>
      )}
    </button>
  );
};

const Photos = ({ photos }) => {
  const strip = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [open, setOpen] = useState(null);
  const update = () => {
    const el = strip.current;
    if (el) setEdges({ start: el.scrollLeft < 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  };
  // one photo per click, eased like the old slider
  const slide = (dir) => {
    const el = strip.current;
    const item = el.firstElementChild;
    const step = item.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0);
    const from = el.scrollLeft;
    const to = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, Math.round(from / step + dir) * step));
    const t0 = performance.now() + 150;
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - t0) / 850));
      el.scrollLeft = from + (to - from) * slideEase(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  return (
    // old gallery: strip clipped 40px from both window edges (phones: 20px on the right), dark square arrows
    <section className="relative bg-[#fbfbfb] py-5 tablet:pt-[60px] tablet:pb-[64px] max-tablet:min-h-[236px]">
      <div className="relative max-tablet:mr-5 tablet:mx-10 overflow-hidden">
        <div ref={strip} onScroll={update} className="flex gap-4 tablet:gap-5 overflow-x-auto max-tablet:snap-x max-tablet:snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
          {photos.map(({ src, alt, caption }, i) => (
            <GalleryPhoto key={src} src={src} alt={alt} caption={caption} onOpen={() => setOpen(i)} />
          ))}
        </div>
        {!edges.start && <NavArrow dir={-1} onClick={() => slide(-1)} />}
        {!edges.end && <NavArrow dir={1} onClick={() => slide(1)} />}
      </div>
      {open !== null && <PhotoLightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
};

export default function Achievements2023() {
  useHashScroll();
  const { y2023: y, layout } = useContent();
  // section heights of the old page in this language (desktop / phones) and whether it has a footer
  const H = layout.y2023.d;
  const M = layout.y2023.m;
  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main style={{ "--mh": `${layout.m.header}px` }} className="flex-1 pt-(--mh) tablet-md:pt-20 text-[#ebebeb]">
        <Stats heading={y.heading} stats={y.stats} h={H} mobileTop={M.header - layout.m.header} shift={y.mobile.statShift} />

        <section style={{ "--h": `${H.locations}px`, "--mh": `${M.locations}px` }} className="bg-theme-bg max-tablet:min-h-(--mh) tablet:min-h-(--h)">
          <div className={`${WRAP} max-tablet:px-[7px] pt-[31px] tablet:pt-[49px] pb-[40px] tablet:pb-[60px] flex flex-col items-center`}>
            <h2 className="text-center text-[30px] tablet:text-[56px] leading-none tablet:leading-[59px] tracking-[0.01em] font-[500] uppercase max-tablet:max-w-[306px] tablet:w-[910px] tablet:-translate-x-[35px]">{y.locations.heading}</h2>
            <img src="/legacy/y2023/map.png" alt="" loading="lazy" className="mt-7 tablet:mt-[54px] w-[288px] tablet:w-[974px] h-auto" />
            <button
              onClick={() => setListOpen(true)}
              style={{ "--fs": `${y.mobile.listButtonSize ?? 24}px`, "--lpt": `${2 * (y.mobile.listButtonShift ?? 0)}px` }}
              className="mt-9 tablet:mt-[58px] tablet:translate-x-[19px] w-[280px] tablet:w-[332px] h-[53px] tablet:h-[73px] bg-white text-theme-bg max-tablet:text-(length:--fs) max-tablet:pt-(--lpt) tablet:text-[24px] font-[700] tracking-[0.05em] cursor-pointer hover:text-[#404040] transition-all duration-200 ease-[ease]"
            >
              {y.locations.button}
            </button>
          </div>
        </section>

        <section style={{ "--h": `${H.activities}px`, "--mh": `${M.activities}px` }} className="bg-theme-bg-grey max-tablet:min-h-(--mh) tablet:min-h-(--h)">
          <div className={`${WRAP} max-tablet:px-4 pt-[31px] tablet:pt-[39px] pb-6`}>
            <p className="max-tablet:px-1 max-w-[288px] tablet:max-w-none text-[19px] tablet:text-[24px] tablet:leading-[1.48] tablet:pl-[3px]">{y.activities.text}</p>
            <div className="mt-[39px] tablet:mt-[33px]">
              <ArrowBox to="/" label={y.activities.button} mobileRegular={y.mobile.activitiesRegular} />
            </div>
          </div>
        </section>

        <Photos photos={y.photos} />

        <section style={{ "--h": `${H.guests}px`, "--mh": `${M.guests}px` }} className="bg-theme-primary-dark max-tablet:min-h-(--mh) tablet:min-h-(--h)">
          <div className={`${WRAP} max-tablet:px-4 pt-[39px] tablet:pt-[75px] pb-6`}>
            <p className="max-tablet:px-1 max-w-[288px] tablet:max-w-[724px] text-[19px] tablet:text-[24px] tablet:leading-[1.48]">{y.guests.text}</p>
            <div className="mt-[35px] tablet:mt-[55px]">
              <ArrowBox href={y.guests.button.href ?? ORGANIZER_FORM} label={y.guests.button.label} className="bg-[#ebebeb] tablet:bg-[#fbfbfb]" />
            </div>
          </div>
        </section>

        <section style={{ "--h": `${H.team}px` }} className="bg-theme-bg-grey tablet:min-h-(--h)">
          <div className={`${WRAP} max-tablet:px-4 pt-[41px] tablet:pt-[70px] pb-9 tablet:pb-6 flex flex-col tablet:flex-row tablet:items-start gap-7 tablet:gap-[61px]`}>
            <img src="/legacy/y2023/susk.png" alt="" className="max-tablet:hidden shrink-0 w-[110px] h-[195px] object-contain" />
            <div className="max-tablet:px-1 max-tablet:translate-y-[4px] max-w-[288px] tablet:max-w-[891px] tablet:mt-[9px] space-y-[22px] [&_a]:text-[#ff6868] [&_a]:no-underline">
              <RichText blocks={toBlocks(y.team.text)} className="text-[19px] tablet:text-[24px] leading-[1.2] tablet:leading-[1.48] tracking-[0.01em]" strongClassName="text-[#ff6868] font-normal" />
            </div>
            <img src="/legacy/partners/7667557f44204651a6829d4eddcf228f.png" alt="Ukrainian Canadian Students Union" className="tablet:hidden w-[287px] h-[80px] object-contain" />
          </div>
        </section>

        <LegacyLogos kind="sponsors2023" {...y.sponsors} className="bg-theme-bg" minHeight={H.sponsors} mobileMinHeight={M.sponsors} />
        <LegacyLogos kind="partners2023" {...y.partners} className="bg-theme-bg-grey" minHeight={H.partners} mobileMinHeight={M.partners} offset={{ className: "tablet:translate-y-[3px] tablet:-translate-x-[5px]" }} />
      </main>
      {/* the old German 2023 page has no footer */}
      {H.footer && <Footer emailLeft={y.mobile.footerEmailLeft} />}
      {listOpen && <FullList countries={y.exhibitions2023} onClose={() => setListOpen(false)} />}
    </div>
  );
}
