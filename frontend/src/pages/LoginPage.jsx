import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    eyebrow: "Track",
    title: "Every application, one place",
    body: "Log roles the moment you apply. Never lose track of a company, deadline, or recruiter note again.",
  },
  {
    eyebrow: "Move",
    title: "Drag from applied to offer",
    body: "A visual Kanban board that mirrors your real pipeline — To Apply, Applied, Interview, Offer, Rejected.",
  },
  {
    eyebrow: "Analyse",
    title: "AI resume feedback",
    body: "Upload your resume and paste a job description. Get instant match score, missing skills and improvement tips.",
  },
];

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

  const scrollToForm = () => {
    document.getElementById("login-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="login-landing">

      <nav className="login-landing__nav">
        <span className="nav-brand">Career<em>Canvas</em></span>
        <button onClick={scrollToForm} className="btn-primary" style={{ padding: "0.45rem 1.1rem", fontSize: "0.88rem" }}>
          Sign in
        </button>
      </nav>

      <section className="login-hero">
        <div className="login-hero__inner">
          <p className="login-hero__eyebrow">Career<em>Canvas</em></p>
          <h1 className="login-hero__headline">
            Your career search,<br />
            beautifully organised.
          </h1>
          <p className="login-hero__sub">
            A smart Kanban board that tracks every job application from first click to final offer — with AI insights built right in.
          </p>

          <div className="login-hero__actions">
            <button onClick={scrollToForm} className="login-hero__cta">
              Sign in to your board
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Link to="/register" className="login-hero__link">
              New here? Create a free account →
            </Link>
          </div>

          <div className="login-features">
            {FEATURES.map((f) => (
              <div key={f.eyebrow} className="login-feature-card">
                <span className="login-feature-card__eye">{f.eyebrow}</span>
                <strong className="login-feature-card__title">{f.title}</strong>
                <p className="login-feature-card__body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="login-hero__scroll-cue" onClick={scrollToForm}>
          <div className="scroll-cue__dot" />
          <span>Sign in below</span>
        </div>
      </section>

      <section id="login-form-section" className="login-form-section">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <p className="auth-kicker">Welcome back</p>
            <h2 className="login-form-title">Login to Career<em>Canvas</em></h2>
            <p className="login-form-sub">Access your board and continue your job search.</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">{error}</div>
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
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="auth-link auth-link--accent">
              Create your account
            </Link>
          </p>
        </div>
      </section>

      <footer className="login-footer">
        <span>Career<em>Canvas</em> — Track every move.</span>
      </footer>
    </div>
  );
}
