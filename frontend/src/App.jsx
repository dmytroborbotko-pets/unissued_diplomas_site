import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Home from './pages/Home';
import Achievements from './pages/Achievements';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:year-achievements" element={<Achievements />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
