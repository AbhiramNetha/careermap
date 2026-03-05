import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
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
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CoursesPage from './pages/CoursesPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminAnalytics from './pages/admin/AdminAnalytics';
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

/* ── Public site wrapper (with Navbar + Footer + particles) ── */
function PublicSite() {
  return (
    <div className="page-wrapper">
      <ParticleBackground />
      <Navbar />
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/careers" element={<CareerCategoryPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/branches" element={<BranchSelectionPage />} />

        {/* ── Protected routes (login required) ── */}
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/quiz/results" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
        <Route path="/careers/:id" element={<ProtectedRoute><CareerDetailPage /></ProtectedRoute>} />
        <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
        <Route path="/branches/:branch" element={<ProtectedRoute><BranchDetailPage /></ProtectedRoute>} />
        <Route path="/roadmap/:id" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* ── Admin routes (no Navbar / Footer / particles) ── */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>

              {/* ── All other routes → public site ── */}
              <Route path="/*" element={<PublicSite />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </AdminAuthProvider>
  );
}

export default App;
