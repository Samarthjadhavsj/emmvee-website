export interface Job {
  id: number;
  title: string;
  location: string;
  department: string;
  employmentType: string;
}

export interface JobPage {
  content: Job[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

const API_BASE_URL = "http://localhost:8080/api";

export async function getJobs(
  search = "",
  department = "",
  location = "",
  employmentType = "",
  page = 0,
  size = 10,
  sortBy = "title",
  direction = "asc"
): Promise<JobPage> {

  const params = new URLSearchParams();

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (department) {
    params.append("department", department);
  }

  if (location) {
    params.append("location", location);
  }

  if (employmentType) {
    params.append("employmentType", employmentType);
  }

  params.append("page", String(page));
  params.append("size", String(size));
  params.append("sortBy", sortBy);
  params.append("direction", direction);

  const response = await fetch(
    `${API_BASE_URL}/careers/jobs?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
}

export async function getJobById(id: number): Promise<Job> {
  const response = await fetch(
    `${API_BASE_URL}/careers/jobs/${id}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Job not found");
    }

    throw new Error("Failed to fetch job");
  }

  return response.json();
}
