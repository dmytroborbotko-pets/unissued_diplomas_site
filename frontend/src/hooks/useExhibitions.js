import { useMemo } from "react";
import { MOCK_EXHIBITIONS } from "../constants/exhibitions";

export const useExhibitions = () => {
  const exhibitionsByCountry = useMemo(() => {
    return new Map(Object.entries(MOCK_EXHIBITIONS));
  }, []);

  return { exhibitionsByCountry, isLoading: false };
};
