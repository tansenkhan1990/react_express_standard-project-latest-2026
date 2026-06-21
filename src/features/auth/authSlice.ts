import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, SafeUser, LoginCredentials, RegisterData } from '../../types';
import * as userService from '../../services/userService';

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
};

/**
 * Restore session on app init by calling GET /api/auth/me.
 * The HTTP-only cookie is sent automatically by the browser.
 */
export const fetchCurrentUser = createAsyncThunk<SafeUser | null, void>(
  'auth/fetchCurrentUser',
  async () => {
    const user = await userService.getCurrentUser();
    return user;
  }
);

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
    await userService.logoutUser();
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
    // Fetch current user (session restore)
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<SafeUser | null>) => {
        state.loading = false;
        state.isInitialized = true;
        state.currentUser = action.payload;
        state.isAuthenticated = action.payload !== null;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.currentUser = null;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<SafeUser>) => {
        state.loading = false;
        state.isInitialized = true;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
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
        state.isInitialized = true;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = action.payload || 'Login failed';
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
