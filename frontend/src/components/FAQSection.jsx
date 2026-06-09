import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import HomeVyshyvankaIcon from "../assets/HomeVyshyvankaIcon.png";

const FAQ_ITEMS = [
  {
    id: 1,
    question: "Were only 40 students killed?",
    answer:
      "No, the full-scale russian invasion has taken more student lives, as, in total, more than 6000 civilians and 13 000 soldiers have been reported killed since February 24, 2022. The exact number of students among them is unknown, considering that losses keep increasing every day.",
  },
  {
    id: 2,
    question: "Are exhibitions free to attend?",
    answer:
      "Yes, exhibitions are free of charge. However, you are welcome to donate, as we want to support financially Ukrainian students who stay in Ukraine and sacrifice their time and education to work for Ukraine's freedom.",
  },
  {
    id: 3,
    question: "Where can I learn more about other events?",
    answer:
      "You can find more information on our social media, the links to which are just below the FAQ section. We would also highly appreciate you sharing the events with those who might be interested, as we hope for this project to reach as many people as possible.",
  },
];

export const FAQSection = () => {
  const [openId, setOpenId] = useState(1);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="w-full bg-theme-bg text-theme-text">
      <div
        className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4
          py-6 mobile-sm:py-8 tablet:py-12"
      >
        <div className="flex flex-col tablet:grid tablet:grid-cols-2 tablet:gap-16 tablet-md:gap-20">
          <div className="mb-10 tablet:mb-0">
            <p
              className="flex flex-col font-heading font-normal uppercase leading-none relative
                text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]"
            >
              <span>FREQUENTLY</span>
              <span>ASKED</span>
              <span>QUESTIONS</span>
              <img
                src={HomeVyshyvankaIcon}
                alt=""
                className="absolute top-[1.2em] left-[3.15em] -translate-y-1/2 w-[1.3em] h-[1.3em] object-contain"
              />
            </p>
          </div>

          <div>
            {FAQ_ITEMS.map((item) => (
              <div key={item.id}>
                <button
                  className="w-full flex items-start justify-between gap-4 py-5 tablet:py-6 text-left"
                  onClick={() => toggle(item.id)}
                >
                  <span className="text-[15px] tablet:text-[17px] font-normal leading-snug">
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 text-[22px] leading-none">
                    {openId === item.id ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openId === item.id && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="pb-5 tablet:pb-6 text-[13px] tablet:text-[15px] leading-relaxed text-theme-text-muted">
                        {item.answer}
                      </p>
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
