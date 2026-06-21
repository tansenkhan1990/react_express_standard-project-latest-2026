import type { SafeUser } from '../../../types';

/** Shape returned by the auth slice on mount. */
export interface AuthSliceState {
  currentUser: SafeUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
}
