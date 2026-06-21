/** API endpoint path constants — single source of truth. */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    BY_ID: (id: string) => `/users/${id}`,
  },
} as const;
