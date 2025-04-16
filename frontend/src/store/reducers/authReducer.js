// frontend/src/store/reducers/authReducer.js
import { AUTH_TYPES } from '../actions/types';

// Initial state for authentication
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null
};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case AUTH_TYPES.AUTH_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };
        
        case AUTH_TYPES.LOGIN_SUCCESS:
        case AUTH_TYPES.REGISTER_SUCCESS:
            // Store token in localStorage
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                token: payload.token,
                user: payload.user,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        
        case AUTH_TYPES.USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                user: payload,
                loading: false,
                error: null
            };
        
        case AUTH_TYPES.AUTH_ERROR:
        case AUTH_TYPES.LOGIN_FAIL:
        case AUTH_TYPES.REGISTER_FAIL:
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: payload
            };
        
        case AUTH_TYPES.LOGOUT:
            // Remove token from localStorage
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null
            };
        
        case AUTH_TYPES.CLEAR_AUTH_ERROR:
            return {
                ...state,
                error: null
            };
        
        case AUTH_TYPES.UPDATE_USER_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...payload
                },
                loading: false
            };
        
        default:
            return state;
    }
};

export default authReducer;