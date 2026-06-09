export const DonateSection = () => {
  return (
    <section
      className="w-full text-theme-text"
      style={{
        background:
          "radial-gradient(ellipse at 70% 40%, #c80000 0%, #9a0000 45%, var(--color-theme-donate-bg) 100%)",
      }}
    >
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 py-6 mobile-sm:py-8 tablet:py-12">
        {/* Heading */}
        <h2 className="font-heading font-normal uppercase text-center leading-tight mb-10 tablet:mb-14
          text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]">
          Donate to honor
          <br />
          Students&apos; Legacy
        </h2>

        {/* Body text */}
        <div className="mx-auto space-y-6 text-[15px] mobile-sm:text-[16px] tablet:text-[17px] leading-7 tablet:leading-[1.75]">
          <p>
            This year, the Unissued Diplomas initiative aims to establish{" "}
            <strong className="font-bold">
              The Unissued Diplomas Endowment Fund
            </strong>{" "}
            by raising USD $75,000 worldwide. We plan to partner with
            Kyiv-Mohyla Foundation of America and Kyiv-Mohyla Foundation of
            Canada to use these funds to establish a sustainable endowment fund
            that will fully cover the tuition for one student per year, while
            also providing scholarships and grants for projects.
          </p>
          <p>
            This scholarship will serve as a living tribute to the memory of
            students who lost their lives due to the russian invasion. Through
            this fund, we commit to honoring their legacy by investing in the
            future of education and the potential of Ukraine&apos;s next
            generation.
          </p>
        </div>

        {/* Buttons */}
        <div className="mx-auto mt-10 tablet:mt-14 flex flex-col gap-4">
          <a
            href="#donate-usd"
            className="block w-full py-2 tablet:py-3 text-center uppercase tracking-widest font-[500]
              text-[14px] mobile-sm:text-[15px] tablet:text-[16px]
              bg-theme-accent text-theme-donate-bg
              border border-theme-accent
              transition-colors duration-200 hover:bg-transparent hover:text-theme-accent"
          >
            Donate in USD
          </a>
          <a
            href="#donate-cad"
            className="block w-full py-2 tablet:py-3 text-center uppercase tracking-widest font-[500]
              text-[14px] mobile-sm:text-[15px] tablet:text-[16px]
              bg-theme-accent text-theme-donate-bg
              border border-theme-accent
              transition-colors duration-200 hover:bg-transparent hover:text-theme-accent"
          >
            Donate in CAD
          </a>
        </div>
      </div>
    </section>
  );
};
