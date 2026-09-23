import { DiplomaScrollIcon } from "../assets/DiplomaScrollIcon";
import { MediaMentionsIcon } from "../assets/MediaMentionsIcon";
import { ExhibitionsIcon } from "../assets/ExhibitionsIcon";
import { WorldMapIcon } from "../assets/WorldMapIcon";
import { TeamMembersIcon } from "../assets/TeamMembersIcon";
import { EndowmentFundIcon } from "../assets/EndowmentFundIcon";

const STATS = [
  {
    Icon: DiplomaScrollIcon,
    number: "40",
    label: "DIPLOMAS OF STUDENTS KILLED BY RUSSIA",
  },
  {
    Icon: MediaMentionsIcon,
    number: "300+",
    label: "MEDIA MENTIONS",
  },
  {
    Icon: ExhibitionsIcon,
    number: "300+",
    label: "EXHIBITIONS",
  },
  {
    Icon: WorldMapIcon,
    number: "23",
    label: "LANGUAGES FOR GLOBAL IMPACT",
  },
  {
    Icon: TeamMembersIcon,
    number: "100+",
    label: "TEAM MEMBERS",
  },
  {
    Icon: EndowmentFundIcon,
    number: "CAD $25,000+",
    label: "RAISED FOR THE ENDOWMENT FUND",
  },
];

export const AchievementsGrid = () => {
  return (
    <section className="bg-theme-accent text-theme-bg-dark">
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 py-(--section-space) grid grid-cols-1 mobile-sm:grid-cols-2 tablet:grid-cols-3 gap-x-10 gap-y-12 tablet:gap-y-16">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col justify-between h-full">
            <div className="flex flex-col desktop:flex-row items-start gap-3 desktop:gap-4">
              <stat.Icon className="h-10 tablet:h-12 w-auto shrink-0" />
              <div className="min-w-0">
                <p className="text-theme-primary text-[32px] tablet:text-[40px] font-bold leading-none break-words">
                  {stat.number}
                </p>
                <p className="mt-2 uppercase font-bold text-[14px] tablet:text-[15px] leading-snug">
                  {stat.label}
                </p>
              </div>
            </div>
            <div className="flex items-center mt-6">
              <span className="w-2.5 h-2.5 rounded-full bg-theme-primary shrink-0" />
              <span className="flex-1 h-px bg-theme-primary" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
