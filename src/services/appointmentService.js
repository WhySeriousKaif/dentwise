import api from './api';

export const appointmentService = {
  // Create appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/api/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create appointment' };
    }
  },

  // Get user appointments
  getUserAppointments: async (status) => {
    try {
      const params = status ? { status } : {};
      const response = await api.get('/api/appointments', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get appointments' };
    }
  },

  // Get appointment stats
  getAppointmentStats: async () => {
    try {
      const response = await api.get('/api/appointments/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get appointment stats' };
    }
  },

  // Update appointment
  updateAppointment: async (appointmentId, updateData) => {
    try {
      const response = await api.put(`/api/appointments/${appointmentId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update appointment' };
    }
  },

  // Cancel appointment (update status to cancelled)
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await api.put(`/api/appointments/${appointmentId}`, {
        status: 'cancelled'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel appointment' };
    }
  },

  // Delete appointment
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await api.delete(`/api/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete appointment' };
    }
  },
};
