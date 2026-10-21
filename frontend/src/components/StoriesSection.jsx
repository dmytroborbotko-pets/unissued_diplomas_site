import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";
import { toBlocks } from "../utils/markup";
import { Responsive } from "../shared/Responsive";
import { ink } from "../utils/utils";

export const StoriesSection = () => {
  const { stories, layout, mobileText } = useContent();
  const sb = layout.storiesButton;

  return (
    <section className="w-full bg-theme-bg-grey text-[#ebebeb] tablet:min-h-(--h) max-tablet:min-h-(--mh) tab:min-h-0 tab:pb-16" style={{ "--h": `${layout.stories}px`, "--mh": `${layout.m.stories}px`, "--pt": `${layout.storiesTop}px`, "--w": `${layout.storiesWidth}px` }}>
      <div className="max-w-[1089px] mx-auto px-4 tablet:pt-(--pt) max-tablet:pt-[60px] pb-6 flex flex-col max-tablet:items-start items-center max-tablet:text-left text-center max-tablet:px-[15px]">
        <h2 {...ink(layout, "storiesHeading", "font-normal uppercase leading-[1.05] tracking-[0.01em] whitespace-pre-line text-[30px] tablet:text-[56px] max-tablet:leading-none max-w-[287px] tablet:max-w-(--w)")}>
          {stories.heading}
        </h2>

        <div {...ink(layout, "storiesText", "mt-[33px] text-[16px] leading-[1.4] tracking-[0.01em] max-w-[287px] tablet:max-w-[587px]")}>
          <RichText blocks={toBlocks(stories.text)} />
        </div>

        {/* button size, icon gap and placement per language as on the old pages (texts `layout.storiesButton`) */}
        <div {...ink(layout, "storiesButton", "relative mt-[42px] tablet:mt-[33px] max-tablet:ml-(--mx) tablet:left-(--dx) tab:left-0")} style={{ ...ink(layout, "storiesButton").style, "--mx": `${sb.m[4]}px`, "--dx": `${sb.d[2]}px` }}>
          <a
            href={stories.button.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--w": `${sb.d[0]}px`, "--mw": `${sb.m[0]}px`, "--mh": `${sb.m[1]}px`, "--mfs": `${sb.m[5]}px` }}
            className={`flex items-center justify-center text-center w-(--mw) tablet:w-(--w) h-(--mh) tablet:h-[37px] text-(length:--mfs) tablet:text-[16px] font-[500] tablet:whitespace-nowrap bg-theme-primary-dark hover:bg-theme-primary transition-colors ${sb.m[5] > 12 ? "max-tablet:tracking-normal tablet:tracking-[0.05em]" : "tracking-[0.05em]"}`}
          >
            {/* old Ukrainian phone page: one line cut with "…" */}
            <span className={sb.m[7] ? "max-tablet:block max-tablet:w-full max-tablet:pl-px max-tablet:text-left max-tablet:truncate" : undefined}>
              <Responsive mobile={mobileText.storiesButton}>{stories.button.label}</Responsive>
            </span>
          </a>
          <a
            href="https://twitter.com/memorialua"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Memorial on X (Twitter)"
            style={{ "--gap": `${sb.d[1]}px`, "--mgap": `${sb.m[2]}px`, "--mdy": `${sb.m[3]}px` }}
            className={`absolute w-max max-tablet:left-[calc(100%+var(--mgap))] max-tablet:top-(--mdy) tablet:left-[calc(100%+var(--gap))] tablet:top-[-1px] ${sb.m[6] ? "" : "max-tablet:hidden"}`}
          >
            <img src="/legacy/memorial-x.png" alt="" className="max-w-none w-[30px] h-[30px] tablet:w-10 tablet:h-10" />
          </a>
        </div>
      </div>
    </section>
  );
};
