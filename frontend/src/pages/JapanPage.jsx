import { useMemo, useRef, useState, useEffect, useSyncExternalStore } from "react";
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
// Like Wix, the page has two hand-placed layouts: desktop (980px column) and mobile (320px column, which phones
// scale to their width via the viewport meta, see usePhoneViewport). Every element gets both sets of coordinates —
// x from the column's left edge, y from its section's top — as --x/--y/--w/--h and --mx/--my/--mw/--mh.
// Tablets (600–1099px) get their own fluid layout instead (TabletPage, at the end of the file); the old page had none.

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

const POS = "absolute left-(--mx) top-(--my) min-[600px]:left-(--x) min-[600px]:top-(--y)";
const W = "w-(--mw) min-[600px]:w-(--w)";
const H = "h-(--mh) min-[600px]:h-(--h)";
const px = (v) => (v == null ? "auto" : `${v}px`);
// at([x, y, w, h], [mx, my, mw, mh]); all variables are always set so nested elements never inherit them
const at = ([x, y, w, h], [mx, my, mw, mh] = []) => ({
  "--x": px(x), "--y": px(y), "--w": px(w), "--h": px(h),
  "--mx": px(mx), "--my": px(my), "--mw": px(mw), "--mh": px(mh),
});

// y values are Wix's span tops (content box taller than the line), hence the small top margins
const H56 = `${KR} text-[30px] leading-[30px] mt-[3px] min-[600px]:text-[56px] min-[600px]:leading-[56px] min-[600px]:mt-[5.5px] tracking-[0.01em] whitespace-pre-line`;
const BODY16 = `${R} text-[16px] leading-[22.4px] tracking-[0.01em] space-y-[27px]`; // Wix: an empty line between paragraphs
const RED_RUN = "font-light text-[#ff6868]";
const RED = "bg-[#b10000]";
const DESKTOP_ONLY = "hidden min-[600px]:block";

const mapEmbed = (query) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
const scrollTo = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

// Fixed-height Wix section holding the 320px (mobile) / 980px (desktop) column
const Section = ({ id, h, mh, className, children }) => (
  <section id={id} style={{ "--sh": `${h}px`, "--msh": `${mh}px` }} className={cn("relative h-(--msh) min-[600px]:h-(--sh)", className)}>
    <div className="relative mx-auto w-[320px] min-[600px]:w-[980px] h-full">{children}</div>
  </section>
);

// Heading lines that Wix breaks on desktop only
const DesktopLines = ({ text }) =>
  text.split("\n").map((line, i) => (
    <span key={line}>
      {i > 0 && <br className="hidden min-[600px]:inline" />}
      {line}
    </span>
  ));

const LANGUAGE_ORDER = ["en", "ja", "it", "de", "uk", "es"]; // as in the old Wix language menu
const languageLabel = (code) => (code === "uk" ? "UA" : code.toUpperCase());

const LanguageMenu = ({ className = cn(POS, W, H), style = at([895, 44, null, 40], [206, 15, 97, 46]) }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <div className={className} style={style}>
      <button
        onClick={() => setOpen(!open)}
        className={`${HV} flex items-center justify-between w-full h-full pl-[10px] pr-[20px] min-[600px]:justify-start min-[600px]:gap-[30px] min-[600px]:px-2 text-[14px] text-white cursor-pointer`}
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

// Wix menu item boxes (x, width); labels are centered in them. The mobile layout has no menu.
const NAV = [[98, 159], [319, 91], [499, 105]];

const Header = () => (
  <Section h={119} mh={76}>
    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={cn(POS, W, H)} style={at([0, 39, 39, 50], [22, 23, 27, 31])}>
      <img src={smallLogo} alt="Unissued Diplomas" className="w-full h-full object-contain" />
    </Link>
    {jp.nav.map(({ label, to }, i) => (
      <a
        key={to}
        href={to}
        onClick={scrollTo(to.split("#")[1])}
        className={`${POS} ${W} ${HV} ${DESKTOP_ONLY} text-center text-[14px] leading-[50px] text-white whitespace-nowrap`}
        style={at([NAV[i][0], 39, NAV[i][1]])}
      >
        {label}
      </a>
    ))}
    <a
      href={jp.donate.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${POS} ${W} ${H} ${HV} ${RED} flex items-center justify-center text-[15px] tracking-[1.5px] text-white`}
      style={at([660, 44, 209, 40], [75, 21, 111, 34])}
    >
      {jp.donate.label}
    </a>
    <LanguageMenu />
  </Section>
);

const Hero = () => {
  const [line1, line2] = jp.hero.title.split("\n");
  return (
    <Section h={523} mh={333}>
      <h1 className={`${KR} text-[#ebebeb]`}>
        <span
          className={`${POS} ${W} block text-[40px] leading-[44px] min-[600px]:text-[120px] min-[600px]:leading-none min-[600px]:whitespace-nowrap tracking-[-0.02em]`}
          style={at([0, 85], [16, 50, 200])}
        >
          {line1}
        </span>
        <span
          className={`${POS} block whitespace-nowrap text-[40px] leading-[44px] min-[600px]:text-[145px] min-[600px]:leading-none`}
          style={at([0, 224], [16, 142])}
        >
          <span className="tracking-[-0.02em]">{line2.slice(0, -1)}</span>
          {line2.slice(-1)}
        </span>
      </h1>
      <img src="/legacy/ornament.png" alt="" className={cn(POS, W, H)} style={at([654, 189, 118, 116], [154, 134, 40, 39])} />
      <p
        className={`${POS} ${W} ${R} text-[16px] leading-[32px] min-[600px]:text-[20px] min-[600px]:leading-[20px] min-[600px]:whitespace-nowrap tracking-[0.05em] text-[#ebebeb]`}
        style={at([0, 406], [16, 209, 202])}
      >
        {jp.hero.tagline}
      </p>
    </Section>
  );
};

const TwoColumns = ({ id, h, mh, className, heading, headingClass, headingAt, text, textClass, textAt }) => (
  <Section id={id} h={h} mh={mh} className={className}>
    <h2 className={cn(POS, W, headingClass)} style={headingAt}>
      {heading}
    </h2>
    <div className={cn(POS, W, textClass)} style={textAt}>
      <RichText blocks={toBlocks(text)} strongClassName={RED_RUN} />
    </div>
  </Section>
);

// Desktop: the image stays pinned to the viewport while the section scrolls over it (Wix "reveal" background).
// Mobile: a plain image filling the section.
const Banner = () => (
  <section className="relative h-[200px] min-[600px]:h-[281px] [clip-path:inset(0)]">
    <img src="/legacy/jp/banner-flags.jpg" alt="" className="absolute inset-0 w-full h-full min-[600px]:fixed min-[600px]:h-screen object-cover pointer-events-none" />
    <p className={`${R} relative h-full flex items-center justify-center text-center whitespace-pre-line min-[600px]:pt-[8px] text-[20px] leading-[20px] min-[600px]:text-[40px] min-[600px]:leading-[40px] tracking-[0.01em] text-[#ebebeb]`}>
      {jp.banner}
    </p>
  </section>
);

const THUMB = 108;
const THUMB_STEP = 118;

const Chevron = ({ flip }) => (
  <svg viewBox="0 0 16 27" className={cn("w-[11px] h-[19px] min-[600px]:w-4 min-[600px]:h-[27px]", flip && "rotate-180")} fill="none" stroke="#b10000" strokeWidth="1.5">
    <path d="M2 1l12 12.5L2 26" />
  </svg>
);

// The students and order of the old page's gallery (texts/jp.json); images come from Strapi
const useGalleryImages = () => {
  const { diplomas, diplomaLanguages } = useContent();
  const language = diplomaLanguages.find((l) => l.name === jp.gallery.diplomaLanguage);
  return useMemo(
    () =>
      jp.gallery.students.flatMap((student) => {
        const version = diplomas
          .find(({ studentName }) => studentName === student)
          ?.versions.find((v) => v.language?.documentId === language?.documentId);
        return version
          ? [{
              name: student,
              src: mediaUrl(version.image, "large"),
              // the original (1920px) on dense screens, so the slide is as sharp as the fullscreen view
              srcSet: [version.image.formats?.large, version.image].filter(Boolean).map((f) => `${f.url} ${f.width}w`).join(", "),
              thumb: mediaUrl(version.image, "small"),
              full: version.image.url,
            }]
          : [];
      }),
    [diplomas, language],
  );
};

// Slide index + a thumbnail strip that keeps the active thumbnail centered
const useGallery = (count, step = THUMB_STEP, thumb = THUMB) => {
  const [index, setIndex] = useState(0);
  const strip = useRef(null);
  useEffect(() => {
    const el = strip.current;
    el?.scrollTo({ left: index * step - (el.clientWidth - thumb) / 2, behavior: "smooth" });
  }, [index, step, thumb]);
  return { index, setIndex, go: (i) => setIndex((i + count) % count), strip };
};

// Wix Pro Gallery look: one slide (840×390 image, 227×105 on mobile) with side arrows;
// desktop also has a strip of square thumbnails and a donate button below
const Gallery = () => {
  const images = useGalleryImages();
  const { index, setIndex, go, strip } = useGallery(images.length);
  const [zoomed, setZoomed] = useState(false);

  // Mobile: the classroom's dark bottom strip overlaps 13px into this section, so mobile y values include it
  return (
    <Section h={784} mh={294}>
      <h2 className={cn(POS, H56)} style={at([0, 27], [16, 31])}>
        {jp.gallery.heading}
      </h2>
      <p
        className={`${POS} ${W} ${HV} flex items-start gap-[7px] text-[14px] leading-[26.32px] min-[600px]:items-center min-[600px]:gap-[2px] min-[600px]:whitespace-nowrap min-[600px]:text-[16px] min-[600px]:leading-[30px] text-[#404040]`}
        style={at([716, 30], [46, 72, 246])}
      >
        <img src="/legacy/zoom-hint.png" alt="" className="shrink-0 mt-[5px] min-[600px]:mt-0 w-[24px] h-[21px] min-[600px]:w-[34px] min-[600px]:h-[30px] object-cover object-left" />
        {jp.gallery.hint}
      </p>

      <div className={cn(POS, W)} style={at([-39, 131, 1066], [47, 124, 227])}>
        <div className="relative mx-auto w-full min-[600px]:w-[954px]">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
              {images.map((image) => (
                <button key={image.name} onClick={() => setZoomed(true)} className="shrink-0 w-full h-[105px] min-[600px]:h-[390px] min-[600px]:px-[57px] cursor-pointer">
                  <img src={image.src} srcSet={image.srcSet} sizes="(min-width: 600px) 840px, 227px" alt={image.name} loading="lazy" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>
          {index > 0 && (
            <button onClick={() => go(index - 1)} aria-label="Previous" className="absolute top-1/2 -translate-y-1/2 -left-[31px] min-[600px]:-left-9 cursor-pointer">
              <Chevron flip />
            </button>
          )}
          {index < images.length - 1 && (
            <button onClick={() => go(index + 1)} aria-label="Next" className="absolute top-1/2 -translate-y-1/2 -right-[31px] min-[600px]:-right-9 cursor-pointer">
              <Chevron />
            </button>
          )}
        </div>

        <div ref={strip} className={`${DESKTOP_ONLY} mt-[5px] overflow-x-auto [scrollbar-width:none] p-[5px]`}>
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
        className={`${POS} ${W} ${H} ${KM} ${RED} hidden min-[600px]:flex items-center justify-center text-[16px] tracking-[0.8px] text-[#ebebeb]`}
        style={at([-37, 690, 1057, 47])}
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

// Venues grouped by city: name, red-framed dates and hours, a map. Wix placed every venue by hand in both
// layouts, so each one carries its own coordinates (texts/jp.json: `layout` desktop, `mobile`).
const Venues = () => (
  <Section h={2262} mh={2929}>
    <h2 className={cn(POS, W, H56, "min-[600px]:text-center")} style={at([283, 48, 454], [16, 18])}>
      {jp.venues.heading}
    </h2>
    {Object.entries(Object.groupBy(jp.venues.items, (v) => v.city)).map(([city, venues]) => [
      <h3
        key={city}
        className={cn(POS, R, "text-[36px] leading-[36px] min-[600px]:text-[56px] min-[600px]:leading-[56px] tracking-[0.01em]")}
        style={at([-37, jp.venues.cities[city]], [20, jp.venues.mobileCities[city]])}
      >
        {city}
      </h3>,
      ...venues.map(({ name, dates, hours, map, layout, mobile: m }) => (
        <div key={name} className="contents">
          <p
            className={cn(POS, W, KM, "whitespace-pre-line text-(length:--mfs) leading-(--mfs) min-[600px]:text-[24px] min-[600px]:leading-[25px] tracking-[0.01em] text-[#ebebeb]")}
            style={{ ...at([-37, layout.name, 420], m.name), "--mfs": `${m.name[3]}px` }}
          >
            {name}
          </p>
          <div
            className={cn(POS, W, H, "flex items-center justify-center border border-[#b10000] min-[600px]:block")}
            style={{ ...at([-37, layout.box[0], layout.box[1], layout.box[2]], [...m.box, 50]), "--tw": `${layout.date[1]}px` }}
          >
            <p className={`${KR} min-[600px]:absolute min-[600px]:left-[16px] min-[600px]:top-[13px] min-[600px]:w-(--tw) text-[24px] leading-[29px] min-[600px]:leading-[25px] tracking-[0.01em] text-[#b30000]`}>
              {dates}
            </p>
          </div>
          {hours && (
            <p
              className={cn(POS, W, R, "whitespace-pre-line text-[17px] leading-[18px] min-[600px]:text-[20px] min-[600px]:leading-[21.5px] tracking-[0.01em] text-[#ebebeb]")}
              style={at([-37, layout.hours], m.hours)}
            >
              {hours}
            </p>
          )}
          <iframe
            src={mapEmbed(map)}
            title={name}
            loading="lazy"
            className={cn(POS, W, H, "border-0 grayscale invert-[0.9]")}
            style={at([540, layout.name, 479, 310], [...m.map, 280, 240])}
          />
        </div>
      )),
    ])}
  </Section>
);

const Fund = () => (
  <Section id="fund" h={512} mh={837} className={RED}>
    <h2
      className={cn(POS, W, KR, "text-center text-[32px] leading-[32px] min-[600px]:text-[56px] min-[600px]:leading-[56px] min-[600px]:mt-[5.5px]")}
      style={at([100, 49, 784], [30, 32, 260])}
    >
      {jp.fund.heading}
    </h2>
    <div
      className={`${POS} ${W} ${KR} text-[19px] leading-[26.6px] space-y-[39.6px] min-[600px]:text-[20px] min-[600px]:leading-[28px] min-[600px]:space-y-[28px] tracking-[0.01em] text-white`}
      style={at([-35, 164, 1053], [20, 128, 280])}
    >
      <RichText blocks={toBlocks(jp.fund.text)} strongClassName="font-bold" />
    </div>
    <a
      href={jp.fund.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${POS} ${W} ${H} ${KM} flex items-center justify-center bg-[#fbfbfb] text-[18px] min-[600px]:text-[24px] tracking-[0.05em] text-[#b10000]`}
      style={at([239, 400, 548, 65], [16, 741, 288, 54])}
    >
      {jp.fund.button}
    </a>
  </Section>
);

const Mission = () => (
  <Section h={911} mh={1209}>
    <div className={cn(POS, W, H)} style={at([-36, 109, 469, 694], [16, 411, 287, 308])}>
      <img src="/legacy/team.png" alt="" className="w-full h-full object-cover object-[60%_50%]" />
      <p className={`${KM} ${DESKTOP_ONLY} absolute left-[13px] bottom-[9px] text-[12px] leading-[16.92px] text-[#ebebeb]`}>{jp.photoCredit}</p>
    </div>
    <h2 className={cn(POS, H56)} style={at([509, 95], [15, 62])}>
      {jp.purpose.heading}
    </h2>
    <div
      className={`${POS} ${W} ${R} text-[18px] leading-[31.5px] space-y-[31.5px] min-[600px]:leading-[32px] min-[600px]:space-y-[32px] text-[#ebebeb]`}
      style={at([510, 182, 451], [16, 130, 270])}
    >
      <RichText blocks={toBlocks(jp.purpose.text)} strongClassName={RED_RUN} />
    </div>
    <h2 className={cn(POS, W, H56, "whitespace-normal")} style={at([509, 426], [14, 753, 290])}>
      <DesktopLines text={jp.team.heading} />
    </h2>
    <div
      className={`${POS} ${W} ${R} text-[17px] leading-[29.75px] space-y-[29.75px] min-[600px]:text-[18px] min-[600px]:leading-[32px] min-[600px]:space-y-[32px] text-white`}
      style={at([509, 580, 469], [20, 800, 281])}
    >
      <RichText blocks={toBlocks(jp.team.text)} strongClassName={RED_RUN} />
    </div>
  </Section>
);

const TEXT_SIZES = {
  10: "text-[9px] leading-[12.6px] min-[600px]:text-center min-[600px]:text-[10px] min-[600px]:leading-[14px]",
  16: "text-[16px] leading-[22.4px]",
  24: "text-center text-[24px] leading-[33.6px]",
};

// Logo walls with the exact Wix placement in both layouts
const Logos = ({ heading, logos, texts, h, mh, headingAt, className }) => (
  <Section h={h} mh={mh} className={className}>
    <h2 className={cn(POS, H56)} style={headingAt}>
      {heading}
    </h2>
    {logos.map(({ name, src, href, x, y, w, h, m }) => {
      const img = <img src={src} alt={name} loading="lazy" className="w-full h-full object-cover" />;
      const box = cn(POS, W, H, "block");
      return href ? (
        <a key={src} href={href} target="_blank" rel="noopener noreferrer" className={box} style={at([x, y, w, h], m)}>
          {img}
        </a>
      ) : (
        <span key={src} className={box} style={at([x, y, w, h], m)}>
          {img}
        </span>
      );
    })}
    {texts.map(({ text, x, y, w, size, m }) => (
      <p key={text} className={cn(POS, W, KR, "min-[600px]:whitespace-pre tracking-[0.01em] text-[#ebebeb]", TEXT_SIZES[size])} style={at([x, y, w], m)}>
        {size === 24 ? text : text.replace("\n", " ")}
      </p>
    ))}
  </Section>
);

const Faq = () => {
  const [open, setOpen] = useState(null);
  // Mobile: the partners' dark bottom strip overlaps 16px into this section, so mobile y values include it
  return (
    <section id="faq" className="relative pt-[147px] pb-[20px] min-[600px]:pt-[57px] min-[600px]:pb-[60px]">
      <div className="relative mx-auto w-[320px] min-[600px]:w-[980px]">
        <h2 className={cn(H56, "absolute left-[15px] -top-[73px] text-[28px] leading-[28px] min-[600px]:left-[-36px] min-[600px]:top-[41px]")}>{jp.faq.heading}</h2>
        <img
          src="/legacy/ornament.png"
          alt=""
          className="absolute left-[191px] -top-[75px] w-[43px] h-[42px] min-[600px]:left-[289px] min-[600px]:top-[73px] min-[600px]:w-[88px] min-[600px]:h-auto"
        />
        <div className="ml-[27px] w-[265px] min-[600px]:ml-[504px] min-[600px]:w-[523px]">
          {jp.faq.items.map(({ question, answer }, i) => (
            <div key={question} className="border-b border-[#b10000]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between min-[600px]:gap-4 pt-[27px] pb-[26px] min-[600px]:pt-[40px] min-[600px]:pb-[36.5px] text-left cursor-pointer"
                aria-expanded={open === i}
              >
                <span className={`${KR} w-[241px] min-[600px]:w-auto text-[16px] leading-[22.4px] text-[#ebebeb]`}>{question}</span>
                <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0 -mt-[2px]" stroke="#ebebeb" strokeWidth="1">
                  <path d="M12 4v16" className={cn("transition-opacity", open === i && "opacity-0")} />
                  <path d="M4 12h16" />
                </svg>
              </button>
              {open === i && (
                <div className={`${KM} -mt-[1.4px] min-[600px]:-mt-[8.4px] pb-[53px] text-[16px] leading-[24px] min-[600px]:leading-[21.5px] text-[#ebebeb]`}>
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

// ---------------------------------------------------------------------------------------------------------
// Tablet layout (600–1099px). The old Wix page had none: tablets got the 980px desktop layout shrunk to fit,
// with unreadable small text. Here it is a fluid layout with the same fonts, colours and content.
// ---------------------------------------------------------------------------------------------------------
const TABLET_QUERY = "(min-width: 600px) and (max-width: 1099px)";
const useMediaQuery = (query) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
  );

const T_WRAP = "mx-auto w-full max-w-[880px] px-8 min-[768px]:px-12";
const T_SECTION = "py-16 min-[768px]:py-20";
const T_H2 = `${KR} text-[40px] min-[768px]:text-[48px] leading-[1.15] tracking-[0.01em] whitespace-pre-line text-balance`;
const T_BODY = `${R} text-[16px] min-[768px]:text-[17px] leading-[1.7] tracking-[0.01em] space-y-[1.2em]`;
// Two columns only from 900px: below that the heading column gets too narrow for Japanese headings
const T_TWO_COLUMNS = "grid gap-8 min-[900px]:grid-cols-[5fr_7fr] min-[900px]:gap-12";

const TabletHeader = () => (
  <header className={`${T_WRAP} flex items-center gap-6 h-[88px]`}>
    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="shrink-0">
      <img src={smallLogo} alt="Unissued Diplomas" className="w-[34px] h-[44px] object-contain" />
    </Link>
    <nav className="hidden min-[900px]:flex gap-8">
      {jp.nav.map(({ label, to }) => (
        <a key={to} href={to} onClick={scrollTo(to.split("#")[1])} className={`${HV} text-[14px] text-white whitespace-nowrap hover:text-[#ff6868]`}>
          {label}
        </a>
      ))}
    </nav>
    <a
      href={jp.donate.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${HV} ${RED} ml-auto flex items-center h-10 px-7 text-[15px] tracking-[1.5px] text-white whitespace-nowrap`}
    >
      {jp.donate.label}
    </a>
    <LanguageMenu className="relative h-10" style={{}} />
  </header>
);

const TabletHero = () => {
  const [line1, line2] = jp.hero.title.split("\n");
  return (
    <section className={`${T_WRAP} pt-10 pb-16 min-[768px]:pb-20`}>
      {/* Stamp placed in em units with the same proportions as on desktop */}
      <h1 className={`${KR} relative inline-block text-[min(10vw,94px)] leading-[1.15] text-[#ebebeb]`}>
        <span className="block tracking-[-0.02em]">{line1}</span>
        <span className="block text-[1.21em] leading-[1.1]">
          <span className="tracking-[-0.02em]">{line2.slice(0, -1)}</span>
          {line2.slice(-1)}
        </span>
        <img src="/legacy/ornament.png" alt="" className="absolute left-[5.45em] top-[0.87em] w-[0.98em] h-[0.97em]" />
      </h1>
      <p className={`${R} mt-8 text-[18px] tracking-[0.05em] text-[#ebebeb]`}>{jp.hero.tagline}</p>
    </section>
  );
};

const TabletText = ({ id, className, heading, headingClass = T_H2, text, textColor = "text-[#ebebeb]" }) => (
  <section id={id} className={cn(T_SECTION, className)}>
    <div className={`${T_WRAP} ${T_TWO_COLUMNS}`}>
      <h2 className={headingClass}>{heading}</h2>
      <div className={`${T_BODY} ${textColor}`}>
        <RichText blocks={toBlocks(text)} strongClassName={RED_RUN} />
      </div>
    </div>
  </section>
);

const T_THUMB = 96;

const TabletGallery = () => {
  const images = useGalleryImages();
  const { index, setIndex, go, strip } = useGallery(images.length, T_THUMB + 8, T_THUMB);
  const [zoomed, setZoomed] = useState(false);
  return (
    <section className={`${T_WRAP} ${T_SECTION}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={T_H2}>{jp.gallery.heading}</h2>
        <p className={`${HV} flex items-center gap-1 text-[15px] text-[#8a8a8a]`}>
          <img src="/legacy/zoom-hint.png" alt="" className="w-[28px] h-[25px] object-cover object-left opacity-60" />
          {jp.gallery.hint}
        </p>
      </div>
      <div className="relative mt-8 px-8">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
            {images.map((image) => (
              <button key={image.name} onClick={() => setZoomed(true)} className="shrink-0 w-full aspect-[840/390] cursor-pointer">
                <img src={image.src} srcSet={image.srcSet} sizes="100vw" alt={image.name} loading="lazy" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>
        {index > 0 && (
          <button onClick={() => go(index - 1)} aria-label="Previous" className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer">
            <Chevron flip />
          </button>
        )}
        {index < images.length - 1 && (
          <button onClick={() => go(index + 1)} aria-label="Next" className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer">
            <Chevron />
          </button>
        )}
      </div>
      <div ref={strip} className="mt-4 overflow-x-auto [scrollbar-width:none]">
        <div className="flex gap-2">
          {images.map((image, i) => (
            <button
              key={image.name}
              onClick={() => setIndex(i)}
              className={cn("relative shrink-0 bg-white cursor-pointer", i === index && "after:absolute after:inset-0 after:bg-white/60")}
              aria-label={image.name}
            >
              <img src={image.thumb} alt="" loading="lazy" className="w-[96px] h-[96px] object-cover" />
            </button>
          ))}
        </div>
      </div>
      <a href="#fund" onClick={scrollTo("fund")} className={`${KM} ${RED} mt-10 flex items-center justify-center h-12 text-[16px] tracking-[0.8px] text-[#ebebeb]`}>
        {jp.gallery.donate}
      </a>
      <DiplomaModal isOpen={zoomed} onClose={() => setZoomed(false)} diploma={images[index]} onNext={() => go(index + 1)} onPrev={() => go(index - 1)} />
    </section>
  );
};

const TabletVenues = () => (
  <section className={`${T_WRAP} ${T_SECTION}`}>
    <h2 className={`${T_H2} text-center`}>{jp.venues.heading}</h2>
    {Object.entries(Object.groupBy(jp.venues.items, (v) => v.city)).map(([city, venues]) => (
      <div key={city} className="mt-14">
        <h3 className={`${R} text-[40px] min-[768px]:text-[48px] leading-none tracking-[0.01em]`}>{city}</h3>
        {venues.map(({ name, dates, hours, map }) => (
          <div key={name} className="mt-8 grid gap-6 min-[768px]:grid-cols-2 min-[768px]:gap-10">
            <div>
              <p className={`${KM} whitespace-pre-line text-[22px] leading-[1.3] tracking-[0.01em] text-[#ebebeb]`}>{name}</p>
              <p className={`${KR} mt-5 inline-block border border-[#b10000] px-4 py-2.5 text-[22px] leading-none tracking-[0.01em] text-[#b30000]`}>{dates}</p>
              {hours && <p className={`${R} mt-5 whitespace-pre-line text-[17px] leading-[1.5] tracking-[0.01em] text-[#ebebeb]`}>{hours}</p>}
            </div>
            <iframe src={mapEmbed(map)} title={name} loading="lazy" className="w-full h-[260px] min-[768px]:h-[280px] border-0 grayscale invert-[0.9]" />
          </div>
        ))}
      </div>
    ))}
  </section>
);

const TabletFund = () => (
  <section id="fund" className={`${RED} ${T_SECTION}`}>
    <div className={T_WRAP}>
      <h2 className={`${KR} text-center text-balance text-[40px] min-[768px]:text-[48px] leading-[1.2]`}>{jp.fund.heading}</h2>
      <div className={`${KR} mt-10 text-[18px] leading-[1.6] tracking-[0.01em] space-y-[1.2em] text-white`}>
        <RichText blocks={toBlocks(jp.fund.text)} strongClassName="font-bold" />
      </div>
      <a
        href={jp.fund.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${KM} mt-12 mx-auto flex items-center justify-center max-w-[460px] h-[60px] bg-[#fbfbfb] text-[20px] tracking-[0.05em] text-[#b10000]`}
      >
        {jp.fund.button}
      </a>
    </div>
  </section>
);

const TabletMission = () => (
  <section className={T_SECTION}>
    <div className={`${T_WRAP} grid gap-10 min-[900px]:grid-cols-[5fr_6fr] min-[900px]:gap-12 items-start`}>
      <div className="relative aspect-[16/10] min-[900px]:aspect-[469/694]">
        <img src="/legacy/team.png" alt="" className="w-full h-full object-cover object-[60%_50%]" />
        <p className={`${KM} absolute left-[13px] bottom-[9px] text-[12px] text-[#ebebeb]`}>{jp.photoCredit}</p>
      </div>
      <div className="space-y-12">
        {[
          [jp.purpose, "text-[#ebebeb]"],
          [jp.team, "text-white"],
        ].map(([block, color]) => (
          <div key={block.heading}>
            <h2 className={T_H2}>{block.heading}</h2>
            <div className={`${T_BODY} ${color} mt-6`}>
              <RichText blocks={toBlocks(block.text)} strongClassName={RED_RUN} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Logos keep their desktop proportions at 80%, wrapped and centered
const TabletLogos = ({ heading, logos, texts, className }) => (
  <section className={cn(T_SECTION, className)}>
    <div className={T_WRAP}>
      <h2 className={T_H2}>{heading}</h2>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-10">
        {logos.map(({ name, src, href, w, h }) => {
          const img = <img src={src} alt={name} loading="lazy" className="object-contain" style={{ width: w * 0.8, height: h * 0.8 }} />;
          return href ? (
            <a key={src} href={href} target="_blank" rel="noopener noreferrer">
              {img}
            </a>
          ) : (
            <span key={src}>{img}</span>
          );
        })}
        {texts
          .filter(({ size }) => size !== 10) // the tiny caption belongs to the UCRDC logo, which already names it
          .map(({ text, size }) => (
            <p key={text} className={cn(KR, "whitespace-pre text-center text-[#ebebeb]", size === 24 ? "text-[22px] leading-[1.4]" : "text-[17px]")}>
              {text}
            </p>
          ))}
      </div>
    </div>
  </section>
);

const TabletFaq = () => {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className={T_SECTION}>
      <div className={`${T_WRAP} grid gap-8 min-[900px]:grid-cols-[2fr_3fr] min-[900px]:gap-12`}>
        <h2 className={`${T_H2} relative self-start justify-self-start whitespace-nowrap`}>
          {jp.faq.heading}
          <img src="/legacy/ornament.png" alt="" className="absolute left-full ml-1 top-[0.35em] w-[1.3em] h-auto" />
        </h2>
        <div>
          {jp.faq.items.map(({ question, answer }, i) => (
            <div key={question} className="border-b border-[#b10000]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 py-7 text-left cursor-pointer"
                aria-expanded={open === i}
              >
                <span className={`${KR} text-[17px] leading-[1.5] text-[#ebebeb]`}>{question}</span>
                <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" stroke="#ebebeb" strokeWidth="1">
                  <path d="M12 4v16" className={cn("transition-opacity", open === i && "opacity-0")} />
                  <path d="M4 12h16" />
                </svg>
              </button>
              {open === i && (
                <div className={`${KM} -mt-2 pb-8 text-[16px] leading-[1.6] text-[#ebebeb]`}>
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

const TabletPage = () => (
  <>
    <TabletHeader />
    <TabletHero />
    <TabletText id="about" heading={jp.about.heading} headingClass={`${KM} text-[34px] min-[768px]:text-[40px] min-[900px]:text-[34px] leading-[1.4] whitespace-pre-line text-white`} text={jp.about.text} />
    <Banner />
    <TabletText id="classroom" className="bg-theme-bg-grey" heading={jp.classroom.heading} text={jp.classroom.text} textColor="text-white" />
    <TabletGallery />
    <TabletVenues />
    <TabletFund />
    <TabletMission />
    <TabletLogos heading={jp.sponsors.heading} logos={jp.sponsors.logos} texts={jp.sponsors.texts} />
    <TabletLogos heading={jp.partners.heading} logos={jp.partners.logos} texts={jp.partners.texts} className="bg-theme-bg-grey" />
    <TabletFaq />
  </>
);

// Phones get the 320px mobile layout scaled to the screen, exactly like Wix's <meta name="viewport" content="width=320">
const usePhoneViewport = () =>
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta || window.screen.width >= 600) return;
    const previous = meta.content;
    meta.content = "width=320, user-scalable=yes";
    return () => {
      meta.content = previous;
    };
  }, []);

// The 1:1 copy of the old page: mobile (<600px) and desktop (≥1100px) Wix layouts
const WixPage = () => (
  <>
    <Header />
    <Hero />
    <TwoColumns
      id="about"
      h={358}
      mh={528}
      heading={jp.about.heading}
      headingClass={`${KM} whitespace-pre-line text-[28px] leading-[38px] min-[600px]:text-[50px] min-[600px]:leading-[75px] text-white`}
      headingAt={at([0, 66, 416], [15, 41, 225])}
      text={jp.about.text}
      textClass={`${BODY16} text-[#ebebeb]`}
      textAt={at([509, 70, 491], [15, 161, 281])}
    />
    <Banner />
    <TwoColumns
      id="classroom"
      h={579}
      mh={663}
      className="bg-theme-bg-grey"
      heading={jp.classroom.heading}
      headingClass={H56}
      headingAt={at([0, 140, 284], [16, 21, 153])}
      text={jp.classroom.text}
      textClass={`${BODY16} text-white`}
      textAt={at([510, 146, 485], [16, 75, 282])}
    />
    <Gallery />
    <Venues />
    <Fund />
    <Mission />
    <Logos heading={jp.sponsors.heading} logos={jp.sponsors.logos} texts={jp.sponsors.texts} h={765} mh={833} headingAt={at([-38, 88], [16, 62])} />
    <Logos
      heading={jp.partners.heading}
      logos={jp.partners.logos}
      texts={jp.partners.texts}
      h={520}
      mh={693}
      headingAt={at([-43, 88], [15, 47])}
      className="bg-theme-bg-grey"
    />
    <Faq />
  </>
);

export default function JapanPage() {
  usePhoneViewport();
  const tablet = useMediaQuery(TABLET_QUERY);
  return (
    <div className="bg-theme-bg text-[#ebebeb] overflow-x-hidden">
      <title>{jp.metaTitle}</title>
      <meta name="description" content={jp.metaDescription} />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&text=0123456789%2F%3A%28%29%20&display=swap" precedence="default" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@300&display=swap" precedence="default" />
      <style href="jp-fonts" precedence="default">{FONTS}</style>
      {tablet ? <TabletPage /> : <WixPage />}
    </div>
  );
}
