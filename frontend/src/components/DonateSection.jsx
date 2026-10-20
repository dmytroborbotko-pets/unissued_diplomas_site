import { RichText } from "../shared/RichText";
import { cn } from "../utils/utils";

// `text`: rich text blocks; one button (`url` + `label`, /jp) or several (`buttons`, Home: USD and CAD)
// `plain`: old main-site look — flat red, left-aligned text, stacked buttons
export const DonateSection = ({ heading, text, url, label, buttons = [{ href: url, label }], plain }) => {
  return (
    <section
      id="donate"
      className={cn("w-full text-theme-text scroll-mt-20", plain && "bg-theme-primary-dark")}
      style={plain ? undefined : {
        background:
          "radial-gradient(ellipse at 70% 40%, #c80000 0%, #9a0000 45%, var(--color-theme-donate-bg) 100%)",
      }}
    >
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 py-(--section-space)">
        {/* Heading */}
        <h2 className="font-heading font-normal uppercase text-center leading-tight mb-8 tablet:mb-12 whitespace-pre-line
          text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]">
          {heading}
        </h2>

        {/* Body text */}
        <div className={cn("mx-auto space-y-6 text-[15px] mobile-sm:text-[16px] tablet:text-[17px] leading-7 tablet:leading-[1.75]", plain ? "tablet:text-[18px] tablet:leading-[1.4]" : "text-center")}>
          <RichText blocks={text} strongClassName="font-bold" />
        </div>

        {/* Buttons */}
        <div className={cn("mx-auto mt-10 flex flex-col gap-4", !plain && "tablet:mt-14 tablet:flex-row")}>
          {buttons.map((button) => (
            <a
              key={button.label}
              href={button.href || "#donate"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "block w-full text-center uppercase tracking-widest font-[500] bg-theme-accent text-theme-donate-bg",
                "border border-theme-accent transition-colors duration-200 hover:bg-transparent hover:text-theme-accent",
                plain ? "py-1.5 text-[13px]" : "py-2 tablet:py-3 text-[14px] mobile-sm:text-[15px] tablet:text-[16px]",
              )}
            >
              {button.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
