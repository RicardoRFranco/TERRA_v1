// frontend/src/store/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import uiReducer from './uiReducer';
import routeReducer from './routeReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    routes: routeReducer
});

export default rootReducer;