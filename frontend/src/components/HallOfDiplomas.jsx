import { DiplomaViewer } from "./DiplomaViewer";
import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";
import { toBlocks } from "../utils/markup";
import { ink, minH } from "../utils/utils";

// Paddings/sizes measured on the old site; block heights per language come from texts `layout`
export const HallOfDiplomas = () => {
  const { hall, layout } = useContent();
  const wrap = "max-w-[1089px] mx-auto px-4";

  return (
    <section id="diplomas" className="text-[#ebebeb] scroll-mt-20">
      <div {...minH(layout, "hall", `${wrap} max-tablet:px-[15px] pt-[59px] tablet:pt-[76px] pb-6 grid content-start grid-cols-1 tablet:grid-cols-[497px_503px] tablet:gap-x-[51px]`)}>
        <h2 {...ink(layout, "hallHeading", "text-[30px] tablet:text-[56px] leading-none tracking-[0.01em] uppercase whitespace-pre-line max-tablet:max-w-[226px] tablet:-ml-[6px]")}>{hall.heading}</h2>
        <div {...ink(layout, "hallText", "mt-[33px] tablet:mt-[15px] space-y-[22px] max-tablet:max-w-[286px]")}>
          <RichText
            blocks={toBlocks(hall.text)}
            className="text-[16px] leading-[1.4] tracking-[0.01em] whitespace-pre-line"
            strongClassName="text-[#ff6868] font-normal"
          />
        </div>
      </div>

      <div {...minH(layout, "viewer", `${wrap} ${hall.diplomaLanguage ? "pt-[43px] tablet:pt-[31px]" : "pt-[18px] tablet:pt-[38px]"} pb-4 tablet:pb-6`)}>
        <DiplomaViewer
          legacy
          languageName={hall.diplomaLanguage}
          languageLabel={hall.languageLabel}
          zoomHint={hall.zoomHint}
        />
        <a
          href="#donate"
          className={`block max-tablet:mx-auto w-[120px] tablet:w-full ${hall.diplomaLanguage ? "mt-[51px]" : "mt-[49px]"} tablet:mt-[41px] h-[42px] tablet:h-[37px] leading-[42px] tablet:leading-[37px] text-center uppercase tracking-[0.05em] text-[13px] tablet:text-[16px] font-[500] bg-theme-primary-dark hover:bg-theme-primary transition-colors text-[#ebebeb]`}
        >
          {hall.donate}
        </a>
      </div>
    </section>
  );
};
