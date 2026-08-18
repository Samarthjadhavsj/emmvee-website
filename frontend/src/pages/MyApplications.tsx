import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyApplications,
  type MyApplication,
} from "../services/myApplicationService";

function MyApplications() {
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  if (loading) {
    return (
      <section className="applications-page">
        <div className="applications-container">
          <p>Loading applications...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="applications-page">
        <div className="applications-container">
          <p className="auth-error">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="applications-page">
      <div className="applications-container">
        <div className="applications-header">
          <p className="section-label">MY CAREER</p>

          <h1>My Applications</h1>

          <p>
            Track the jobs you have applied for and their
            current status.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="applications-empty">
            <p>You haven't applied for any jobs yet.</p>

            <Link to="/careers" className="apply-button">
              Explore Careers
            </Link>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <article
                className="application-card"
                key={application.id}
              >
                <div>
                  <p className="job-department">
                    {application.status}
                  </p>

                  <h2>{application.jobTitle}</h2>

                  <p className="application-date">
                    Applied on{" "}
                    {new Date(
                      application.appliedAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  to={`/careers/${application.jobId}`}
                  className="job-button"
                >
                  View Job
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyApplications;
