import { useHashScroll } from "../hooks/useHashScroll";
import { useContent } from "../hooks/useContent";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Main } from "../components/Main";

export default function Home() {
  useHashScroll();
  const { layout } = useContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* below the fixed header: its height per language on phones, 80px from 905px up */}
      <main style={{ "--mh": `${layout.m.header}px` }} className="flex-1 pt-(--mh) tablet-md:pt-20">
        <Main />
      </main>

      <Footer />
    </div>
  );
}
