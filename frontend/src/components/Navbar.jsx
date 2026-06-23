import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar flex items-center justify-between page-reveal">
      <span className="nav-brand">
        Career<em>Canvas</em>
      </span>
      <div className="flex items-center gap-2">
        {location.pathname !== "/profile" && (
          <button
            onClick={() => navigate("/profile")}
            className="nav-btn"
          >
            Profile
          </button>
        )}
        <button onClick={handleLogout} className="nav-btn nav-btn--logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
