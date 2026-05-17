import { auth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * apiFetch is a wrapper around the native fetch API that automatically
 * includes the Firebase ID token in the Authorization header.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error("User must be authenticated to make this request.");
  }

  // Get the latest ID token
  const token = await user.getIdToken();

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "An error occurred while fetching data.");
  }

  return response.json();
}
