import type { SafeUser } from '../types';

const API_BASE = '/api';

/**
 * Default fetch options for API calls that require cookies.
 */
const DEFAULT_OPTIONS: RequestInit = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};

/**
 * Parses the JSON response from the API.
 * Throws an error with the server's error message if the response is not OK.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Register a new user.
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<SafeUser> => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    ...DEFAULT_OPTIONS,
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse<SafeUser>(response);
};

/**
 * Login with email and password.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<SafeUser> => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    ...DEFAULT_OPTIONS,
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  return handleResponse<SafeUser>(response);
};

/**
 * Logout — clears the auth cookie on the server.
 */
export const logoutUser = async (): Promise<void> => {
  await fetch(`${API_BASE}/auth/logout`, {
    ...DEFAULT_OPTIONS,
    method: 'POST',
  });
};

/**
 * Fetch the currently authenticated user via the session cookie.
 * Used on app startup to restore the session.
 */
export const getCurrentUser = async (): Promise<SafeUser | null> => {
  const response = await fetch(`${API_BASE}/auth/me`, {
    ...DEFAULT_OPTIONS,
    method: 'GET',
  });

  if (response.status === 401) {
    return null;
  }

  return handleResponse<SafeUser>(response);
};

/**
 * Get a user by their ID (protected endpoint).
 */
export const getUserById = async (id: string): Promise<SafeUser | null> => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    ...DEFAULT_OPTIONS,
    method: 'GET',
  });

  if (response.status === 404) {
    return null;
  }

  return handleResponse<SafeUser>(response);
};
