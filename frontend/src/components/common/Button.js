// frontend/src/components/common/Button.js
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Button = ({ 
    children, 
    onClick, 
    type = 'button', 
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    loading = false,
    icon = null,
    iconPosition = 'left',
    className = '',
    to = null,
    as = null,
    form = null
}) => {
    // Define variant styles - each style should be used in the component
    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm border border-transparent';
            case 'secondary':
                return 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white shadow-sm border border-transparent';
            case 'outline':
                return 'bg-transparent border border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100';
            case 'danger':
                return 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm border border-transparent';
            case 'success':
                return 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-sm border border-transparent';
            case 'link':
                return 'bg-transparent text-green-600 hover:text-green-700 hover:underline active:text-green-800 shadow-none';
            case 'ghost':
                return 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 shadow-none';
            case 'light':
                return 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 shadow-sm border border-gray-300';
            default:
                return 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm border border-transparent';
        }
    };

    // Size styles - with improved responsive spacing
    const getSizeClasses = () => {
        switch (size) {
            case 'xs':
                return 'px-2 py-1 text-xs';
            case 'small':
                return 'px-3 py-1.5 text-sm';
            case 'medium':
                return 'px-4 py-2 text-base';
            case 'large':
                return 'px-6 py-3 text-lg';
            case 'xl':
                return 'px-8 py-4 text-xl';
            default:
                return 'px-4 py-2 text-base';
        }
    };

    // Base classes with focus and transition improvements
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500';
    
    // State styles
    const stateClasses = disabled 
        ? 'opacity-50 cursor-not-allowed pointer-events-none' 
        : loading 
            ? 'opacity-80 cursor-wait' 
            : 'cursor-pointer';
    
    // Width styling
    const widthClasses = fullWidth ? 'w-full' : '';

    // Combine all classes
    const buttonClasses = `
        ${baseClasses}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${stateClasses}
        ${widthClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    // Loading spinner component
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    // Button content
    const ButtonContent = () => (
        <>
            {loading && <LoadingSpinner />}
            {icon && iconPosition === 'left' && !loading && (
                <span className="mr-2">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
                <span className="ml-2">{icon}</span>
            )}
        </>
    );

    // Render as Link if 'to' prop is provided
    if (to) {
        return (
            <Link 
                to={to} 
                className={buttonClasses}
                onClick={disabled ? (e) => e.preventDefault() : onClick}
            >
                <ButtonContent />
            </Link>
        );
    }

    // Render as custom component if 'as' prop is provided
    if (as) {
        const Component = as;
        return (
            <Component 
                className={buttonClasses}
                onClick={disabled ? (e) => e.preventDefault() : onClick}
                disabled={disabled || loading}
            >
                <ButtonContent />
            </Component>
        );
    }

    // Default render as button
    return (
        <button 
            type={type} 
            onClick={onClick} 
            className={buttonClasses}
            disabled={disabled || loading}
            form={form}
        >
            <ButtonContent />
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success', 'link', 'ghost', 'light']),
    size: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl']),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    to: PropTypes.string,
    as: PropTypes.elementType,
    form: PropTypes.string,
};

export default Button;