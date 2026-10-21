import { Link } from "react-router-dom";
import { RightArrowLongIcon } from "../assets/RightArrowLongIcon";
import { Banner } from "./Banner";
import { HallOfDiplomas } from "./HallOfDiplomas";
import { ExhibitionList } from "./ExhibitionList";
import { DonateSection } from "./DonateSection";
import { StoriesSection } from "./StoriesSection";
import { LegacyLogos } from "./LegacyLogos";
import { FAQSection } from "./FAQSection";
import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";
import { toBlocks } from "../utils/markup";
import { cn, ink, minH } from "../utils/utils";
import { Responsive } from "../shared/Responsive";

const ORGANIZER_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSevvnb-yj7pCqaW6yK-lJM6jDjMrsXC4_nxjXZzgg3euD2-vA/viewform";

// Content width of the old site (1057px)
export const WRAP = "max-w-[1089px] mx-auto px-4";

// Hero tile: 521×311 on desktop, arrow at the bottom right
const Tile = ({ to, href, className, children }) => {
  const body = (
    <>
      {children}
      <RightArrowLongIcon className="absolute right-[34px] bottom-[39px] w-[90px] tablet:w-[125px] h-4" />
    </>
  );
  const cls = cn("relative block h-[180px] tablet:h-[311px] text-white transition-opacity hover:opacity-90", className);
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
  ) : (
    <Link to={to} className={cls}>{body}</Link>
  );
};

const TileTitle = ({ width, top = 18, offset, children }) => (
  <h2 style={{ maxWidth: width, paddingTop: top, ...offset.style }} className={`box-content px-[34px] text-[28px] tablet:text-[32px] desktop:text-[39px] leading-[1.25] font-[800] uppercase whitespace-pre-line ${offset.className}`}>
    {children}
  </h2>
);

// Mission + team next to the red duotone photo (old site: 858px high, photo 437×648)
const MissionTeam = ({ mission, team, photoCredit, layout }) => (
  <section {...minH(layout, "mission", "bg-theme-bg text-[#ebebeb]")}>
    <div className={`${WRAP} max-tablet:px-[15px] pt-[63px] tablet:pt-[100px] pb-10 grid grid-cols-1 tablet:grid-cols-[437px_1fr] tablet:gap-x-[107px] tab:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] tab:gap-x-12 tab:pb-[72px]`}>
      <div className="relative mt-1 hidden tablet:block w-[437px] h-[648px] tab:w-full tab:h-auto tab:aspect-[437/648] tab:self-start">
        <img src="/legacy/team.jpg" alt="" loading="lazy" className="w-full h-full object-cover" />
        <p {...ink(layout, "photoCredit", "absolute left-[15px] bottom-[13px] text-[12px] font-[500] leading-[1.41]")}>{photoCredit}</p>
      </div>
      <div>
        {[mission, team].map(({ heading, text }, i) => (
          <div key={heading} className={i ? "mt-[52px] tablet:mt-[63px]" : ""}>
            <h2 {...ink(layout, i ? "teamHeading" : "missionHeading", "text-[30px] tablet:text-[56px] leading-[1.05] tracking-[0.01em] uppercase whitespace-pre-line")}>{heading}</h2>
            <div {...ink(layout, i ? "teamText" : "missionText", "mt-[31px] tablet:mt-[25px] max-w-[280px] tablet:max-w-[470px] space-y-[22px]")}>
              <RichText blocks={toBlocks(text)} className="text-[16px] leading-[1.4] tracking-[0.01em]" strongClassName="text-[#ff6868] font-normal" />
            </div>
            {/* phones: the photo sits between the mission and the team */}
            {!i && (
              <div className="tablet:hidden relative mt-[46px] w-[287px] h-[308px]">
                <img src="/legacy/team.jpg" alt="" loading="lazy" className="w-full h-full object-cover" />
                <p {...ink(layout, "photoCredit", "absolute left-[7px] bottom-[2px] text-[7px] font-[500] leading-[1.41]")}>{photoCredit}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Phones: the old 320px mobile hero — title with ornament, tagline, four full-width link rows
// Arrow of the old mobile hero rows: the Wix up-arrow shape turned right (≈21×10)
const RowArrow = ({ x, y, color }) => (
  <span className="absolute w-5 h-[10px] flex items-center justify-center" style={{ left: x, top: y }}>
    <svg viewBox="60 20 80 160" preserveAspectRatio="none" className="w-[10px] h-5 rotate-90 shrink-0" style={{ fill: color }}>
      <path d="M140 58.395l-37.001-37.146a4.232 4.232 0 0 0-6.003 0L60 58.395l6.003 6.028 29.099-29.216V180h9.796V35.209l29.099 29.212L140 58.395z" />
    </svg>
  </span>
);

// Phones: the old 320px mobile hero — title with ornament, tagline, four link rows placed as on the old page
// (texts `layout.m.heroRows`: box from the header bottom, its own line breaks, arrow position and colour)
const MobileHero = ({ hero, m }) => {
  const links = [{ to: "/#about" }, { to: "/#exhibitions" }, { href: ORGANIZER_FORM }, { to: "/#donate" }];
  return (
    <div style={{ "--mh": `${m.hero}px` }} className="tablet:hidden relative min-h-(--mh) px-4 pt-10 pb-[30px]">
      <h1 style={{ fontSize: m.titleSize }} className="relative max-w-[288px] leading-[0.9] tracking-[-0.02em] uppercase">
        {hero.title}
        <img src="/legacy/ornament.png" alt="" className="absolute left-[110px] top-[22px] w-[43px] h-[43px] object-contain" />
      </h1>
      {hero.tagline && (
        <p style={{ fontSize: m.tagline, maxWidth: m.taglineWidth }} className="mt-[18px] tracking-[0.05em]">{hero.tagline}</p>
      )}
      {m.heroRows.map(({ box: [x, y, w, h], border, bg, lines, arrow }, i) => {
        const { to, href } = links[i];
        const cls = `absolute block font-[800] text-[16px] leading-[19.2px] uppercase ${border ? "border border-white" : ""}`;
        const style = { left: x, top: y, width: w, height: h, background: bg, color: arrow[2] };
        const body = (
          <>
            {lines.map(([lx, ly, text]) => (
              <span key={text} className="absolute whitespace-nowrap" style={{ left: lx - (border ? 1 : 0), top: ly - (border ? 1 : 0) }}>{text}</span>
            ))}
            <RowArrow x={arrow[0] - (border ? 1 : 0)} y={arrow[1] - (border ? 1 : 0)} color={arrow[2]} />
          </>
        );
        return href ? (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{body}</a>
        ) : (
          <Link key={i} to={to} className={cls} style={style}>{body}</Link>
        );
      })}
    </div>
  );
};

// Home: same sections, order and texts as the old site (texts/<lang>.json)
export const Main = () => {
  const t = useContent();
  const { hero, layout: L } = t;
  const [titleSize, titleWidth, ornX, ornY] = L.heroTitle;
  const [tagSize, tagTop, tagWidth] = L.tagline;

  const donate = (
    <div key="donate" {...minH(L, "donate", "bg-theme-primary-dark max-tablet:order-first flex flex-col")}>
      <DonateSection heading={t.donate.heading} text={toBlocks(t.donate.text)} buttons={[t.donate.usd, t.donate.cad]} plain mobileHeading={L.m.donateHeading} headingOffset={ink(L, "donateHeading")} textOffset={ink(L, "donateText")} buttonsOffset={ink(L, "donateButtons")} mobileButtonsGap={L.m.donateButtonsGap} />
    </div>
  );
  const mission = <MissionTeam key="mission" mission={t.mission} team={t.team} photoCredit={t.photoCredit} layout={L} />;
  const stories = <StoriesSection key="stories" />;

  return (
    <section className="bg-theme-bg text-[#ebebeb]">
      {/* Hero: 4 tiles, sizes and offsets measured on the old site (desktop). The old header height differs per
          language (two-line menu items) while ours is 80px, hence the offsets */}
      <div style={{ "--pt": `${L.header - 11}px`, "--h": `${L.hero + L.header - 80}px` }} className={`${WRAP} max-tablet:hidden tablet:pt-(--pt) tablet:min-h-(--h) content-start grid tablet:grid-cols-2 gap-x-[14px] tablet:gap-y-[17px]`}>
        <Tile to="/#about" className="bg-theme-bg">
          {/* title box and ornament offset per language (texts `layout.heroTitle`), as placed on the old pages */}
          <h1
            style={{ "--fs": `${titleSize}px`, "--w": `${titleWidth}px`, top: L.ink?.d?.heroTitle?.[0] }}
            className="relative ml-[23px] mt-2 tablet:max-w-(--w) text-[48px] tablet:text-(length:--fs) tab:text-[min(var(--fs),7.6vw)] leading-[0.9] tracking-[-0.02em] uppercase text-[#ebebeb]"
          >
            {hero.title}
            {/* in em of the title, so it follows the title when tablets shrink it */}
            <img src="/legacy/ornament.png" alt="" style={{ left: `${ornX / titleSize}em`, top: `${ornY / titleSize}em`, width: `${83 / titleSize}em`, height: `${81 / titleSize}em` }} className="absolute object-contain max-tablet:hidden" />
          </h1>
          {hero.tagline && (
            <p
              style={{ top: tagTop, width: tagWidth, fontSize: tagSize }}
              className="absolute left-[31px] max-w-[85%] tracking-[0.05em] text-[#ebebeb] max-tablet:hidden"
            >
              {hero.tagline}
            </p>
          )}
        </Tile>
        <Tile to="/#exhibitions" className="bg-theme-bg border-2 border-white">
          <TileTitle width={L.tileWidths[0]} offset={ink(L, "tileVisit")}>{hero.visit}</TileTitle>
        </Tile>
        <Tile href={ORGANIZER_FORM} className="bg-theme-primary-dark">
          <TileTitle width={L.tileWidths[1]} top={11} offset={ink(L, "tileHost")}>{hero.host}</TileTitle>
        </Tile>
        <Tile to="/#donate" className="bg-white text-theme-bg">
          <TileTitle width={L.tileWidths[2]} offset={ink(L, "tileDonate")}>{hero.donate}</TileTitle>
        </Tile>
      </div>

      <MobileHero hero={hero} m={L.m} />

      <div id="about" {...minH(L, "about", `${WRAP} scroll-mt-24 pt-[37px] tablet:pt-[51px] pb-6 grid content-start grid-cols-1 tablet:grid-cols-[500px_498px] tablet:gap-x-[47px] tab:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] tab:gap-x-10 tab:pb-[72px]`)}>
        <h2 {...ink(L, "aboutHeading", "text-[30px] tablet:text-[56px] tab:text-[clamp(40px,5.15vw,56px)] leading-none tracking-[0.01em] uppercase whitespace-pre-line max-tablet:max-w-[226px]")}>{t.about.heading}</h2>
        <div {...ink(L, "aboutText", "mt-[36px] tablet:mt-[15px] tab:mt-0 space-y-[22px] max-tablet:max-w-[282px]")}>
          <RichText
            blocks={toBlocks(t.about.text)}
            className="text-[16px] leading-[1.4] tracking-[0.01em]"
            strongClassName="text-[#ff6868] font-normal"
          />
        </div>
      </div>

      {/* 2023 results teaser */}
      <div {...minH(L, "note", "bg-theme-bg-grey")}>
        <div className={`${WRAP} max-tablet:px-5 pt-[31px] tablet:pt-[39px] pb-[39px] tablet:pb-[45px]`}>
          <p className="text-[13px] tablet:text-[16px] tablet:pl-[3px]">{t.results2023.text}</p>
          <Link
            to="/2023-achievements"
            className="mt-[25px] tablet:mt-[33px] h-[74px] tablet:h-[61px] flex items-center justify-between w-full bg-white text-theme-bg pl-[17px] pr-[17px] tablet:pl-[23px] tablet:pr-4 transition-colors hover:bg-theme-primary-dark hover:text-white"
          >
            <span {...ink(L, "results2023Button", "font-[800] text-[16px] tablet:text-[22px] uppercase tracking-[0.05em] max-tablet:max-w-[209px] leading-[1.35] text-black max-tablet:text-theme-bg")}><Responsive mobile={t.mobileText.results2023Button}>{t.results2023.button}</Responsive></span>
            <RightArrowLongIcon className="w-[34px] tablet:w-[70px] h-[17px] tablet:h-4 shrink-0" />
          </Link>
        </div>
      </div>

      <Banner text={t.banner} image="/legacy/never-graduated.jpg" mobileHeight={L.m.banner} offset={ink(L, "banner")} width={L.bannerWidth} />
      <HallOfDiplomas />
      <ExhibitionList />
      {/* Desktop: English shows the donate block before the mission, translations after the stories.
          Phones: every language has it first */}
      <div className="flex flex-col">
        {t.donateFirst ? [donate, mission, stories] : [mission, stories, donate]}
      </div>
      <LegacyLogos kind="sponsors" {...t.sponsors} className="bg-theme-bg" minHeight={L.sponsors} mobileMinHeight={L.m.sponsors} offset={ink(L, "sponsorsHeading")} />
      <LegacyLogos kind="partners" {...t.partners} className="bg-theme-bg-grey" minHeight={L.partners} mobileMinHeight={L.m.partners} gap={L.partnersGap} offset={ink(L, "partnersHeading")} />
      <div {...minH(L, "faq", "bg-theme-bg")}>
        <FAQSection
          heading={t.faq.heading.replaceAll(" ", "\n")} // one word per line, as on the old site
          items={t.faq.items.map(({ q, a }) => ({ question: q, answer: toBlocks(a) }))}
          legacy
          offset={ink(L, "faqItems")}
        />
      </div>
    </section>
  );
};
