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

        {/* More sections will be added here */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4 tablet:px-8">
            <h2 className="text-3xl tablet:text-5xl font-bold mb-8">
              Project sections coming soon...
            </h2>
            <p className="text-gray-400">
              All 10+ sections will be implemented with responsive design
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
