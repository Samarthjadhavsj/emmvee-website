export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

const API_BASE_URL = "http://localhost:8080/api";

export async function registerUser(
  data: RegisterRequest
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Registration failed"
    );
  }

  return response.json();
}

export async function loginUser(
  data: LoginRequest
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Login failed"
    );
  }

  return response.json();
}

export function saveAuthData(
  authData: AuthResponse
) {
  localStorage.setItem(
    "authToken",
    authData.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify({
      userId: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
    })
  );
}

export function getToken() {
  return localStorage.getItem("authToken");
}

export function getUser() {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return Boolean(getToken());
}
