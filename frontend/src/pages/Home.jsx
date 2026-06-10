import Header from "../components/Header";
import Footer from "../components/Footer";
import { Main } from "../components/Main";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16 tablet:pt-20">
        {/* Top Section */}
        <Main />
      </main>

      <Footer />
    </div>
  );
}
