import { DiplomaViewer } from "./DiplomaViewer";
import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";
import { toBlocks } from "../utils/markup";

export const HallOfDiplomas = () => {
  const { hall } = useContent();

  return (
    <section className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4 py-(--section-space)">
      <div className="flex flex-col tablet:grid tablet:grid-cols-2 tablet:gap-8">
        <h2 className="text-[#ebebeb] max-tablet:text-[38px] tablet:text-[58px] font-normal uppercase leading-none whitespace-pre-line">
          {hall.heading}
        </h2>
        <div className="mt-8 tablet:mt-0 space-y-6">
          <RichText
            blocks={toBlocks(hall.text)}
            className="text-[#ebebeb] max-tablet:text-[17px] tablet:text-[16px] leading-7 tablet:leading-6 whitespace-pre-line"
            strongClassName="text-[#ff6868] font-normal"
          />
        </div>
      </div>

      <div className="mt-(--section-space)">
        <DiplomaViewer
          languageName={hall.diplomaLanguage}
          languageLabel={hall.languageLabel}
          zoomHint={hall.zoomHint}
        />
      </div>

      <a
        href="#donate"
        className="block w-full mt-10 py-2 text-center uppercase tracking-widest text-[14px] bg-theme-primary-dark hover:bg-theme-primary transition-colors text-white"
      >
        {hall.donate}
      </a>
    </section>
  );
};
