import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
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
import AtsCheckerPage from './pages/AtsCheckerPage';
import ResumeBuilder from './pages/ResumeBuilder';
import PremiumPage from './pages/PremiumPage';
import CollegeAlumniPage from './pages/CollegeAlumniPage';
import ProtectedRoute from './components/ProtectedRoute';
import PremiumRoute from './components/PremiumRoute';
import AdminRoute from './components/AdminRoute';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import WebsitePreloader from './components/WebsitePreloader';
import ScrollToTop from './components/ScrollToTop';
import BeamsBackground from './components/Beams/BeamsBackground';
import AdminBackgrounds from './components/AdminBackgrounds';
import './index.css';


function PublicSite() {
  const location = useLocation();
  const hideFooter = ['/premium', '/courses', '/careers', '/quiz', '/alumni'].some(p => location.pathname.startsWith(p));
  return (
    <>
      {/* Beams background — fixed to viewport, behind everything */}
      <BeamsBackground
        lightColor="#00ff88"
        beamWidth={3}
        beamHeight={15}
        beamNumber={20}
        speed={1.8}
        noiseIntensity={1.5}
        scale={0.25}
        rotation={0}
      />

      <div className="app-layout">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main content area — this is the scroll container */}
        <div className="main-content-area" id="main-scroll-container">

          {/* Sticky top bar */}
          <TopBar />

          {/* Page content */}
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/careers" element={<CareerCategoryPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/branches" element={<PremiumRoute><BranchSelectionPage /></PremiumRoute>} />
              <Route path="/ats" element={<PremiumRoute><AtsCheckerPage /></PremiumRoute>} />

              {/* Protected routes */}
              <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
              <Route path="/quiz/results" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
              <Route path="/careers/:id" element={<ProtectedRoute><CareerDetailPage /></ProtectedRoute>} />
              <Route path="/compare" element={<PremiumRoute><ComparePage /></PremiumRoute>} />
              <Route path="/branches/:branch" element={<PremiumRoute><BranchDetailPage /></PremiumRoute>} />
              <Route path="/roadmap/:id" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/resume-builder" element={<PremiumRoute><ResumeBuilder /></PremiumRoute>} />
              <Route path="/alumni" element={<ProtectedRoute><CollegeAlumniPage /></ProtectedRoute>} />
            </Routes>
            {!hideFooter && <Footer />}
          </main>
        </div>
      </div>
    </>
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
                <AdminBackgrounds />
                <Routes>
                  {/* Admin routes */}
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

                  {/* Public site with sidebar layout */}
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
