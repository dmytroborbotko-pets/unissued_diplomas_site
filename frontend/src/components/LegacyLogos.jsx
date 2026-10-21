// Sponsors / partners exactly as placed on the old site: every logo has its own box (x, y, width, height in px
// of the 1057px-wide content, measured in the browser). Scales with the width; on phones it is a plain list.
const LAYOUT = {
  sponsors: {
    height: 486,
    gap: [50], // heading → logos
    logos: {
      d730fd: [3, 35, 135, 36], "9fcf07": [221, 28, 150, 50], b608b3: [454, 14, 78, 78], "90d089": [615, 0, 178, 106],
      "1aef25": [877, 22, 180, 62], "454563": [-16, 145, 233, 78], "8e55a7": [302, 169, 173, 29], "7e3c4d": [561, 140, 99, 87],
      "1a1971": [746, 153, 147, 62], "9f6084": [978, 145, 78, 78], "2585c5": [-2, 303, 283, 36], "28bda3": [392, 270, 78, 78],
      "98b816": [595, 274, 93, 93], c74932: [787, 287, 276, 68], be097e: [1, 408, 175, 78],
    },
    // name-only credits, in texts order; [x, y, w, h, class]
    names: [
      [343, 356, 182, 29, "text-[10px] leading-[14px] text-center tracking-[0.01em]"],
      [257, 435, 173, 25, "text-[16px] leading-[1.4] tracking-[0.01em]"],
      [504, 435, 128, 25, "text-[16px] leading-[1.4] tracking-[0.01em]"],
    ],
  },
  partners: {
    height: 237,
    gap: [76],
    logos: {
      "52606d": [1, 13, 280, 60], "766755": [421, 0, 301, 82], "franko-family": [6, 133, 347, 93],
      e1064d: [415, 122, 287, 115], af7be2: [809, 134, 246, 91],
    },
    names: [[842, 8, 177, 70, "text-[24px] leading-[1.4] text-center tracking-[0.01em]"]],
  },
};

// 2023 results page: same sponsor logos as Home (no Boosters), credits placed differently; its own partners
LAYOUT.sponsors2023 = {
  ...LAYOUT.sponsors,
  names: [
    [343, 356, 182, 29, "text-[10px] leading-[14px] text-center tracking-[0.01em]"],
    [2, 435, 189, 25, "text-[16px] leading-[1.4] tracking-[0.01em]"],
    [225, 435, 128, 25, "text-[16px] leading-[1.4] tracking-[0.01em]"],
  ],
};
LAYOUT.partners2023 = {
  height: 247,
  gap: [62],
  logos: {
    "4c6375": [2, 20, 173, 50], "78c29b": [274, 24, 182, 41], a73840: [556, 0, 123, 90], "52606d": [777, 15, 280, 60],
    e1064d: [-6, 141, 224, 90], "12d088": [297, 125, 124, 122], af7be2: [501, 146, 211, 79], e1cdfe: [791, 143, 89, 85],
  },
  names: [[960, 162, 99, 46, "text-[16px] leading-[1.4] tracking-[0.01em]"]],
};

// Phones: the old 320px mobile placement, px from the section's top-left corner
const MOBILE = {
  sponsors: {
    top: 63,
    logos: {
      d730fd: [17, 141, 92, 25], b608b3: [7, 201, 56, 56], "90d089": [65, 197, 104, 62], "9fcf07": [172, 133, 132, 44],
      "8e55a7": [180, 217, 123, 21], "9f6084": [16, 288, 54, 54], "7e3c4d": [102, 288, 70, 62], "1a1971": [203, 294, 100, 42],
      "454563": [5, 376, 160, 54], "1aef25": [173, 381, 130, 45], "2585c5": [13, 463, 236, 30], "28bda3": [17, 526, 54, 54],
      "98b816": [249, 526, 54, 54], c74932: [49, 611, 219, 54], be097e: [15, 694, 120, 53],
    },
    names: [
      [80, 534, 123, 39, "text-[9px] leading-[13px] text-center tracking-[0.01em]"],
      [173, 697, 130, 46, "text-[16px] leading-[1.4] tracking-[0.01em]"],
      [97, 776, 123, 23, "text-[16px] leading-[1.4] tracking-[0.01em]"],
    ],
  },
  partners: {
    top: 59,
    logos: {
      "52606d": [14, 116, 226, 47], e1064d: [108, 200, 195, 78], "766755": [9, 296, 235, 64],
      af7be2: [108, 401, 195, 64], "franko-family": [67, 599, 240, 64],
    },
    names: [[15, 499, 180, 70, "text-[24px] leading-[1.4] text-center tracking-[0.01em]"]],
  },
  sponsors2023: {
    top: 63,
    logos: {
      d730fd: [17, 141, 92, 25], b608b3: [7, 201, 56, 56], "90d089": [65, 197, 104, 62], "9fcf07": [172, 133, 132, 44],
      "8e55a7": [180, 217, 123, 21], "9f6084": [16, 288, 54, 54], "7e3c4d": [102, 288, 70, 62], "1a1971": [203, 294, 100, 42],
      "454563": [5, 376, 160, 54], "1aef25": [173, 381, 130, 45], "2585c5": [13, 463, 236, 30], "28bda3": [17, 526, 54, 54],
      "98b816": [249, 526, 54, 54], c74932: [7, 625, 219, 54],
    },
    names: [
      [80, 534, 123, 39, "text-[10px] leading-[13px] text-center"],
      [11, 712, 144, 46, "text-[16px] leading-[1.4] tracking-[0.01em]"],
      [186, 712, 123, 23, "text-[16px] leading-[1.4] tracking-[0.01em]"],
    ],
  },
  partners2023: {
    top: 59,
    logos: {
      "4c6375": [15, 134, 104, 30], "78c29b": [176, 134, 130, 30], a73840: [11, 196, 76, 56], "52606d": [108, 203, 195, 42],
      e1064d: [13, 280, 160, 64], af7be2: [14, 370, 150, 56], "12d088": [239, 282, 67, 66], e1cdfe: [243, 370, 60, 57],
    },
    names: [[15, 458, 175, 23, "text-[16px] leading-[1.4] tracking-[0.01em]"]],
  },
};

const W = 1057;
const pct = (v, of) => `${(v / of) * 100}%`;

// `minHeight`: section height of the old page (texts `layout`); `gap`: heading → logos, when it differs from the default
// `offset`: measured heading shift from `ink()`
export const LegacyLogos = ({ kind, heading, logos, names, className, minHeight, mobileMinHeight, gap: gapOverride, offset }) => {
  const { height, gap, logos: boxes, names: nameBoxes } = LAYOUT[kind];
  const placed = logos.map((logo) => ({ ...logo, box: Object.entries(boxes).find(([id]) => logo.src.includes(id))?.[1] }));

  const img = ({ name, href, src }, className) => {
    const el = <img src={src} alt={name} loading="lazy" className={`w-full h-full object-contain ${className ?? ""}`} />;
    return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full h-full">{el}</a> : el;
  };

  return (
    <section className={`relative text-[#ebebeb] tablet:min-h-(--h) max-tablet:min-h-(--mh) ${className}`} style={{ "--h": `${minHeight}px`, "--mh": `${mobileMinHeight}px` }}>
      <div style={{ "--mt": `${MOBILE[kind].top}px` }} className="max-w-[1089px] mx-auto px-4 pt-(--mt) tablet:pt-[91px] pb-6">
        <h2 style={offset?.style} className={`text-[30px] tablet:text-[56px] leading-none tracking-[0.01em] uppercase ${offset?.className ?? ""}`}>{heading}</h2>

        {/* Desktop/tablet: measured placement */}
        <div className="hidden tablet:block relative" style={{ aspectRatio: `${W} / ${height}`, marginTop: gapOverride ?? gap[0] }}>
          {placed.map((logo) => logo.box && (
            <div key={logo.src} className="absolute" style={{ left: pct(logo.box[0], W), top: pct(logo.box[1], height), width: pct(logo.box[2], W), height: pct(logo.box[3], height) }}>
              {img(logo)}
            </div>
          ))}
          {names.map((name, i) => {
            if (!nameBoxes[i]) return null;
            const [x, y, w, h, cls] = nameBoxes[i];
            return (
              <p key={name} className={`absolute translate-y-[3px] ${cls}`} style={{ left: pct(x, W), top: pct(y, height), width: pct(w, W), minHeight: h }}>
                {name}
              </p>
            );
          })}
        </div>
        {/* Logos / credits without a measured desktop box (2023 partners): plain row */}
        {(placed.some((logo) => !logo.box) || names.some((_, i) => !nameBoxes[i])) && (
          <div className="hidden tablet:flex flex-wrap items-center gap-10 mt-10">
            {placed.filter((logo) => !logo.box).map((logo) => (
              <div key={logo.src} className="h-16 w-[200px]">{img(logo)}</div>
            ))}
            {names.filter((_, i) => !nameBoxes[i]).map((name) => <p key={name} className="text-[24px]">{name}</p>)}
          </div>
        )}

      </div>

      {/* Phones: measured placement on the 320px canvas */}
      <div className="tablet:hidden">
        {logos.map((logo) => {
          const box = Object.entries(MOBILE[kind].logos).find(([id]) => logo.src.includes(id))?.[1];
          return box && (
            <div key={logo.src} className="absolute" style={{ left: box[0], top: box[1], width: box[2], height: box[3] }}>
              {img(logo)}
            </div>
          );
        })}
        {names.map((name, i) => {
          const [x, y, w, h, cls] = MOBILE[kind].names[i];
          return (
            <p key={name} className={`absolute ${cls}`} style={{ left: x, top: y, width: w, minHeight: h }}>
              {name}
            </p>
          );
        })}
      </div>
    </section>
  );
};
