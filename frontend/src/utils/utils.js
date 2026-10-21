import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Min-heights from texts/<lang>.json `layout` (section heights of the old pages: desktop `layout[key]`,
// phones `layout.m[key]`, measured on the 320px Wix mobile canvas; tablets size to their content): spread on an element
export const minH = (layout, key, className = "") => ({
  className: `tablet:min-h-(--h) max-tablet:min-h-(--mh) tab:min-h-0 ${className}`,
  style: { "--h": `${layout[key]}px`, "--mh": `${layout.m[key]}px` },
});

// Measured glyph offsets against the old pages (texts `layout.ink.d|m[key]` = [dy, dx] px): Wix wraps
// text in spans that shift the baseline, so some elements sit a few px off. Translated: layout and positioning unchanged
export const ink = (layout, key, className = "") => {
  const [dy = 0, dx = 0] = layout.ink?.d?.[key] ?? [];
  const [mdy = 0, mdx = 0] = layout.ink?.m?.[key] ?? [];
  return {
    className: `tablet:translate-y-(--iy) tablet:translate-x-(--ix) max-tablet:translate-y-(--miy) max-tablet:translate-x-(--mix) tab:translate-x-0 tab:translate-y-0 ${className}`,
    style: { "--iy": `${dy}px`, "--ix": `${dx}px`, "--miy": `${mdy}px`, "--mix": `${mdx}px` },
  };
};
