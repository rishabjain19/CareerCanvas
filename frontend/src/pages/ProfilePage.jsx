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
  leetcode: "",
  tenthMarks: "",
  twelfthMarks: "",
};

export default function ProfilePage() {
  const { user, updateProfile, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_PROFILE);
  const [saved, setSaved] = useState(false);

  // pre-fill with whatever the user already has saved, falling back to empty strings
  useEffect(() => {
    if (user) {
      setFormData({
        college: user.college || "",
        collegeYear: user.collegeYear || "",
        gpa: user.gpa ?? "",
        interests: user.interests || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        leetcode: user.leetcode || "",
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
    <div className="min-h-screen bg-[var(--bg)] page-reveal">
      <Navbar />

      <main className="w-full p-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="card-surface p-8 page-reveal page-reveal--soft">
            <div className="profile-hero">
              <p className="profile-hero__eyebrow">Profile setup</p>
              <h2 className="profile-hero__title">My Profile</h2>
              <p className="profile-hero__copy">Optional, but useful. Fill it in when you want to personalize your experience and keep your career details ready for the board.</p>
            </div>

            <div className="flex items-start justify-between mb-6">
              <div />
              <div>
                <button onClick={() => navigate('/board')} className="btn-ghost text-sm">← Back to Job Board</button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[rgba(224,93,93,0.08)] text-[var(--rejected)] text-sm rounded">{error}</div>
            )}
            {saved && (
              <div className="mb-4 p-3 bg-[rgba(86,124,141,0.08)] text-[var(--beige)] text-sm rounded">Profile saved.</div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="reveal-step">
                <label className="block text-sm font-medium small-muted mb-1">College</label>
                <input name="college" value={formData.college} onChange={handleChange} className="w-full input-soft text-sm" />
              </div>

              <div className="reveal-step">
                <label className="block text-sm font-medium small-muted mb-1">Year</label>
                <input name="collegeYear" placeholder="e.g. 3rd Year" value={formData.collegeYear} onChange={handleChange} className="w-full input-soft text-sm" />
              </div>

              <div className="reveal-step">
                <label className="block text-sm font-medium small-muted mb-1">GPA</label>
                <input name="gpa" type="number" step="0.01" min="0" max="10" value={formData.gpa} onChange={handleChange} className="w-full input-soft text-sm" />
              </div>

              <div className="reveal-step">
                <label className="block text-sm font-medium small-muted mb-1">Interests</label>
                <input name="interests" placeholder="e.g. Web Development, Machine Learning" value={formData.interests} onChange={handleChange} className="w-full input-soft text-sm" />
              </div>

              <div className="reveal-step">
                <label className="block text-sm font-medium small-muted mb-1">LinkedIn</label>
                <input name="linkedin" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={handleChange} className="w-full input-soft text-sm" />
              </div>

              <div className="reveal-step">
                <label className="block text-sm font-medium small-muted mb-1">GitHub</label>
                <input name="github" placeholder="https://github.com/..." value={formData.github} onChange={handleChange} className="w-full input-soft text-sm" />
              </div>

              <div className="md:col-span-2 reveal-step">
                <label className="block text-sm font-medium small-muted mb-1">LeetCode</label>
                <input name="leetcode" placeholder="https://leetcode.com/..." value={formData.leetcode} onChange={handleChange} className="w-full input-soft text-sm" />
              </div>

              <div className="reveal-step">
                <label className="block text-sm font-medium small-muted mb-1">10th Marks</label>
                <input name="tenthMarks" required placeholder="e.g. 85%" value={formData.tenthMarks} onChange={handleChange} className="w-full input-soft text-sm" />
              </div>

              <div className="reveal-step">
                <label className="block text-sm font-medium small-muted mb-1">12th Marks</label>
                <input name="twelfthMarks" required placeholder="e.g. 88%" value={formData.twelfthMarks} onChange={handleChange} className="w-full input-soft text-sm" />
              </div>

              <div className="md:col-span-2 flex justify-end mt-4 reveal-step">
                <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving..." : "Save Profile"}</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
