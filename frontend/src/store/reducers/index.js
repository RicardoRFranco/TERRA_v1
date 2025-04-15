import { combineReducers } from 'redux';
import { ACTION_TYPES } from '../actions';

// Initial state
const initialState = {
    data: null,
    loading: false,
    error: null,
};

// Data reducer
const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_DATA_START:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case ACTION_TYPES.FETCH_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case ACTION_TYPES.FETCH_DATA_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    data: dataReducer,
    // Add more reducers as needed
});

export default rootReducer;