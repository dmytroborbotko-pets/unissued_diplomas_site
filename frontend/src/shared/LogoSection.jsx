import { Fragment } from "react";
import { cn } from "../utils/utils";
import { mediaUrl } from "../utils/media";

// Box per Strapi `size` value; partners are shown larger than sponsors (as in the Figma placeholders)
const SIZES = {
  sponsors: {
    wide: "h-[48px] mobile-sm:h-[56px] tablet:h-[64px] w-[100px] mobile-sm:w-[120px] tablet:w-[140px] tablet-md:w-[160px]",
    square: "w-[60px] h-[60px] mobile-sm:w-[70px] mobile-sm:h-[70px] tablet:w-[80px] tablet:h-[80px]",
    text: "h-[48px] w-[140px] mobile-sm:w-[160px] tablet:w-[180px]",
    bordered: "border border-white/30 p-2 w-[120px] h-[64px] mobile-sm:w-[140px] mobile-sm:h-[72px] tablet:w-[160px] tablet:h-[80px]",
  },
  partners: {
    wide: "h-[56px] mobile-sm:h-[64px] tablet:h-[72px] w-[140px] mobile-sm:w-[160px] tablet:w-[220px] tablet-md:w-[260px]",
    square: "w-[72px] h-[72px] tablet:w-[88px] tablet:h-[88px]",
    text: "h-[56px] mobile-sm:h-[64px] tablet:h-[72px] w-[140px] mobile-sm:w-[160px] tablet:w-[200px]",
    bordered: "border border-white/30 p-2 w-[140px] h-[64px] mobile-sm:w-[160px] mobile-sm:h-[72px] tablet:w-[200px] tablet:h-[80px]",
  },
};

export const LogoSection = ({ heading, items, variant, className }) => {
  if (!items.length) return null;

  return (
    <section className={cn("w-full text-theme-text", className)}>
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4 py-(--section-space)">
        <h2
          className="font-heading font-normal uppercase leading-none mb-8 tablet:mb-12
            text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]"
        >
          {heading}
        </h2>

        <div className="flex flex-wrap gap-5 tablet:gap-8 tablet-md:gap-10 items-center">
          {items.map((item) => {
            const logo = (
              <img
                src={mediaUrl(item.logo, "small")}
                alt={item.name}
                loading="lazy"
                className={cn("flex-shrink-0 object-contain", SIZES[variant][item.size])}
              />
            );
            return item.url ? (
              <a key={item.documentId} href={item.url} target="_blank" rel="noopener noreferrer">
                {logo}
              </a>
            ) : (
              <Fragment key={item.documentId}>{logo}</Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};
