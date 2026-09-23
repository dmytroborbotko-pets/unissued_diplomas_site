import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useExhibitions } from "../hooks/useExhibitions";
import { useLanguage } from "../hooks/useLanguage";
import { MapSkeleton } from "../shared/MapSkeleton";
import { cn } from "../utils/utils";

const WorldMap = lazy(() =>
  import("../shared/WorldMap").then((m) => ({ default: m.WorldMap }))
);

// "2026-02-23" → local midnight (a bare ISO date would parse as UTC and shift the day)
const parseDate = (value) => new Date(`${value}T00:00`);

const getStatus = ({ startDate, endDate, dateNote }, today) => {
  if (today < parseDate(startDate)) return "upcoming";
  // No endDate: single day, unless dateNote says it's open-ended ("TBA", "ongoing")
  const end = endDate ?? (dateNote ? null : startDate);
  return end && today > parseDate(end) ? "past" : "open";
};

const formatDates = ({ startDate, endDate, dateNote }, dateFormat) => {
  const start = parseDate(startDate);
  if (dateNote) return `${dateFormat.format(start)} – ${dateNote}`;
  if (!endDate) return dateFormat.format(start);
  return dateFormat.formatRange(start, parseDate(endDate));
};

const StatusBadge = ({ status }) => {
  if (status === "open") {
    return (
      <span className="flex items-center gap-2 shrink-0 text-[12px] uppercase tracking-[0.08em] text-theme-text">
        <span className="size-2 rounded-full bg-theme-primary animate-pulse" />
        Now open
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="shrink-0 px-2 py-0.5 border border-white/30 text-[12px] uppercase tracking-[0.08em] text-theme-text-muted">
        Upcoming
      </span>
    );
  }
  return null;
};

const VenueRow = ({ exhibition, dateFormat, today }) => (
  <li className="py-5 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
    <div className="flex items-baseline justify-between gap-4">
      <p className="text-[13px] uppercase tracking-[0.08em] text-theme-text-muted/60">
        {exhibition.city}
      </p>
      <StatusBadge status={getStatus(exhibition, today)} />
    </div>

    {exhibition.url ? (
      <a
        href={exhibition.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-1 inline-block text-[18px] tablet:text-[20px] leading-snug text-theme-text transition-colors hover:text-theme-primary"
      >
        {exhibition.venue}
        <span className="ml-1 inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          ↗
        </span>
      </a>
    ) : (
      <p className="mt-1 text-[18px] tablet:text-[20px] leading-snug text-theme-text">
        {exhibition.venue}
      </p>
    )}

    <p className="mt-2 text-[15px] text-theme-text-muted">
      {formatDates(exhibition, dateFormat)}
      {exhibition.hours && (
        <span className="text-theme-text-muted/60"> · {exhibition.hours}</span>
      )}
    </p>
  </li>
);

const CountrySection = ({ country, dateFormat, today }) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="grid tablet:grid-cols-[280px_1fr] gap-6 tablet:gap-12 py-12 tablet:py-16 border-t border-white/10"
  >
    <div className="tablet:sticky tablet:top-24 self-start">
      <span className="block text-[44px] leading-none">{country.flag}</span>
      <h2 className="mt-4 text-[28px] tablet:text-[32px] font-normal uppercase leading-tight">
        {country.name}
      </h2>
      <p className="mt-2 text-[14px] uppercase tracking-[0.08em] text-theme-text-muted/60">
        {country.count} venue{country.count !== 1 ? "s" : ""}
      </p>
    </div>

    <ul>
      {country.exhibitions.map((exhibition) => (
        <VenueRow
          key={`${exhibition.city}-${exhibition.venue}-${exhibition.startDate}`}
          exhibition={exhibition}
          dateFormat={dateFormat}
          today={today}
        />
      ))}
    </ul>
  </motion.section>
);

// Mirrors CountrySection's layout so the page doesn't shift when data arrives
const SectionSkeleton = () => (
  <div className="grid tablet:grid-cols-[280px_1fr] gap-6 tablet:gap-12 py-12 tablet:py-16 border-t border-white/10 animate-pulse">
    <div>
      <div className="size-11 bg-white/10" />
      <div className="mt-4 h-8 w-40 bg-white/10" />
      <div className="mt-3 h-4 w-20 bg-white/5" />
    </div>
    <ul>
      {[0, 1, 2].map((i) => (
        <li key={i} className="py-5 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
          <div className="h-3 w-24 bg-white/5" />
          <div className="mt-3 h-6 w-3/4 bg-white/10" />
          <div className="mt-3 h-4 w-40 bg-white/5" />
        </li>
      ))}
    </ul>
  </div>
);

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "flex items-center gap-2 shrink-0 px-3 py-2 border text-[14px] uppercase whitespace-nowrap transition-colors cursor-pointer",
      active
        ? "bg-theme-primary border-theme-primary text-theme-text"
        : "border-white/15 text-theme-text-muted hover:border-white/40 hover:text-theme-text"
    )}
  >
    {children}
  </button>
);

const ScrollArrow = ({ direction, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === "left" ? "Scroll countries left" : "Scroll countries right"}
    className="shrink-0 p-2 border border-white/15 text-theme-text-muted transition-colors hover:border-white/40 hover:text-theme-text cursor-pointer"
  >
    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  </button>
);

export default function Exhibitions() {
  const { exhibitionsByCountry, isLoading } = useExhibitions();
  const { currentLanguage } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get("country")?.toUpperCase() ?? null;

  const countries = useMemo(
    () =>
      Array.from(exhibitionsByCountry.values()).sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name)
      ),
    [exhibitionsByCountry]
  );

  const dateFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(currentLanguage, { month: "short", day: "numeric" }),
    [currentLanguage]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const venueCount = countries.reduce((sum, country) => sum + country.count, 0);
  const visible = selected
    ? countries.filter((country) => country.isoAlpha2 === selected)
    : countries;

  const selectCountry = (code) => setSearchParams(code ? { country: code } : {});

  const chipsRef = useRef(null);
  const scrollChips = (direction) =>
    chipsRef.current.scrollBy({ left: direction * 320, behavior: "smooth" });

  // Center the active chip whenever the selection changes (chip, map click or URL)
  useEffect(() => {
    const scroller = chipsRef.current;
    const chip = scroller.querySelector('[aria-pressed="true"]');
    if (!chip) return;
    scroller.scrollTo({
      left: chip.offsetLeft - (scroller.clientWidth - chip.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [selected]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-theme-text">
      <Header />

      <main className="flex-1 pt-16 tablet-md:pt-20">
        <div className="max-w-[1080px] mx-auto px-4 pt-16 tablet:pt-24">
          <div className="flex flex-col items-center text-center mb-12 tablet:mb-16">
            <h1 className="max-tablet:text-[38px] tablet:text-[58px] font-normal uppercase leading-none">
              Exhibitions
            </h1>
            <p className="mt-6 text-[16px] tablet:text-[18px] text-theme-text-muted">
              Supported by the Ministry of Education and Science of Ukraine
            </p>
            <p className="mt-4 text-[14px] tablet:text-[16px] uppercase tracking-[0.12em] text-theme-text-muted">
              {isLoading ? (
                <span className="inline-block h-[1em] w-56 align-middle bg-white/10 animate-pulse" />
              ) : (
                `${countries.length} countries · ${venueCount} venues`
              )}
            </p>
          </div>

          <div className="hidden tablet:block">
            <Suspense fallback={<MapSkeleton />}>
              <WorldMap exhibitionsByCountry={exhibitionsByCountry} />
            </Suspense>
          </div>
        </div>

        <div className="sticky top-0 z-40 mt-12 bg-black/85 backdrop-blur border-y border-white/10">
          <div className="max-w-[1080px] mx-auto px-4 py-3 flex items-center gap-2">
            <ScrollArrow direction="left" onClick={() => scrollChips(-1)} />
            <div
              ref={chipsRef}
              className="relative flex-1 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {isLoading &&
                Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="h-[38px] w-28 shrink-0 bg-white/5 animate-pulse" />
                ))}
              {!isLoading && (
                <Chip active={!selected} onClick={() => selectCountry(null)}>
                  All
                </Chip>
              )}
              {countries.map((country) => (
                <Chip
                  key={country.isoAlpha2}
                  active={selected === country.isoAlpha2}
                  onClick={() => selectCountry(country.isoAlpha2)}
                >
                  <span className="text-[16px]">{country.flag}</span>
                  {country.name}
                  <span className="opacity-60">{country.count}</span>
                </Chip>
              ))}
            </div>
            <ScrollArrow direction="right" onClick={() => scrollChips(1)} />
          </div>
        </div>

        <div className="max-w-[1080px] mx-auto px-4 pb-20 tablet:pb-28">
          {isLoading ? (
            [0, 1, 2].map((i) => <SectionSkeleton key={i} />)
          ) : visible.length > 0 ? (
            visible.map((country) => (
              <CountrySection
                key={country.isoAlpha2}
                country={country}
                dateFormat={dateFormat}
                today={today}
              />
            ))
          ) : (
            <div className="py-24 text-center">
              <p className="text-[18px] text-theme-text-muted">
                No exhibitions found for this country.
              </p>
              <button
                type="button"
                onClick={() => selectCountry(null)}
                className="mt-6 px-8 py-3 uppercase font-medium bg-theme-accent text-theme-bg-dark transition-colors hover:bg-theme-primary hover:text-theme-text cursor-pointer"
              >
                Show all exhibitions
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
