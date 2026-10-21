import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { JAPAN_PATH } from './constants/languages';
import Home from './pages/Home';

const JapanPage = lazy(() => import('./pages/JapanPage'));
const Achievements2023 = lazy(() => import('./pages/Achievements2023'));

function App() {
  return (
    <Router>
      {/* Inside the Router: the language follows the route (/jp is always Japanese) */}
      <LanguageProvider>
        {/* useContent() suspends until the locale's content chunk has loaded */}
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/2023-achievements" element={<Achievements2023 />} />
            {/* The old exhibitions page is replaced by the 2023 results page */}
            <Route path="/exhibitions" element={<Navigate to="/2023-achievements" replace />} />
            <Route path={JAPAN_PATH} element={<JapanPage />} />
          </Routes>
        </Suspense>
      </LanguageProvider>
    </Router>
  );
}

export default App;
