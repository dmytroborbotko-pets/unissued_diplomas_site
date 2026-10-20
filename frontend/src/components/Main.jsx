import { Link } from "react-router-dom";
import { ActionBlock } from "../shared/ActionBlock";
import HomeVyshyvankaIcon from "../assets/HomeVyshyvankaIcon.png";
import { RightArrowLongIcon } from "../assets/RightArrowLongIcon";
import { Banner } from "./Banner";
import { HallOfDiplomas } from "./HallOfDiplomas";
import { ExhibitionList } from "./ExhibitionList";
import { DonateSection } from "./DonateSection";
import { MissionSection } from "./MissionSection";
import { StoriesSection } from "./StoriesSection";
import { LogoSection } from "../shared/LogoSection";
import { FAQSection } from "./FAQSection";
import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";
import { toBlocks } from "../utils/markup";

const ORGANIZER_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSevvnb-yj7pCqaW6yK-lJM6jDjMrsXC4_nxjXZzgg3euD2-vA/viewform";

// Logo images + name-only credits → LogoSection items
const logoItems = ({ logos, names }) => [
  ...logos.map(({ name, href, src }) => ({ documentId: src, name, url: href, logo: { url: src }, size: "wide" })),
  ...names.map((name) => ({ documentId: name, name })),
];

// Home: same sections, order and texts as the old site (texts/<lang>.json)
export const Main = () => {
  const t = useContent();
  const { hero } = t;
  // ponytail: the icon is placed by em offsets over the "O" of DIPLOMAS; other titles get none
  const titleIcon = hero.title === "UNISSUED DIPLOMAS" && { src: HomeVyshyvankaIcon, alt: "" };

  const donate = (
    <DonateSection
      key="donate"
      heading={t.donate.heading}
      text={toBlocks(t.donate.text)}
      buttons={[t.donate.usd, t.donate.cad]}
      plain
    />
  );
  const mission = (
    <MissionSection
      key="mission"
      sections={[
        { title: t.mission.heading, text: toBlocks(t.mission.text) },
        { title: t.team.heading, text: toBlocks(t.team.text) },
      ]}
      photoCredit={t.photoCredit}
    />
  );
  const stories = <StoriesSection key="stories" />;

  return (
    <section className="bg-theme-bg text-theme-text mt-4 min-h-screen">
      <main className="p-4 tablet:p-0 max-w-[1080px] mx-auto">
        <div className="flex flex-col mobile-xs:gap-5 tablet:grid tablet:grid-cols-2 tablet:gap-4 tablet:px-4 mobile-xs:px-1 tablet:mt-16">
          <ActionBlock
            title={hero.title.split(" ").length === 2 ? hero.title.split(" ") : hero.title}
            titleIcon={titleIcon}
            description={hero.tagline}
            variant="dark"
            titleFont="font-normal"
            titleSize="tablet:text-[60px] tablet-md:text-[70px]"
            titleLineHeight="1"
            descriptionFont="font-normal"
            href="/#about"
          />
          <ActionBlock title={hero.visit} variant="dark" titleFont="font-[800]" hasBorder href="/#exhibitions" />
          <a href={ORGANIZER_FORM} target="_blank" rel="noopener noreferrer">
            <ActionBlock title={hero.host} variant="red" titleFont="font-[800]" />
          </a>
          <ActionBlock title={hero.donate} variant="white" titleFont="font-[800]" href="/#donate" />
        </div>

        <div id="about" className="scroll-mt-24 tablet:px-4 mobile-xs:px-1 pt-(--section-space) pb-(--section-space)">
          <div className="flex flex-col tablet:grid tablet:grid-cols-2 tablet:gap-8">
            <h2 className="text-[#ebebeb] max-tablet:text-[38px] tablet:text-[58px] font-normal uppercase leading-none whitespace-pre-line">
              {t.about.heading}
            </h2>
            <div className="mt-8 tablet:mt-0 space-y-6">
              <RichText
                blocks={toBlocks(t.about.text)}
                className="text-[#ebebeb] max-tablet:text-[17px] tablet:text-[16px] leading-7 tablet:leading-6"
                strongClassName="text-[#ff6868] font-normal"
              />
            </div>
          </div>
        </div>
      </main>

      {/* 2023 results teaser */}
      <div className="bg-theme-bg-grey">
        <div className="max-w-[1080px] mx-auto px-4 py-10">
          <p className="text-[16px] leading-6">{t.results2023.text}</p>
          <Link
            to="/2023-achievements"
            className="mt-6 flex items-center justify-between w-full bg-white text-theme-bg px-4 py-2 transition-colors hover:bg-theme-primary-dark hover:text-white"
          >
            <span className="text-[18px] tablet:text-[22px] font-[800] uppercase tracking-wide">{t.results2023.button}</span>
            <RightArrowLongIcon className="w-16 h-4 shrink-0" />
          </Link>
        </div>
      </div>

      <Banner text={t.banner} image="/legacy/never-graduated.jpg" />
      <HallOfDiplomas />
      <ExhibitionList />
      {/* The English page shows the donate block before the mission; translations after the stories */}
      {t.donateFirst ? [donate, mission, stories] : [mission, stories, donate]}
      <LogoSection heading={t.sponsors.heading} items={logoItems(t.sponsors)} variant="sponsors" className="bg-theme-bg" />
      <LogoSection heading={t.partners.heading} items={logoItems(t.partners)} variant="partners" className="bg-theme-bg-grey" />
      <FAQSection
        heading={t.faq.heading.replaceAll(" ", "\n")} // one word per line, as on the old site
        items={t.faq.items.map(({ q, a }) => ({ question: q, answer: toBlocks(a) }))}
      />
    </section>
  );
};
