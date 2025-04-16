/**
 * Global error handler utilities for the TERRA App frontend
 */

// Define error types
const ERROR_TYPES = {
    NETWORK: 'network',
    AUTH: 'auth',
    VALIDATION: 'validation',
    SERVER: 'server',
    CLIENT: 'client',
    UNKNOWN: 'unknown'
};

/**
 * Parse and categorize API errors
 * 
 * @param {Error} error - The caught error
 * @returns {Object} Categorized error information
 */
const parseApiError = (error) => {
    const errorInfo = {
        type: ERROR_TYPES.UNKNOWN,
        message: 'An unknown error occurred',
        status: null,
        details: null,
        timestamp: new Date().toISOString(),
        originalError: error
    };

    // Network errors (no response)
    if (error.message && error.message.includes('Network Error')) {
        errorInfo.type = ERROR_TYPES.NETWORK;
        errorInfo.message = 'Network connection error. Please check your internet connection.';
        return errorInfo;
    }

    // No axios response
    if (!error.response) {
        return errorInfo;
    }

    // Extract status and data from response
    const { status, data } = error.response;
    errorInfo.status = status;

    // Authentication errors
    if (status === 401) {
        errorInfo.type = ERROR_TYPES.AUTH;
        errorInfo.message = 'Authentication required. Please log in again.';
        errorInfo.details = data.detail || 'Your session may have expired';
    }
    // Permission errors
    else if (status === 403) {
        errorInfo.type = ERROR_TYPES.AUTH;
        errorInfo.message = 'You do not have permission to perform this action';
        errorInfo.details = data.detail;
    }
    // Resource not found
    else if (status === 404) {
        errorInfo.type = ERROR_TYPES.CLIENT;
        errorInfo.message = 'The requested resource was not found';
        errorInfo.details = data.detail;
    }
    // Validation errors
    else if (status === 400 || status === 422) {
        errorInfo.type = ERROR_TYPES.VALIDATION;
        errorInfo.message = 'Invalid input data';
        
        // Handle different validation error formats
        if (data.detail && Array.isArray(data.detail)) {
            // Process detailed validation errors
            errorInfo.details = data.detail.map(err => ({
                field: err.loc[err.loc.length - 1],
                message: err.msg
            }));
        } else if (data.detail) {
            errorInfo.details = data.detail;
        }
    }
    // Server errors
    else if (status >= 500) {
        errorInfo.type = ERROR_TYPES.SERVER;
        errorInfo.message = 'Server error. Please try again later or contact support.';
        errorInfo.details = data.detail || 'The server encountered an internal error';
    }
    // Other client errors
    else if (status >= 400) {
        errorInfo.type = ERROR_TYPES.CLIENT;
        errorInfo.message = data.detail || 'The request could not be processed';
        errorInfo.details = data;
    }

    return errorInfo;
};

/**
 * Format validation errors for form display
 * 
 * @param {Object|Array} validationErrors - Validation error details
 * @returns {Object} Error messages by field name
 */
const formatValidationErrors = (validationErrors) => {
    if (!validationErrors) return {};
    
    // If it's already in the right format, return as is
    if (typeof validationErrors === 'object' && !Array.isArray(validationErrors)) {
        return validationErrors;
    }
    
    // Handle array of errors (common format from FastAPI)
    if (Array.isArray(validationErrors)) {
        return validationErrors.reduce((result, error) => {
            result[error.field] = error.message;
            return result;
        }, {});
    }
    
    // Handle string error message (fallback)
    return { general: validationErrors.toString() };
};

/**
 * Log errors to console in development, or to monitoring service in production
 * 
 * @param {Object} errorInfo - Parsed error information
 */
const logError = (errorInfo) => {
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', errorInfo);
    } else {
        // In production, you might want to log to a service like Sentry
        // Example: Sentry.captureException(errorInfo.originalError, { extra: errorInfo });
        
        // Remove sensitive data before logging
        const sanitizedError = { ...errorInfo };
        delete sanitizedError.originalError;
        
        // Log to console for now
        console.error('Error:', sanitizedError);
    }
};

/**
 * Handle global errors not caught by components
 * 
 * @param {Error} error - The uncaught error
 * @param {string} info - React error info
 */
const handleGlobalError = (error, info) => {
    const errorInfo = {
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
        timestamp: new Date().toISOString()
    };
    
    logError({
        type: ERROR_TYPES.CLIENT,
        ...errorInfo
    });
    
    // You could show a global error notification here
};

/**
 * Get user-friendly error message
 * 
 * @param {Object} errorInfo - Parsed error information
 * @returns {string} User-friendly error message
 */
const getUserFriendlyMessage = (errorInfo) => {
    switch (errorInfo.type) {
        case ERROR_TYPES.NETWORK:
            return 'Unable to connect to the server. Please check your internet connection.';
        case ERROR_TYPES.AUTH:
            return 'Please log in to continue.';
        case ERROR_TYPES.VALIDATION:
            return 'Please check the form for errors.';
        case ERROR_TYPES.SERVER:
            return 'Our server is having issues. Please try again later.';
        case ERROR_TYPES.CLIENT:
            return errorInfo.message || 'Something went wrong with your request.';
        default:
            return 'Something unexpected happened. Please try again.';
    }
};

export {
    ERROR_TYPES,
    parseApiError,
    formatValidationErrors,
    logError,
    handleGlobalError,
    getUserFriendlyMessage
};