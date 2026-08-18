import { useEffect, useMemo, useState } from "react";

import {
  getAllApplications,
  updateApplicationStatus,
  type AdminApplication,
} from "../services/adminApplicationService";

const STATUSES = [
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
];

function AdminDashboard() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getAllApplications();
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

  async function handleStatusChange(
    applicationId: number,
    status: string
  ) {
    setUpdatingId(applicationId);
    setError("");

    try {
      const updated = await updateApplicationStatus(
        applicationId,
        status
      );

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? updated
            : application
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const stats = useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter(
        (application) => application.status === "APPLIED"
      ).length,
      reviewing: applications.filter(
        (application) => application.status === "REVIEWING"
      ).length,
      shortlisted: applications.filter(
        (application) => application.status === "SHORTLISTED"
      ).length,
      rejected: applications.filter(
        (application) => application.status === "REJECTED"
      ).length,
      hired: applications.filter(
        (application) => application.status === "HIRED"
      ).length,
    };
  }, [applications]);

  if (loading) {
    return (
      <section className="admin-page">
        <div className="admin-container">
          <p>Loading applications...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <p className="section-label">ADMIN</p>

          <h1>Application Dashboard</h1>

          <p>
            Review candidates and manage application statuses.
          </p>
        </div>

        {error && (
          <p className="auth-error admin-error">
            {error}
          </p>
        )}

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Applied</span>
            <strong>{stats.applied}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Reviewing</span>
            <strong>{stats.reviewing}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Shortlisted</span>
            <strong>{stats.shortlisted}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Rejected</span>
            <strong>{stats.rejected}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Hired</span>
            <strong>{stats.hired}</strong>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="admin-empty">
            <p>No applications found.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job</th>
                  <th>Resume</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.userName}</td>

                    <td>{application.jobTitle}</td>

                    <td>
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Resume
                      </a>
                    </td>

                    <td>
                      {new Date(
                        application.appliedAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <select
                        value={application.status}
                        disabled={
                          updatingId === application.id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            application.id,
                            event.target.value
                          )
                        }
                      >
                        {STATUSES.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {applications.length > 0 && (
          <div className="admin-cover-letters">
            <h2>Cover Letters</h2>

            {applications.map((application) => (
              <article
                key={application.id}
                className="admin-application-note"
              >
                <div>
                  <strong>{application.userName}</strong>
                  <span>{application.jobTitle}</span>
                </div>

                <p>{application.coverLetter}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;
