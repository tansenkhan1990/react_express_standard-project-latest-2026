import apiClient from './axios';

/**
 * Low-level typed API wrapper that unwraps `axios` responses.
 * Each method is typed so callers get the correct response shape.
 *
 * Feature-level API helpers (authApi, usersApi, etc.) live in
 * their respective features/api/ folders.
 */
export const api = {
  get<T>(url: string) {
    return apiClient.get<T>(url).then((res) => res.data);
  },
  post<T>(url: string, body?: unknown) {
    return apiClient.post<T>(url, body).then((res) => res.data);
  },
  put<T>(url: string, body?: unknown) {
    return apiClient.put<T>(url, body).then((res) => res.data);
  },
  patch<T>(url: string, body?: unknown) {
    return apiClient.patch<T>(url, body).then((res) => res.data);
  },
  delete<T>(url: string) {
    return apiClient.delete<T>(url).then((res) => res.data);
  },
};
