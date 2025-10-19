import api from './api';

export const authService = {
  // Sign up
  signUp: async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Sign up failed' };
    }
  },

  // Sign in
  signIn: async (credentials) => {
    try {
      const response = await api.post('/api/auth/signin', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Sign in failed' };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Sign out failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/user');
      return response.data;
    } catch (error) {
      // If it's a 401 (unauthorized), this is normal when not logged in
      if (error.response?.status === 401) {
        throw new Error('NO_USER'); // Special error code for no user
      }
      throw error.response?.data || { message: 'Failed to get user' };
    }
  },
};
