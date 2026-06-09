import { useNavigate } from "react-router-dom";

export const CountryCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/exhibitions?country=${data.isoAlpha2}`)}
      className="flex items-center gap-3 rounded-lg border border-white/10 bg-theme-bg-dark px-4 py-3 text-left transition-colors hover:border-theme-primary/50 hover:bg-white/5 cursor-pointer"
    >
      <span className="text-2xl">{data.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="text-theme-text text-[14px] font-[500] truncate">
          {data.name}
        </p>
        <p className="text-theme-text-muted text-[12px]">
          {data.count} exhibition{data.count !== 1 ? "s" : ""}
        </p>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-theme-text-muted shrink-0"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
};
