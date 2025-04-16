import { combineReducers } from 'redux';

// Auth reducer
const initialAuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null
};

const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        loading: false,
        error: null
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null
      };
    case 'UPDATE_USER_PROFILE_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

// Routes reducer
const initialRoutesState = {
  routes: [],
  currentRoute: null,
  loading: false,
  error: null
};

const routesReducer = (state = initialRoutesState, action) => {
  switch (action.type) {
    case 'FETCH_ROUTES_START':
    case 'FETCH_ROUTE_START':
    case 'CREATE_ROUTE_START':
    case 'UPDATE_ROUTE_START':
    case 'DELETE_ROUTE_START':
    case 'IMPORT_GPX_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_ROUTES_SUCCESS':
      return {
        ...state,
        routes: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_ROUTE_SUCCESS':
      return {
        ...state,
        currentRoute: action.payload,
        loading: false,
        error: null
      };
    case 'CREATE_ROUTE_SUCCESS':
      return {
        ...state,
        routes: [...state.routes, action.payload],
        currentRoute: action.payload,
        loading: false,
        error: null
      };
    case 'UPDATE_ROUTE_SUCCESS':
      return {
        ...state,
        routes: state.routes.map(route => 
          route.id === action.payload.id ? action.payload : route
        ),
        currentRoute: action.payload,
        loading: false,
        error: null
      };
    case 'DELETE_ROUTE_SUCCESS':
      return {
        ...state,
        routes: state.routes.filter(route => route.id !== action.payload),
        currentRoute: state.currentRoute?.id === action.payload ? null : state.currentRoute,
        loading: false,
        error: null
      };
    case 'IMPORT_GPX_SUCCESS':
      return {
        ...state,
        routes: [...state.routes, action.payload],
        currentRoute: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_ROUTES_FAIL':
    case 'FETCH_ROUTE_FAIL':
    case 'CREATE_ROUTE_FAIL':
    case 'UPDATE_ROUTE_FAIL':
    case 'DELETE_ROUTE_FAIL':
    case 'IMPORT_GPX_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// User reducer
const initialUserState = {
  userStats: null,
  statsLoading: false,
  statsError: null,
  profileLoading: false,
  profileError: null
};

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'FETCH_USER_STATS_START':
      return {
        ...state,
        statsLoading: true,
        statsError: null
      };
    case 'FETCH_USER_STATS_SUCCESS':
      return {
        ...state,
        userStats: action.payload,
        statsLoading: false,
        statsError: null
      };
    case 'FETCH_USER_STATS_FAIL':
      return {
        ...state,
        statsLoading: false,
        statsError: action.payload
      };
    case 'UPDATE_USER_PROFILE_START':
      return {
        ...state,
        profileLoading: true,
        profileError: null
      };
    case 'UPDATE_USER_PROFILE_FAIL':
      return {
        ...state,
        profileLoading: false,
        profileError: action.payload
      };
    default:
      return state;
  }
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  routes: routesReducer,
  user: userReducer
});

export default rootReducer;