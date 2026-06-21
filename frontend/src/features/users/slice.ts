import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { SafeUser } from '../../types';
import { usersApi } from './api/usersApi';

interface UsersState {
  profile: SafeUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<
  SafeUser | null,
  string,
  { rejectValue: string }
>('users/fetchProfile', async (id, { rejectWithValue }) => {
  try {
    return await usersApi.getById(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to load profile'
    );
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load profile';
      });
  },
});

export const { clearProfile } = usersSlice.actions;
export default usersSlice.reducer;
