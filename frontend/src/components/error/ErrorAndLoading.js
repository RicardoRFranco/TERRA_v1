import React, { Component } from 'react';

// Error Boundary Component
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>
            We apologize for the inconvenience. Please try refreshing the page 
            or contact support if the problem persists.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Error Details</summary>
              <p>{this.state.error && this.state.error.toString()}</p>
              <p>Component Stack:</p>
              <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Message Component
export const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <p>{message || 'An error occurred. Please try again.'}</p>
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const spinnerSizes = {
    small: { width: '20px', height: '20px' },
    medium: { width: '40px', height: '40px' },
    large: { width: '60px', height: '60px' },
  };

  return (
    <div className="loading-container">
      <div 
        className="loading-spinner" 
        style={spinnerSizes[size] || spinnerSizes.medium}
      ></div>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

// Data loading component with error handling
export const DataLoader = ({ 
  isLoading, 
  error, 
  data, 
  loadingMessage = 'Loading data...',
  errorMessage = 'Failed to load data. Please try again.',
  children 
}) => {
  if (isLoading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  if (error) {
    return <ErrorMessage message={errorMessage} />;
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return children(data);
};

export default {
  ErrorBoundary,
  ErrorMessage,
  LoadingSpinner,
  DataLoader
};