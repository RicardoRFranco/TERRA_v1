import React, { Component } from 'react';
import { handleGlobalError } from '../../utils/errorHandler';

/**
 * Error Boundary component to catch JavaScript errors in child components
 * and display a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to error tracking service
        handleGlobalError(error, errorInfo);
        
        // Update state with error details
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Display fallback UI
            return (
                <div className="error-boundary">
                    <div className="error-container">
                        <h2>Something went wrong.</h2>
                        <p>We're sorry, but there was an error loading this page.</p>
                        
                        <div className="error-actions">
                            <button 
                                onClick={() => window.location.reload()}
                                className="refresh-button"
                            >
                                Refresh Page
                            </button>
                            
                            <button 
                                onClick={() => {
                                    // Reset error state
                                    this.setState({ 
                                        hasError: false,
                                        error: null,
                                        errorInfo: null
                                    });
                                    
                                    // Navigate to home
                                    window.location.href = '/';
                                }}
                                className="home-button"
                            >
                                Go to Home
                            </button>
                        </div>
                        
                        {/* Show error details in development only */}
                        {process.env.NODE_ENV === 'development' && (
                            <details className="error-details">
                                <summary>Error Details</summary>
                                <p>{this.state.error && this.state.error.toString()}</p>
                                <p>Component Stack:</p>
                                <pre>
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        // If no error, render children normally
        return this.props.children;
    }
}

export default ErrorBoundary;