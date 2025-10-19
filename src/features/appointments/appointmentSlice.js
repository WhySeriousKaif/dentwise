import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '../../services/appointmentService';

// Async thunks
export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentService.createAppointment(appointmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create appointment');
    }
  }
);

export const getUserAppointments = createAsyncThunk(
  'appointments/getUserAppointments',
  async (status, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getUserAppointments(status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get appointments');
    }
  }
);

export const getAppointmentStats = createAsyncThunk(
  'appointments/getAppointmentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get appointment stats');
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ appointmentId, updateData }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointment(appointmentId, updateData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update appointment');
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await appointmentService.deleteAppointment(appointmentId);
      return { appointmentId, ...response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete appointment');
    }
  }
);

const initialState = {
  appointments: [],
  stats: {
    totalAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
  },
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.stats = {
        totalAppointments: 0,
        confirmedAppointments: 0,
        completedAppointments: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload.appointment);
        state.error = null;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user appointments
      .addCase(getUserAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
        state.error = null;
      })
      .addCase(getUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get appointment stats
      .addCase(getAppointmentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getAppointmentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (appointment) => appointment._id === action.payload.appointment._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload.appointment;
        }
        state.error = null;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (appointment) => appointment._id !== action.payload.appointmentId
        );
        state.error = null;
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
