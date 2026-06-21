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
      <h1 className="text-xl font-bold">CareerCanvas</h1>
      <div className="flex items-center gap-4">
        {location.pathname !== '/profile' && (
          <button onClick={() => navigate('/profile')} className="text-sm text-[var(--beige)] hover:underline btn-ghost">Profile</button>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-[var(--beige)] hover:underline btn-ghost"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
