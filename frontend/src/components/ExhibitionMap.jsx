import { lazy, Suspense } from "react";
import { useExhibitions } from "../hooks/useExhibitions";
import { CountryCard } from "../shared/CountryCard";
import { MapSkeleton } from "../shared/MapSkeleton";
import { RichText } from "../shared/RichText";
import { useContent } from "../hooks/useContent";

const WorldMap = lazy(() =>
  import("../shared/WorldMap").then((m) => ({ default: m.WorldMap }))
);

export const ExhibitionMap = () => {
  const { home } = useContent();
  const { exhibitionsByCountry } = useExhibitions();

  const countries = Array.from(exhibitionsByCountry.values()).sort(
    (a, b) => b.count - a.count
  );

  return (
    <section className="bg-black text-theme-text">
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 py-(--section-space)">
        {/* Header: stacked, centered */}
        <div className="flex flex-col items-center text-center mb-8 tablet:mb-12">
          <h2 className="max-tablet:text-[38px] tablet:text-[58px] font-normal uppercase leading-none whitespace-pre-line">
            {home.mapHeading}
          </h2>
          <RichText
            blocks={home.mapText}
            className="mt-6 max-w-[640px] max-tablet:text-[19px] tablet:text-[16px] leading-7 tablet:leading-6 text-theme-text-muted"
          />
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

        <button
          type="button"
          className="w-full mt-8 py-4 text-center uppercase font-medium bg-theme-accent text-theme-bg-dark"
        >
          GET EXHIBITION ORGANIZER'S GUIDE
        </button>
      </div>
    </section>
  );
};
