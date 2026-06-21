import { api } from '../../../services/api';
import type { SafeUser } from '../../../types';

/** Auth API — login, register, logout, session restore. */
export const authApi = {
  register: (name: string, email: string, password: string) =>
    api.post<SafeUser>('/auth/register', { name, email, password }),

  login: (email: string, password: string) =>
    api.post<SafeUser>('/auth/login', { email, password }),

  logout: () => api.post<void>('/auth/logout'),

  me: () => api.get<SafeUser>('/auth/me'),
};
