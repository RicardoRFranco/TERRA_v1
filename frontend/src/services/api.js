import axios from 'axios';

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Axios instance for API requests
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

/**
 * Auth token management
 */
const AUTH_TOKEN_KEY = 'terra_auth_token';
const REFRESH_TOKEN_KEY = 'terra_refresh_token';

/**
 * Set auth token for API requests
 * @param {string} token - JWT token
 */
const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        delete api.defaults.headers.common['Authorization'];
    }
};

/**
 * Set refresh token in local storage
 * @param {string} token - Refresh token
 */
const setRefreshToken = (token) => {
    if (token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};

/**
 * Get stored auth token
 * @returns {string|null} Stored auth token
 */
const getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get stored refresh token
 * @returns {string|null} Stored refresh token
 */
const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Initialize auth token from localStorage if available
const token = getAuthToken();
if (token) {
    setAuthToken(token);
}

/**
 * Request interceptor for handling auth tokens
 */
api.interceptors.request.use(
    config => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

/**
 * Response interceptor for handling token refresh
 */
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    // Try to get a new token
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refresh_token: refreshToken
                    });
                    
                    const { access_token } = response.data;
                    
                    // Update token
                    setAuthToken(access_token);
                    
                    // Retry original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Clear tokens on refresh failure
                setAuthToken(null);
                setRefreshToken(null);
                
                // Redirect to login (you'll need to implement a redirect mechanism)
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }
        
        return Promise.reject(error);
    }
);

// API service functions
const apiService = {
    // Auth endpoints
    auth: {
        /**
         * Register a new user
         * @param {Object} userData - User registration data
         * @returns {Promise} Registration response
         */
        register: (userData) => api.post('/auth/register', userData),
        
        /**
         * Login a user
         * @param {string} username - User's username
         * @param {string} password - User's password
         * @returns {Promise} Login response with tokens
         */
        login: async (username, password) => {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            
            const response = await api.post('/auth/token', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const { access_token, refresh_token } = response.data;
            
            setAuthToken(access_token);
            setRefreshToken(refresh_token);
            
            return response;
        },
        
        /**
         * Logout the current user
         */
        logout: () => {
            setAuthToken(null);
            setRefreshToken(null);
            window.dispatchEvent(new CustomEvent('auth:logout'));
        },
        
        /**
         * Check if user is authenticated
         * @returns {boolean} Authentication status
         */
        isAuthenticated: () => !!getAuthToken(),
    },
    
    // Route endpoints
    routes: {
        /**
         * Get all routes for the current user
         * @param {boolean} publicOnly - Whether to retrieve only public routes
         * @returns {Promise} Routes response
         */
        getRoutes: (publicOnly = false) => api.get(`/routes?public_only=${publicOnly}`),
        
        /**
         * Get a specific route by ID
         * @param {number} routeId - ID of the route to retrieve
         * @returns {Promise} Route response
         */
        getRoute: (routeId) => api.get(`/routes/${routeId}`),
        
        /**
         * Create a new route
         * @param {Object} routeData - Route creation data
         * @returns {Promise} Created route response
         */
        createRoute: (routeData) => api.post('/routes', routeData),
        
        /**
         * Update an existing route
         * @param {number} routeId - ID of the route to update
         * @param {Object} routeData - Updated route data
         * @returns {Promise} Updated route response
         */
        updateRoute: (routeId, routeData) => api.put(`/routes/${routeId}`, routeData),
        
        /**
         * Delete a route
         * @param {number} routeId - ID of the route to delete
         * @returns {Promise} Delete response
         */
        deleteRoute: (routeId) => api.delete(`/routes/${routeId}`),
        
        /**
         * Import a GPX file
         * @param {File} file - GPX file to import
         * @param {string} name - Name for the new route
         * @param {string} description - Description for the new route
         * @param {boolean} isPublic - Whether the route should be public
         * @returns {Promise} Imported route response
         */
        importGpx: (file, name, description = '', isPublic = false) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('is_public', isPublic);
            
            return api.post('/routes/import-gpx', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
    },
    
    // User endpoints
    users: {
        /**
         * Get current user profile
         * @returns {Promise} User profile response
         */
        getProfile: () => api.get('/users/me'),
        
        /**
         * Update user profile
         * @param {Object} userData - Updated user data
         * @returns {Promise} Updated profile response
         */
        updateProfile: (userData) => api.put('/users/me', userData),
        
        /**
         * Change user password
         * @param {string} currentPassword - Current password
         * @param {string} newPassword - New password
         * @returns {Promise} Password change response
         */
        changePassword: (currentPassword, newPassword) => api.post('/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
        }),
    },
};

export default apiService;