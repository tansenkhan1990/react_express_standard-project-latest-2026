export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export type SafeUser = Omit<User, 'password'>;

export interface AuthState {
  currentUser: SafeUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
