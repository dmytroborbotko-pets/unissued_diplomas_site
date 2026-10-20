import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";
import { toBlocks } from "../utils/markup";

export const StoriesSection = () => {
  const { stories } = useContent();

  return (
    <section className="w-full bg-theme-bg-grey text-theme-text">
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 py-(--section-space) flex flex-col items-center text-center">
        <h2 className="font-heading font-normal uppercase leading-tight whitespace-pre-line text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px] max-w-[900px] mb-8">
          {stories.heading}
        </h2>

        <div className="space-y-5 text-[15px] tablet:text-[16px] leading-7 text-theme-text-muted max-w-[620px] mb-10">
          <RichText blocks={toBlocks(stories.text)} />
        </div>

        <div className="flex items-center gap-4">
          <a
            href={stories.button.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 mobile-sm:px-12 py-2 bg-theme-primary-dark text-white font-[500] tracking-widest hover:bg-theme-primary transition-colors"
          >
            {stories.button.label}
          </a>
          <a href="https://twitter.com/memorialua" target="_blank" rel="noopener noreferrer" aria-label="Memorial on X (Twitter)">
            <img src="/legacy/memorial-x.png" alt="" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
};
