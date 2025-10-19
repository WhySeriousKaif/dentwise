import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Async thunks
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.signUp(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.signIn(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.signOut();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign out failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      // If it's the special "NO_USER" error, don't treat it as an error
      if (error.message === 'NO_USER') {
        return rejectWithValue('NO_USER');
      }
      return rejectWithValue(error.message || 'Failed to get user');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false, // Start with loading false
  error: null,
  initialized: false, // Track if we've checked auth status
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setInitialized: (state) => {
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.initialized = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        // Only set error if it's not the "NO_USER" case (which is normal when not logged in)
        state.error = action.payload === 'NO_USER' ? null : action.payload;
        state.initialized = true;
      });
  },
});

export const { clearError, clearUser, setInitialized } = authSlice.actions;
export default authSlice.reducer;
