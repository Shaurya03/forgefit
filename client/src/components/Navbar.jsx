import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSettings } from "../hooks/useSettings";
import { FiSettings } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuthContext();
  const { settings, fetchSettings } = useSettings();

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    const loadSettings = async () => {
      if (user && !settings) {
        try {
          await fetchSettings();
        } catch (error) {
          console.error(error);
        }
      }
    };

    loadSettings();
  }, [user, settings]);

  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <header className="navbar">
      <div className="container">

        <NavLink className="logo" to="/">
          <svg className="logo-icon" viewBox="0 0 100 100" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="22,82 50,54 78,82" opacity="0.35" />
            <polyline points="22,64 50,36 78,64" opacity="0.65" />
            <polyline points="22,46 50,18 78,46" />
          </svg>
          <h1>ForgeFit</h1>
        </NavLink>

        <nav className="navbar-nav">

          {user ? (
            <>
              <div className="nav-links">
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/workouts">Workouts</NavLink>
                <NavLink to="/exercises">Exercises</NavLink>
              </div>

              <NavLink
                to="/settings"
                className="settings-link"
              >
                <span className="settings-text">
                  Settings
                </span>

                <FiSettings className="settings-icon" />
              </NavLink>
            </>
          ) : (
            <div className="nav-links auth-links">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </div>
          )}

        </nav>

      </div>
    </header>
  );
}

export default Navbar;