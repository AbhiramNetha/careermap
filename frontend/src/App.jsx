import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import QuizResultPage from './pages/QuizResultPage';
import CareerCategoryPage from './pages/CareerCategoryPage';
import CareerDetailPage from './pages/CareerDetailPage';
import ComparePage from './pages/ComparePage';
import BranchSelectionPage from './pages/BranchSelectionPage';
import BranchDetailPage from './pages/BranchDetailPage';
import RoadmapPage from './pages/RoadmapPage';
import './index.css';

/* ── Global rising-particle background (matches original app.js createParticles) ── */
const PARTICLE_COLORS = [
  '99,102,241',   // indigo
  '139,92,246',   // violet
  '6,182,212',    // cyan
  '16,185,129',   // emerald
  '248,113,113',  // rose
  '245,158,11',   // amber
];

function ParticleBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // clear any old particles (dev hot-reload guard)
    container.innerHTML = '';

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'g-particle';
      const size = Math.random() * 5 + 2;                          // 2–7 px
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const alpha = (Math.random() * 0.35 + 0.15).toFixed(2);       // 0.15–0.5
      const dur = (Math.random() * 15 + 10).toFixed(1);           // 10–25 s
      const delay = -(Math.random() * 20).toFixed(1);               // negative = pre-start

      p.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${(Math.random() * 100).toFixed(1)}%;
        background:rgba(${color},${alpha});
        animation-duration:${dur}s;
        animation-delay:${delay}s;
        box-shadow:0 0 ${Math.round(size * 1.5)}px rgba(${color},${alpha});
      `;
      container.appendChild(p);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="page-wrapper">
          <ParticleBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz/results" element={<QuizResultPage />} />
            <Route path="/careers" element={<CareerCategoryPage />} />
            <Route path="/careers/:id" element={<CareerDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/branches" element={<BranchSelectionPage />} />
            <Route path="/branches/:branch" element={<BranchDetailPage />} />
            <Route path="/roadmap/:id" element={<RoadmapPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

