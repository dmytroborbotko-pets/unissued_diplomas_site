const SPONSOR_ROWS = [
  [
    { id: 1, w: "wide" },
    { id: 2, w: "wide" },
    { id: 3, w: "square" },
    { id: 4, w: "wide" },
    { id: 5, w: "wide" },
  ],
  [
    { id: 6, w: "wide" },
    { id: 7, w: "wide" },
    { id: 8, w: "square" },
    { id: 9, w: "wide" },
    { id: 10, w: "square" },
  ],
  [
    { id: 11, w: "wide" },
    { id: 12, w: "square" },
    { id: 13, w: "wide" },
    { id: 14, w: "wide" },
  ],
  [
    { id: 15, w: "bordered" },
    { id: 16, w: "text" },
    { id: 17, w: "text" },
  ],
];

const PlaceholderLogo = ({ width }) => {
  const base =
    "flex-shrink-0 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center";

  if (width === "square") {
    return <div className={`${base} w-[60px] h-[60px] mobile-sm:w-[70px] mobile-sm:h-[70px] tablet:w-[80px] tablet:h-[80px]`} />;
  }

  if (width === "text") {
    return (
      <div className={`${base} h-[48px] w-[140px] mobile-sm:w-[160px] tablet:w-[180px]`} />
    );
  }

  if (width === "bordered") {
    return (
      <div
        className={`flex-shrink-0 rounded-sm border border-white/30 flex items-center justify-center
          w-[120px] h-[64px] mobile-sm:w-[140px] mobile-sm:h-[72px] tablet:w-[160px] tablet:h-[80px]`}
      />
    );
  }

  /* wide */
  return (
    <div
      className={`${base} h-[48px] mobile-sm:h-[56px] tablet:h-[64px]
        w-[100px] mobile-sm:w-[120px] tablet:w-[140px] tablet-md:w-[160px]`}
    />
  );
};

export const SponsorsSection = () => {
  return (
    <section className="w-full bg-theme-bg text-theme-text">
      <div
        className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4
          py-[30px] tablet:py-16"
      >
        <h2
          className="font-heading font-normal uppercase leading-none mb-10 tablet:mb-14
            text-[28px] mobile-sm:text-[36px] tablet:text-[48px] tablet-md:text-[52px] desktop:text-[56px]"
        >
          Sponsors
        </h2>

        <div className="flex flex-col gap-8 tablet:gap-10 tablet-md:gap-12">
          {SPONSOR_ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex flex-wrap gap-5 tablet:gap-8 tablet-md:gap-10 items-center"
            >
              {row.map((sponsor) => (
                <PlaceholderLogo key={sponsor.id} width={sponsor.w} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
