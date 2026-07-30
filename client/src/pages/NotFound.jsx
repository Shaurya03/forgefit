import { Link } from "react-router-dom";
import { PiBarbellDuotone } from "react-icons/pi";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found">
      <PiBarbellDuotone className="not-found-icon" />
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/" className="not-found-link">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;