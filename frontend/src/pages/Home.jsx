import { useHashScroll } from "../hooks/useHashScroll";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Main } from "../components/Main";

export default function Home() {
  useHashScroll();

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
