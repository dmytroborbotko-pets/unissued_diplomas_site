import { useSearchParams } from "react-router-dom";

export default function Exhibitions() {
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <h1 className="text-4xl font-bold text-center py-20">
        Exhibitions{country ? ` in ${country}` : ""}
      </h1>
      <p className="text-center text-theme-text-muted">
        This page will display the full list of exhibitions
        {country ? ` filtered by ${country}` : ""}.
      </p>
    </div>
  );
}
