import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" fill="currentColor" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 3-8 5-8-5V7l8 5 8-5Z" fill="currentColor" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-6 7.7V15a1 1 0 1 1 2 0v1.7a2 2 0 1 1-2 0ZM10 9V7a2 2 0 0 1 4 0v2Z" fill="currentColor" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7Zm0 11a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" fill="currentColor" />
    </svg>
  );
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);
  const hasMinimumLength = password.length >= 8;

  let passwordLabel = "Weak";
  let passwordWidth = "18%";

  if (hasMinimumLength && hasUppercase && hasSpecialCharacter) {
    passwordLabel = "Strong";
    passwordWidth = "100%";
  } else if (hasMinimumLength && (hasUppercase || hasSpecialCharacter)) {
    passwordLabel = "Medium";
    passwordWidth = "65%";
  } else if (hasMinimumLength) {
    passwordLabel = "Weak";
    passwordWidth = "42%";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate("/board");
    }
  };

  return (
    <div className="register-shell">
      <div className="register-shell__glow register-shell__glow--left" />
      <div className="register-shell__glow register-shell__glow--right" />

      <div className="register-card register-card--modern page-reveal">
        <div className="register-brand">
          <div className="register-brand__mark">CC</div>
          <p>
            Career<em>Canvas</em>
            <span>Register once, then manage every application in one place.</span>
          </p>
        </div>

        <h1 className="register-header">Create Account</h1>
        <p className="register-subheader">
          Join and keep your career search organised in one place. Add jobs, track progress, and never lose the bigger picture.
        </p>

        {error && (
          <div className="register-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-field">
            <label htmlFor="name">Name</label>
            <div className="register-input-shell">
              <span className="register-icon"><IconUser /></span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="register-input"
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="email">Email</label>
            <div className="register-input-shell">
              <span className="register-icon"><IconMail /></span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="register-input"
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="password">Password</label>
            <div className="register-input-shell register-input-shell--password">
              <span className="register-icon"><IconLock /></span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Enter your password"
                className="register-input"
              />
              <button
                type="button"
                className="register-visibility"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <IconEye />
              </button>
            </div>

            <div className="register-strength">
              <div className="register-strength__label">
                <span>Password strength</span>
                <strong>{passwordLabel}</strong>
              </div>
              <div className="register-strength__track" aria-hidden="true">
                <span style={{ width: passwordWidth }} />
              </div>
              <p>Use 8+ characters with an uppercase letter and a special character.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="register-cta"
          >
            <span>{loading ? "Creating account…" : "Register"}</span>
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-footer__link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
