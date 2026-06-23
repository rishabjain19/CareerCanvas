import { useState } from "react";
import api from "../api/axios";

const ACCEPTED_TYPES = ".jpg,.jpeg,.png,.pdf";
const MAX_FILE_SIZE_MB = 10;

export default function AIResumeFeedback() {
  const [open, setOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFeedback(null);
    setFileError("");

    if (!file) {
      setResumeFile(null);
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setFileError(`File is too large — max ${MAX_FILE_SIZE_MB}MB`);
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleAnalyze = async () => {
    setLoading(true);
    setFileError("");
    try {
      const base64Data = await fileToBase64(resumeFile);
      const res = await api.post("/ai/resume-feedback", {
        fileData: base64Data,
        mimeType: resumeFile.type,
        jobDescription,
      });
      setFeedback(res.data);
    } catch (err) {
      setFileError(
        err.response?.data?.message || "AI analysis failed — please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-feedback-panel">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="ai-feedback-toggle"
      >
        <span>Check your selection chances</span>
        <span style={{ color: "var(--taupe)", fontSize: "1.1rem", lineHeight: 1 }}>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="ai-feedback-body">
          <div>
            <label className="ai-feedback-label">Upload your resume</label>
            <input
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={handleFileChange}
              className="ai-file-input"
            />
            <p className="ai-feedback-hint">
              Image or PDF — max {MAX_FILE_SIZE_MB}MB
            </p>
            {resumeFile && (
              <p className="ai-feedback-success mt-1">
                ✓ {resumeFile.name} selected
              </p>
            )}
            {fileError && (
              <p className="ai-feedback-error-text mt-1">{fileError}</p>
            )}
          </div>

          <textarea
            placeholder="Paste the job description to check your chances"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={3}
            className="w-full input-soft text-sm"
          />

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !resumeFile || !jobDescription}
            className="ai-analyze-btn"
          >
            {loading ? "Checking…" : "Check your chances"}
          </button>

          {feedback && (
            <div className="ai-results">
              {feedback.matchPercent !== undefined && (
                <p className="ai-results__match">
                  Match:{" "}
                  <span>{feedback.matchPercent}%</span>
                </p>
              )}
              {feedback.missingSkills?.length > 0 && (
                <div className="ai-results__section">
                  <p>Missing skills:</p>
                  <ul>
                    {feedback.missingSkills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
              {feedback.suggestions?.length > 0 && (
                <div className="ai-results__section">
                  <p>Suggestions:</p>
                  <ul>
                    {feedback.suggestions.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
