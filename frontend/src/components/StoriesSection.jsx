export const StoriesSection = () => {
  return (
    <section className="w-full bg-theme-bg-grey text-theme-text">
      <div
        className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3
          py-12 mobile-sm:py-14 tablet:py-22 desktop:py-26
          flex flex-col items-center text-center"
      >
        <h2
          className="font-heading font-normal uppercase leading-tight
             text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]
            max-w-[900px] mb-6 tablet:mb-10"
        >
          The Stories Behind the Diplomas
        </h2>

        <div
          className="space-y-5 text-[14px] mobile-sm:text-[15px] tablet:text-[16px]
            leading-7 tablet:leading-[1.75] text-theme-text-muted
            max-w-[620px] mb-4 tablet:mb-12"
        >
          <p>
            We contacted relatives, universities, and the platform Memorial to
            collect the stories and turn them into Unissued Diplomas.
          </p>
          <p>
            With the consent of parents and families, our team created each
            story in memory of the students whose lives were taken by the war,
            honoring their contributions and the future they were building.
          </p>
        </div>

        <a
          href="https://memorial.ua"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 mobile-sm:px-12 py-2 bg-theme-primary-dark text-white font-[500] tracking-widest rounded hover:bg-theme-primary transition-colors"
        >
          Explore more stories on Memorial
        </a>
      </div>
    </section>
  );
};
