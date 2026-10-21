import { DiplomaViewer } from "./DiplomaViewer";
import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";
import { toBlocks } from "../utils/markup";
import { ink, minH } from "../utils/utils";

// Paddings/sizes measured on the old site (text: 23.5px line pitch, one empty line between paragraphs); block heights per language come from texts `layout`
const soundcloudPlayer = (url) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23b10000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;

export const HallOfDiplomas = () => {
  const { hall, layout } = useContent();
  const wrap = "max-w-[1089px] mx-auto px-4";

  return (
    <section id="diplomas" className="text-[#ebebeb] scroll-mt-20">
      <div {...minH(layout, "hall", `${wrap} relative max-tablet:px-[15px] pt-[59px] tablet:pt-[76px] pb-6 grid content-start grid-cols-1 tablet:grid-cols-[497px_503px] tablet:gap-x-[51px] tab:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] tab:gap-x-10 tab:pb-12`)}>
        <h2 {...ink(layout, "hallHeading", "text-[30px] tablet:text-[56px] tab:text-[clamp(40px,5.15vw,56px)] leading-none tracking-[0.01em] uppercase whitespace-pre-line max-tablet:max-w-[226px] tablet:-ml-[6px] tab:ml-0")}>{hall.heading}</h2>
        <div {...ink(layout, "hallText", "mt-[33px] tablet:mt-[15px] tab:mt-0 space-y-[23.5px] max-tablet:max-w-[286px]")}>
          <RichText
            blocks={toBlocks(hall.text)}
            className="text-[16px] leading-[23.5px] tracking-[0.01em] whitespace-pre-line"
            strongClassName="text-[#ff6868] font-normal"
          />
        </div>
        {/* audio tour: 508×116 under the text (phones 286×116), where the old page placed it (texts `layout.soundcloudTop`) */}
        {hall.soundcloud && (
          <iframe
            title="Unissued Diplomas | audiotour"
            src={soundcloudPlayer(hall.soundcloud)}
            loading="lazy"
            allow="autoplay"
            style={{ "--st": `${layout.soundcloudTop[0]}px`, "--mst": `${layout.soundcloudTop[1]}px` }}
            className="absolute left-4 tablet:left-[563px] max-tablet:top-(--mst) tablet:top-(--st) tab:static tab:col-start-2 tab:mt-10 w-[286px] tablet:w-[508px] tab:w-full tab:max-w-[508px] h-[116px] border-0"
          />
        )}
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
