import { lazy, Suspense } from "react";
import { useExhibitions } from "../hooks/useExhibitions";
import { CountryCard } from "../shared/CountryCard";

const WorldMap = lazy(() =>
  import("../shared/WorldMap").then((m) => ({ default: m.WorldMap }))
);

const MapSkeleton = () => (
  <div className="w-full aspect-[800/420] rounded-lg bg-white/5 animate-pulse" />
);

export const ExhibitionMap = () => {
  const { exhibitionsByCountry } = useExhibitions();

  const countries = Array.from(exhibitionsByCountry.values()).sort(
    (a, b) => b.count - a.count
  );

  return (
    <section className="bg-black text-theme-text">
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 py-20 tablet:py-28">
        {/* Header: two-column layout matching "What's the Project About?" */}
        <div className="flex flex-col tablet:grid tablet:grid-cols-2 tablet:gap-8 mb-12 tablet:mb-16">
          <div>
            <h2 className="max-tablet:text-[38px] tablet:text-[58px] font-normal uppercase leading-none">
              EXHIBITIONS <br /> AROUND <br /> THE WORLD
            </h2>
          </div>
          <div className="mt-6 tablet:mt-0 flex items-end">
            <p className="max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6 text-theme-text-muted">
              "Unissued Diplomas" has been exhibited across the globe, bringing
              awareness about Ukrainian students whose lives were cut short by
              the war. Each exhibition carries their stories to new audiences.
            </p>
          </div>
        </div>

        {/* Map: visible on tablet+ */}
        <div className="hidden tablet:block">
          <Suspense fallback={<MapSkeleton />}>
            <WorldMap exhibitionsByCountry={exhibitionsByCountry} />
          </Suspense>
        </div>

        {/* Mobile card grid: visible below tablet */}
        <div className="tablet:hidden grid grid-cols-2 mobile-xs:grid-cols-1 mobile-sm:grid-cols-2 gap-3">
          {countries.map((country) => (
            <CountryCard key={country.isoAlpha2} data={country} />
          ))}
        </div>
      </div>
    </section>
  );
};
