import React from 'react';
import { getIcon } from '../utils/iconUtils';

// Get icon components
const AlertCircleIcon = getIcon('AlertCircle');
const RefreshCwIcon = getIcon('RefreshCw');

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  // This lifecycle method runs when an error is thrown in a child component
  // It returns a new state to update the component
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error: error
    };
  }

  // This lifecycle method allows you to log errors
  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      errorInfo: errorInfo
    });
  }

  // Reset the error state to allow the component to try rendering again
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
            <AlertCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="text-xl font-bold text-surface-800 dark:text-surface-100 mb-2">Something went wrong</h2>
          
          <div className="text-surface-600 dark:text-surface-400 text-center mb-6">
            <p className="mb-2">An error occurred in this section.</p>
            <p className="mb-2">Error: {this.state.error && this.state.error.toString()}</p>
          </div>
          
          <button onClick={this.resetError} className="btn-primary">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * A robust error boundary component that catches errors in child components
 * and displays a fallback UI when errors occur.
 *
 * This implementation is deliberately simple and self-contained to ensure it never
 * throws its own errors. It avoids using external dependencies for its fallback UI.
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
    try {
      // Log the error to console
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
      
      // Update state with error details
      this.setState({ 
        componentStack: errorInfo?.componentStack || '',
        errorMessage: error?.toString() || 'An unknown error occurred'
      });
    } catch (catchError) {
      // If updating state fails, log it but don't throw
      console.error("Error in ErrorBoundary's componentDidCatch:", catchError);
    }
  }

  handleReset = (e) => {
    // Prevent default button behavior
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    // Reset the error state
    try {
      this.setState({ 
        hasError: false, 
        errorMessage: '', 
        componentStack: '' 
      });
    
      // If user provided onReset callback, call it
      if (this.props.onReset && typeof this.props.onReset === 'function') {
        this.props.onReset();
      }
      
      // For severe errors, reload the page as a fallback
      } catch (error) {
        console.error("Failed to reload page:", error);
      }
  }
  
  render() {
    try {
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

      // If no error occurred, simply render children
      return this.props.children || null;
    } catch (renderError) {
      // Extra safety net if render itself fails
      console.error("Error in ErrorBoundary's render method:", renderError);
      return (
        <div className="p-4 m-4 border border-red-500 bg-red-50 rounded">
          <p className="text-red-700 font-bold">Critical Error in Error Boundary</p>
          <p className="text-red-600">
            The application encountered a serious error and the error boundary failed.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded">Reload Page</button>
        </div>
      );
    }
  }
}

export default ErrorBoundary;