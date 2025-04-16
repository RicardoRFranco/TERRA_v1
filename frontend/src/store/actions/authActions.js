// frontend/src/store/actions/authActions.js
import api from '../../services/api';
import { AUTH_TYPES, UI_TYPES } from './types';
import { setAuthToken } from '../../services/setAuthToken';

// Helper function to display toast notifications
const showToast = (dispatch, message, type = 'error') => {
    const id = Date.now();
    dispatch({
        type: UI_TYPES.ADD_TOAST,
        payload: { id, message, type }
    });

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
        dispatch({
            type: UI_TYPES.REMOVE_TOAST,
            payload: id
        });
    }, 5000);
};

// Check user authentication status
export const checkAuth = () => async (dispatch) => {
    // Set loading
    dispatch({ type: AUTH_TYPES.AUTH_LOADING });

    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (!token) {
        dispatch({ type: AUTH_TYPES.AUTH_ERROR });
        return;
    }

    // Set auth token in headers
    setAuthToken(token);

    try {
        // Get current user data
        const res = await api.get('/auth/user');
        
        dispatch({
            type: AUTH_TYPES.USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        // Clear token on auth error
        localStorage.removeItem('token');
        
        dispatch({
            type: AUTH_TYPES.AUTH_ERROR,
            payload: err.response?.data?.detail || 'Authentication failed'
        });
    }
};

// Login user
export const login = (credentials) => async (dispatch) => {
    dispatch({ type: AUTH_TYPES.AUTH_LOADING });

    try {
        // Prepare form data for token endpoint
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        // Get token
        const tokenRes = await api.post('/auth/token', formData);
        
        if (tokenRes.data.access_token) {
            // Set token in auth header
            setAuthToken(tokenRes.data.access_token);
            
            // Get user data with token
            const userRes = await api.get('/auth/user');
            
            dispatch({
                type: AUTH_TYPES.LOGIN_SUCCESS,
                payload: {
                    token: tokenRes.data.access_token,
                    user: userRes.data
                }
            });

            showToast(dispatch, 'Login successful', 'success');
        }
    } catch (err) {
        dispatch({
            type: AUTH_TYPES.LOGIN_FAIL,
            payload: err.response?.data?.detail || 'Invalid credentials'
        });

        showToast(dispatch, err.response?.data?.detail || 'Login failed');
    }
};

// Register user
export const register = (userData) => async (dispatch) => {
    dispatch({ type: AUTH_TYPES.AUTH_LOADING });

    try {
        // Register user
        await api.post('/auth/register', userData);
        
        // Login after successful registration
        dispatch(login({
            username: userData.username,
            password: userData.password
        }));

        showToast(dispatch, 'Registration successful', 'success');
    } catch (err) {
        dispatch({
            type: AUTH_TYPES.REGISTER_FAIL,
            payload: err.response?.data?.detail || 'Registration failed'
        });

        showToast(dispatch, err.response?.data?.detail || 'Registration failed');
    }
};

// Logout user
export const logout = () => (dispatch) => {
    dispatch({ type: AUTH_TYPES.LOGOUT });
    showToast(dispatch, 'You have been logged out', 'info');
};

// Clear auth errors
export const clearAuthError = () => ({
    type: AUTH_TYPES.CLEAR_AUTH_ERROR
});

// Update user profile
export const updateProfile = (userData) => async (dispatch) => {
    dispatch({ type: AUTH_TYPES.AUTH_LOADING });

    try {
        const res = await api.put(`/users/${userData.id}`, userData);
        
        dispatch({
            type: AUTH_TYPES.UPDATE_USER_SUCCESS,
            payload: res.data
        });

        showToast(dispatch, 'Profile updated successfully', 'success');
    } catch (err) {
        dispatch({
            type: AUTH_TYPES.AUTH_ERROR,
            payload: err.response?.data?.detail || 'Failed to update profile'
        });

        showToast(dispatch, err.response?.data?.detail || 'Failed to update profile');
    }
};