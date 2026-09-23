import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";

export const StoriesSection = () => {
  const { home } = useContent();

  return (
    <section className="w-full bg-theme-bg-grey text-theme-text">
      <div
        className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3
          py-(--section-space)
          flex flex-col items-center text-center"
      >
        <h2
          className="font-heading font-normal uppercase leading-tight whitespace-pre-line
             text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]
            max-w-[900px] mb-8 tablet:mb-12"
        >
          {home.storiesHeading}
        </h2>

        <div
          className="space-y-5 text-[14px] mobile-sm:text-[15px] tablet:text-[16px]
            leading-7 tablet:leading-[1.75] text-theme-text-muted
            max-w-[620px] mb-4 tablet:mb-12"
        >
          <RichText blocks={home.storiesText} />
        </div>

        <a
          href={home.storiesLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 mobile-sm:px-12 py-2 bg-theme-primary-dark text-white font-[500] tracking-widest rounded hover:bg-theme-primary transition-colors"
        >
          Explore more stories on Memorial
        </a>
      </div>
    </section>
  );
};
