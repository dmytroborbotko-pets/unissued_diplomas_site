import { ActionBlock } from "../shared/ActionBlock";
import HomeVyshyvankaIcon from "../assets/HomeVyshyvankaIcon.png";
import { Achievements } from "./Achievements";
import { HallOfDiplomas } from "./HallOfDiplomas";
import { ExhibitionMap } from "./ExhibitionMap";
import { DonateSection } from "./DonateSection";
import { MissionSection } from "./MissionSection";
import { StoriesSection } from "./StoriesSection";
import { SponsorsSection } from "./SponsorsSection";
import { PartnersSection } from "./PartnersSection";
import { FAQSection } from "./FAQSection";
import { useLanguage } from "../hooks/useLanguage";
import { ACTION_BLOCK_TITLES } from "../config/actionBlockTitles";

export const Main = () => {
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage ?? "en";
  const b2 = ACTION_BLOCK_TITLES.block2[lang] ?? ACTION_BLOCK_TITLES.block2.en;
  const b3 = ACTION_BLOCK_TITLES.block3[lang] ?? ACTION_BLOCK_TITLES.block3.en;
  const b4 = ACTION_BLOCK_TITLES.block4[lang] ?? ACTION_BLOCK_TITLES.block4.en;

  return (
    <section className="bg-theme-bg text-theme-text mt-4 min-h-screen">
      <main className="p-4 tablet:p-0 max-w-[1080px] mx-auto">
        <div className="tablet:px-4 mobile-xs:px-1 tablet:hidden my-[30px]">
          <p className="flex flex-col font-normal tablet:text-[70px] mobile-sm:text-[58px] mobile-lg:text-[60px] mobile-xs:text-[48px] leading-none relative">
            <span>UNISSUED</span>
            <span>DIPLOMAS</span>
            <img
              src={HomeVyshyvankaIcon}
              alt={""}
              className="absolute top-[1.1em] left-[2.96em] -translate-y-1/2 w-[1.11em] h-[1.11em] object-contain"
            />
          </p>
          <p className="font-normal mt-[20px] text-[15px] max-w-[75%] letter-spacing-[0.05em]">
            When your classroom turns into a battlefield, your major becomes
            bravery.
          </p>
        </div>
        <div className="flex flex-col mobile-xs:gap-5 tablet:grid tablet:grid-cols-2 tablet:gap-4 tablet:px-4 mobile-xs:px-1 tablet:mt-16">
          {/* Block 1: Dark with title image and description */}
          <ActionBlock
            title={["UNISSUED", "DIPLOMAS"]}
            titleIcon={{
              src: HomeVyshyvankaIcon,
              alt: "Vyshyvanka",
            }}
            mobileTitle="ABOUT THE PROJECT"
            description="When your classroom turns into a battlefield, your major becomes bravery."
            variant="dark"
            titleFont="font-normal"
            titleSize="tablet:text-[60px] tablet-md:text-[70px]"
            titleLineHeight="1"
            descriptionFont="font-normal"
            href="/unissued-diplomas"
          />

          {/* Block 2: Dark with border */}
          <ActionBlock
            title={b2.title}
            mobileTitle={b2.mobileTitle}
            variant="dark"
            titleFont="font-[800]"
            hasBorder
            href="/exhibitions"
          />

          {/* Block 3: Red */}
          <ActionBlock
            title={b3.title}
            mobileTitle={b3.mobileTitle}
            variant="red"
            titleFont="font-[800]"
            href="/host-exhibition"
          />

          {/* Block 4: White */}
          <ActionBlock
            title={b4.title}
            mobileTitle={b4.mobileTitle}
            variant="white"
            titleFont="font-[800]"
            href="/donate"
          />
        </div>

        {/* What's the Project About Section */}
        <div className="tablet:px-4 mobile-xs:px-1 mt-20 tablet:mt-28">
          <div className="flex flex-col tablet:grid tablet:grid-cols-2 tablet:gap-8">
            {/* Left: Heading */}
            <div>
              <h2 className=" max-tablet:text-[38px] tablet:text-[58px] font-normal uppercase leading-none">
                WHAT'S <br /> THE PROJECT <br /> ABOUT?
              </h2>
            </div>

            {/* Right: Content */}
            <div className="mt-10 tablet:mt-0 space-y-6">
              <p className="max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6">
                We created this exhibition to remind the world about the ongoing
                war and the price Ukrainians pay daily in their fight for
                freedom. "Unissued Diplomas" honours the memory of Ukrainian
                students who will never graduate because their lives were taken
                by the russian invasion.
              </p>
              <p className="max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6">
                <span className="text-[#ff6868] font-[500] max-tablet:text-[20px] tablet:text-[16px]">
                  The "Unissued Diplomas" exhibition uncovers the stories of 40
                  Ukrainian students killed in the war.
                </span>{" "}
                In 2024, it will be held in different institutions worldwide on
                February 24, which marks the anniversary of the day all Ukraine
                woke up from explosions.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Achievements />
      <HallOfDiplomas />
      <ExhibitionMap />
      <DonateSection />
      <MissionSection />
      <StoriesSection />
      <SponsorsSection />
      <PartnersSection />
      <FAQSection />
    </section>
  );
};
