import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomeVyshyvankaIcon from "../assets/HomeVyshyvankaIcon.png";
import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";


export const FAQSection = () => {
  const { home, faqs } = useContent();
  const [openId, setOpenId] = useState(faqs[0]?.documentId);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="faq" className="w-full bg-theme-bg text-theme-text scroll-mt-20">
      <div
        className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4
          py-(--section-space)"
      >
        <div className="flex flex-col tablet:grid tablet:grid-cols-2 tablet:gap-16 tablet-md:gap-20">
          <div className="mb-8 tablet:mb-0">
            <p
              className="flex flex-col font-heading font-normal uppercase leading-none relative
                text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]"
            >
              {home.faqHeading?.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
              <img
                src={HomeVyshyvankaIcon}
                alt=""
                className="absolute top-[1.2em] left-[3.15em] -translate-y-1/2 w-[1.3em] h-[1.3em] object-contain"
              />
            </p>
          </div>

          <div>
            {faqs.map((item) => (
              <div key={item.documentId}>
                <button
                  className="w-full flex items-start justify-between gap-4 py-5 tablet:py-6 text-left"
                  onClick={() => toggle(item.documentId)}
                >
                  <span className="text-[15px] tablet:text-[17px] font-normal leading-snug">
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 text-[22px] leading-none">
                    {openId === item.documentId ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openId === item.documentId && (
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
                        className="pb-5 tablet:pb-6 text-[13px] tablet:text-[15px] leading-relaxed text-theme-text-muted"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="h-px bg-theme-primary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
