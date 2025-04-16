import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading spinner component with size and color options
 * 
 * @param {Object} props - Component props
 * @returns {JSX.Element} Spinner component
 */
const LoadingSpinner = ({ 
    size = 'medium', 
    color = 'primary', 
    fullScreen = false,
    message = 'Loading...'
}) => {
    // Size classes
    const sizeClasses = {
        small: 'spinner-sm',
        medium: 'spinner-md',
        large: 'spinner-lg'
    };
    
    // Color classes
    const colorClasses = {
        primary: 'spinner-primary',
        secondary: 'spinner-secondary',
        light: 'spinner-light',
        dark: 'spinner-dark'
    };
    
    // Determine CSS classes
    const spinnerClass = `spinner ${sizeClasses[size] || 'spinner-md'} ${colorClasses[color] || 'spinner-primary'}`;
    const containerClass = fullScreen ? 'spinner-container fullscreen' : 'spinner-container';
    
    return (
        <div className={containerClass} role="status" aria-live="polite">
            <div className={spinnerClass}>
                <svg viewBox="0 0 50 50">
                    <circle 
                        className="spinner-circle" 
                        cx="25" 
                        cy="25" 
                        r="20" 
                        fill="none" 
                        strokeWidth="5"
                    />
                </svg>
            </div>
            {message && <p className="spinner-text">{message}</p>}
            <span className="sr-only">Loading...</span>
        </div>
    );
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'light', 'dark']),
    fullScreen: PropTypes.bool,
    message: PropTypes.string
};

export default LoadingSpinner;