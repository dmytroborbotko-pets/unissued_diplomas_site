import { DiplomaViewer } from './DiplomaViewer';

export const HallOfDiplomas = () => {
  return (
    <div className="p-4 tablet:p-0 max-w-[1080px] mx-auto">
      {/* Hall of Diplomas Section */}
      <div className="tablet:px-4 mobile-xs:px-1 mt-20 tablet:mt-28">
        <div className="flex flex-col tablet:grid tablet:grid-cols-2 tablet:gap-8">
          {/* Left: Heading */}
          <div>
            <h2 className=" max-tablet:text-[38px] tablet:text-[58px] font-normal uppercase leading-none">
              HALL OF <br /> DIPLOMAS
            </h2>
          </div>

          {/* Right: Content */}
          <div className="mt-10 tablet:mt-0 space-y-6">
            <p className="max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6">
              They used to spend their days in study halls. They had favourite
              classes and those they dreaded weekly. And how scary it was for
              them to even think of failing a midterm.
            </p>
            <p className="max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6">
              But
              <span className="text-[#ff6868] font-[500] max-tablet:text-[20px] tablet:text-[16px]">
                after February 24, 2022, everything changed for Ukrainian
                students.
              </span>{" "}
              Classrooms turned into bomb shelters and battlefields. Fear
              changed its course, and bravery took control.
            </p>
            <p className="mb-14">
              {" "}
              <span className="text-[#ff6868] font-[500] max-tablet:text-[20px] tablet:text-[16px]">
                Now, diplomas of some will never be issued.
              </span>{" "}
              Because russia took the lives of their to-be owners in its attempt
              to take Ukraine's freedom.
            </p>
            {/* SoundCloud Embedding */}
            <iframe
              width="100%"
              height="120"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/user-418708485/unissued-diplomas-audiotour-1&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              title="Unissued Diplomas Audio Tour"
            ></iframe>
          </div>
        </div>

        {/* Diploma Viewer */}
        <DiplomaViewer />
      </div>
    </div>
  );
};
