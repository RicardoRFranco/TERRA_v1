// frontend/src/components/common/FormInput.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
    id,
    name,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    helper,
    disabled = false,
    required = false,
    autoComplete,
    icon,
    iconPosition = 'left',
    className = '',
    inputClassName = '',
    labelClassName = '',
    fullWidth = true,
    size = 'medium',
    variant = 'outlined',
    min,
    max,
    step,
    pattern,
    maxLength,
    minLength,
    readOnly = false,
}) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Handle input focus
    const handleFocus = () => setFocused(true);
    const handleBlur = (e) => {
        setFocused(false);
        if (onBlur) onBlur(e);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Size variants
    const sizeClasses = {
        small: 'py-1 px-2 text-sm',
        medium: 'py-2 px-3',
        large: 'py-3 px-4 text-lg',
    };

    // Variant styles
    const getVariantClasses = () => {
        const baseClasses = 'w-full rounded transition-colors duration-200 focus:outline-none';
        const focusClasses = focused ? 'ring-2 ring-green-500 ring-opacity-50' : '';
        const errorClasses = error ? 'border-red-500 focus:border-red-500' : '';
        
        switch (variant) {
            case 'outlined':
                return `${baseClasses} ${focusClasses} border ${error ? 'border-red-500' : focused ? 'border-green-600' : 'border-gray-300'} ${disabled ? 'bg-gray-100' : 'bg-white'}`;
            case 'filled':
                return `${baseClasses} ${focusClasses} border border-transparent ${error ? 'bg-red-50' : disabled ? 'bg-gray-100' : focused ? 'bg-green-50' : 'bg-gray-100'}`;
            case 'standard':
                return `${baseClasses} border-b rounded-none px-0 ${error ? 'border-red-500' : focused ? 'border-green-600' : 'border-gray-300'} ${disabled ? 'bg-transparent' : 'bg-transparent'}`;
            default:
                return `${baseClasses} ${focusClasses} border ${error ? 'border-red-500' : 'border-gray-300'}`;
        }
    };

    // Icon container classes
    const iconContainerClasses = iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3';
    
    // Input padding adjustment for icons
    const iconPaddingClass = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

    // Parse special input types (number, password, etc.)
    const inputType = showPassword ? 'text' : type;
    const parsedValue = type === 'number' && value === '' ? undefined : value;

    // Width class
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <div className={`mb-4 ${widthClass} ${className}`}>
            {/* Label */}
            {label && (
                <label 
                    htmlFor={id} 
                    className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            {/* Input container with relative positioning for icons */}
            <div className="relative">
                {/* Input element */}
                <input
                    id={id}
                    name={name}
                    type={inputType}
                    className={`
                        ${getVariantClasses()}
                        ${sizeClasses[size]}
                        ${iconPaddingClass}
                        ${error ? 'text-red-900' : ''}
                        ${disabled ? 'cursor-not-allowed opacity-60' : ''}
                        ${inputClassName}
                    `}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    min={min}
                    max={max}
                    step={step}
                    pattern={pattern}
                    maxLength={maxLength}
                    minLength={minLength}
                    readOnly={readOnly}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
                />
                
                {/* Left or right icon */}
                {icon && (
                    <div className={`absolute inset-y-0 ${iconContainerClasses} flex items-center pointer-events-none text-gray-500`}>
                        {icon}
                    </div>
                )}
                
                {/* Password toggle button */}
                {type === 'password' && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                        tabIndex="-1"
                    >
                        {showPassword ? (
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            
            {/* Error message */}
            {error && (
                <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
            
            {/* Helper text */}
            {!error && helper && (
                <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500">
                    {helper}
                </p>
            )}
        </div>
    );
};

FormInput.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.oneOf([
        'text', 'password', 'email', 'number', 'tel', 'url', 
        'date', 'datetime-local', 'month', 'search', 'time', 'week'
    ]),
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    error: PropTypes.string,
    helper: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    autoComplete: PropTypes.string,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    fullWidth: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pattern: PropTypes.string,
    maxLength: PropTypes.number,
    minLength: PropTypes.number,
    readOnly: PropTypes.bool,
};

export default FormInput;