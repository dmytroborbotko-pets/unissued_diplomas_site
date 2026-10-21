import { useContent } from "../hooks/useContent";
import { ink, minH } from "../utils/utils";
import { Responsive } from "../shared/Responsive";

// Tablets (flowing grid): flag 40px, name 20/27 Medium, venues 16px underlined; widths per entry from texts
const Country = ({ code, name, exhibitions, className, style }) => (
  <div className={className} style={style}>
    <img src={`/legacy/flags/${code}.png`} alt="" className="w-10 h-10 object-contain" />
    <h3 className="mt-[7px] text-[20px] leading-[27px] font-[500] uppercase">{name}</h3>
    {exhibitions.map(({ name, href, when, whenMobile, w, ww, mw, mww }) => (
      // text box widths of the old page (desktop / phones), so lines break at the same words
      <div
        key={name + when}
        style={{ "--w": `${w ?? 242}px`, "--ww": `${ww ?? 252}px`, "--mw": `${mw ?? 234}px`, "--mww": `${mww ?? 242}px` }}
        className="mt-[10px] [&+&]:mt-3 text-[16px] whitespace-pre-line"
      >
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="block w-max tablet:max-w-(--w) max-tablet:max-w-(--mw) leading-[1.1] underline hover:text-[#ff6868]">
            {name}
          </a>
        ) : (
          <p className="w-max tablet:max-w-(--w) max-tablet:max-w-(--mw) leading-[1.1]">{name}</p>
        )}
        <p className="mt-[10px] w-max tablet:max-w-(--ww) max-tablet:max-w-(--mww) leading-[18px]"><Responsive mobile={whenMobile}>{when}</Responsive></p>
      </div>
    ))}
  </div>
);

// A country placed element by element where the old page had it (texts `pos`: name [left, top] and
// per exhibition [venue left, venue top, date left, date top] in the list block). `mode`: "d" desktop, "m" phones.
// Entries the measurement could not match follow the previous one.
const PlacedCountry = ({ code, name, exhibitions, pos, mode }) => {
  const [nx, ny, nw] = pos.name;
  // fill unmeasured entries from the previous one
  const places = exhibitions.reduce((acc, _, i) => {
    const prev = acc.length ? acc[acc.length - 1][3] + 24 : ny + 27;
    return [...acc, pos.ex[i] ?? [nx, prev + 12, nx, prev + 52]];
  }, []);
  const at = (x, y) => ({ left: x, top: y });
  return (
    <>
      <img src={`/legacy/flags/${code}.png`} alt="" className="absolute w-10 h-10 object-contain" style={at(nx, ny - 48)} />
      {/* names the old page wrapped (e.g. UNITED STATES OF / AMERICA) keep its width */}
      <h3 className="absolute text-[20px] leading-[27px] font-[500] uppercase whitespace-nowrap" style={{ ...at(nx, ny + 2), ...(nw && { whiteSpace: "normal", width: nw }) }}>{name}</h3>
      {exhibitions.map(({ name: venue, href, when, whenMobile, w, ww, mw, mww }, i) => {
        const [vx, vy, dx, dy] = places[i];
        const vw = mode === "d" ? w : mw;
        const dw = mode === "d" ? ww : mww;
        const cls = "absolute text-[16px] whitespace-pre-line w-max";
        return (
          <div key={venue + when}>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} leading-[18px] underline hover:text-[#ff6868]`} style={{ ...at(vx, vy + 2), maxWidth: vw ?? 242 }}>
                {venue}
              </a>
            ) : (
              <p className={`${cls} leading-[18px]`} style={{ ...at(vx, vy + 2), maxWidth: vw ?? 242 }}>{venue}</p>
            )}
            <p className={`${cls} leading-[18px]`} style={{ ...at(dx, dy), maxWidth: dw ?? 252 }}>
              {mode === "m" && whenMobile ? whenMobile : when}
            </p>
          </div>
        );
      })}
    </>
  );
};

// "Attend exhibitions": map picture of the old site + venues grouped by country (flag, venue → map link, dates).
// Placement mirrors the old pages: 4 hand-placed columns from 1089px, a flowing 4-column grid on tablets, one column on phones
export const ExhibitionList = () => {
  const { attend, layout } = useContent();
  const byCode = Object.fromEntries(attend.countries.map((c) => [c.code, c]));

  return (
    <section id="exhibitions" className="bg-black text-[#ebebeb] scroll-mt-20">
      <div className="max-w-[1089px] mx-auto px-4">
        {/* heading block and list block keep the old page's heights */}
        <div {...minH(layout, "attend", "pt-5 tablet:pt-[51px] max-tablet:px-[3px]")}>
          <h2 {...ink(layout, "attendHeading", "text-center font-normal uppercase leading-[1.05] tracking-[0.01em] whitespace-pre-line text-[30px] max-tablet:leading-none max-tablet:-mx-3 tablet:text-[56px]")}>
            {attend.heading}
          </h2>
          {attend.subtitle && <p className="mt-[26px] tablet:mt-[40px] text-center text-white text-[17px] tablet:text-[18px] max-tablet:mx-auto max-tablet:max-w-[280px]">{attend.subtitle}</p>}
        </div>

        <div {...minH(layout, "list", "relative tablet:pb-10")}>
          {attend.map && (
            <img src="/legacy/map.png" alt="" width="1600" height="810" loading="lazy" className="max-tablet:hidden w-full h-auto pt-[52px]" />
          )}

          {/* Phones: one column in the old mobile order, every element at its measured place */}
          <div className="tablet:hidden">
            {attend.countries.map((c) => c.pos.m && <PlacedCountry key={c.code} {...c} pos={c.pos.m} mode="m" />)}
          </div>

          {/* Full width: the 4 hand-placed columns of the old page */}
          <div className="hidden min-[1089px]:block">
            {attend.countries.map((c) => c.pos.d && <PlacedCountry key={c.code} {...c} pos={c.pos.d} mode="d" />)}
          </div>

          {/* Tablets: the same columns as a flowing grid */}
          <div className="max-tablet:hidden min-[1089px]:hidden mt-[41px] grid grid-cols-4 gap-x-[29px]">
            {attend.columns.map((codes) => (
              <div key={codes[0]}>
                {codes.map((code) => (
                  <Country key={code} {...byCode[code]} className="mb-[50px]" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
