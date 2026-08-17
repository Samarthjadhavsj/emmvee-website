import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { applyForJob } from "../services/applicationService";

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!id) {
      setError("Invalid job ID.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await applyForJob({
        jobId: Number(id),
        resumeUrl,
        coverLetter,
      });

      setSuccess("Application submitted successfully.");

      setTimeout(() => {
        navigate("/careers");
      }, 1200);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit application."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <p className="section-label">APPLICATION</p>

          <h1>Apply for this role.</h1>

          <p>
            Submit your resume link and cover letter to apply
            for this position.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Resume URL
            <input
              type="url"
              value={resumeUrl}
              onChange={(event) =>
                setResumeUrl(event.target.value)
              }
              placeholder="https://drive.google.com/..."
              required
            />
          </label>

          <label>
            Cover Letter
            <textarea
              value={coverLetter}
              onChange={(event) =>
                setCoverLetter(event.target.value)
              }
              placeholder="Write your cover letter..."
              rows={8}
              required
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {success && (
            <p className="auth-success">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to={`/careers/${id}`}>
            Back to Job Details
          </Link>
        </p>
      </div>
    </section>
  );
}

export default ApplicationForm;
