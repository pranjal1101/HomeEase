import axios from 'axios';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://homeease-backend-x7k6.onrender.com/api' : 'http://localhost:5000/api');
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('homeease_token');
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

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

export const aiAPI = {
  getRecommendation: async (data) => {
    const response = await api.post('/ai/recommend', data);
    return response.data;
  }
};

export const providerAPI = {
  getDashboard: async () => {
    const response = await api.get('/provider/dashboard');
    return response.data;
  },
  getServices: async () => {
    const response = await api.get('/provider/services');
    return response.data;
  },
  createService: async (serviceData) => {
    const response = await api.post('/provider/services', serviceData);
    return response.data;
  },
  updateService: async (id, serviceData) => {
    const response = await api.put(`/provider/services/${id}`, serviceData);
    return response.data;
  },
  deleteService: async (id) => {
    const response = await api.delete(`/provider/services/${id}`);
    return response.data;
  },
  getBookings: async (params = {}) => {
    const response = await api.get('/provider/bookings', { params });
    return response.data;
  },
  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/provider/bookings/${id}/status`, { status });
    return response.data;
  },
  getEarnings: async () => {
    const response = await api.get('/provider/earnings');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/provider/profile', profileData);
    return response.data;
  }
};

export default api;
