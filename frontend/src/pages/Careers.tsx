import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { getJobs } from "../services/jobService";
import type { Job } from "../services/jobService";

function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const [sortBy, setSortBy] = useState("title");
  const [direction, setDirection] = useState("asc");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs(
        search,
        department,
        location,
        employmentType,
        page,
        10,
        sortBy,
        direction
      );

      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch {
      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, [
    page,
    department,
    location,
    employmentType,
    sortBy,
    direction,
  ]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setPage(0);
    loadJobs();
  }

  function clearFilters() {
    setSearch("");
    setDepartment("");
    setLocation("");
    setEmploymentType("");
    setSortBy("title");
    setDirection("asc");
    setPage(0);
  }

  return (
    <section className="careers-page">
      <div className="careers-header">
        <p className="section-label">CAREERS</p>

        <h1>Build your career with Emmvee.</h1>

        <p>
          Explore opportunities and join us in building a more sustainable
          future.
        </p>
      </div>

      <form className="job-filters" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={department}
          onChange={(event) => {
            setDepartment(event.target.value);
            setPage(0);
          }}
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
        </select>

        <select
          value={location}
          onChange={(event) => {
            setLocation(event.target.value);
            setPage(0);
          }}
        >
          <option value="">All Locations</option>
          <option value="Bengaluru">Bengaluru</option>
        </select>

        <select
          value={employmentType}
          onChange={(event) => {
            setEmploymentType(event.target.value);
            setPage(0);
          }}
        >
          <option value="">All Employment Types</option>
          <option value="Full Time">Full Time</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(0);
          }}
        >
          <option value="title">Sort: Title</option>
          <option value="location">Sort: Location</option>
          <option value="department">Sort: Department</option>
          <option value="employmentType">
            Sort: Employment Type
          </option>
        </select>

        <select
          value={direction}
          onChange={(event) => {
            setDirection(event.target.value);
            setPage(0);
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button type="submit">Search</button>

        <button
          type="button"
          className="clear-button"
          onClick={clearFilters}
        >
          Clear
        </button>
      </form>

      {loading && (
        <div className="careers-message">
          Loading jobs...
        </div>
      )}

      {error && (
        <div className="careers-message">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="careers-message">
          No jobs found.
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="job-list">
            {jobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div>
                  <p className="job-department">
                    {job.department}
                  </p>

                  <h2>{job.title}</h2>

                  <p className="job-meta">
                    {job.location} | {job.employmentType}
                  </p>
                </div>

                <Link
                  to={`/careers/${job.id}`}
                  className="job-button"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span>
                Page {page + 1} of {totalPages}
              </span>

              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Careers;
