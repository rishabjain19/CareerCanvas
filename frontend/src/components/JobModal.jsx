import { useState, useEffect } from "react";
import { useJobs } from "../context/JobContext";
import { generateGoogleCalendarLink } from "../utils/googleCalendar";
import AIResumeFeedback from "./AIResumeFeedback";

const STATUS_OPTIONS = ["ToApply", "Applied", "Interview", "Offer", "Rejected"];

const EMPTY_JOB = {
  companyName: "",
  role: "",
  salary: "",
  location: "",
  applicationLink: "",
  applicationDate: "",
  status: "ToApply",
  notes: "",
  interviewDate: "",
};

export default function JobModal({ job, onClose }) {
  const { addJob, updateJob, deleteJob } = useJobs();
  const [formData, setFormData] = useState(EMPTY_JOB);
  const [saving, setSaving] = useState(false);

  const isEditing = !!job;

  useEffect(() => {
    if (job) {
      setFormData({
        ...EMPTY_JOB,
        ...job,
        applicationDate: job.applicationDate
          ? job.applicationDate.slice(0, 10)
          : "",
        interviewDate: job.interviewDate ? job.interviewDate.slice(0, 16) : "",
      });
    } else {
      setFormData(EMPTY_JOB);
    }
  }, [job]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await updateJob(job._id, formData);
      } else {
        await addJob(formData);
      }
      onClose();
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this job application?")) return;
    await deleteJob(job._id);
    onClose();
  };

  const calendarLink = generateGoogleCalendarLink(formData);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <h2 className="modal-title">
          {isEditing ? "Edit Application" : "New Application"}
        </h2>
        <hr className="modal-divider" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <input
              name="companyName"
              placeholder="Company name"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full input-soft text-sm"
            />
            <input
              name="role"
              placeholder="Role / Position"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full input-soft text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="salary"
              placeholder="Salary / Stipend"
              value={formData.salary}
              onChange={handleChange}
              className="w-full input-soft text-sm"
            />
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full input-soft text-sm"
            />
          </div>

          <input
            name="applicationLink"
            placeholder="Application link"
            value={formData.applicationLink}
            onChange={handleChange}
            className="w-full input-soft text-sm"
          />

          <div>
            <label className="modal-field-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full input-soft text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {formData.status === "Interview" && (
            <div>
              <label className="modal-field-label">Interview date &amp; time</label>
              <input
                type="datetime-local"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
                className="w-full input-soft text-sm"
              />
            </div>
          )}

          <textarea
            name="notes"
            placeholder="Notes…"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full input-soft text-sm h-28"
          />

          {calendarLink && (
            <a
              href={calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="calendar-btn"
            >
              📅 Add to Google Calendar
            </a>
          )}

          <AIResumeFeedback />

          <div className="flex items-center justify-between pt-2">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="modal-delete-btn"
              >
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
