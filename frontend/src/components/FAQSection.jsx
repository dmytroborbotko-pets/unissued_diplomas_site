import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomeVyshyvankaIcon from "../assets/HomeVyshyvankaIcon.png";
import { RichText } from "../shared/RichText";
import { cn } from "../utils/utils";

// `items`: [{ question, answer: rich text blocks }] (`icon`: stamp after the heading, /jp)
// `legacy`: old main-site look (Home) — measured column widths, all questions closed at first
// `offset`: measured shift of the question list from `ink()` (Home)
export const FAQSection = ({ heading, items, icon, legacy, offset }) => {
  const [openId, setOpenId] = useState(legacy ? null : 0);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="faq" className="w-full bg-theme-bg text-theme-text scroll-mt-20">
      <div className={legacy ? "max-w-[1089px] mx-auto px-[15px] tablet:px-4 pt-[59px] tablet:pt-[71px] pb-4 tablet:pb-6" : "max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4 py-(--section-space)"}>
        <div className={cn("flex flex-col tablet:grid", legacy ? "tablet:grid-cols-[451px_523px] tablet:justify-between" : "tablet:grid-cols-2 tablet:gap-16 tablet-md:gap-20")}>
          <div className={cn("mb-8 tablet:mb-0", legacy && "max-tablet:mb-[7px] max-tablet:[&>p]:text-[30px] tablet:pt-6 text-[#ebebeb] tracking-[0.01em]")}>
            <p
              className="flex flex-col font-heading font-normal uppercase leading-none relative
                text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]"
            >
              {heading?.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
              {icon && <img src={HomeVyshyvankaIcon} alt="" className="absolute top-[0.45em] left-[5em] w-[1.15em] h-[1.15em] object-contain" />}
              {/* ponytail: em offsets fit the English heading only; translations would need their own */}
              {heading === "FREQUENTLY\nASKED\nQUESTIONS" && (
                <img
                  src="/legacy/ornament.png"
                  alt=""
                  className="absolute max-tablet:top-[14px] max-tablet:left-[93px] max-tablet:w-[55px] max-tablet:h-[54px] tablet:top-[0.91em] tablet:left-[3.14em] tablet:w-[1.57em] tablet:h-[1.55em] object-contain"
                />
              )}
            </p>
          </div>

          <div style={offset?.style} className={legacy ? `max-tablet:ml-3 max-tablet:w-[265px] tablet:pl-2 ${offset?.className ?? ""}` : undefined}>
            {items.map((item, i) => (
              <div key={i}>
                <button
                  className={cn("w-full flex items-start justify-between gap-4 text-left", legacy ? "max-tablet:gap-0 max-tablet:min-h-[67px] max-tablet:items-center max-tablet:py-5 tablet:pt-[26px] tablet:pb-[27px] text-[#ebebeb]" : "py-5 tablet:py-6")}
                  onClick={() => toggle(i)}
                >
                  <span className={legacy ? "text-[16px] leading-[1.4] max-tablet:max-w-[241px]" : "text-[15px] tablet:text-[17px] font-normal leading-snug"}>
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 text-[22px] leading-none">
                    {openId === i ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openId === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <RichText
                        blocks={item.answer}
                        className={legacy ? "pb-6 text-[14px] leading-[1.5] text-[#ebebeb]" : "pb-5 tablet:pb-6 text-[13px] tablet:text-[15px] leading-relaxed text-theme-text-muted"}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className={cn("h-px bg-theme-primary", legacy && "mb-3 tablet:mb-[25px]")} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
