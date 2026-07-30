import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Workouts from './pages/Workouts';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  const { user } = useAuthContext();

  return (
    <>
      <Navbar />

      <div className="pages">
        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route
            path="/workouts"
            element={user ? <Workouts /> : <Navigate to="/login" />}
          />

          <Route
            path="/exercises"
            element={user ? <Exercises /> : <Navigate to="/login" />}
          />

          <Route
            path="/settings"
            element={user ? <Settings /> : <Navigate to="/login" />}
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
      </div>
    </>
  );
}

export default App;
