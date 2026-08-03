import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Workouts from './pages/Workouts';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';

function App() {
  const { user, authIsReady } = useAuthContext();
  const location = useLocation();

  if (!authIsReady) {
    return null;
  }

  // The landing page ships its own nav (different links, own CTA styling),
  // so skip the app Navbar there instead of stacking two nav bars.
  const isLandingPage = location.pathname === '/' && !user;

  return (
    <>
      {!isLandingPage && <Navbar />}

      <div className="pages">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            <Routes location={location}>
              <Route
                path="/"
                element={user ? <Dashboard /> : <LandingPage />}
              />

              <Route
                path="/workouts"
                element={user ? <Workouts /> : <Navigate to="/" />}
              />

              <Route
                path="/exercises"
                element={user ? <Exercises /> : <Navigate to="/" />}
              />

              <Route
                path="/settings"
                element={user ? <Settings /> : <Navigate to="/" />}
              />

              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />

              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
