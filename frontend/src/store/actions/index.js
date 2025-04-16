import api from '../../services/api';

// Auth actions
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: 'AUTH_START' });
  
  try {
    const response = await api.auth.login(credentials);
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { token, user }
    });
    
    return user;
  } catch (error) {
    dispatch({
      type: 'AUTH_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch({ type: 'AUTH_START' });
  
  try {
    const response = await api.auth.register(userData);
    
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'AUTH_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  try {
    await api.auth.logout();
    
    dispatch({ type: 'LOGOUT' });
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const loadUser = () => async (dispatch) => {
  // Skip if no token
  if (!localStorage.getItem('token')) {
    return null;
  }
  
  dispatch({ type: 'AUTH_START' });
  
  try {
    const response = await api.auth.getCurrentUser();
    
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: {
        token: localStorage.getItem('token'),
        user: response.data
      }
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'AUTH_FAIL',
      payload: error.message
    });
    
    // Clear token on auth failure
    localStorage.removeItem('token');
    
    return null;
  }
};

// Route actions
export const getRoutes = (userOnly = false) => async (dispatch) => {
  dispatch({ type: 'FETCH_ROUTES_START' });
  
  try {
    const response = await api.routes.getRoutes(userOnly);
    
    dispatch({
      type: 'FETCH_ROUTES_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_ROUTES_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};

export const getRouteById = (routeId) => async (dispatch) => {
  dispatch({ type: 'FETCH_ROUTE_START' });
  
  try {
    const response = await api.routes.getRouteById(routeId);
    
    dispatch({
      type: 'FETCH_ROUTE_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_ROUTE_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};

export const createRoute = (routeData) => async (dispatch) => {
  dispatch({ type: 'CREATE_ROUTE_START' });
  
  try {
    const response = await api.routes.createRoute(routeData);
    
    dispatch({
      type: 'CREATE_ROUTE_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'CREATE_ROUTE_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};

export const updateRoute = (routeId, routeData) => async (dispatch) => {
  dispatch({ type: 'UPDATE_ROUTE_START' });
  
  try {
    const response = await api.routes.updateRoute(routeId, routeData);
    
    dispatch({
      type: 'UPDATE_ROUTE_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'UPDATE_ROUTE_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};

export const deleteRoute = (routeId) => async (dispatch) => {
  dispatch({ type: 'DELETE_ROUTE_START' });
  
  try {
    await api.routes.deleteRoute(routeId);
    
    dispatch({
      type: 'DELETE_ROUTE_SUCCESS',
      payload: routeId
    });
    
    return true;
  } catch (error) {
    dispatch({
      type: 'DELETE_ROUTE_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};

export const importGPX = (routeData) => async (dispatch) => {
  dispatch({ type: 'IMPORT_GPX_START' });
  
  try {
    const response = await api.routes.importGPX(routeData);
    
    dispatch({
      type: 'IMPORT_GPX_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'IMPORT_GPX_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};

// User actions
export const updateUserProfile = (userData, currentPassword) => async (dispatch) => {
  dispatch({ type: 'UPDATE_USER_PROFILE_START' });
  
  try {
    const response = await api.user.updateProfile(userData, currentPassword);
    
    dispatch({
      type: 'UPDATE_USER_PROFILE_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'UPDATE_USER_PROFILE_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};

export const getUserStats = () => async (dispatch) => {
  dispatch({ type: 'FETCH_USER_STATS_START' });
  
  try {
    const response = await api.user.getUserStats();
    
    dispatch({
      type: 'FETCH_USER_STATS_SUCCESS',
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_USER_STATS_FAIL',
      payload: error.message
    });
    
    throw error;
  }
};