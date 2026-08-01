import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found">
      <svg className="not-found-icon" viewBox="0 0 100 100" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22,82 50,54 78,82" opacity="0.35" />
        <polyline points="22,64 50,36 78,64" opacity="0.65" />
        <polyline points="22,46 50,18 78,46" />
      </svg>
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/" className="not-found-link">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;