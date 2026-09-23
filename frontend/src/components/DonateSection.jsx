export const DonateSection = () => {
  return (
    <section
      id="donate"
      className="w-full text-theme-text scroll-mt-20"
      style={{
        background:
          "radial-gradient(ellipse at 70% 40%, #c80000 0%, #9a0000 45%, var(--color-theme-donate-bg) 100%)",
      }}
    >
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 py-(--section-space)">
        {/* Heading */}
        <h2 className="font-heading font-normal uppercase text-center leading-tight mb-8 tablet:mb-12
          text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]">
          Donate to honor
          <br />
          Their Memory
        </h2>

        {/* Body text */}
        <div className="mx-auto space-y-6 text-center text-[15px] mobile-sm:text-[16px] tablet:text-[17px] leading-7 tablet:leading-[1.75]">
          <p>
            The goal of{" "}
            <strong className="font-bold">
              The Unissued Diplomas Endowment Fund
            </strong>{" "}
            is to raise $75,000 USD ($100,000 CAD). Reaching this target — in
            partnership with the Kyiv-Mohyla Foundations of America and
            Canada — will allow us to establish a sustainable endowment fund
            that finances <strong className="font-bold">an annual scholarship</strong>.
          </p>
          <p>
            Each year, this scholarship will cover the full cost of one
            student&apos;s education. It will serve as a living tribute to
            the students of Kyiv-Mohyla Academy and other universities who
            lost their lives during Russia&apos;s full-scale invasion of
            Ukraine.
          </p>
          <p>
            Through this fund, we honor their memory by investing in what
            they believed in — education, opportunity, and the future of
            Ukraine&apos;s next generation.
          </p>
        </div>

        {/* Button */}
        <div className="mx-auto mt-10 tablet:mt-14 flex flex-col">
          <a
            href="#donate"
            className="block w-full py-2 tablet:py-3 text-center uppercase tracking-widest font-[500]
              text-[14px] mobile-sm:text-[15px] tablet:text-[16px]
              bg-theme-accent text-theme-donate-bg
              border border-theme-accent
              transition-colors duration-200 hover:bg-transparent hover:text-theme-accent"
          >
            Donate
          </a>
        </div>
      </div>
    </section>
  );
};
