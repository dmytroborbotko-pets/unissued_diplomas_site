import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16 tablet:pt-20">
        {/* Hero Section - Placeholder */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl tablet:text-6xl desktop:text-7xl font-bold mb-4">
              UNISSUED DIPLOMAS
            </h1>
            <p className="text-gray-400 text-lg tablet:text-xl">
              When your classroom turns into a battlefield, your major becomes in every.
            </p>
          </div>
        </section>

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
