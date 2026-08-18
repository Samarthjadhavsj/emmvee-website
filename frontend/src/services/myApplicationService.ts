import { getToken } from "./authService";

export interface MyApplication {
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

export async function getMyApplications(): Promise<MyApplication[]> {
  const token = getToken();

  if (!token) {
    throw new Error("Please login to view your applications.");
  }

  const response = await fetch(
    "http://localhost:8080/api/applications/my",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to load applications."
    );
  }

  return response.json();
}
