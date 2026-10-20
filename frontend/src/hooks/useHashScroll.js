import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Router links like "/#faq" don't scroll on their own
export const useHashScroll = () => {
  const { hash, key } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash, key]); // key: re-clicking the same link scrolls again
};
