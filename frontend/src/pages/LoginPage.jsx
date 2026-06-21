import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/board");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-shell__glow auth-shell__glow--left" />
      <div className="auth-shell__glow auth-shell__glow--right" />

      <div className="auth-card login-card page-reveal">
        <section className="auth-card__intro">
          <div className="auth-badge">CareerCanvas</div>
          <h1>Design your career, one application at a time.</h1>
          <p>Organise roles, track status, and move forward with clarity.</p>

          <div className="auth-stats">
            <div>
              <strong>Track</strong>
              <span>Every application in one place.</span>
            </div>
            <div>
              <strong>Move</strong>
              <span>From applied to interview with focus.</span>
            </div>
          </div>
        </section>

        <section className="auth-card__form-panel">
          <div className="auth-card__header">
            <p className="auth-kicker">Welcome back</p>
            <h2>Login</h2>
            <p className="auth-subcopy">
              Access your dashboard and continue your job search.
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="auth-input"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="auth-input"
              />
            </div>

            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="auth-link auth-link--accent">
              Create your account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
