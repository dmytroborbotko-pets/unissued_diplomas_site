import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars

const TOOLTIP_WIDTH = 230;
const TOOLTIP_OFFSET_Y = 16;

export const MapTooltip = ({
  data,
  dotPos,
  containerWidth,
  tooltipRef,
  countryCode,
}) => {
  const isVisible = !!(data && dotPos);

  let left = 0;
  let top = 0;
  let placeBelow = false;

  if (dotPos) {
    left = dotPos.x - TOOLTIP_WIDTH / 2;
    top = dotPos.y - TOOLTIP_OFFSET_Y;

    if (top < 130) {
      top = dotPos.y + TOOLTIP_OFFSET_Y;
      placeBelow = true;
    }

    if (left < 8) left = 8;
    if (containerWidth > 0 && left + TOOLTIP_WIDTH > containerWidth - 8) {
      left = containerWidth - TOOLTIP_WIDTH - 8;
    }
  }

  const positionStyle = placeBelow
    ? { left, top }
    : { left, top, transform: "translateY(-100%)" };

  return (
    <AnimatePresence mode="popLayout">
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          key={countryCode || "tooltip"}
          className="absolute z-50 rounded-lg bg-theme-bg-dark border border-white/10 px-4 py-3 shadow-xl pointer-events-none"
          style={{
            ...positionStyle,
            width: TOOLTIP_WIDTH,
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{data.flag}</span>
            <span className="text-theme-text font-[500] text-[15px]">
              {data.name}
            </span>
          </div>
          <p className="text-theme-text-muted text-[13px] mb-2">
            {data.count} exhibition{data.count !== 1 ? "s" : ""} held
          </p>
          <div className="flex items-center gap-1 text-theme-primary text-[13px] font-[500]">
            <span>Show all exhibitions</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
