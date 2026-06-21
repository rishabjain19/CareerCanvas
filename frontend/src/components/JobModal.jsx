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

  // pre-fill the form when editing an existing job
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
      // error already captured in JobContext state; modal just stays open so user can retry
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this job application?")) return;
    await deleteJob(job._id);
    onClose();
  };

  // uses live formData, not the stale `job` prop — so the link appears as soon as the user
  // sets status to Interview + picks a date, without needing to save and reopen first
  const calendarLink = generateGoogleCalendarLink(formData);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-surface text-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold text-[var(--beige)] mb-2">
          {isEditing ? "Edit Application" : "New Application"}
        </h2>
        <div className="h-0.5 w-full mb-4 rounded bg-gradient-to-r from-[var(--teal)] via-[var(--navy)] to-[var(--beige)]/30"></div>

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
              placeholder="Role"
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
            <label className="block text-xs small-muted mb-1">Status</label>
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
              <label className="block text-xs small-muted mb-1">
                Interview date & time
              </label>
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
            placeholder="Notes"
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
                className="text-sm text-[var(--rejected)] hover:underline"
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
                className="px-4 py-2 text-sm small-muted hover:bg-[rgba(255,255,255,0.02)] rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm btn-primary disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
