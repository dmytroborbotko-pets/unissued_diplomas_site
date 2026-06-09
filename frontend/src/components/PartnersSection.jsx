const PARTNER_ROWS = [
  [
    { id: 1, w: "wide" },
    { id: 2, w: "wide" },
    { id: 3, w: "text" },
  ],
  [
    { id: 4, w: "wide" },
    { id: 5, w: "wide" },
    { id: 6, w: "bordered" },
  ],
];

const PlaceholderLogo = ({ width }) => {
  const base =
    "flex-shrink-0 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center";

  if (width === "text") {
    return (
      <div className={`${base} h-[56px] mobile-sm:h-[64px] tablet:h-[72px] w-[140px] mobile-sm:w-[160px] tablet:w-[200px]`} />
    );
  }

  if (width === "bordered") {
    return (
      <div
        className={`flex-shrink-0 rounded-sm border border-white/30 flex items-center justify-center
          w-[140px] h-[64px] mobile-sm:w-[160px] mobile-sm:h-[72px] tablet:w-[200px] tablet:h-[80px]`}
      />
    );
  }

  /* wide */
  return (
    <div
      className={`${base} h-[56px] mobile-sm:h-[64px] tablet:h-[72px]
        w-[140px] mobile-sm:w-[160px] tablet:w-[220px] tablet-md:w-[260px]`}
    />
  );
};

export const PartnersSection = () => {
  return (
    <section className="w-full bg-theme-bg-grey text-theme-text">
      <div
        className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4
          py-[30px] tablet:py-16"
      >
        <h2
          className="font-heading font-normal uppercase leading-none mb-10 tablet:mb-14
            text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]"
        >
          Partners
        </h2>

        <div className="flex flex-col gap-8 tablet:gap-12 tablet-md:gap-14">
          {PARTNER_ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex flex-wrap gap-6 tablet:gap-10 tablet-md:gap-14 items-center"
            >
              {row.map((partner) => (
                <PlaceholderLogo key={partner.id} width={partner.w} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
