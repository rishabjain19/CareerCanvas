import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const EMPTY_PROFILE = {
  college: "",
  collegeYear: "",
  gpa: "",
  interests: "",
  linkedin: "",
  github: "",
  tenthMarks: "",
  twelfthMarks: "",
};

function ProfileSection({ title, variant = "", children }) {
  return (
    <div className={`profile-section ${variant ? `profile-section--${variant}` : ""}`}>
      <h3 className="profile-section__title">{title}</h3>
      <div className="profile-section__grid">
        {children}
      </div>
    </div>
  );
}

function ProfileField({ label, children }) {
  return (
    <div className="profile-field">
      <label className="profile-field__label">{label}</label>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        college: user.college || "",
        collegeYear: user.collegeYear || "",
        gpa: user.gpa ?? "",
        interests: user.interests || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        tenthMarks: user.tenthMarks || "",
        twelfthMarks: user.twelfthMarks || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      gpa: formData.gpa === "" ? null : Number(formData.gpa),
    };
    const success = await updateProfile(payload);
    if (success) {
      setSaved(true);
    }
  };

  return (
    <div className="board-page page-reveal">
      <Navbar />

      <main className="profile-main">
        <div className="profile-container">

          <div className="profile-topbar">
            <div>
              <p className="profile-hero__eyebrow">Your profile</p>
              <h1 className="profile-hero__title">My Profile</h1>
              <p className="profile-hero__copy">
                Keep your career details sharp and ready. Fill in what matters — update anytime.
              </p>
            </div>
            <button
              onClick={() => navigate("/board")}
              className="btn-ghost profile-back-btn"
            >
              ← Job Board
            </button>
          </div>

          {error && (
            <div className="profile-alert profile-alert--error">{error}</div>
          )}
          {saved && (
            <div className="profile-alert profile-alert--success">
              ✓ Profile saved successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">

            <ProfileSection title="Academic Background" variant="academic">
              <ProfileField label="College / University">
                <input
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. IIT Delhi"
                  className="profile-input"
                />
              </ProfileField>

              <ProfileField label="Current Year">
                <input
                  name="collegeYear"
                  value={formData.collegeYear}
                  onChange={handleChange}
                  placeholder="e.g. 3rd Year"
                  className="profile-input"
                />
              </ProfileField>

              <ProfileField label="GPA / CGPA">
                <input
                  name="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  className="profile-input"
                />
              </ProfileField>

              <ProfileField label="Interests">
                <input
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g. Web Development, Machine Learning"
                  className="profile-input"
                />
              </ProfileField>
            </ProfileSection>

            <ProfileSection title="Academic Scores" variant="scores">
              <ProfileField label="10th Marks">
                <input
                  name="tenthMarks"
                  required
                  value={formData.tenthMarks}
                  onChange={handleChange}
                  placeholder="e.g. 92%"
                  className="profile-input"
                />
              </ProfileField>

              <ProfileField label="12th Marks">
                <input
                  name="twelfthMarks"
                  required
                  value={formData.twelfthMarks}
                  onChange={handleChange}
                  placeholder="e.g. 88%"
                  className="profile-input"
                />
              </ProfileField>
            </ProfileSection>

            <ProfileSection title="Online Profile" variant="online">
              <ProfileField label="LinkedIn">
                <input
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourname"
                  className="profile-input"
                />
              </ProfileField>

              <ProfileField label="GitHub">
                <input
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/yourname"
                  className="profile-input"
                />
              </ProfileField>
            </ProfileSection>

            <div className="profile-form__footer">
              <p className="profile-form__hint">
                All fields are optional except 10th &amp; 12th Marks.
              </p>
              <button type="submit" disabled={loading} className="btn-primary profile-save-btn">
                {loading ? "Saving…" : "Save Profile"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
