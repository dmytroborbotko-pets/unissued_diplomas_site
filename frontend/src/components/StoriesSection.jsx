import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";
import { toBlocks } from "../utils/markup";
import { Responsive } from "../shared/Responsive";
import { ink } from "../utils/utils";

export const StoriesSection = () => {
  const { stories, layout, mobileText } = useContent();

  return (
    <section className="w-full bg-theme-bg-grey text-[#ebebeb] tablet:min-h-(--h) max-tablet:min-h-(--mh) tab:min-h-0 tab:pb-16" style={{ "--h": `${layout.stories}px`, "--mh": `${layout.m.stories}px`, "--pt": `${layout.storiesTop}px`, "--w": `${layout.storiesWidth}px` }}>
      <div className="max-w-[1089px] mx-auto px-4 tablet:pt-(--pt) max-tablet:pt-[60px] pb-6 flex flex-col max-tablet:items-start items-center max-tablet:text-left text-center max-tablet:px-[15px]">
        <h2 {...ink(layout, "storiesHeading", "font-normal uppercase leading-[1.05] tracking-[0.01em] whitespace-pre-line text-[30px] tablet:text-[56px] max-tablet:leading-none max-w-[287px] tablet:max-w-(--w)")}>
          {stories.heading}
        </h2>

        <div {...ink(layout, "storiesText", "mt-[33px] text-[16px] leading-[1.4] tracking-[0.01em] max-w-[287px] tablet:max-w-[587px]")}>
          <RichText blocks={toBlocks(stories.text)} />
        </div>

        <div {...ink(layout, "storiesButton", "relative mt-[42px] tablet:mt-[33px]")}>
          <a
            href={stories.button.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-[226px] tablet:w-[409px] h-[30px] tablet:h-[37px] text-[12px] tablet:text-[16px] font-[500] tracking-[0.05em] whitespace-nowrap bg-theme-primary-dark tracking-[0.05em] hover:bg-theme-primary transition-colors"
          >
            <Responsive mobile={mobileText.storiesButton}>{stories.button.label}</Responsive>
          </a>
          <a href="https://twitter.com/memorialua" target="_blank" rel="noopener noreferrer" aria-label="Memorial on X (Twitter)" className="absolute left-[calc(100%+24px)] tablet:left-[calc(100%+20px)] top-0 tablet:top-[-1px]">
            <img src="/legacy/memorial-x.png" alt="" className="w-[30px] h-[30px] tablet:w-10 tablet:h-10" />
          </a>
        </div>
      </div>
    </section>
  );
};
