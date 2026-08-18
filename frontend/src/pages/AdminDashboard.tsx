import { useEffect, useMemo, useState } from "react";

import {
  getAllApplications,
  updateApplicationStatus,
  type AdminApplication,
} from "../services/adminApplicationService";

import {
  createJob,
  updateJob,
  deleteJob,
  type JobRequest,
} from "../services/adminJobService";

import { getJobs, type Job } from "../services/jobService";

const STATUSES = [
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
];

const EMPTY_JOB: JobRequest = {
  title: "",
  location: "",
  department: "",
  employmentType: "Full Time",
};

function AdminDashboard() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobError, setJobError] = useState("");

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [jobForm, setJobForm] = useState<JobRequest>(EMPTY_JOB);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [jobSubmitting, setJobSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [applicationData, jobData] = await Promise.all([
          getAllApplications(),
          getJobs(),
        ]);

        setApplications(applicationData);
        setJobs(jobData.content);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load admin data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
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

  function handleJobInputChange(
    field: keyof JobRequest,
    value: string
  ) {
    setJobForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEditingJob(job: Job) {
    setEditingJobId(job.id);

    setJobForm({
      title: job.title,
      location: job.location,
      department: job.department,
      employmentType: job.employmentType,
    });

    setJobError("");
  }

  function cancelEditingJob() {
    setEditingJobId(null);
    setJobForm(EMPTY_JOB);
    setJobError("");
  }

  async function handleJobSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setJobSubmitting(true);
    setJobError("");

    try {
      if (editingJobId !== null) {
        const updated = await updateJob(
          editingJobId,
          jobForm
        );

        setJobs((current) =>
          current.map((job) =>
            job.id === editingJobId
              ? updated
              : job
          )
        );
      } else {
        const created = await createJob(jobForm);

        setJobs((current) => [
          created,
          ...current,
        ]);
      }

      cancelEditingJob();
    } catch (error) {
      setJobError(
        error instanceof Error
          ? error.message
          : "Unable to save job."
      );
    } finally {
      setJobSubmitting(false);
    }
  }

  async function handleDeleteJob(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteJob(id);

      setJobs((current) =>
        current.filter((job) => job.id !== id)
      );

      if (editingJobId === id) {
        cancelEditingJob();
      }
    } catch (error) {
      setJobError(
        error instanceof Error
          ? error.message
          : "Unable to delete job."
      );
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
          <p>Loading admin dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <p className="section-label">ADMIN</p>

          <h1>Admin Dashboard</h1>

          <p>
            Manage applications and job openings.
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

        <div className="admin-section">
          <h2>Applications</h2>

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
        </div>

        <div className="admin-section">
          <h2>
            {editingJobId !== null
              ? "Edit Job"
              : "Create Job"}
          </h2>

          {jobError && (
            <p className="auth-error admin-error">
              {jobError}
            </p>
          )}

          <form
            className="admin-job-form"
            onSubmit={handleJobSubmit}
          >
            <input
              value={jobForm.title}
              onChange={(event) =>
                handleJobInputChange(
                  "title",
                  event.target.value
                )
              }
              placeholder="Job title"
              required
            />

            <input
              value={jobForm.location}
              onChange={(event) =>
                handleJobInputChange(
                  "location",
                  event.target.value
                )
              }
              placeholder="Location"
              required
            />

            <input
              value={jobForm.department}
              onChange={(event) =>
                handleJobInputChange(
                  "department",
                  event.target.value
                )
              }
              placeholder="Department"
              required
            />

            <select
              value={jobForm.employmentType}
              onChange={(event) =>
                handleJobInputChange(
                  "employmentType",
                  event.target.value
                )
              }
            >
              <option value="Full Time">
                Full Time
              </option>
              <option value="Part Time">
                Part Time
              </option>
              <option value="Contract">
                Contract
              </option>
              <option value="Internship">
                Internship
              </option>
            </select>

            <div className="admin-job-actions">
              <button
                type="submit"
                className="auth-button"
                disabled={jobSubmitting}
              >
                {jobSubmitting
                  ? "Saving..."
                  : editingJobId !== null
                    ? "Update Job"
                    : "Create Job"}
              </button>

              {editingJobId !== null && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={cancelEditingJob}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-section">
          <h2>Jobs</h2>

          {jobs.length === 0 ? (
            <div className="admin-empty">
              <p>No jobs found.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Department</th>
                    <th>Employment</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.location}</td>
                      <td>{job.department}</td>
                      <td>{job.employmentType}</td>
                      <td>
                        <div className="admin-job-actions">
                          <button
                            type="button"
                            className="job-button"
                            onClick={() =>
                              startEditingJob(job)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="clear-button"
                            onClick={() =>
                              handleDeleteJob(job.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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

      </div>
    </section>
  );
}

export default AdminDashboard;
