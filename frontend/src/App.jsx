import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
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
import OpportunitiesPage from './pages/OpportunitiesPage';
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
import AdminOpportunities from './pages/admin/AdminOpportunities';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import WebsitePreloader from './components/WebsitePreloader';
import ScrollToTop from './components/ScrollToTop';
import AdminBackgrounds from './components/AdminBackgrounds';
import './index.css';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.2,  ease: 'easeIn' } },
};



function PublicSite() {
  const location = useLocation();
  const hideFooter = ['/premium', '/courses', '/careers', '/quiz', '/alumni', '/jobs', '/internships', '/walkins', '/opportunities'].some(p => location.pathname.startsWith(p));
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
  const [showSidebar, setShowSidebar] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    setAnimationCompleted(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowSidebar(true);
      return;
    }

    const scrollContainer = document.getElementById('main-scroll-container');
    if (!scrollContainer) {
      setShowSidebar(false);
      return;
    }

    const handleScroll = () => {
      const viewportH = window.innerHeight;
      // Show sidebar after 2.8 viewports
      const threshold = viewportH * 2.8;
      if (scrollContainer.scrollTop >= threshold) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    handleScroll();

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  if (isAuthPage) {
    return (
      <main style={{ padding: 0, margin: 0, minHeight: '100vh', width: '100vw', background: 'var(--bg)' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minHeight: '100vh', width: '100vw' }}
          >
            <Routes location={location}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  return (
    <>
      <div className="app-layout">
        {/* Fixed Sidebar */}
        <Sidebar visible={showSidebar} />

        {/* Main content area — this is the scroll container */}
        <div className="main-content-area" id="main-scroll-container">

          {/* Sticky top bar */}
          <TopBar sidebarHidden={!showSidebar} />

          {/* Page content with animated transitions */}
          <main className="main-content">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ 
                  minHeight: '100%',
                  transform: location.pathname === '/' ? 'none' : (animationCompleted ? 'none' : undefined),
                  willChange: location.pathname === '/' ? 'auto' : (animationCompleted ? 'auto' : undefined)
                }}
                onAnimationComplete={() => setAnimationCompleted(true)}
              >
                <Routes location={location}>
                  {/* Public routes — all pages are browsable */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/premium" element={<PremiumPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/careers" element={<CareerCategoryPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/branches" element={<BranchSelectionPage />} />
                  <Route path="/ats" element={<AtsCheckerPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/quiz/results" element={<QuizResultPage />} />
                  <Route path="/careers/:id" element={<CareerDetailPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/branches/:branch" element={<BranchDetailPage />} />
                  <Route path="/roadmap/:id" element={<RoadmapPage />} />
                  <Route path="/resume-builder" element={<ResumeBuilder />} />
                  <Route path="/alumni" element={<CollegeAlumniPage />} />
                  <Route path="/jobs" element={<OpportunitiesPage />} />
                  <Route path="/internships" element={<OpportunitiesPage />} />
                  <Route path="/walkins" element={<OpportunitiesPage />} />

                  {/* Profile stays fully protected */}
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                </Routes>
                {!hideFooter && <Footer />}
              </motion.div>
            </AnimatePresence>
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
              <Toaster position="top-center" reverseOrder={false} />
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
                    <Route path="opportunities" element={<AdminOpportunities />} />
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
