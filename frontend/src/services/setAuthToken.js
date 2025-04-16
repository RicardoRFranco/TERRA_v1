// frontend/src/services/setAuthToken.js
import api from './api';

/**
 * Sets or removes the authentication token in Axios default headers
 * @param {string|null} token - JWT token or null to remove token
 */
export const setAuthToken = (token) => {
    if (token) {
        // Apply to every request
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Also store in localStorage
        localStorage.setItem('token', token);
    } else {
        // Remove from headers
        delete api.defaults.headers.common['Authorization'];
        // Also remove from localStorage
        localStorage.removeItem('token');
    }
};

/**
 * Initialize auth token from localStorage on app start
 */
export const initializeAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }
};