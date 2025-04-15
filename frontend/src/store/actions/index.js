// Action types
export const ACTION_TYPES = {
    // Define your action types here
    FETCH_DATA_START: 'FETCH_DATA_START',
    FETCH_DATA_SUCCESS: 'FETCH_DATA_SUCCESS',
    FETCH_DATA_ERROR: 'FETCH_DATA_ERROR',
};

// Action creators
export const fetchDataStart = () => ({
    type: ACTION_TYPES.FETCH_DATA_START,
});

export const fetchDataSuccess = (data) => ({
    type: ACTION_TYPES.FETCH_DATA_SUCCESS,
    payload: data,
});

export const fetchDataError = (error) => ({
    type: ACTION_TYPES.FETCH_DATA_ERROR,
    payload: error,
});