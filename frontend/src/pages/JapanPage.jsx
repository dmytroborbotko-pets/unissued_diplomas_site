import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DiplomaModal } from "../shared/DiplomaModal";
import { RichText } from "../shared/RichText";
import smallLogo from "../assets/small_logo.png";
import { useContent } from "../hooks/useContent";
import { useLanguage } from "../hooks/useLanguage";
import { toBlocks } from "../utils/markup";
import { mediaUrl } from "../utils/media";
import { cn } from "../utils/utils";
import jp from "../texts/jp.json";

// 1:1 copy of the old Wix /jp page. Texts live in texts/jp.json; only diplomas come from Strapi.
// From 1100px the old desktop layout is reproduced: a 980px column with the Wix coordinates
// (x from the column's left edge, y from the section's top, via --x/--y/--w/--h); below that, a stacked layout.

// Fonts as on the old page. Its <html lang="en"> and font stacks without a generic family make the browser
// pick the Japanese glyphs from its default CJK fallback (PingFang on macOS) — so no lang="ja" and no
// generic family here either. Body text in place of Wix's licensed Rodin Light: M PLUS 1p Light, except digits,
// spaces and / : ( ) from Montserrat Light with tabular figures (Rodin's digits are that wide; the Montserrat
// stylesheet below is subset to those characters only, so everything else falls through to M PLUS 1p).
const KR = "font-['KyivType_Sans'] font-normal";
const KM = "font-['KyivType_Sans_Medium'] font-normal";
const R = "font-['Montserrat','M_PLUS_1p'] font-light tabular-nums [word-spacing:0.09em]"; // Rodin's spaces are 0.345em wide
const HV = "font-['Helvetica_Neue',Helvetica,Arial,sans-serif] font-light";
const FONTS = `@font-face{font-family:"KyivType Sans Medium";src:url("/font/KyivType-Sans--Medium.otf") format("opentype");font-display:swap}`;

const POS = "min-[1100px]:absolute min-[1100px]:left-(--x) min-[1100px]:top-(--y)";
const W = "min-[1100px]:w-(--w)";
const H = "min-[1100px]:h-(--h)";
const at = (x, y, w, h) => ({
  "--x": `${x}px`,
  "--y": `${y}px`,
  ...(w && { "--w": `${w}px` }),
  ...(h && { "--h": `${h}px` }),
});

// y values are Wix's span tops (67px content box around the 56px line), hence the 5.5px offset
const H56 = `${KR} text-[36px] leading-[1.15] min-[1100px]:text-[56px] min-[1100px]:leading-[56px] min-[1100px]:mt-[5.5px] tracking-[0.01em] whitespace-pre-line`;
const BODY16 = `${R} text-[16px] leading-[22.4px] tracking-[0.01em] space-y-[27px]`; // Wix: an empty line between paragraphs
const BODY18 = `${R} text-[18px] leading-[32px] space-y-[32px]`;
const RED_RUN = "font-light text-[#ff6868]";
const RED = "bg-[#b10000]";

const mapEmbed = (query) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
const scrollTo = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

// Fixed-height Wix section (desktop) holding the 980px column; stacked with padding below 1100px
const Section = ({ id, h, className, children }) => (
  <section id={id} style={{ "--sh": `${h}px` }} className={cn("relative scroll-mt-4 min-[1100px]:h-(--sh)", className)}>
    <div className="relative mx-auto max-w-[980px] h-full flex flex-col gap-6 px-4 py-12 min-[1100px]:block min-[1100px]:p-0">
      {children}
    </div>
  </section>
);

const LANGUAGE_ORDER = ["en", "ja", "it", "de", "uk", "es"]; // as in the old Wix language menu
const languageLabel = (code) => (code === "uk" ? "UA" : code.toUpperCase());

const LanguageMenu = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(POS, "relative ml-auto")} style={at(895, 44)}>
      <button
        onClick={() => setOpen(!open)}
        className={`${HV} flex items-center gap-[30px] h-10 px-2 text-[14px] text-white cursor-pointer`}
        aria-expanded={open}
      >
        {languageLabel(currentLanguage)}
        <svg className={cn("w-3 h-3 transition-transform", open && "rotate-180")} viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1 1.5l5 5 5-5" />
        </svg>
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-50 min-w-full bg-theme-bg">
          {LANGUAGE_ORDER.map((code) => (
            <li key={code}>
              <button
                onClick={() => {
                  setOpen(false);
                  changeLanguage(code);
                }}
                className={`${HV} block w-full px-2 py-2 text-left text-[14px] cursor-pointer hover:text-[#ff6868] ${code === currentLanguage ? "text-[#ff6868]" : "text-white"}`}
              >
                {languageLabel(code)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Wix menu item boxes (x, width); labels are centered in them
const NAV = [[98, 159], [319, 91], [499, 105]];

const Header = () => (
  <Section h={119}>
    <div className="flex items-center gap-4 flex-wrap min-[1100px]:block">
      <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={POS} style={at(0, 39)}>
        <img src={smallLogo} alt="Unissued Diplomas" className="w-[39px] h-[50px] object-contain" />
      </Link>
      {jp.nav.map(({ label, to }, i) => (
        <a
          key={to}
          href={to}
          onClick={scrollTo(to.split("#")[1])}
          className={`${POS} ${W} ${HV} hidden min-[1100px]:block text-center text-[14px] leading-[50px] text-white whitespace-nowrap`}
          style={at(NAV[i][0], 39, NAV[i][1])}
        >
          {label}
        </a>
      ))}
      <a
        href={jp.donate.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${POS} ${W} ${H} ${HV} ${RED} flex items-center justify-center px-4 h-10 text-[15px] tracking-[1.5px] text-white`}
        style={at(660, 44, 209, 40)}
      >
        {jp.donate.label}
      </a>
      <LanguageMenu />
    </div>
  </Section>
);

const Hero = () => (
  <Section h={523}>
    <h1 className={`${KR} text-[#ebebeb] whitespace-nowrap leading-none`}>
      <span className={`${POS} block text-[11vw] tracking-[-0.02em] min-[1100px]:text-[120px]`} style={at(0, 85)}>
        {jp.hero.title.split("\n")[0]}
      </span>
      <span className={`${POS} block mt-3 text-[13.3vw] min-[1100px]:mt-0 min-[1100px]:text-[145px]`} style={at(0, 224)}>
        <span className="tracking-[-0.02em]">{jp.hero.title.split("\n")[1].slice(0, -1)}</span>
        {jp.hero.title.slice(-1)}
      </span>
    </h1>
    <img
      src="/legacy/ornament.png"
      alt=""
      className={`${POS} ${W} ${H} absolute right-4 top-24 w-[22vw] h-auto min-[1100px]:right-auto`}
      style={at(654, 189, 118, 116)}
    />
    <p className={`${POS} ${R} text-[16px] min-[1100px]:text-[20px] min-[1100px]:leading-[20px] tracking-[1px] text-[#ebebeb]`} style={at(0, 406)}>
      {jp.hero.tagline}
    </p>
  </Section>
);

const TwoColumns = ({ id, h, className, heading, headingClass, headingAt, text, textClass, textAt }) => (
  <Section id={id} h={h} className={className}>
    <h2 className={cn(POS, W, headingClass)} style={headingAt}>
      {heading}
    </h2>
    <div className={cn(POS, W, textClass)} style={textAt}>
      <RichText blocks={toBlocks(text)} strongClassName={RED_RUN} />
    </div>
  </Section>
);

// The image stays pinned to the viewport while the section scrolls over it (Wix "reveal" background)
const Banner = () => (
  <section className="relative h-[200px] min-[1100px]:h-[281px] [clip-path:inset(0)]">
    <img src="/legacy/jp/banner-flags.jpg" alt="" className="fixed inset-0 w-full h-screen object-cover pointer-events-none" />
    <p className={`${R} relative h-full flex items-center justify-center text-center whitespace-pre-line px-4 text-[26px] leading-[1.1] min-[1100px]:text-[40px] min-[1100px]:leading-[40px] tracking-[0.01em] text-[#ebebeb]`}>
      {jp.banner}
    </p>
  </section>
);

const THUMB = 108;
const THUMB_STEP = 118;

const Chevron = ({ flip }) => (
  <svg viewBox="0 0 16 27" className={cn("w-4 h-[27px]", flip && "rotate-180")} fill="none" stroke="#b10000" strokeWidth="1.5">
    <path d="M2 1l12 12.5L2 26" />
  </svg>
);

// Wix Pro Gallery look: one slide (840×390 image) with side arrows, a strip of square thumbnails below
const Gallery = () => {
  const { diplomas, diplomaLanguages } = useContent();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const strip = useRef(null);
  const language = diplomaLanguages.find((l) => l.name === jp.gallery.diplomaLanguage);
  // The students and order of the old page's gallery (texts/jp.json); images come from Strapi
  const images = useMemo(
    () =>
      jp.gallery.students.flatMap((student) => {
        const version = diplomas
          .find(({ studentName }) => studentName === student)
          ?.versions.find((v) => v.language?.documentId === language?.documentId);
        return version
          ? [{ name: student, src: mediaUrl(version.image, "large"), thumb: mediaUrl(version.image, "small"), full: version.image.url }]
          : [];
      }),
    [diplomas, language],
  );
  const go = (i) => setIndex((i + images.length) % images.length);

  // Keep the active thumbnail centered in the strip
  useEffect(() => {
    const el = strip.current;
    el?.scrollTo({ left: index * THUMB_STEP - (el.clientWidth - THUMB) / 2, behavior: "smooth" });
  }, [index]);

  return (
    <Section h={784}>
      <h2 className={cn(POS, H56)} style={at(0, 27)}>
        {jp.gallery.heading}
      </h2>
      <p className={`${POS} ${HV} flex items-center gap-[2px] whitespace-nowrap text-[16px] leading-[30px] text-[#404040]`} style={at(716, 30)}>
        <img src="/legacy/zoom-hint.png" alt="" className="w-[34px] h-[30px] object-cover object-left" />
        {jp.gallery.hint}
      </p>

      <div className={`${POS} ${W} relative`} style={at(-39, 131, 1066)}>
        <div className="relative mx-auto min-[1100px]:w-[954px]">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
              {images.map((image) => (
                <button
                  key={image.name}
                  onClick={() => setZoomed(true)}
                  className="shrink-0 w-full aspect-[840/390] min-[1100px]:aspect-auto min-[1100px]:h-[390px] min-[1100px]:px-[57px] cursor-pointer"
                >
                  <img src={image.src} alt={image.name} loading="lazy" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>
          {index > 0 && (
            <button onClick={() => go(index - 1)} aria-label="Previous" className="absolute top-1/2 -translate-y-1/2 -left-4 min-[1100px]:-left-9 cursor-pointer">
              <Chevron flip />
            </button>
          )}
          {index < images.length - 1 && (
            <button onClick={() => go(index + 1)} aria-label="Next" className="absolute top-1/2 -translate-y-1/2 -right-4 min-[1100px]:-right-9 cursor-pointer">
              <Chevron />
            </button>
          )}
        </div>

        <div ref={strip} className="mt-[5px] overflow-x-auto [scrollbar-width:none] p-[5px]">
          <div className="flex gap-[10px]">
            {images.map((image, i) => (
              <button
                key={image.name}
                onClick={() => setIndex(i)}
                className={cn("relative shrink-0 bg-white cursor-pointer", i === index && "after:absolute after:inset-0 after:bg-white/60")}
                aria-label={image.name}
              >
                <img src={image.thumb} alt="" loading="lazy" className="w-[108px] h-[108px] object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#fund"
        onClick={scrollTo("fund")}
        className={`${POS} ${W} ${H} ${KM} ${RED} flex items-center justify-center h-[47px] text-[16px] tracking-[0.8px] text-[#ebebeb]`}
        style={at(-37, 690, 1057, 47)}
      >
        {jp.gallery.donate}
      </a>

      <DiplomaModal
        isOpen={zoomed}
        onClose={() => setZoomed(false)}
        diploma={images[index]}
        onNext={() => go(index + 1)}
        onPrev={() => go(index - 1)}
      />
    </Section>
  );
};

// Venues grouped by city: name, red-framed dates and hours on the left, a map on the right.
// Wix placed every venue by hand, so each one carries its own desktop coordinates (texts/jp.json `layout`).
const Venues = () => (
  <Section h={2262}>
    <h2 className={cn(POS, W, H56, "text-center")} style={at(283, 48, 454)}>
      {jp.venues.heading}
    </h2>
    {Object.entries(Object.groupBy(jp.venues.items, (v) => v.city)).map(([city, venues]) => (
      <div key={city} className="flex flex-col gap-6 min-[1100px]:contents">
        <h3 className={cn(POS, R, "text-[40px] leading-[1.1] min-[1100px]:text-[56px] min-[1100px]:leading-[56px] tracking-[0.01em]")} style={at(-37, jp.venues.cities[city])}>
          {city}
        </h3>
        {venues.map(({ name, dates, hours, map, layout }) => (
          <div key={name} className="flex flex-col gap-6 min-[1100px]:contents">
            <p className={cn(POS, W, KM, "whitespace-pre-line text-[24px] leading-[25px] tracking-[0.01em] text-[#ebebeb]")} style={at(-37, layout.name, 420)}>
              {name}
            </p>
            <div
              className={cn(POS, W, H, "relative w-fit border border-[#b10000] px-[17px] py-[14px]")}
              style={{ ...at(-37, layout.box[0], layout.box[1], layout.box[2]), "--tw": `${layout.date[1]}px` }}
            >
              <p className={`${KR} min-[1100px]:absolute min-[1100px]:left-[16px] min-[1100px]:top-[13px] min-[1100px]:w-(--tw) text-[24px] leading-[25px] tracking-[0.01em] text-[#b30000]`}>
                {dates}
              </p>
            </div>
            {hours && (
              <p className={cn(POS, R, "whitespace-pre-line text-[18px] leading-[20px] min-[1100px]:text-[20px] min-[1100px]:leading-[21.5px] tracking-[0.01em] text-[#ebebeb]")} style={at(-37, layout.hours)}>
                {hours}
              </p>
            )}
            <iframe
              src={mapEmbed(map)}
              title={name}
              loading="lazy"
              className={cn(POS, W, H, "w-full h-[260px] border-0 grayscale invert-[0.9]")}
              style={at(540, layout.name, 479, 310)}
            />
          </div>
        ))}
      </div>
    ))}
  </Section>
);

const Fund = () => (
  <Section id="fund" h={512} className={RED}>
    <h2 className={cn(POS, W, H56, "text-center tracking-normal")} style={at(100, 49, 784)}>
      {jp.fund.heading}
    </h2>
    <div className={`${POS} ${W} ${KR} text-[18px] min-[1100px]:text-[20px] leading-[28px] tracking-[0.01em] space-y-[28px] text-white`} style={at(-35, 164, 1053)}>
      <RichText blocks={toBlocks(jp.fund.text)} strongClassName="font-bold" />
    </div>
    <a
      href={jp.fund.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${POS} ${W} ${H} ${KM} flex items-center justify-center h-[65px] bg-[#fbfbfb] text-[20px] min-[1100px]:text-[24px] tracking-[1.2px] text-[#b10000]`}
      style={at(239, 400, 548, 65)}
    >
      {jp.fund.button}
    </a>
  </Section>
);

const Mission = () => (
  <Section h={911}>
    <div className={`${POS} ${W} ${H} relative`} style={at(-36, 109, 469, 694)}>
      <img src="/legacy/team.png" alt="" className="w-full h-full object-cover object-[60%_50%]" />
      <p className={`${KM} absolute left-[13px] bottom-[9px] text-[12px] leading-[16.92px] text-[#ebebeb]`}>{jp.photoCredit}</p>
    </div>
    <h2 className={cn(POS, H56)} style={at(509, 95)}>
      {jp.purpose.heading}
    </h2>
    <div className={`${POS} ${W} ${BODY18} text-[#ebebeb]`} style={at(510, 182, 451)}>
      <RichText blocks={toBlocks(jp.purpose.text)} strongClassName={RED_RUN} />
    </div>
    <h2 className={cn(POS, H56)} style={at(509, 426)}>
      {jp.team.heading}
    </h2>
    <div className={`${POS} ${W} ${BODY18} text-white`} style={at(509, 580, 469)}>
      <RichText blocks={toBlocks(jp.team.text)} strongClassName={RED_RUN} />
    </div>
  </Section>
);

// Logo wall with the exact Wix placement on desktop; a wrapped row on small screens
const Logos = ({ heading, logos, texts, h, headingX, className }) => (
  <Section h={h} className={className}>
    <h2 className={cn(POS, H56)} style={at(headingX, 88)}>
      {heading}
    </h2>
    <div className="flex flex-wrap items-center gap-6 min-[1100px]:contents">
      {logos.map(({ name, src, href, x, y, w, h }) => {
        const img = <img src={src} alt={name} loading="lazy" className="h-14 w-auto max-w-[40vw] object-contain min-[1100px]:w-full min-[1100px]:h-full min-[1100px]:max-w-none min-[1100px]:object-cover" />;
        const box = cn(POS, W, H, "block");
        return href ? (
          <a key={src} href={href} target="_blank" rel="noopener noreferrer" className={box} style={at(x, y, w, h)}>
            {img}
          </a>
        ) : (
          <span key={src} className={box} style={at(x, y, w, h)}>
            {img}
          </span>
        );
      })}
      {texts.map(({ text, x, y, w, size }) => (
        <p
          key={text}
          className={cn(POS, W, KR, "whitespace-pre tracking-[0.01em] text-[#ebebeb]", size === 10 ? "text-center text-[10px] leading-[14px]" : size === 24 ? "text-center text-[24px] leading-[33.6px]" : "text-[16px] leading-[22.4px]")}
          style={at(x, y, w)}
        >
          {text}
        </p>
      ))}
    </div>
  </Section>
);

const Faq = () => {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="px-4 py-12 min-[1100px]:px-0 min-[1100px]:pt-[57px] min-[1100px]:pb-[60px]">
      <div className="mx-auto max-w-[980px] min-[1100px]:grid min-[1100px]:grid-cols-[540px_523px] min-[1100px]:-translate-x-[36px]">
        <div className="relative min-[1100px]:pt-[41px]">
          <h2 className={H56}>{jp.faq.heading}</h2>
          <img src="/legacy/ornament.png" alt="" className="absolute left-[200px] top-[30px] w-[60px] min-[1100px]:left-[325px] min-[1100px]:top-[73px] min-[1100px]:w-[88px] h-auto" />
        </div>
        <div className="mt-8 min-[1100px]:mt-0">
          {jp.faq.items.map(({ question, answer }, i) => (
            <div key={question} className="border-b border-[#b10000]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 pt-[40px] pb-[36.5px] text-left cursor-pointer"
                aria-expanded={open === i}
              >
                <span className={`${KR} text-[16px] leading-[22.4px] text-[#ebebeb]`}>{question}</span>
                <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0 -mt-[2px]" stroke="#ebebeb" strokeWidth="1">
                  <path d="M12 4v16" className={cn("transition-opacity", open === i && "opacity-0")} />
                  <path d="M4 12h16" />
                </svg>
              </button>
              {open === i && (
                <div className={`${KM} -mt-[8.4px] pb-[53px] text-[16px] leading-[21.5px] text-[#ebebeb]`}>
                  <RichText blocks={toBlocks(answer)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function JapanPage() {
  return (
    <div className="bg-theme-bg text-[#ebebeb] overflow-x-hidden">
      <title>{jp.metaTitle}</title>
      <meta name="description" content={jp.metaDescription} />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&text=0123456789%2F%3A%28%29%20&display=swap" precedence="default" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@300&display=swap" precedence="default" />
      <style href="jp-fonts" precedence="default">{FONTS}</style>

      <Header />
      <Hero />
      <TwoColumns
        id="about"
        h={358}
        heading={jp.about.heading}
        headingClass={`${KM} whitespace-pre-line text-[34px] leading-[1.35] min-[1100px]:text-[50px] min-[1100px]:leading-[75px] text-white`}
        headingAt={at(0, 66, 416)}
        text={jp.about.text}
        textClass={`${BODY16} text-[#ebebeb]`}
        textAt={at(509, 70, 491)}
      />
      <Banner />
      <TwoColumns
        id="classroom"
        h={579}
        className="bg-theme-bg-grey"
        heading={jp.classroom.heading}
        headingClass={H56}
        headingAt={at(0, 140, 284)}
        text={jp.classroom.text}
        textClass={`${BODY16} text-white`}
        textAt={at(510, 146, 485)}
      />
      <Gallery />
      <Venues />
      <Fund />
      <Mission />
      <Logos heading={jp.sponsors.heading} logos={jp.sponsors.logos} texts={jp.sponsors.texts} h={765} headingX={-38} />
      <Logos heading={jp.partners.heading} logos={jp.partners.logos} texts={jp.partners.texts} h={520} headingX={-43} className="bg-theme-bg-grey" />
      <Faq />
    </div>
  );
}
