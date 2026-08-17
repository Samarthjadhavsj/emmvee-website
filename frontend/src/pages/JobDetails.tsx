import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getJobById } from "../services/jobService";
import type { Job } from "../services/jobService";
import { isAuthenticated } from "../services/authService";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      if (!id) {
        setError("Invalid job ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getJobById(Number(id));
        setJob(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load job."
        );
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  if (loading) {
    return (
      <section className="job-details-page">
        <div className="job-details-container">
          <p>Loading job...</p>
        </div>
      </section>
    );
  }

  if (error || !job) {
    return (
      <section className="job-details-page">
        <div className="job-details-container">
          <p>{error || "Job not found."}</p>

          <Link to="/careers" className="job-back-button">
            Back to Careers
          </Link>
        </div>
      </section>
    );
  }

  const loggedIn = isAuthenticated();

  return (
    <section className="job-details-page">
      <div className="job-details-container">

        <Link to="/careers" className="back-link">
          ? Back to Careers
        </Link>

        <p className="section-label">
          {job.department}
        </p>

        <h1>{job.title}</h1>

        <div className="job-details-meta">
          <div>
            <span>Location</span>
            <strong>{job.location}</strong>
          </div>

          <div>
            <span>Employment Type</span>
            <strong>{job.employmentType}</strong>
          </div>

          <div>
            <span>Department</span>
            <strong>{job.department}</strong>
          </div>
        </div>

        <div className="job-details-content">
          <h2>About the role</h2>

          <p>
            Join the Emmvee team and contribute to innovative
            solutions while building your career in a
            collaborative environment.
          </p>

          <p>
            This position is based in {job.location} and is part
            of the {job.department} department.
          </p>
        </div>

        {loggedIn ? (
          <Link
            to={`/careers/${job.id}/apply`}
            className="apply-button"
          >
            Apply Now
          </Link>
        ) : (
          <Link
            to="/login"
            className="apply-button"
          >
            Login to Apply
          </Link>
        )}

      </div>
    </section>
  );
}

export default JobDetails;
