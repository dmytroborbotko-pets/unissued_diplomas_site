import { Link } from "react-router-dom";
import { cn } from "../utils/utils";
import { RightArrowLongIcon } from "../assets/RightArrowLongIcon";

export function ActionBlock({
  title,
  titleIcon,
  mobileTitle,
  description,
  variant = "dark",
  titleFont,
  titleSize,
  titleLineHeight = "1.25em",
  descriptionFont,
  hasBorder = false,
  href = "#",
  className,
}) {
  const bgColors = {
    dark: "bg-[var(--color-theme-bg)]",
    red: "bg-[var(--color-theme-primary-dark)]",
    white: "bg-white",
  };

  const textColors = {
    dark: "text-white",
    red: "text-white",
    white: "text-[var(--color-theme-bg-dark)]",
  };

  const renderTitle = () => {
    if (typeof title === "string") {
      return title;
    }

    if (Array.isArray(title)) {
      return (
        <>
          {title.map((line, index) => (
            <span
              key={index}
              className={index === 1 && titleIcon ? "relative" : ""}
            >
              {line}
              {index === 1 && titleIcon && (
                <img
                  src={titleIcon.src}
                  alt={titleIcon.alt || ""}
                  className="absolute top-[0.14em] left-[2.7em] -translate-y-1/2 w-[1.11em] h-[1.11em] object-contain"
                />
              )}
            </span>
          ))}
        </>
      );
    }

    return title;
  };

  // Mobile border logic: all variants get border on mobile except red
  const mobileBorderStyles =
    variant !== "red" ? "max-tablet:border-1 max-tablet:border-white" : "";

  const content = (
    <div
      className={cn(
        // Base styles
        "relative transition-opacity hover:opacity-90",
        // Mobile layout (< 769px): horizontal row layout
        "max-tablet:flex max-tablet:flex-row max-tablet:items-center max-tablet:justify-between max-tablet:p-3 max-tablet:min-h-0",
        // Desktop layout (>= 769px): vertical column layout
        "tablet:flex tablet:flex-col tablet:py-5 tablet:px-8 desktop:py-5 desktop:px-9 tablet:h-[307px]",
        bgColors[variant],
        textColors[variant],
        // Desktop border (only when hasBorder is true)
        hasBorder ? "tablet:border-2 tablet:border-white" : "",
        // Mobile border (all except red)
        mobileBorderStyles,
        className,
      )}
    >
      {/* Title and description container */}
      <div className="max-tablet:flex-1 tablet:space-y-4">
        {/* Mobile title */}
        {mobileTitle && (
          <h2
            className={cn(
              "font-[800]",
              "uppercase tracking-tight leading-tight text-balance tablet:hidden",
              "text-[18px]",
            )}
          >
            {mobileTitle}
          </h2>
        )}
        {/* Desktop title (or mobile if no mobileTitle provided) */}
        <h2
          className={cn(
            titleFont,
            "uppercase tracking-tight text-balance",
            // Apply flex-col and leading-none for array titles, tighter leading for wrapped titles
            Array.isArray(title)
              ? "flex flex-col leading-none"
              : "leading-none",
            // Hide on mobile if mobileTitle is provided
            mobileTitle
              ? "max-tablet:hidden"
              : "max-tablet:text-xl max-mobile-lg:text-[18px]",
            // Desktop text sizes - 70px for blocks with description, 39px for others (can be overridden by titleSize)
            titleSize
              ? titleSize
              : description
                ? "tablet:text-[70px]"
                : "text-[41px]",
          )}
          style={{ lineHeight: titleLineHeight }}
        >
          {renderTitle()}
        </h2>
        {description && (
          <p
            className={cn(
              descriptionFont,
              "opacity-90 max-w-[70%] leading-relaxed mt-[40px]",
              // Hide description on mobile
              "max-tablet:hidden",
              // Desktop description - 12px
              "tablet:text-[12px]",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* Arrow container */}
      <div
        className={cn(
          // Mobile: arrow on the right, vertically centered
          "max-tablet:shrink-0 max-tablet:ml-4 tablet:mb-[16px]",
          // Desktop: arrow absolutely positioned at bottom right
          "tablet:absolute tablet:bottom-5 tablet:right-8",
        )}
      >
        <RightArrowLongIcon
          className={cn(
            // Mobile arrow size
            "max-tablet:w-12 max-tablet:h-5",
            // Desktop arrow size
            "tablet:w-28 desktop:w-32 tablet:h-6",
          )}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline">
        {content}
      </Link>
    );
  }

  return content;
}
