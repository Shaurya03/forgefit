import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import { useSignup } from "../hooks/useSignup";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import "./Auth.css";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    signup,
    error,
    isLoading
  } = useSignup();

  const {
    googleAuth,
    error: googleError
  } = useGoogleAuth();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const success = await signup(
      email,
      password
    );

    if (success) {
      setEmail("");
      setPassword("");

      navigate("/");
    }
  };

  return (
    <div className="auth-page">

      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >

        <div className="auth-header">

          <svg className="auth-logo" viewBox="0 0 100 100" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="22,82 50,54 78,82" opacity="0.35" />
            <polyline points="22,64 50,36 78,64" opacity="0.65" />
            <polyline points="22,46 50,18 78,46" />
          </svg>

          <h2 className="auth-title">ForgeFit</h2>

          <h2>Create your account</h2>

          <p>
            Forge your strongest self.
          </p>

        </div>

        <div className="auth-field">

          <label>Email address</label>

          <input
            required
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

        </div>

        <div className="auth-field">

          <label>Password</label>

          <div className="password-input">

            <input
              required
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(current => !current)
              }
            >
              {showPassword
                ? <PiEyeSlash />
                : <PiEye />}
            </button>

          </div>

        </div>

        {(error || googleError) && (
          <div className="auth-error">
            {error || googleError}
          </div>
        )}

        <button
          className="auth-btn"
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Creating account..."
            : "Create Account"}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              await googleAuth(
                credentialResponse.credential
              );
            }}
            text="continue_with"
            theme="filled_black"
            shape="rectangular"
            size="large"
            width="100%"
            useOneTap={false}
          />
        </div>

        <p className="auth-footer">

          Already have an account?

          <Link to="/login">
            Sign In
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Signup;