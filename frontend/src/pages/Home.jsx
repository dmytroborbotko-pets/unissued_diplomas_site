import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Main } from "../components/Main";

export default function Home() {
  const { hash, key } = useLocation();

  // Router links like "/#faq" don't scroll on their own
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash, key]); // key: re-clicking the same link scrolls again

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16 tablet-md:pt-20">
        {/* Top Section */}
        <Main />
      </main>

      <Footer />
    </div>
  );
}
