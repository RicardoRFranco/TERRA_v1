// frontend/src/store/reducers/routeReducer.js
import { ROUTE_TYPES } from '../actions/types';

const initialState = {
    routes: [],
    publicRoutes: [],
    currentRoute: null,
    loading: false,
    error: null
};

const routeReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case ROUTE_TYPES.SET_ROUTE_LOADING:
            return {
                ...state,
                loading: true
            };

        case ROUTE_TYPES.GET_ROUTES:
            return {
                ...state,
                routes: payload,
                loading: false,
                error: null
            };

        case ROUTE_TYPES.GET_PUBLIC_ROUTES:
            return {
                ...state,
                publicRoutes: payload,
                loading: false,
                error: null
            };
            
        case ROUTE_TYPES.GET_ROUTE:
            return {
                ...state,
                currentRoute: payload,
                loading: false,
                error: null
            };
            
        case ROUTE_TYPES.ADD_ROUTE:
            return {
                ...state,
                routes: [payload, ...state.routes],
                loading: false,
                error: null
            };
            
        case ROUTE_TYPES.UPDATE_ROUTE:
            return {
                ...state,
                routes: state.routes.map(route => 
                    route.id === payload.id ? payload : route
                ),
                currentRoute: payload,
                loading: false,
                error: null
            };
            
        case ROUTE_TYPES.DELETE_ROUTE:
            return {
                ...state,
                routes: state.routes.filter(route => route.id !== payload),
                loading: false,
                error: null
            };
            
        case ROUTE_TYPES.ROUTE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
            
        case ROUTE_TYPES.CLEAR_ROUTE:
            return {
                ...state,
                currentRoute: null
            };
            
        default:
            return state;
    }
};

export default routeReducer;