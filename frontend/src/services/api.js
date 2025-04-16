import axios from 'axios';

// Create axios instance with base URL and default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error statuses
    if (error.response) {
      // Authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        // If using history outside of components:
        // window.location.href = '/login';
      }
      
      // Format error response
      const errorMessage = error.response.data.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    }
    
    if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    }
    
    // Other errors
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  getCurrentUser: () => api.get('/auth/me')
};

// Routes services
export const routesService = {
  getRoutes: (userOnly = false) => api.get('/routes', { params: { userOnly } }),
  getRouteById: (id) => api.get(`/routes/${id}`),
  createRoute: (routeData) => api.post('/routes', routeData),
  updateRoute: (id, routeData) => api.put(`/routes/${id}`, routeData),
  deleteRoute: (id) => api.delete(`/routes/${id}`),
  importGPX: (routeData) => api.post('/routes/import', routeData)
};

// User services
export const userService = {
  updateProfile: (userData, currentPassword) => 
    api.put('/users/profile', { userData, currentPassword }),
  getUserStats: () => api.get('/users/stats'),
  getPublicProfile: (userId) => api.get(`/users/${userId}`)
};

// Search services
export const searchService = {
  searchRoutes: (query) => api.get('/search/routes', { params: { q: query } }),
  searchUsers: (query) => api.get('/search/users', { params: { q: query } })
};

export default {
  auth: authService,
  routes: routesService,
  user: userService,
  search: searchService
};