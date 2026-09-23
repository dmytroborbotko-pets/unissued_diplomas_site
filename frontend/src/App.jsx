import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Home from './pages/Home';
import Exhibitions from './pages/Exhibitions';

function App() {
  return (
    <LanguageProvider>
      <Router>
        {/* useContent() suspends until the locale's content chunk has loaded */}
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exhibitions" element={<Exhibitions />} />
          </Routes>
        </Suspense>
      </Router>
    </LanguageProvider>
  );
}

export default App;
