import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Interview from './pages/Interview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import './App.css';

function App() {
  return (
    <Router>
      {/* The Navbar stays at the top of every page */}
      <Navbar />
      
      {/* The Routes decide which page component to load based on the URL */}
      <Routes>
        <Route path="/" element={<Interview />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
      </Routes>
    </Router>
  );
}

export default App;