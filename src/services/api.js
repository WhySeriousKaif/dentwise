import axios from 'axios';

// Use relative URLs for API calls (Next.js handles them)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't automatically redirect on 401 - let components handle it
    return Promise.reject(error);
  }
);

export default api;
