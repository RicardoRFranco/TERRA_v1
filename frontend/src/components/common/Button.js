import React from 'react';

const Button = ({
  children,
  type = 'button',
  className = '',
  onClick,
  disabled = false,
  isLoading = false,
  fullWidth = false,
  ...props
}) => {
  const baseClass = 'btn';
  const widthClass = fullWidth ? 'w-100' : '';
  const combinedClassName = `${baseClass} ${className} ${widthClass}`.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="loading-indicator">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;