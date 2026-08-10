import axios from 'axios';

// Create a single Axios instance with fallback base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ----------------------------------------------------
// 1. User APIs
// ----------------------------------------------------
export const userAPI = {
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

// ----------------------------------------------------
// 2. Service APIs
// ----------------------------------------------------
export const serviceAPI = {
  create: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/services', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },
  update: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }
};

// ----------------------------------------------------
// 3. Booking APIs
// ----------------------------------------------------
export const bookingAPI = {
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  update: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};

export default api;

// Frontend API communication layer
