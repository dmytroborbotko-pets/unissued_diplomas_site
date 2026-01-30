import { ActionBlock } from "../shared/ActionBlock";
import HomeVyshyvankaIcon from "../assets/HomeVyshyvankaIcon.png";

export const Main = () => {
  return (
    <section className="bg-theme-bg text-theme-text mt-4 ">
      <main className="min-h-screen p-4 tablet:p-0 max-w-[1080px] mx-auto">
        <div className="tablet:px-4 mobile-xs:px-1 tablet:hidden my-[30px]">
          <p className="flex flex-col font-normal tablet:text-[70px] mobile-sm:text-[58px] mobile-lg:text-[60px] mobile-xs:text-[48px] leading-none relative">
            <span>UNISSUED</span>
            <span>DIPLOMAS</span>
            <img
              src={HomeVyshyvankaIcon}
              alt={""}
              className="absolute top-[1.1em] left-[2.96em] -translate-y-1/2 w-[1.11em] h-[1.11em] object-contain"
            />
          </p>
          <p className="font-normal mt-[20px] text-[17px] max-w-[75%]">
            When your classroom turns into a battlefield, your major becomes
            bravery.
          </p>
        </div>
        <div className="flex flex-col mobile-xs:gap-5 tablet:grid tablet:grid-cols-2 tablet:gap-4 tablet:px-4 mobile-xs:px-1 tablet:mt-16">
          {/* Block 1: Dark with title image and description */}
          <ActionBlock
            title={["UNISSUED", "DIPLOMAS"]}
            titleIcon={{
              src: HomeVyshyvankaIcon,
              alt: "Vyshyvanka",
            }}
            mobileTitle="ABOUT THE PROJECT"
            description="When your classroom turns into a battlefield, your major becomes bravery."
            variant="dark"
            titleFont="font-normal"
            titleSize="tablet:text-[60px] tablet-md:text-[70px]"
            descriptionFont="font-normal"
            href="/unissued-diplomas"
          />

          {/* Block 2: Dark with border */}
          <ActionBlock
            title="VISIT AN EXHIBITION"
            variant="dark"
            titleFont="font-[800]"
            hasBorder
            href="/exhibitions"
          />

          {/* Block 3: Red */}
          <ActionBlock
            title="HOLD AN EXHIBITION IN YOUR CITY"
            variant="red"
            titleFont="font-[800]"
            href="/host-exhibition"
          />

          {/* Block 4: White */}
          <ActionBlock
            title="DONATE TO HONOR STUDENTS' LEGACY"
            variant="white"
            titleFont="font-[800]"
            href="/donate"
          />
        </div>
      </main>
    </section>
  );
};
