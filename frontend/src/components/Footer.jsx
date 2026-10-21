import { Link } from "react-router-dom";
import { useContent } from "../hooks/useContent";
import { minH } from "../utils/utils";

// Links and icons of the old site's footer
const SOCIAL_LINKS = [
  ["Instagram", "instagram", "https://instagram.com/unissued_diplomas"],
  ["Facebook", "facebook", "https://www.facebook.com/profile.php?id=100090022783304"],
  ["LinkedIn", "linkedin", "https://www.linkedin.com/company/unissueddiplomas/"],
  ["TikTok", "tiktok", "https://www.tiktok.com/@unissueddiplomas"],
  ["X (Twitter)", "x", "https://x.com/unissuedd"],
];

// Layout measured on the old site: 282px high, logo left, email + icons in the middle, donate right, copyright below
// `emailLeft`: the old Italian 2023 page places the mobile email differently from its home page
export default function Footer({ emailLeft }) {
  const { footer, layout } = useContent();
  const c = layout.m.footerCentered;
  // desktop: English layout, translations 11–13px to the right, 3px lower, copyright 74px above the bottom
  const d = c ? { x: 11, y: 3, logo: 13, copyright: 166 } : { x: 0, y: 0, logo: 0, copyright: 238 };

  return (
    <footer id="contacts" className="relative bg-theme-bg text-[#ebebeb]">
      {/* Phones: the old 320px mobile footer, measured placement (English: logo, SUSK, donate in a row; others centered) */}
      {c ? (
        <div {...minH(layout, "footer", "tablet:hidden relative")}>
          <Link to="/" className="absolute left-[107px] top-[20px]">
            <img src="/legacy/logo-white.png" alt="Unissued Diplomas" className="w-[107px] h-[30px] object-contain" />
          </Link>
          <a href={`mailto:${footer.email}`} className="absolute top-[60px] text-[14px] font-[500] leading-[26.25px]" style={{ left: emailLeft ?? c.email }}>
            {footer.email}
          </a>
          <a href="#donate" className="absolute top-[106px] w-[217px] h-[30px] flex items-center justify-center bg-theme-primary-dark text-[13px] font-[500] tracking-[0.05em] uppercase" style={{ left: c.donate }}>
            {footer.donate}
          </a>
          {SOCIAL_LINKS.map(([label, icon, url], i) => (
            <a key={icon} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="absolute top-[156px]" style={{ left: [27, 83, 144, 213, 273][i] }}>
              <img src={`/legacy/social/${icon}.png`} alt="" className="w-[30px] h-[30px]" />
            </a>
          ))}
          <p className="absolute left-[79px] top-[201px] text-[12px] leading-[29px]">{footer.copyright}</p>
        </div>
      ) : (
        <div {...minH(layout, "footer", "tablet:hidden relative")}>
          <Link to="/" className="absolute left-[13px] top-[26px]">
            <img src="/legacy/logo-white.png" alt="Unissued Diplomas" className="w-[107px] h-[30px] object-contain" />
          </Link>
          <img src="/legacy/y2023/susk.png" alt="" className="absolute left-[147px] top-[22px] w-[21px] h-[38px] object-contain" />
          <a href="#donate" className="absolute left-[196px] top-[26px] w-[107px] h-[30px] flex items-center justify-center bg-theme-primary-dark text-[13px] font-[500] tracking-[0.05em] uppercase">
            {footer.donate}
          </a>
          <a href={`mailto:${footer.email}`} className="absolute left-[14px] top-[99px] text-[14px] font-[500] leading-[26.25px]">
            {footer.email}
          </a>
          {SOCIAL_LINKS.map(([label, icon, url], i) => (
            <a key={icon} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="absolute top-[140px]" style={{ left: [12, 72, 138, 201, 261][i] }}>
              <img src={`/legacy/social/${icon}.png`} alt="" className="w-[30px] h-[30px]" />
            </a>
          ))}
          <p className="absolute left-[16px] top-[197px] text-[12px] leading-[29px]">{footer.copyright}</p>
        </div>
      )}

      {/* Desktop: measured placement in the 1057px column (translations: shifted right, copyright higher) */}
      <div {...minH(layout, "footer", "max-tablet:hidden relative max-w-[1057px] mx-auto")}>
        <Link to="/" className="absolute top-[53px]" style={{ left: -9 + d.logo }}>
          <img src="/legacy/logo-white.png" alt="Unissued Diplomas" className="w-[147px] h-10" />
        </Link>
        <a href={`mailto:${footer.email}`} className="absolute text-[16px] font-[500] leading-[31px] hover:text-[#ff6868] transition-colors" style={{ left: 382 + d.x, top: 45 + d.y }}>
          {footer.email}
        </a>
        {SOCIAL_LINKS.map(([label, icon, url], i) => (
          <a key={icon} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="absolute top-[102px] hover:opacity-80 transition-opacity" style={{ left: [380, 457, 538, 618, 695][i] + d.x, marginTop: d.y ? 1 : 0 }}>
            <img src={`/legacy/social/${icon}.png`} alt="" className="w-10 h-10" />
          </a>
        ))}
        <a
          href="#donate"
          className="absolute w-[262px] h-[37px] flex items-center justify-center bg-theme-primary-dark hover:bg-theme-primary transition-colors text-[16px] font-[500] tracking-[0.05em] uppercase"
          style={{ left: 796 + d.x, top: 55 + d.y }}
        >
          {footer.donate}
        </a>
        <p className="absolute text-[14px] leading-[29px]" style={{ left: -11 + d.logo, top: d.copyright }}>{footer.copyright}</p>
      </div>
    </footer>
  );
}
