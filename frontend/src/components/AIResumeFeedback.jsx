import { useState } from "react";
import api from "../api/axios";

const ACCEPTED_TYPES = ".jpg,.jpeg,.png,.pdf";
const MAX_FILE_SIZE_MB = 10;

// Lives inside JobModal as an optional collapsible section, rather than a separate page.
// Resume is uploaded as a file (image or PDF) and sent to Gemini directly — Gemini reads
// both formats natively, so no OCR/text-extraction step is needed on our end.
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

  // Converts the uploaded file to base64 — this is the format the backend forwards
  // to the Gemini API as inline file data.
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // strip the data: prefix
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
    <div className="border border-gray-200 rounded-md">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>🤖 Check your chances (optional)</span>
        <span className="text-gray-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="p-3 border-t border-gray-200 space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Upload your resume
            </label>
            <input
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <p className="text-xs text-gray-400 mt-1">
              Image or PDF file — max {MAX_FILE_SIZE_MB}MB
            </p>
            {resumeFile && (
              <p className="text-xs text-green-600 mt-1">
                ✓ {resumeFile.name} selected
              </p>
            )}
            {fileError && (
              <p className="text-xs text-red-600 mt-1">{fileError}</p>
            )}
          </div>

          <textarea
            placeholder="Paste the job description to check your chances"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !resumeFile || !jobDescription}
            className="w-full bg-gray-800 text-white text-sm py-2 rounded-md hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check your chances"}
          </button>

          {feedback && (
            <div className="text-sm bg-gray-50 p-3 rounded space-y-2">
              {feedback.matchPercent !== undefined && (
                <p className="font-semibold text-gray-800">
                  Match:{" "}
                  <span className="text-blue-600">
                    {feedback.matchPercent}%
                  </span>
                </p>
              )}
              {feedback.missingSkills?.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Missing skills:</p>
                  <ul className="list-disc list-inside text-gray-600">
                    {feedback.missingSkills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
              {feedback.suggestions?.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Suggestions:</p>
                  <ul className="list-disc list-inside text-gray-600">
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
