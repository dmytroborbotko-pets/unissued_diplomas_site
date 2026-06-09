import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Home from './pages/Home';
import Achievements from './pages/Achievements';
import Exhibitions from './pages/Exhibitions';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:year-achievements" element={<Achievements />} />
          <Route path="/exhibitions" element={<Exhibitions />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
