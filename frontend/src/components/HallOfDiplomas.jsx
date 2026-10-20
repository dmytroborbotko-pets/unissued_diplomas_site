import { DiplomaViewer } from "./DiplomaViewer";
import { useContent } from "../hooks/useContent";
import { RichText } from "../shared/RichText";

const soundcloudPlayer = (url) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;

export const HallOfDiplomas = () => {
  const { home } = useContent();

  return (
    <div className="px-4 tablet:px-0 max-w-[1080px] mx-auto">
      {/* Hall of Diplomas Section */}
      <div className="tablet:px-4 mobile-xs:px-1 pt-(--section-space)">
        {/* Diploma Viewer */}
        <DiplomaViewer />

        <div className="mt-12 tablet:mt-20 space-y-6">
          <RichText
            blocks={home.hallText}
            className="max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6"
            strongClassName="text-[#ff6868] font-[500] max-tablet:text-[20px] tablet:text-[16px]"
          />
          {/* SoundCloud Embedding */}
          {home.soundcloudUrl && (
            <iframe
              width="100%"
              height="120"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={soundcloudPlayer(home.soundcloudUrl)}
              title="Unissued Diplomas Audio Tour"
              className="!mt-14"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};
