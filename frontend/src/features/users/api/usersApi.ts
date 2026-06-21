import { api } from '../../../services/api';
import type { SafeUser } from '../../../types';

export const usersApi = {
  getById: (id: string) => api.get<SafeUser>(`/users/${id}`),
};
