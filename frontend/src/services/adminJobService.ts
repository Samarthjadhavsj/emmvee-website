import { getToken } from "./authService";
import type { Job } from "./jobService";

const API_BASE_URL = "http://localhost:8080/api";

export interface JobRequest {
  title: string;
  location: string;
  department: string;
  employmentType: string;
}

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createJob(
  data: JobRequest
): Promise<Job> {
  const response = await fetch(
    `${API_BASE_URL}/careers/jobs`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to create job."
    );
  }

  return response.json();
}

export async function updateJob(
  id: number,
  data: JobRequest
): Promise<Job> {
  const response = await fetch(
    `${API_BASE_URL}/careers/jobs/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to update job."
    );
  }

  return response.json();
}

export async function deleteJob(id: number): Promise<void> {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/careers/jobs/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to delete job."
    );
  }
}
