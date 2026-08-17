import { getToken } from "./authService";

export interface ApplicationRequest {
  jobId: number;
  resumeUrl: string;
  coverLetter: string;
}

export async function applyForJob(
  data: ApplicationRequest
) {
  const token = getToken();

  if (!token) {
    throw new Error("Please login to apply.");
  }

  const response = await fetch(
    "http://localhost:8080/api/applications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to submit application."
    );
  }

  return response.json();
}
