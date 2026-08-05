import { FiMoon, FiSun, FiLogOut } from "react-icons/fi";
import { FaWeightHanging } from "react-icons/fa";
import { MdSocialDistance } from "react-icons/md";
import { useSettings } from "../hooks/useSettings";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { FiDownload } from "react-icons/fi";
import "./Settings.css";

function Settings() {

  const {
    settings,
    updateSettings
  } = useSettings();

  const { user } = useAuthContext();

  const { logout } = useLogout();

  const { isInstallable, isInstalled, isIOS, promptInstall } = useInstallPrompt();

  if (!settings) {
    return (
      <div className="settings-page">
        <p>Loading settings...</p>
      </div>
    );
  }

  const handleSettingChange = async (
    setting,
    value
  ) => {
    await updateSettings({
      [setting]: value
    });
  };

  return (
    <div className="settings-page">

      <div className="settings-page-header">

        <div className="page-header">
          <h2>Settings</h2>
        </div>

      </div>

      <div className="settings-body">

        {/* ---------------- Appearance ---------------- */}

        <section className="settings-section">

          <div className="settings-header">
            <h3>Appearance</h3>

            <p>
              Choose how the application looks.
            </p>
          </div>

          <div className="settings-options">

            <button
              className={
                settings.theme === "light"
                  ? "setting-pill active"
                  : "setting-pill"
              }
              onClick={() =>
                handleSettingChange(
                  "theme",
                  "light"
                )
              }
            >
              <FiSun />
              Light
            </button>

            <button
              className={
                settings.theme === "dark"
                  ? "setting-pill active"
                  : "setting-pill"
              }
              onClick={() =>
                handleSettingChange(
                  "theme",
                  "dark"
                )
              }
            >
              <FiMoon />
              Dark
            </button>

          </div>

        </section>

        {/* ---------------- Weight ---------------- */}

        <section className="settings-section">

          <div className="settings-header">
            <h3>Weight Unit</h3>

            <p>
              Used throughout workouts and history.
            </p>
          </div>

          <div className="settings-options">

            <button
              className={
                settings.weightSystem === "metric"
                  ? "setting-pill active"
                  : "setting-pill"
              }
              onClick={() =>
                handleSettingChange(
                  "weightSystem",
                  "metric"
                )
              }
            >
              <FaWeightHanging />
              Kilograms (kg)
            </button>

            <button
              className={
                settings.weightSystem === "imperial"
                  ? "setting-pill active"
                  : "setting-pill"
              }
              onClick={() =>
                handleSettingChange(
                  "weightSystem",
                  "imperial"
                )
              }
            >
              <FaWeightHanging />
              Pounds (lb)
            </button>

          </div>

        </section>

        {/* ---------------- Distance ---------------- */}

        <section className="settings-section">

          <div className="settings-header">
            <h3>Distance Unit</h3>

            <p>
              Used for cardio exercises.
            </p>
          </div>

          <div className="settings-options">

            <button
              className={
                settings.distanceSystem === "metric"
                  ? "setting-pill active"
                  : "setting-pill"
              }
              onClick={() =>
                handleSettingChange(
                  "distanceSystem",
                  "metric"
                )
              }
            >
              <MdSocialDistance />
              Metric (km / m)
            </button>

            <button
              className={
                settings.distanceSystem === "imperial"
                  ? "setting-pill active"
                  : "setting-pill"
              }
              onClick={() =>
                handleSettingChange(
                  "distanceSystem",
                  "imperial"
                )
              }
            >
              <MdSocialDistance />
              Imperial (mi / ft)
            </button>

          </div>

        </section>

        {/* ---------------- Account ---------------- */}

        <section className="settings-section">

          <div className="settings-header">
            <h3>Account</h3>

            <p>
              Manage your account.
            </p>
          </div>

          <div className="account-info">

            <span className="account-label">
              Signed in as
            </span>

            <span className="account-email">
              {user.email}
            </span>

          </div>

          <div className="logout-container">
            <button
              className="logout-btn"
              onClick={logout}
            >
              <FiLogOut />
              Logout
            </button>
          </div>

        </section>

        {/* ---------------- Install App ---------------- */}

        {!isInstalled && (isInstallable || isIOS) && (
          <section className="settings-section">

            <div className="settings-header">
              <h3>Install App</h3>

              <p>
                Add ForgeFit to your home screen for quick, full-screen access.
              </p>
            </div>

            {isInstallable ? (
              <div className="install-container">
                <button
                  className="install-btn"
                  onClick={promptInstall}
                >
                  <FiDownload />
                  Install App
                </button>
              </div>
            ) : (
              <div className="install-ios-instructions">
                Tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
              </div>
            )}

          </section>
        )}

        {/* ---------------- About ---------------- */}

        <section className="settings-section">

          <div className="settings-header">
            <h3>About</h3>

            <p>
              Application information.
            </p>
          </div>

          <div className="about-info">

            <div className="about-row">
              <span className="about-label">
                Application
              </span>

              <span className="about-value">
                ForgeFit
              </span>
            </div>

            <div className="about-row">
              <span className="about-label">
                Version
              </span>

              <span className="about-value">
                v1.0.0
              </span>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Settings;