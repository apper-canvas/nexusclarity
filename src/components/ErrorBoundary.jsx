import React from 'react';

/**
 * A robust error boundary component that catches errors in child components
 * and displays a fallback UI when errors occur.
 * 
 * This implementation uses multiple fallback mechanisms to ensure it never
 * throws its own errors.
 */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      errorMessage: '',
      componentStack: ''
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      errorMessage: error?.toString() || 'An unknown error occurred'
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // Update state with error details
    this.setState({ 
      componentStack: errorInfo?.componentStack || ''
    });
  }

  handleReset = (e) => {
    // Prevent default button behavior
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    // Reset the error state
    this.setState({ 
      hasError: false, 
      errorMessage: '', 
      componentStack: '' 
    });
    
    // If that doesn't work, reload the page
    if (typeof window !== 'undefined') {
      try {
        window.location.reload();
      } catch (error) {
        console.error("Failed to reload page:", error);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Safe fallback UI with no external dependencies
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 max-w-lg w-full">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
              <span role="img" aria-label="Warning" className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-surface-600 dark:text-surface-300 mb-4">
              An error occurred in the application. You can try again or refresh the page.
            </p>
            {this.state.errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4 text-left w-full overflow-auto text-sm">
                <p className="font-mono text-red-700 dark:text-red-400">{this.state.errorMessage}</p>
              </div>
            )}
            <button onClick={this.handleReset} className="btn-primary">
              <span className="mr-2">🔄</span> Try Again
            </button>
          </div>
          </div>
        </div>
      );
    }
    
    // If no error occurred, render children
    return this.props.children;
  }
}

export default ErrorBoundary;