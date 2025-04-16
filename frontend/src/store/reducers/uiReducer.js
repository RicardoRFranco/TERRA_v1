// frontend/src/store/reducers/uiReducer.js
import { UI_TYPES } from '../actions/types';

const initialState = {
    loading: false,
    toasts: []
};

const uiReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case UI_TYPES.SET_LOADING:
            return {
                ...state,
                loading: true
            };
        
        case UI_TYPES.CLEAR_LOADING:
            return {
                ...state,
                loading: false
            };
        
        case UI_TYPES.ADD_TOAST:
            return {
                ...state,
                toasts: [...state.toasts, payload]
            };
        
        case UI_TYPES.REMOVE_TOAST:
            return {
                ...state,
                toasts: state.toasts.filter(toast => toast.id !== payload)
            };
        
        default:
            return state;
    }
};

export default uiReducer;