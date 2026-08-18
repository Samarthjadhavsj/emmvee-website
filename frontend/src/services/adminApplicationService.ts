import { getToken } from "./authService";

export interface AdminApplication {
  id: number;
  userId: number;
  userName: string;
  jobId: number;
  jobTitle: string;
  resumeUrl: string;
  coverLetter: string;
  status: string;
  appliedAt: string;
}

export async function getAllApplications(): Promise<AdminApplication[]> {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    "http://localhost:8080/api/admin/applications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load applications.");
  }

  return response.json();
}

export async function updateApplicationStatus(
  id: number,
  status: string
): Promise<AdminApplication> {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `http://localhost:8080/api/admin/applications/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update application status.");
  }

  return response.json();
}
