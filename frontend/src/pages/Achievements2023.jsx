import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LegacyLogos } from "../components/LegacyLogos";
import { RightArrowLongIcon } from "../assets/RightArrowLongIcon";
import { useContent } from "../hooks/useContent";
import { useHashScroll } from "../hooks/useHashScroll";
import { RichText } from "../shared/RichText";
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
    <div style={{ height: h.stats }} className="max-tablet:hidden relative max-w-[1057px] mx-auto">
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

// Popup with the full 2023 list (old "See full list")
const FullList = ({ countries, onClose }) => (
  <div className="fixed inset-0 z-[60] bg-black/70 flex items-start justify-center overflow-y-auto py-10" onClick={onClose}>
    <div className="relative bg-theme-bg text-[#ebebeb] w-[90%] max-w-[700px] px-6 py-8" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.6"><path d="M2 2l16 16M18 2L2 18" /></svg>
      </button>
      {countries.map(({ name, venues }) => (
        <div key={name} className="mt-6 first:mt-0">
          <h3 className="text-[20px] font-[500] uppercase">{name}</h3>
          {venues.map(({ name: venue, href }) => (
            <p key={venue} className="mt-1 text-[16px] leading-[1.3]">
              {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="underline">{venue}</a> : venue}
            </p>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// White (or light grey) full-width link box with a bold label and an arrow
// `mobileRegular`: the old mobile page sets this label in the regular weight
const ArrowBox = ({ to, href, label, className = "bg-white", mobileRegular, labelClassName = "" }) => {
  const cls = `flex items-center justify-between w-[287px] tablet:w-full h-[81px] tablet:h-[61px] pl-[10px] pr-[30px] tablet:pl-[23px] tablet:pr-[17px] text-black transition-colors hover:bg-theme-primary-dark hover:text-white ${className}`;
  const body = (
    <>
      <span className={`max-w-[220px] tablet:max-w-none font-[800] text-[16px] tablet:text-[28px] uppercase tracking-[0.05em] leading-[1.35] ${mobileRegular ? "max-tablet:font-normal max-tablet:tracking-normal max-tablet:text-theme-bg" : ""} ${labelClassName}`}>{label}</span>
      <RightArrowLongIcon className="w-[31px] tablet:w-[100px] h-[15px] tablet:h-5 shrink-0" />
    </>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a> : <Link to={to} className={cls}>{body}</Link>;
};

const Photos = ({ photos }) => {
  const strip = useRef(null);
  const next = () => strip.current?.scrollBy({ left: strip.current.clientWidth * 0.5, behavior: "smooth" });
  return (
    <section className="relative bg-[rgba(250,250,250,0.8)] py-5 tablet:pt-[60px] tablet:pb-[64px] max-tablet:min-h-[236px] overflow-hidden">
      <div ref={strip} className="flex gap-5 tablet:pl-[max(0px,calc((100vw-1057px)/2-32px))] overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        {photos.map(({ src, alt }) => (
          <img key={src} src={src} alt={alt} loading="lazy" className="shrink-0 w-[146px] h-[195px] tablet:w-[439px] tablet:h-[585px] object-cover" />
        ))}
      </div>
      <button onClick={next} aria-label="Next photos" className="absolute right-[25px] top-1/2 -translate-y-1/2 w-[46px] h-[46px] flex items-center justify-center cursor-pointer">
        <svg width="16" height="27" viewBox="0 0 16 27" fill="none" stroke="#e21c21" strokeWidth="1.5"><path d="M1 1l13 12.5L1 26" /></svg>
      </button>
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
              className="mt-9 tablet:mt-[58px] tablet:translate-x-[19px] w-[280px] tablet:w-[332px] h-[53px] tablet:h-[73px] bg-white text-theme-bg max-tablet:text-(length:--fs) max-tablet:pt-(--lpt) tablet:text-[24px] font-[700] tracking-[0.05em] cursor-pointer hover:bg-theme-primary-dark hover:text-white transition-colors"
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
              <ArrowBox href={y.guests.button.href ?? ORGANIZER_FORM} label={y.guests.button.label} className="bg-[#ebebeb] tablet:bg-[#fbfbfb]" mobileRegular labelClassName="max-tablet:-translate-y-[6px]" />
            </div>
          </div>
        </section>

        <section style={{ "--h": `${H.team}px`, "--mh": `${M.team}px` }} className="bg-theme-bg-grey max-tablet:min-h-(--mh) tablet:min-h-(--h)">
          <div className={`${WRAP} max-tablet:px-4 pt-[41px] tablet:pt-[70px] pb-6 flex flex-col tablet:flex-row tablet:items-start gap-7 tablet:gap-[61px]`}>
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
