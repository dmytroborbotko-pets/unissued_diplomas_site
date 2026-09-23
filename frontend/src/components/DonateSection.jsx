import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";

export const DonateSection = () => {
  const { home } = useContent();

  return (
    <section
      id="donate"
      className="w-full text-theme-text scroll-mt-20"
      style={{
        background:
          "radial-gradient(ellipse at 70% 40%, #c80000 0%, #9a0000 45%, var(--color-theme-donate-bg) 100%)",
      }}
    >
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 py-(--section-space)">
        {/* Heading */}
        <h2 className="font-heading font-normal uppercase text-center leading-tight mb-8 tablet:mb-12 whitespace-pre-line
          text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]">
          {home.donateHeading}
        </h2>

        {/* Body text */}
        <div className="mx-auto space-y-6 text-center text-[15px] mobile-sm:text-[16px] tablet:text-[17px] leading-7 tablet:leading-[1.75]">
          <RichText blocks={home.donateText} strongClassName="font-bold" />
        </div>

        {/* Button */}
        <div className="mx-auto mt-10 tablet:mt-14 flex flex-col">
          <a
            href={home.donateUrl || "#donate"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 tablet:py-3 text-center uppercase tracking-widest font-[500]
              text-[14px] mobile-sm:text-[15px] tablet:text-[16px]
              bg-theme-accent text-theme-donate-bg
              border border-theme-accent
              transition-colors duration-200 hover:bg-transparent hover:text-theme-accent"
          >
            Donate
          </a>
        </div>
      </div>
    </section>
  );
};
