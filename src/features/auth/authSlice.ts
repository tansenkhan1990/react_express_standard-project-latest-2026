import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, SafeUser, LoginCredentials, RegisterData } from '../../types';
import * as userService from '../../services/userService';

const AUTH_STORAGE_KEY = 'app_current_user';

const loadAuthState = (): SafeUser | null => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveAuthState = (user: SafeUser | null): void => {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

const initialState: AuthState = {
  currentUser: loadAuthState(),
  isAuthenticated: loadAuthState() !== null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk<
  SafeUser,
  RegisterData,
  { rejectValue: string }
>('auth/registerUser', async (data, { rejectWithValue }) => {
  try {
    const user = await userService.registerUser(
      data.name,
      data.email,
      data.password
    );
    return user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Registration failed'
    );
  }
});

export const loginUser = createAsyncThunk<
  SafeUser,
  LoginCredentials,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const user = await userService.loginUser(
      credentials.email,
      credentials.password
    );
    return user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Login failed'
    );
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  'auth/logoutUser',
  async () => {
    // In a real app, you might call a logout API endpoint here
    return;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<SafeUser>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        saveAuthState(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<SafeUser>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        saveAuthState(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        saveAuthState(null);
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
