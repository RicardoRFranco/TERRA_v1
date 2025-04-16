import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component with different variants and states
 * 
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Button component
 */
const Button = ({ 
    children, 
    onClick, 
    type = 'button', 
    className = '',
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    isLoading = false,
    icon = null,
    iconPosition = 'left',
    ...rest
}) => {
    // Base button class
    const baseClass = 'btn';
    
    // Variant classes
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'btn-success',
        danger: 'btn-danger',
        warning: 'btn-warning',
        info: 'btn-info',
        light: 'btn-light',
        dark: 'btn-dark',
        link: 'btn-link',
        outline: 'btn-outline',
    };
    
    // Size classes
    const sizeClasses = {
        small: 'btn-sm',
        medium: '',
        large: 'btn-lg',
    };
    
    // Build class list
    const classes = [
        baseClass,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.medium,
        fullWidth ? 'btn-block' : '',
        isLoading ? 'btn-loading' : '',
        className,
    ].filter(Boolean).join(' ');
    
    // Loading spinner element
    const loadingSpinner = isLoading && (
        <span className="btn-spinner" aria-hidden="true">
            <svg 
                className="animate-spin h-4 w-4 mr-2" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
            >
                <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                ></circle>
                <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </span>
    );
    
    // Render icon if provided
    const iconElement = icon && (
        <span className={`btn-icon ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`}>
            {icon}
        </span>
    );
    
    return (
        <button 
            type={type} 
            onClick={onClick} 
            className={classes}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading && loadingSpinner}
            {icon && iconPosition === 'left' && iconElement}
            {children}
            {icon && iconPosition === 'right' && iconElement}
        </button>
    );
};

// PropTypes for documentation and validation
Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
    variant: PropTypes.oneOf([
        'primary', 
        'secondary', 
        'success', 
        'danger', 
        'warning', 
        'info', 
        'light', 
        'dark', 
        'link', 
        'outline'
    ]),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    isLoading: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
};

export default Button;