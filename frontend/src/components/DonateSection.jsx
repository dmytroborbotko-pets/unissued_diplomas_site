import { RichText } from "../shared/RichText";
import { cn } from "../utils/utils";

const NONE = { className: "", style: undefined };

// `text`: rich text blocks; one button (`url` + `label`, /jp) or several (`buttons`, Home: USD and CAD)
// `plain`: old main-site look — flat red, left-aligned text, stacked buttons
// `headingOffset` / `textOffset`: measured shifts from `ink()`; `mobileHeading`: {size, width, tracking} of the old phone layout (Home)
export const DonateSection = ({ heading, text, url, label, buttons = [{ href: url, label }], plain, headingOffset = NONE, textOffset = NONE, buttonsOffset = NONE, mobileButtonsGap = 29, mobileHeading = {} }) => {
  return (
    <section
      id="donate"
      className={cn("w-full text-theme-text scroll-mt-20", plain && "bg-theme-primary-dark max-tablet:flex-1 max-tablet:flex max-tablet:flex-col")}
      style={plain ? undefined : {
        background:
          "radial-gradient(ellipse at 70% 40%, #c80000 0%, #9a0000 45%, var(--color-theme-donate-bg) 100%)",
      }}
    >
      <div className={cn("mx-auto px-4", plain ? "max-w-[1089px] max-tablet:px-4 pt-6 tablet:pt-[41px] pb-[52px] tablet:pb-6 max-tablet:flex-1 max-tablet:flex max-tablet:flex-col w-full" : "max-w-[1080px] mobile-xs:px-3 py-(--section-space)")}>
        {/* Heading */}
        <h2 style={{ "--mfs": `${mobileHeading.size ?? 28}px`, "--mw": mobileHeading.width ? `${mobileHeading.width}px` : "none", "--mls": mobileHeading.tracking ?? "normal", ...headingOffset.style }} className={cn(headingOffset.className, "font-heading font-normal uppercase text-center whitespace-pre-line text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]",
          plain ? "max-tablet:px-1 max-tablet:text-(length:--mfs)! max-tablet:max-w-(--mw) max-tablet:mx-auto max-tablet:tracking-(--mls) leading-none tablet:leading-[1.05] text-[#ebebeb] mb-[33px] tablet:mb-[50px]" : "leading-tight mb-8 tablet:mb-12")}>
          {heading}
        </h2>

        {/* Body text */}
        <div style={textOffset.style} className={cn(textOffset.className, "mx-auto space-y-6 text-[15px] mobile-sm:text-[16px] tablet:text-[17px] leading-7 tablet:leading-[1.75]", plain ? "max-tablet:px-1 max-tablet:text-[17px] max-tablet:leading-[1.4] tablet:text-[18px] tablet:leading-[1.4] tracking-[0.01em] space-y-[24px] tablet:space-y-[25px]" : "text-center")}>
          <RichText blocks={text} strongClassName="font-bold" />
        </div>

        {/* Buttons */}
        <div style={{ "--mgap": `${mobileButtonsGap}px`,...buttonsOffset.style }} className={cn(buttonsOffset.className, "mx-auto flex flex-col", plain ? "w-full mt-[34px] max-tablet:mt-auto tablet:mt-[63px] max-tablet:gap-(--mgap) tablet:gap-[18px]" : "mt-10 gap-4 tablet:mt-14 tablet:flex-row")}>
          {buttons.map((button) => (
            <a
              key={button.label}
              href={button.href || "#donate"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "block w-full text-center uppercase tracking-widest font-[500] bg-theme-accent text-theme-donate-bg",
                "border border-theme-accent transition-colors duration-200 hover:bg-transparent hover:text-theme-accent",
                plain ? "h-[49px] tablet:h-[52px] flex items-center justify-center text-[13px] tablet:text-[16px] tracking-[0.05em] font-[500] bg-[#fbfbfb] text-theme-primary-dark" : "py-2 tablet:py-3 text-[14px] mobile-sm:text-[15px] tablet:text-[16px]",
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
