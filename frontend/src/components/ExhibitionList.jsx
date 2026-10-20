import { useContent } from "../hooks/useContent";

const Country = ({ code, name, exhibitions }) => (
  <div className="mb-10">
    <img src={`/legacy/flags/${code}.png`} alt="" className="w-9 h-9 object-contain" />
    <h3 className="mt-3 mb-2 text-[20px] leading-[27px] uppercase">{name}</h3>
    {exhibitions.map(({ name, href, when }) => (
      <div key={name + when} className="mb-3 text-[16px] leading-[1.1] whitespace-pre-line">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#ff6868]">
            {name}
          </a>
        ) : (
          <p>{name}</p>
        )}
        <p className="mt-2">{when}</p>
      </div>
    ))}
  </div>
);

// "Attend exhibitions": map picture of the old site + venues grouped by country (flag, venue → map link, dates)
export const ExhibitionList = () => {
  const { attend } = useContent();
  const byCode = Object.fromEntries(attend.countries.map((c) => [c.code, c]));

  return (
    <section id="exhibitions" className="bg-black text-theme-text scroll-mt-20">
      <div className="max-w-[1080px] mx-auto px-4 mobile-xs:px-3 tablet:px-4 py-(--section-space)">
        <h2 className="text-center font-normal uppercase leading-none whitespace-pre-line max-tablet:text-[34px] tablet:text-[56px]">
          {attend.heading}
        </h2>
        {attend.subtitle && <p className="mt-6 text-center text-[18px]">{attend.subtitle}</p>}

        <img src="/legacy/map.png" alt="" loading="lazy" className="w-full h-auto mt-10 tablet:mt-14" />

        {/* The old page places countries in 4 hand-made columns */}
        <div className="mt-12 grid grid-cols-1 mobile-sm:grid-cols-2 tablet:grid-cols-4 gap-x-8">
          {attend.columns.map((codes) => (
            <div key={codes[0]}>
              {codes.map((code) => (
                <Country key={code} {...byCode[code]} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
