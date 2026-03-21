import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ThemeProvider } from './context/ThemeContext';
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
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CoursesPage from './pages/CoursesPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import WebsitePreloader from './components/WebsitePreloader';
import ScrollToTop from './components/ScrollToTop';
import BeamsBackground from './components/Beams/BeamsBackground';
import './index.css';

/* ── Public site wrapper (with Navbar + Footer + Beams background) ── */
function PublicSite() {
  return (
    <div className="page-wrapper">
      {/* Beams animated background — fixed layer at z-index:-1, mounted once */}
      <BeamsBackground
        lightColor="#07c06a"
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={0}
      />
      <Navbar />
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <WebsitePreloader />
      <ThemeProvider>
        <AdminAuthProvider>
          <AuthProvider>
            <AppProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* ── Admin routes (no Navbar / Footer / Beams) ── */}
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
      </ThemeProvider>
    </>
  );
}

export default App;
