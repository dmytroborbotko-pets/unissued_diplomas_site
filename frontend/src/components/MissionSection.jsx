import missionPhoto from "../assets/ud_missuin_part_photo.png";

export const MissionSection = () => {
  return (
    <section className="w-full relative bg-theme-bg text-theme-text border-t-2 border-theme-primary">
      {/* Blurred background photo — all mobile sizes (< 769px) */}
      <div className="block tablet:hidden absolute inset-0 overflow-hidden">
        <img
          src={missionPhoto}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center scale-110"
          style={{ filter: "blur(8px) brightness(0.3)" }}
        />
      </div>

      <div
        className="relative z-10 max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4
          py-[30px] tablet:py-16"
      >
        <div className="flex flex-col tablet:flex-row tablet:gap-12 tablet-md:gap-16 desktop:gap-20">
          {/* Column photo — tablet+ only (769px+) */}
          <div
            className="hidden tablet:flex flex-col flex-shrink-0
              w-full tablet:w-[42%] tablet-md:w-[44%]"
          >
            <div className="overflow-hidden">
              <img
                src={missionPhoto}
                alt="Mission — students at a protest"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="mt-2 text-[12px] text-theme-text-muted opacity-60 leading-tight">
              Photo by @johnwithlenses
            </p>
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-10 tablet:gap-12 tablet-md:gap-14 flex-1">
            {/* THE MISSION */}
            <div>
              <h2
                className="font-heading font-normal uppercase leading-none mb-5 tablet:mb-6
                  text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]"
              >
                The Mission
              </h2>
              <div className="space-y-4 text-[14px] mobile-sm:text-[15px] tablet:text-[16px] leading-7 tablet:leading-[1.75]">
                <p>
                  It is our honor to spread the life stories of the courageous
                  students who would still be here if it wasn&apos;t for the
                  russian invasion.
                </p>
                <p>
                  We believe in taking action when the freedom of our country is
                  at stake.
                </p>
              </div>
            </div>

            {/* THE TEAM */}
            <div>
              <h2
                className="font-heading font-normal uppercase leading-none mb-5 tablet:mb-6
                  text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]"
              >
                The Team
              </h2>
              <p className="text-[14px] mobile-sm:text-[15px] tablet:text-[16px] leading-7 tablet:leading-[1.75]">
                Girls and boys, students and graduates, in Ukraine and abroad —
                all 85+ of us are quite different.{" "}
                <span className="text-theme-primary font-[500]">
                  But we united in our goal to commemorate the lost lives of
                  Ukrainian students
                </span>{" "}
                and remind the world that the full-scale war still goes on. And
                it takes innocent lives daily, student or not.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
