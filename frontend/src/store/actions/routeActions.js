// frontend/src/store/actions/routeActions.js
import api from '../../services/api';
import { ROUTE_TYPES, UI_TYPES } from './types';

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

// Fetch user's routes
export const fetchRoutes = () => async (dispatch) => {
    dispatch({ type: ROUTE_TYPES.SET_ROUTE_LOADING });

    try {
        const res = await api.get('/routes');
        
        dispatch({
            type: ROUTE_TYPES.GET_ROUTES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ROUTE_TYPES.ROUTE_ERROR,
            payload: err.response?.data?.detail || 'Failed to fetch routes'
        });
        showToast(dispatch, err.response?.data?.detail || 'Failed to fetch routes');
    }
};

// Fetch public routes for exploration
export const fetchPublicRoutes = () => async (dispatch) => {
    dispatch({ type: ROUTE_TYPES.SET_ROUTE_LOADING });

    try {
        const res = await api.get('/routes?public_only=true');
        
        dispatch({
            type: ROUTE_TYPES.GET_PUBLIC_ROUTES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ROUTE_TYPES.ROUTE_ERROR,
            payload: err.response?.data?.detail || 'Failed to fetch public routes'
        });
        showToast(dispatch, err.response?.data?.detail || 'Failed to fetch public routes');
    }
};

// Fetch a single route by ID
export const fetchRoute = (routeId) => async (dispatch) => {
    dispatch({ type: ROUTE_TYPES.SET_ROUTE_LOADING });

    try {
        const res = await api.get(`/routes/${routeId}`);
        
        dispatch({
            type: ROUTE_TYPES.GET_ROUTE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ROUTE_TYPES.ROUTE_ERROR,
            payload: err.response?.data?.detail || 'Failed to fetch route details'
        });
        showToast(dispatch, err.response?.data?.detail || 'Failed to fetch route details');
    }
};

// Create a new route
export const createRoute = (routeData, navigate) => async (dispatch) => {
    dispatch({ type: ROUTE_TYPES.SET_ROUTE_LOADING });

    try {
        const res = await api.post('/routes', routeData);
        
        dispatch({
            type: ROUTE_TYPES.ADD_ROUTE,
            payload: res.data
        });
        
        showToast(dispatch, 'Route created successfully', 'success');
        
        // Navigate to route details or routes list
        if (navigate) {
            navigate(`/routes/${res.data.id}`);
        }
    } catch (err) {
        dispatch({
            type: ROUTE_TYPES.ROUTE_ERROR,
            payload: err.response?.data?.detail || 'Failed to create route'
        });
        showToast(dispatch, err.response?.data?.detail || 'Failed to create route');
    }
};

// Import a GPX file to create a route
export const importGpxRoute = (formData, navigate) => async (dispatch) => {
    dispatch({ type: ROUTE_TYPES.SET_ROUTE_LOADING });

    try {
        const res = await api.post('/routes/import-gpx', formData);
        
        dispatch({
            type: ROUTE_TYPES.ADD_ROUTE,
            payload: res.data
        });
        
        showToast(dispatch, 'GPX route imported successfully', 'success');
        
        // Navigate to route details or routes list
        if (navigate) {
            navigate(`/routes/${res.data.id}`);
        }
    } catch (err) {
        dispatch({
            type: ROUTE_TYPES.ROUTE_ERROR,
            payload: err.response?.data?.detail || 'Failed to import GPX file'
        });
        showToast(dispatch, err.response?.data?.detail || 'Failed to import GPX file');
    }
};

// Update a route
export const updateRoute = (routeId, routeData) => async (dispatch) => {
    dispatch({ type: ROUTE_TYPES.SET_ROUTE_LOADING });

    try {
        const res = await api.put(`/routes/${routeId}`, routeData);
        
        dispatch({
            type: ROUTE_TYPES.UPDATE_ROUTE,
            payload: res.data
        });
        
        showToast(dispatch, 'Route updated successfully', 'success');
    } catch (err) {
        dispatch({
            type: ROUTE_TYPES.ROUTE_ERROR,
            payload: err.response?.data?.detail || 'Failed to update route'
        });
        showToast(dispatch, err.response?.data?.detail || 'Failed to update route');
    }
};

// Delete a route
export const deleteRoute = (routeId) => async (dispatch) => {
    try {
        await api.delete(`/routes/${routeId}`);
        
        dispatch({
            type: ROUTE_TYPES.DELETE_ROUTE,
            payload: routeId
        });
        
        showToast(dispatch, 'Route deleted successfully', 'success');
    } catch (err) {
        dispatch({
            type: ROUTE_TYPES.ROUTE_ERROR,
            payload: err.response?.data?.detail || 'Failed to delete route'
        });
        showToast(dispatch, err.response?.data?.detail || 'Failed to delete route');
    }
};

// Toggle route's public/private status
export const toggleRoutePublic = (routeId, isPublic) => async (dispatch) => {
    try {
        const res = await api.put(`/routes/${routeId}`, { is_public: isPublic });
        
        dispatch({
            type: ROUTE_TYPES.UPDATE_ROUTE,
            payload: res.data
        });
        
        const message = isPublic ? 'Route is now public' : 'Route is now private';
        showToast(dispatch, message, 'success');
    } catch (err) {
        dispatch({
            type: ROUTE_TYPES.ROUTE_ERROR,
            payload: err.response?.data?.detail || 'Failed to update route visibility'
        });
        showToast(dispatch, err.response?.data?.detail || 'Failed to update route visibility');
    }
};

// Clear current route from state
export const clearCurrentRoute = () => ({
    type: ROUTE_TYPES.CLEAR_ROUTE
});