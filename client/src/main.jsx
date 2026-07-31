import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WorkoutContextProvider } from './context/WorkoutContextProvider';
import { AuthContextProvider } from './context/AuthContextProvider.jsx';
import { CategoryContextProvider } from './context/CategoryContextProvider.jsx';
import { ExerciseContextProvider } from './context/ExerciseContextProvider.jsx';
import { SettingsContextProvider } from './context/SettingsContextProvider.jsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppToastContainer from "./components/AppToastContainer.jsx";
import ErrorBoundary from './components/ErrorBoundary.jsx';
import App from './App.jsx';
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import "./styles/theme.css";
import "./index.css";
import "./styles/reactDatepicker.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      >
        <BrowserRouter>
          <AuthContextProvider>
            <SettingsContextProvider>
              <WorkoutContextProvider>
                <CategoryContextProvider>
                  <ExerciseContextProvider>
                    <App />
                  </ExerciseContextProvider>
                </CategoryContextProvider>
              </WorkoutContextProvider>
              <AppToastContainer />
            </SettingsContextProvider>
          </AuthContextProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
